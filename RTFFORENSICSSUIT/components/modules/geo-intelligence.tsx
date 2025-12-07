"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MapIcon,
  Download,
  Search,
  Sun,
  Moon,
  SatelliteDish,
  Eraser,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Info,
  XCircle,
  Signal,
} from "lucide-react"
import FileUploader from "@/components/file-uploader"
import { useDataStore } from "@/lib/data-store"
import { parseFile, type ParsedData } from "@/lib/file-parser"
import type { RadioType } from "@/lib/types"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

interface LocalCellTowerData {
  lac: number
  cid: number
  mcc: number
  mnc: number
  radio?: RadioType
  signal?: number
  provider?: string
  lat?: number
  lon?: number
  accuracy?: number
}

// Provider colors for Bangladesh operators
const providerColors: Record<string, string> = {
  GP: "#22d3ee",
  Grameenphone: "#22d3ee",
  Robi: "#f43f5e",
  Banglalink: "#3b82f6",
  BL: "#3b82f6",
  Teletalk: "#f59e0b",
  Airtel: "#ef4444",
  Unknown: "#6b7280",
}

// Radio type options
const RADIO_TYPES: { value: RadioType; label: string; description: string }[] = [
  { value: "gsm", label: "GSM (2G)", description: "GSM, EDGE, GPRS" },
  { value: "cdma", label: "CDMA", description: "1xRTT, EVDO" },
  { value: "umts", label: "UMTS (3G)", description: "HSPA, HSDPA, HSUPA" },
  { value: "lte", label: "LTE (4G)", description: "4G LTE" },
  { value: "nr", label: "NR (5G)", description: "5G New Radio" },
]

// Alert message interface
interface AlertMessage {
  type: "warning" | "success" | "error" | "info"
  message: string
  details?: string
}

interface GeolocationResult extends LocalCellTowerData {
  status: "pending" | "success" | "error" | "not_found"
  errorMessage?: string
  requestTime?: number
}

// Tile layer URLs
const TILE_LAYERS = {
  light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
}

// Helper function to get provider from MNC
function getProviderFromMNC(mnc: number): string {
  const providers: Record<number, string> = {
    1: "Grameenphone",
    2: "Robi",
    3: "Banglalink",
    4: "Teletalk",
    5: "Citycell",
    6: "Airtel",
    7: "Robi",
  }
  return providers[mnc] || "Unknown"
}

export default function GeoIntelligence() {
  // State management
  const [mounted, setMounted] = useState(false)
  const [cellData, setCellData] = useState<GeolocationResult[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>("all")
  const [mapMode, setMapMode] = useState<"light" | "dark" | "satellite">("dark")
  const [showConnections, setShowConnections] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [apiStatus, setApiStatus] = useState<"unconfigured" | "configured" | "error">("unconfigured")
  const [alerts, setAlerts] = useState<AlertMessage[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [defaultRadioType, setDefaultRadioType] = useState<RadioType>("gsm")
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]) // Bangladesh center
  const [mapZoom, setMapZoom] = useState(7)

  // Additional state
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Cell tower input fields
  const [mcc, setMcc] = useState("470") // Bangladesh MCC
  const [mnc, setMnc] = useState("")
  const [lac, setLac] = useState("")
  const [cid, setCid] = useState("")
  const [signalStrength, setSignalStrength] = useState("")

  // API status
  const [isLocating, setIsLocating] = useState(false)
  const [locatingProgress, setLocatingProgress] = useState(0)

  const { sessions, activeSession, addSession } = useDataStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check API configuration on mount
  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch("/api/geolocation/status")
      const data = await response.json()
      setApiStatus(data.configured ? "configured" : "unconfigured")
      if (!data.configured) {
        addAlert({
          type: "warning",
          message: "UnwiredLabs API not configured",
          details: "Set UNWIREDLABS_API_TOKEN environment variable to enable real geolocation.",
        })
      }
    } catch {
      setApiStatus("error")
      addAlert({
        type: "error",
        message: "Failed to check API status",
      })
    }
  }

  const addAlert = useCallback((alert: AlertMessage) => {
    setAlerts((prev) => [...prev.slice(-4), alert])
    setTimeout(() => {
      setAlerts((prev) => prev.slice(1))
    }, 5000)
  }, [])

  const extractCellTowers = useCallback(
    (data: ParsedData): LocalCellTowerData[] => {
      const towers: LocalCellTowerData[] = []
      const seen = new Set<string>()

      for (const row of data.rows) {
        // Try to find cell tower fields
        const lacVal = row["lac"] || row["LAC"] || row["location_area_code"]
        const cidVal = row["cid"] || row["CID"] || row["cell_id"] || row["cellId"]
        const mccVal = row["mcc"] || row["MCC"] || "470" // Bangladesh default
        const mncVal = row["mnc"] || row["MNC"]

        if (lacVal && cidVal) {
          const key = `${mccVal}-${mncVal}-${lacVal}-${cidVal}`
          if (!seen.has(key)) {
            seen.add(key)
            towers.push({
              lac: Number.parseInt(String(lacVal)),
              cid: Number.parseInt(String(cidVal)),
              mcc: Number.parseInt(String(mccVal)) || 470,
              mnc: Number.parseInt(String(mncVal)) || 1,
              radio: defaultRadioType,
              provider: getProviderFromMNC(Number.parseInt(String(mncVal))),
            })
          }
        }
      }

      return towers
    },
    [defaultRadioType],
  )

  // Handle file upload and processing
  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      setProcessingProgress(20)
      const data = await parseFile(file)
      setParsedData(data)
      setProcessingProgress(50)

      // Extract cell towers from parsed data
      const towers = extractCellTowers(data)
      setProcessingProgress(70)

      if (towers.length === 0) {
        addAlert({
          type: "warning",
          message: "No cell tower data found",
          details: "The file does not contain recognizable cell tower fields (LAC, CID).",
        })
        setIsProcessing(false)
        return
      }

      // Convert to GeolocationResult format
      const results: GeolocationResult[] = towers.map((tower) => ({
        ...tower,
        status: "pending" as const,
      }))

      setCellData(results)
      setProcessingProgress(100)

      addAlert({
        type: "success",
        message: `Found ${towers.length} unique cell towers`,
        details: "Ready to geolocate. Click 'Locate All' to process.",
      })

      // Add session to data store
      addSession("geo-intelligence", file.name, data)
    } catch (error) {
      addAlert({
        type: "error",
        message: "Failed to parse file",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsProcessing(false)
      setShowUploader(false)
    }
  }

  const geolocateTower = async (tower: LocalCellTowerData): Promise<GeolocationResult> => {
    const startTime = Date.now()

    try {
      console.log("[v0] Geolocating tower:", { lac: tower.lac, cid: tower.cid, mcc: tower.mcc, mnc: tower.mnc })

      const response = await fetch("/api/geolocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cells: [
            {
              lac: String(tower.lac),
              cid: String(tower.cid),
              mcc: String(tower.mcc),
              mnc: String(tower.mnc),
              radio: tower.radio,
            },
          ],
          radio: tower.radio,
          mcc: String(tower.mcc),
          mnc: String(tower.mnc),
        }),
      })

      const data = await response.json()
      console.log("[v0] API Response:", data)

      if (data.success && data.data?.lat && data.data?.lng) {
        return {
          ...tower,
          lat: data.data.lat,
          lon: data.data.lng,
          accuracy: data.data.accuracy,
          status: "success",
          requestTime: Date.now() - startTime,
        }
      } else if (data.error?.includes("not found") || data.error?.includes("Location not found")) {
        return {
          ...tower,
          status: "not_found",
          errorMessage: "Cell tower not found in database",
          requestTime: Date.now() - startTime,
        }
      } else {
        return {
          ...tower,
          status: "error",
          errorMessage: data.error || "Unknown error",
          requestTime: Date.now() - startTime,
        }
      }
    } catch (error) {
      console.log("[v0] Geolocation error:", error)
      return {
        ...tower,
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Network error",
        requestTime: Date.now() - startTime,
      }
    }
  }

  // Geolocate all pending towers
  const geolocateAll = async () => {
    if (apiStatus !== "configured") {
      addAlert({
        type: "error",
        message: "API not configured",
        details: "Please configure the UnwiredLabs API token first.",
      })
      return
    }

    setIsLocating(true)
    setLocatingProgress(0)

    const pendingTowers = cellData.filter((t) => t.status === "pending" || t.status === "error")
    const total = pendingTowers.length

    for (let i = 0; i < pendingTowers.length; i++) {
      const tower = pendingTowers[i]
      const result = await geolocateTower(tower)

      setCellData((prev) => prev.map((t) => (t.lac === tower.lac && t.cid === tower.cid ? result : t)))

      setLocatingProgress(Math.round(((i + 1) / total) * 100))

      // Add small delay to avoid rate limiting
      if (i < pendingTowers.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    setIsLocating(false)

    const successCount = cellData.filter((t) => t.status === "success").length
    addAlert({
      type: "success",
      message: `Geolocation complete`,
      details: `${successCount} of ${total} towers located successfully.`,
    })
  }

  // Manual cell tower lookup
  const handleManualLookup = async () => {
    if (!lac || !cid) {
      addAlert({
        type: "warning",
        message: "Missing required fields",
        details: "LAC and CID are required for cell tower lookup.",
      })
      return
    }

    const tower: LocalCellTowerData = {
      lac: Number.parseInt(lac),
      cid: Number.parseInt(cid),
      mcc: Number.parseInt(mcc) || 470,
      mnc: Number.parseInt(mnc) || 1,
      radio: defaultRadioType,
      signal: signalStrength ? Number.parseInt(signalStrength) : undefined,
      provider: getProviderFromMNC(Number.parseInt(mnc) || 1),
    }

    setIsLocating(true)
    const result = await geolocateTower(tower)
    setIsLocating(false)

    if (result.status === "success") {
      setCellData((prev) => [...prev, result])
      addAlert({
        type: "success",
        message: "Cell tower located",
        details: `Found at ${result.lat?.toFixed(6)}, ${result.lon?.toFixed(6)}`,
      })

      // Center map on result
      if (result.lat && result.lon) {
        setMapCenter([result.lat, result.lon])
        setMapZoom(14)
      }
    } else {
      setCellData((prev) => [...prev, result])
      addAlert({
        type: "error",
        message: "Lookup failed",
        details: result.errorMessage || "Cell tower not found",
      })
    }

    // Clear input fields
    setLac("")
    setCid("")
    setMnc("")
    setSignalStrength("")
  }

  // Clear all data
  const handleClearData = () => {
    setCellData([])
    setParsedData(null)
    setMapCenter([23.8103, 90.4125])
    setMapZoom(7)
    addAlert({
      type: "info",
      message: "Data cleared",
    })
  }

  // Export data to JSON
  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalTowers: cellData.length,
      locatedTowers: cellData.filter((t) => t.status === "success").length,
      data: cellData,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `geo-intelligence-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter cell data based on provider and search
  const filteredCellData = useMemo(() => {
    return cellData.filter((cell) => {
      const matchesProvider = selectedProvider === "all" || cell.provider === selectedProvider
      const matchesSearch =
        !searchQuery ||
        `${cell.lac}`.includes(searchQuery) ||
        `${cell.cid}`.includes(searchQuery) ||
        cell.provider?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesProvider && matchesSearch
    })
  }, [cellData, selectedProvider, searchQuery])

  // Get located towers for map display
  const locatedTowers = useMemo(() => {
    return filteredCellData.filter((t) => t.status === "success" && t.lat && t.lon)
  }, [filteredCellData])

  // Statistics
  const stats = useMemo(() => {
    return {
      total: cellData.length,
      located: cellData.filter((t) => t.status === "success").length,
      pending: cellData.filter((t) => t.status === "pending").length,
      notFound: cellData.filter((t) => t.status === "not_found").length,
      errors: cellData.filter((t) => t.status === "error").length,
    }
  }, [cellData])

  // Get unique providers
  const uniqueProviders = useMemo(() => {
    const providers = new Set(cellData.map((t) => t.provider).filter(Boolean))
    return Array.from(providers) as string[]
  }, [cellData])

  if (!mounted) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg p-3 ${
                alert.type === "error"
                  ? "bg-destructive/10 text-destructive"
                  : alert.type === "warning"
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    : alert.type === "success"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
              }`}
            >
              {alert.type === "error" && <XCircle className="h-5 w-5 shrink-0" />}
              {alert.type === "warning" && <AlertTriangle className="h-5 w-5 shrink-0" />}
              {alert.type === "success" && <CheckCircle className="h-5 w-5 shrink-0" />}
              {alert.type === "info" && <Info className="h-5 w-5 shrink-0" />}
              <div className="flex-1">
                <p className="font-medium">{alert.message}</p>
                {alert.details && <p className="text-sm opacity-80">{alert.details}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold">GEO Intelligence</h2>
          <Badge variant={apiStatus === "configured" ? "default" : "secondary"}>
            {apiStatus === "configured" ? "API Ready" : "API Not Configured"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploader(true)}>
            <Signal className="mr-2 h-4 w-4" />
            Import CDR
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={geolocateAll}
            disabled={isLocating || stats.pending === 0 || apiStatus !== "configured"}
          >
            {isLocating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Locating... {locatingProgress}%
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Locate All ({stats.pending})
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={cellData.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearData} disabled={cellData.length === 0}>
            <Eraser className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* File Uploader Modal */}
      {showUploader && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import CDR Data</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader
              onFileSelect={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              maxSize={50}
              isProcessing={isProcessing}
            />
            {isProcessing && (
              <div className="mt-4">
                <Progress value={processingProgress} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">Processing... {processingProgress}%</p>
              </div>
            )}
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShowUploader(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {cellData.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Towers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.located}</div>
              <div className="text-sm text-muted-foreground">Located</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-500">{stats.notFound}</div>
              <div className="text-sm text-muted-foreground">Not Found</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Cell Tower Map</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={mapMode === "light" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMapMode("light")}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={mapMode === "dark" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMapMode("dark")}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={mapMode === "satellite" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMapMode("satellite")}
                >
                  <SatelliteDish className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[500px] w-full overflow-hidden rounded-b-lg">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url={TILE_LAYERS[mapMode]}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {/* Cell Tower Markers */}
                {locatedTowers.map((tower, index) => (
                  <CircleMarker
                    key={`${tower.lac}-${tower.cid}-${index}`}
                    center={[tower.lat!, tower.lon!]}
                    radius={8}
                    pathOptions={{
                      fillColor: providerColors[tower.provider || "Unknown"] || "#6b7280",
                      fillOpacity: 0.8,
                      color: "#fff",
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="space-y-1 text-sm">
                        <div className="font-semibold">{tower.provider || "Unknown Provider"}</div>
                        <div>LAC: {tower.lac}</div>
                        <div>CID: {tower.cid}</div>
                        <div>MCC: {tower.mcc}</div>
                        <div>MNC: {tower.mnc}</div>
                        {tower.accuracy && <div>Accuracy: {tower.accuracy}m</div>}
                        <div className="text-muted-foreground">
                          {tower.lat?.toFixed(6)}, {tower.lon?.toFixed(6)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
                {/* Connection Lines */}
                {showConnections && locatedTowers.length > 1 && (
                  <Polyline
                    positions={locatedTowers.map((t) => [t.lat!, t.lon!] as [number, number])}
                    pathOptions={{ color: "#3b82f6", weight: 2, opacity: 0.5, dashArray: "5, 5" }}
                  />
                )}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Controls Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manual Lookup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="mcc" className="text-xs">
                  MCC
                </Label>
                <Input
                  id="mcc"
                  placeholder="470"
                  value={mcc}
                  onChange={(e) => setMcc(e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="mnc" className="text-xs">
                  MNC
                </Label>
                <Input
                  id="mnc"
                  placeholder="1-7"
                  value={mnc}
                  onChange={(e) => setMnc(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="lac" className="text-xs">
                  LAC *
                </Label>
                <Input
                  id="lac"
                  placeholder="Required"
                  value={lac}
                  onChange={(e) => setLac(e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="cid" className="text-xs">
                  CID *
                </Label>
                <Input
                  id="cid"
                  placeholder="Required"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="radio" className="text-xs">
                Radio Type
              </Label>
              <Select value={defaultRadioType} onValueChange={(v) => setDefaultRadioType(v as RadioType)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RADIO_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleManualLookup} disabled={isLocating || !lac || !cid}>
              {isLocating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Lookup Cell Tower
                </>
              )}
            </Button>

            <div className="border-t pt-4">
              <Label className="text-xs">Display Options</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Connections</span>
                  <Switch checked={showConnections} onCheckedChange={setShowConnections} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Labels</span>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                </div>
              </div>
            </div>

            {uniqueProviders.length > 0 && (
              <div className="border-t pt-4">
                <Label className="text-xs">Filter by Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="mt-2 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    {uniqueProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="border-t pt-4">
              <Label className="text-xs">Search</Label>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search LAC, CID, provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cell Tower List */}
      {filteredCellData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cell Tower Data ({filteredCellData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="p-2 text-left">Provider</th>
                    <th className="p-2 text-left">LAC</th>
                    <th className="p-2 text-left">CID</th>
                    <th className="p-2 text-left">MCC/MNC</th>
                    <th className="p-2 text-left">Location</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCellData.map((cell, index) => (
                    <tr key={`${cell.lac}-${cell.cid}-${index}`} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: providerColors[cell.provider || "Unknown"] }}
                          />
                          {cell.provider || "Unknown"}
                        </div>
                      </td>
                      <td className="p-2 font-mono">{cell.lac}</td>
                      <td className="p-2 font-mono">{cell.cid}</td>
                      <td className="p-2 font-mono">
                        {cell.mcc}/{cell.mnc}
                      </td>
                      <td className="p-2 font-mono text-xs">
                        {cell.lat && cell.lon ? `${cell.lat.toFixed(4)}, ${cell.lon.toFixed(4)}` : "-"}
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={
                            cell.status === "success"
                              ? "default"
                              : cell.status === "pending"
                                ? "secondary"
                                : cell.status === "not_found"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {cell.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
