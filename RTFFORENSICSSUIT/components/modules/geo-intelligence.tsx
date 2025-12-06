"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Map,
  Layers,
  Play,
  Pause,
  Download,
  Search,
  Filter,
  MapPin,
  Radio,
  Route,
  Thermometer,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize,
  Sun,
  Moon,
  Fingerprint,
  SatelliteDish,
  Eraser,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import FileUploader from "@/components/file-uploader"
import { useDataStore } from "@/lib/data-store"
import { parseFile, type ParsedData } from "@/lib/file-parser"

interface TowerData {
  id: number
  mcc: string
  mnc: string
  lac: string
  ci: string
  lat: number
  lng: number
  provider: string
  hits: number
  timestamp?: string
}

const providerColors: Record<string, string> = {
  GP: "#22d3ee",
  Robi: "#f43f5e",
  Banglalink: "#3b82f6",
  Teletalk: "#f59e0b",
}

const EXAMPLE_PATTERNS = [
  /^4600[0-9]$/, // Common China Mobile examples
  /^310260$/, // Common T-Mobile US examples
  /^test/i,
  /^example/i,
  /^demo/i,
  /^sample/i,
]

export default function GeoIntelligence() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const tileLayerRef = useRef<unknown>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showClusters, setShowClusters] = useState(true)
  const [showMovement, setShowMovement] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [towers, setTowers] = useState<TowerData[]>([])
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { addSession } = useDataStore()

  const [visualProtocol, setVisualProtocol] = useState<"light" | "dark">("dark")
  const [alertMessage, setAlertMessage] = useState<{ type: "warning" | "success" | "error"; message: string } | null>(
    null,
  )

  const [mcc, setMcc] = useState("")
  const [mnc, setMnc] = useState("")
  const [lac, setLac] = useState("")
  const [cid, setCid] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProtocol = localStorage.getItem("geoVisualProtocol") as "light" | "dark" | null
      if (savedProtocol) {
        setVisualProtocol(savedProtocol)
      }
      // Clear any example data from storage
      localStorage.removeItem("geoExampleData")
    }
  }, [])

  const validateForensicInput = useCallback((inputData: { mcc: string; mnc: string; lac: string; cid: string }) => {
    const combinedValue = inputData.mcc + inputData.mnc
    for (const pattern of EXAMPLE_PATTERNS) {
      if (pattern.test(combinedValue) || pattern.test(inputData.lac) || pattern.test(inputData.cid)) {
        setAlertMessage({
          type: "warning",
          message: "Forensic Alert: Example data patterns detected. Use actual case data.",
        })
        return false
      }
    }
    return true
  }, [])

  const initiateForensicClear = useCallback(() => {
    if (
      confirm("FORENSIC SANITIZATION PROTOCOL\n\nThis will clear all search data and history.\n\nConfirm sanitization?")
    ) {
      setMcc("")
      setMnc("")
      setLac("")
      setCid("")
      setTowers([])
      setSearchQuery("")
      setSelectedProvider(null)
      localStorage.removeItem("geoSearchHistory")
      setAlertMessage({
        type: "success",
        message: "All data sanitized. Ready for new case.",
      })
      setTimeout(() => setAlertMessage(null), 3000)
    }
  }, [])

  const toggleVisualProtocol = useCallback(() => {
    const newProtocol = visualProtocol === "light" ? "dark" : "light"
    setVisualProtocol(newProtocol)
    localStorage.setItem("geoVisualProtocol", newProtocol)

    // Update map tiles
    if (mapInstanceRef.current && tileLayerRef.current) {
      const L = (window as unknown as { L: typeof import("leaflet") }).L
      const tileUrl =
        newProtocol === "dark"
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ;(tileLayerRef.current as { setUrl: (url: string) => void }).setUrl(tileUrl)
    }
  }, [visualProtocol])

  const initiateTrace = useCallback(() => {
    if (!mcc && !mnc && !lac && !cid) {
      setAlertMessage({
        type: "warning",
        message: "Please enter at least one cell tower parameter to initiate trace.",
      })
      setTimeout(() => setAlertMessage(null), 3000)
      return
    }

    if (!validateForensicInput({ mcc, mnc, lac, cid })) {
      setTimeout(() => setAlertMessage(null), 3000)
      return
    }

    setAlertMessage({
      type: "success",
      message: "Trace initiated. Awaiting geolocation data...",
    })
    setTimeout(() => setAlertMessage(null), 3000)
  }, [mcc, mnc, lac, cid, validateForensicInput])

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsProcessing(true)
      try {
        const data = await parseFile(file)
        setParsedData(data)
        addSession("geo", file.name, data)
        setShowUploader(false)
      } catch (error) {
        console.error("Error parsing file:", error)
        setAlertMessage({
          type: "error",
          message: `Error parsing file: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
        setTimeout(() => setAlertMessage(null), 5000)
      } finally {
        setIsProcessing(false)
      }
    },
    [addSession],
  )

  // FIX: Populate towers state from parsedData when a file is uploaded
  useEffect(() => {
    if (parsedData?.analytics?.towerLocations) {
      const newTowers: TowerData[] = parsedData.analytics.towerLocations
        .filter((t) => t.lat && t.lng) // Only include towers with coordinates
        .map((t, index) => ({
          id: index,
          mcc: "N/A", // Placeholder
          mnc: "N/A", // Placeholder
          lac: t.lac,
          ci: t.ci,
          lat: t.lat!,
          lng: t.lng!,
          provider: "GP", // Default to GP for visual color
          hits: t.count,
        }))
      setTowers(newTowers)
      setAlertMessage({
        type: "success",
        message: `Successfully loaded ${newTowers.length} geolocated towers.`,
      })
      setTimeout(() => setAlertMessage(null), 3000)
    }
  }, [parsedData])

  useEffect(() => {
    if (typeof window !== "undefined" && !mapLoaded && mapRef.current) {
      const loadLeaflet = async () => {
        if (!document.querySelector('link[href*="leaflet"]')) {
          const linkEl = document.createElement("link")
          linkEl.rel = "stylesheet"
          linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          linkEl.crossOrigin = "anonymous"
          document.head.appendChild(linkEl)
        }

        if (!(window as unknown as { L?: unknown }).L) {
          const scriptEl = document.createElement("script")
          scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          scriptEl.crossOrigin = "anonymous"
          scriptEl.onload = () => {
            setTimeout(initializeMap, 100)
          }
          document.head.appendChild(scriptEl)
        } else {
          initializeMap()
        }
      }
      loadLeaflet()
    }
  }, [mapLoaded])

  const initializeMap = () => {
    if (!mapRef.current) return
    const L = (window as unknown as { L: typeof import("leaflet") }).L
    if (!L) return

    if (mapInstanceRef.current) {
      ;(mapInstanceRef.current as { remove: () => void }).remove()
    }

    const map = L.map(mapRef.current, {
      center: [23.8103, 90.4125],
      zoom: 12,
      zoomControl: false,
    })

    const tileUrl =
      visualProtocol === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    tileLayerRef.current = tileLayer

    L.control.zoom({ position: "topright" }).addTo(map)

    towers.forEach((tower) => {
      const color = providerColors[tower.provider] || "#6b7280"

      const marker = L.circleMarker([tower.lat, tower.lng], {
        radius: Math.min(8 + tower.hits / 10, 15),
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map)

      marker.bindPopup(`
        <div style="min-width: 180px; font-family: system-ui, sans-serif; background: ${visualProtocol === "dark" ? "#0f172a" : "#ffffff"}; padding: 12px; border-radius: 8px; color: ${visualProtocol === "dark" ? "#f3f4f6" : "#1f2937"};">
          <div style="font-weight: 600; margin-bottom: 8px; color: ${color};">${tower.provider}</div>
          <div style="font-size: 12px;">
            <div style="margin-bottom: 4px;"><strong style="color: #22d3ee;">MCC:</strong> ${tower.mcc || "N/A"}</div>
            <div style="margin-bottom: 4px;"><strong style="color: #22d3ee;">MNC:</strong> ${tower.mnc || "N/A"}</div>
            <div style="margin-bottom: 4px;"><strong style="color: #22d3ee;">LAC:</strong> ${tower.lac}</div>
            <div style="margin-bottom: 4px;"><strong style="color: #22d3ee;">CI:</strong> ${tower.ci}</div>
            <div style="margin-bottom: 4px;"><strong style="color: #22d3ee;">Hits:</strong> ${tower.hits}</div>
            <div><strong style="color: #22d3ee;">Coords:</strong> ${tower.lat.toFixed(4)}, ${tower.lng.toFixed(4)}</div>
          </div>
        </div>
      `)
    })

    if (showMovement && towers.length > 0) {
      const movementPath = towers.sort((a, b) => a.id - b.id).map((t) => [t.lat, t.lng] as [number, number])

      L.polyline(movementPath, {
        color: "#22d3ee",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 10",
      }).addTo(map)
    }

    mapInstanceRef.current = map
    setMapLoaded(true)
  }

  const filteredTowers = towers.filter((tower) => {
    if (selectedProvider && tower.provider !== selectedProvider) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return tower.lac.includes(query) || tower.ci.includes(query) || tower.provider.toLowerCase().includes(query)
    }
    return true
  })

  return (
    <div className={`p-8 space-y-6 max-w-[1600px] mx-auto ${visualProtocol === "light" ? "bg-gray-50" : ""}`}>
      {alertMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            alertMessage.type === "warning"
              ? "bg-amber-500/20 border border-amber-500/50 text-amber-300"
              : alertMessage.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                : "bg-red-500/20 border border-red-500/50 text-red-300"
          }`}
        >
          {alertMessage.type === "warning" ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          {alertMessage.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            GEO Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">Cell Tower Geolocation & Forensic Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
            <Button
              size="icon"
              variant="ghost"
              className={`w-8 h-8 ${visualProtocol === "light" ? "bg-amber-500/20 text-amber-400" : ""}`}
              onClick={toggleVisualProtocol}
              aria-label="Toggle visual mode"
            >
              {visualProtocol === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <span className="text-xs text-muted-foreground">
              {visualProtocol === "light" ? "Light Protocol" : "Dark Protocol"}
            </span>
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-transparent border-border hover:border-cyan-500/50"
            onClick={() => setShowUploader(!showUploader)}
          >
            <Upload className="w-4 h-4" />
            Load Data
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
            <Download className="w-4 h-4" />
            Export Map
          </Button>
        </div>
      </div>

      {showUploader && (
        <FileUploader
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
          acceptedFormats={[".xls", ".xlsx", ".csv"]}
        />
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left sidebar - Controls */}
        <div className="space-y-4">
          <Card className="bg-card border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                Cell Tower Analysis
              </CardTitle>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${visualProtocol === "light" ? "bg-amber-400" : "bg-cyan-400"}`}
                />
                {visualProtocol === "light" ? "Light" : "Dark"} Protocol Active
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">MCC</Label>
                  <Input
                    placeholder="e.g. 470"
                    value={mcc}
                    onChange={(e) => setMcc(e.target.value)}
                    className="bg-secondary border-border text-sm h-8 focus:border-cyan-500/50"
                  />
                  <span className="text-[10px] text-muted-foreground">Mobile Country Code</span>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">MNC</Label>
                  <Input
                    placeholder="e.g. 01"
                    value={mnc}
                    onChange={(e) => setMnc(e.target.value)}
                    className="bg-secondary border-border text-sm h-8 focus:border-cyan-500/50"
                  />
                  <span className="text-[10px] text-muted-foreground">Mobile Network Code</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">LAC</Label>
                  <Input
                    placeholder="e.g. 1234"
                    value={lac}
                    onChange={(e) => setLac(e.target.value)}
                    className="bg-secondary border-border text-sm h-8 focus:border-cyan-500/50"
                  />
                  <span className="text-[10px] text-muted-foreground">Location Area Code</span>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">CID</Label>
                  <Input
                    placeholder="e.g. 5678"
                    value={cid}
                    onChange={(e) => setCid(e.target.value)}
                    className="bg-secondary border-border text-sm h-8 focus:border-cyan-500/50"
                  />
                  <span className="text-[10px] text-muted-foreground">Cell ID</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  onClick={initiateTrace}
                >
                  <SatelliteDish className="w-3.5 h-3.5" />
                  Initiate Trace
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 bg-transparent border-border hover:border-red-500/50 hover:text-red-400"
                  onClick={initiateForensicClear}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  Sanitize
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Search LAC/CI</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter LAC or CI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary border-border text-sm h-9 focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Provider</Label>
                <div className="flex flex-wrap gap-2">
                  {["GP", "Robi", "Banglalink", "Teletalk"].map((provider) => (
                    <Button
                      key={provider}
                      size="sm"
                      variant={selectedProvider === provider ? "default" : "outline"}
                      className={`text-xs h-7 px-2 ${selectedProvider === provider ? "bg-cyan-600 hover:bg-cyan-500" : "bg-transparent"}`}
                      onClick={() => setSelectedProvider(selectedProvider === provider ? null : provider)}
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-1.5"
                        style={{ backgroundColor: providerColors[provider] }}
                      />
                      {provider}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Tower Markers</span>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Heatmap</span>
                </div>
                <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Clusters</span>
                </div>
                <Switch checked={showClusters} onCheckedChange={setShowClusters} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Movement Path</span>
                </div>
                <Switch checked={showMovement} onCheckedChange={setShowMovement} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(providerColors).map(([provider, color]) => (
                <div key={provider} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-muted-foreground">{provider}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map area */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-card border-cyan-500/20 overflow-hidden">
            <CardContent className="p-0 relative">
              <div
                ref={mapRef}
                className="w-full h-[550px]"
                style={{ background: visualProtocol === "dark" ? "#0f172a" : "#f3f4f6" }}
              >
                {!mapLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Map className="w-12 h-12 mx-auto mb-2 text-cyan-500/50 animate-pulse" />
                      <p>Loading map...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map controls overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="w-8 h-8 bg-card/90 hover:bg-cyan-500/20">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="w-8 h-8 bg-card/90 hover:bg-cyan-500/20">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="w-8 h-8 bg-card/90 hover:bg-cyan-500/20">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline playback */}
          <Card className="bg-card border-border">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent border-cyan-500/30 hover:bg-cyan-500/10"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">Timeline: 00:00 - 23:59</span>
              </div>
            </CardContent>
          </Card>

          {/* Tower list / Empty State */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Active Towers ({filteredTowers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTowers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-12 h-12 text-cyan-500/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Awaiting Coordinates</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Enter cell tower data above or load a data file to begin geolocation analysis
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredTowers.map((tower) => (
                    <div
                      key={tower.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: providerColors[tower.provider] }}
                        />
                        <div>
                          <p className="text-sm font-medium">
                            LAC {tower.lac} / CI {tower.ci}
                          </p>
                          <p className="text-xs text-muted-foreground">{tower.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-cyan-400">{tower.hits} hits</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {tower.lat.toFixed(4)}, {tower.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
