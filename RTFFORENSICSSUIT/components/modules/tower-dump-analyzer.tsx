"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Radio, Clock, Users, MapPin, Activity, Loader2, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EnhancedFileUploader from "@/components/enhanced-file-uploader"
import DataTable from "@/components/data-table"
import type { ParsedData } from "@/lib/file-parser"
import { useDataStore } from "@/lib/data-store"
import { exportReport } from "@/lib/report-generator"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface CoPresenceResult {
  numbers: string[]
  tower: string
  timeWindow: string
  count: number
}

export default function TowerDumpAnalyzer() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { addSession } = useDataStore()

  const handleFileComplete = useCallback(
    (data: ParsedData) => {
      setParsedData(data)
      addSession("tower", "Tower Dump Analysis", data)
    },
    [addSession],
  )

  const handleExport = async (format: string) => {
    if (!parsedData) return
    setIsExporting(true)
    try {
      const config = {
        selectedReports: ["tower"],
        selectedFormat: format,
        caseInfo: {
          caseNumber: "",
          investigator: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
        },
        includeCharts: true,
        includeMaps: false,
        includeTables: true,
        includeSummary: true,
      }
      exportReport(config, { tower: parsedData })
    } finally {
      setIsExporting(false)
    }
  }

  const hitFrequencyData = useMemo(() => {
    if (!parsedData) return []

    const headers = parsedData.headers.map((h) => h.toLowerCase())
    const msisdnCol = parsedData.headers.find(
      (h, i) => headers[i].includes("msisdn") || headers[i].includes("phone") || headers[i].includes("number"),
    )

    if (!msisdnCol) return []

    const counts: Record<string, number> = {}
    parsedData.rows.forEach((row) => {
      const num = row[msisdnCol]
      if (num) {
        counts[num] = (counts[num] || 0) + 1
      }
    })

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([number, count], index) => ({
        number: number.slice(-4),
        fullNumber: number,
        count,
        color: index < 3 ? "#22d3ee" : index < 7 ? "#0ea5e9" : "#6b7280",
      }))
  }, [parsedData])

  const coPresenceData = useMemo((): CoPresenceResult[] => {
    if (!parsedData) return []

    const headers = parsedData.headers.map((h) => h.toLowerCase())
    const msisdnCol = parsedData.headers.find(
      (h, i) => headers[i].includes("msisdn") || headers[i].includes("phone") || headers[i].includes("number"),
    )
    const lacCol = parsedData.headers.find((h, i) => headers[i].includes("lac"))
    const ciCol = parsedData.headers.find((h, i) => headers[i].includes("ci") || headers[i].includes("cell"))
    const timeCol = parsedData.headers.find((h, i) => headers[i].includes("time") || headers[i].includes("date"))

    if (!msisdnCol || (!lacCol && !ciCol)) return []

    // Group by tower and time window (1 hour)
    const towerTimeGroups: Record<string, Set<string>> = {}

    parsedData.rows.forEach((row) => {
      const number = row[msisdnCol]
      const tower = `${row[lacCol || ""] || ""}-${row[ciCol || ""] || ""}`
      let timeWindow = "Unknown"

      if (timeCol && row[timeCol]) {
        try {
          const date = new Date(row[timeCol])
          if (!isNaN(date.getTime())) {
            timeWindow = `${date.toISOString().split("T")[0]} ${date.getHours().toString().padStart(2, "0")}:00`
          }
        } catch {
          // Use default
        }
      }

      const key = `${tower}|${timeWindow}`
      if (!towerTimeGroups[key]) {
        towerTimeGroups[key] = new Set()
      }
      if (number) {
        towerTimeGroups[key].add(number)
      }
    })

    // Find groups with multiple numbers
    return Object.entries(towerTimeGroups)
      .filter(([, numbers]) => numbers.size >= 2)
      .map(([key, numbers]) => {
        const [tower, timeWindow] = key.split("|")
        return {
          numbers: Array.from(numbers),
          tower,
          timeWindow,
          count: numbers.size,
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)
  }, [parsedData])

  const stats = parsedData
    ? [
        {
          label: "Total Records",
          value: parsedData.rows.length.toLocaleString(),
          icon: Radio,
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
        },
        {
          label: "Unique MSISDN",
          value: parsedData.analytics?.uniqueMSISDN?.toLocaleString() || "0",
          icon: Users,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Time Span",
          value: parsedData.analytics?.timeSpan || "N/A",
          icon: Clock,
          color: "text-teal-400",
          bgColor: "bg-teal-500/10",
        },
        {
          label: "Tower Count",
          value: parsedData.analytics?.towerCount?.toLocaleString() || "0",
          icon: MapPin,
          color: "text-sky-400",
          bgColor: "bg-sky-500/10",
        },
      ]
    : []

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Tower Dump Analyzer
          </h1>
          <p className="text-muted-foreground mt-1">Analyze cell tower dump files for device identification</p>
        </div>
        {parsedData && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent border-border hover:border-cyan-500/50"
              onClick={() => setParsedData(null)}
            >
              Upload New File
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")}>Export as HTML</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {!parsedData && (
        <EnhancedFileUploader
          onComplete={handleFileComplete}
          moduleType="tower"
          acceptedFormats={[".xls", ".xlsx", ".csv", ".txt"]}
        />
      )}

      {parsedData && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="bg-card border-border hover:border-cyan-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Tabs defaultValue="data" className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="data">Raw Data</TabsTrigger>
              <TabsTrigger value="frequency">Hit Frequency</TabsTrigger>
              <TabsTrigger value="copresence">Co-Presence ({coPresenceData.length})</TabsTrigger>
              <TabsTrigger value="timeline">Presence Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="data">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Tower Dump Records</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by MSISDN, IMEI..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-secondary border-border focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable columns={parsedData.headers} data={parsedData.rows} searchQuery={searchQuery} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="frequency">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Hit Frequency Analysis</CardTitle>
                  <CardDescription>Top 20 MSISDN by appearance frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  {hitFrequencyData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hitFrequencyData} layout="vertical" margin={{ left: 10, right: 30 }}>
                          <XAxis type="number" stroke="#6b7280" fontSize={12} />
                          <YAxis type="category" dataKey="number" stroke="#6b7280" fontSize={12} width={50} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #0ea5e9",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number, name: string, props: { payload?: { fullNumber: string } }) => [
                              `${value} hits`,
                              props.payload?.fullNumber || name,
                            ]}
                          />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {hitFrequencyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Activity className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                        <p>No MSISDN data available for frequency analysis</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="copresence">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Co-Presence Detection
                  </CardTitle>
                  <CardDescription>Multiple numbers present at same tower within 1-hour time window</CardDescription>
                </CardHeader>
                <CardContent>
                  {coPresenceData.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {coPresenceData.map((group, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400">
                                {idx + 1}
                              </span>
                              <span className="font-medium text-amber-300">{group.count} devices</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{group.timeWindow}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Radio className="w-3 h-3" />
                            <span>Tower: {group.tower}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.numbers.slice(0, 10).map((num) => (
                              <span
                                key={num}
                                className="px-2 py-1 text-xs font-mono bg-secondary rounded border border-border"
                              >
                                {num}
                              </span>
                            ))}
                            {group.numbers.length > 10 && (
                              <span className="px-2 py-1 text-xs text-muted-foreground">
                                +{group.numbers.length - 10} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Users className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                        <p>No co-presence patterns detected</p>
                        <p className="text-xs mt-1">Requires MSISDN, LAC/CI, and timestamp columns</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Presence Timeline</CardTitle>
                  <CardDescription>First seen, last seen, and total duration</CardDescription>
                </CardHeader>
                <CardContent>
                  {parsedData.analytics?.firstActivity ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <p className="text-xs text-muted-foreground mb-1">First Activity</p>
                          <p className="font-medium">{parsedData.analytics.firstActivity}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <p className="text-xs text-muted-foreground mb-1">Last Activity</p>
                          <p className="font-medium">{parsedData.analytics.lastActivity}</p>
                        </div>
                      </div>
                      {parsedData.analytics.hourlyDistribution && (
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={parsedData.analytics.hourlyDistribution}>
                              <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} tickFormatter={(h) => `${h}h`} />
                              <YAxis stroke="#6b7280" fontSize={10} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1e293b",
                                  border: "1px solid #0ea5e9",
                                  borderRadius: "8px",
                                }}
                                labelFormatter={(h) => `${h}:00 - ${h}:59`}
                              />
                              <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Clock className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                        <p>Timeline requires timestamp column</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
