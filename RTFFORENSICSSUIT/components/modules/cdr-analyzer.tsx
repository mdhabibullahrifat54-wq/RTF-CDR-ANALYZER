"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileSpreadsheet,
  Search,
  Clock,
  Users,
  Radio,
  BarChart3,
  Phone,
  ArrowDownLeft,
  ArrowUpRight,
  MessageSquare,
  Loader2,
  TrendingUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EnhancedFileUploader from "@/components/enhanced-file-uploader"
import DataTable from "@/components/data-table"
import { useDataStore } from "@/lib/data-store"
import type { ParsedData } from "@/lib/file-parser"
import { exportReport } from "@/lib/report-generator"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Area, AreaChart } from "recharts"

export default function CDRAnalyzer() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { addSession } = useDataStore()

  const handleFileComplete = useCallback(
    (data: ParsedData) => {
      setParsedData(data)
      addSession("cdr", "CDR Analysis", data)
    },
    [addSession],
  )

  const handleExport = async (format: string) => {
    if (!parsedData) return
    setIsExporting(true)
    try {
      const config = {
        selectedReports: ["cdr"],
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
      exportReport(config, { cdr: parsedData })
    } finally {
      setIsExporting(false)
    }
  }

  const bPartyChartData = useMemo(() => {
    if (!parsedData?.analytics?.topBParty) return []
    return parsedData.analytics.topBParty.slice(0, 10).map((item, index) => ({
      name: item.number.slice(-4),
      fullNumber: item.number,
      count: item.count,
      color: index === 0 ? "#22d3ee" : index < 3 ? "#0ea5e9" : "#6b7280",
    }))
  }, [parsedData])

  const timelineChartData = useMemo(() => {
    if (!parsedData?.analytics?.timelineData) return []
    return parsedData.analytics.timelineData.map((item) => ({
      date: item.date.slice(5), // MM-DD format
      fullDate: item.date,
      calls: item.calls,
      sms: item.sms,
      total: item.calls + item.sms + item.data,
    }))
  }, [parsedData])

  const hourlyChartData = useMemo(() => {
    if (!parsedData?.analytics?.hourlyDistribution) return []
    return parsedData.analytics.hourlyDistribution.map((item) => ({
      hour: `${item.hour.toString().padStart(2, "0")}:00`,
      count: item.count,
    }))
  }, [parsedData])

  const stats = parsedData
    ? [
        {
          label: "Total Records",
          value: parsedData.rows.length.toLocaleString(),
          icon: FileSpreadsheet,
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
        },
        {
          label: "Unique B-Party",
          value: parsedData.analytics?.uniqueBParty?.toLocaleString() || "0",
          icon: Users,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Total Duration",
          value: parsedData.analytics?.totalDuration || "N/A",
          icon: Clock,
          color: "text-teal-400",
          bgColor: "bg-teal-500/10",
        },
        {
          label: "Tower Hits",
          value: parsedData.analytics?.towerHits?.toLocaleString() || "0",
          icon: Radio,
          color: "text-sky-400",
          bgColor: "bg-sky-500/10",
        },
      ]
    : []

  const callStats = parsedData?.analytics
    ? [
        {
          label: "Incoming",
          value: parsedData.analytics.incomingCalls || 0,
          icon: ArrowDownLeft,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
        },
        {
          label: "Outgoing",
          value: parsedData.analytics.outgoingCalls || 0,
          icon: ArrowUpRight,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "SMS",
          value: parsedData.analytics.smsCount || 0,
          icon: MessageSquare,
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
        },
        {
          label: "IMEI Count",
          value: parsedData.analytics.uniqueIMEI || 0,
          icon: Phone,
          color: "text-indigo-400",
          bgColor: "bg-indigo-500/10",
        },
      ]
    : []

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            CDR Analyzer
          </h1>
          <p className="text-muted-foreground mt-1">Analyze Call Detail Records from mobile operators</p>
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
          moduleType="cdr"
          acceptedFormats={[".xls", ".xlsx", ".csv", ".txt"]}
        />
      )}

      {parsedData && (
        <>
          {/* Primary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="bg-card border-border hover:border-cyan-500/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-11 h-11 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Secondary stats - call breakdown */}
          {callStats.some((s) => s.value > 0) && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {callStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">{stat.value.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Time span info */}
          {parsedData.analytics?.firstActivity && (
            <Card className="bg-card border-cyan-500/20">
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-cyan-400/70">First Activity</p>
                      <p className="text-sm font-medium text-foreground">{parsedData.analytics.firstActivity}</p>
                    </div>
                    <div className="w-px h-8 bg-cyan-500/20" />
                    <div>
                      <p className="text-xs text-cyan-400/70">Last Activity</p>
                      <p className="text-sm font-medium text-foreground">{parsedData.analytics.lastActivity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-cyan-400/70">Unique Towers</p>
                    <p className="text-sm font-medium text-foreground">{parsedData.analytics.towerCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="data" className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="data">Raw Data</TabsTrigger>
              <TabsTrigger value="bparty">B-Party Analysis</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="towers">Tower Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">CDR Records ({parsedData.rows.length.toLocaleString()})</CardTitle>
                    <div className="relative w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-secondary border-border focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={parsedData.headers}
                    data={parsedData.rows}
                    searchQuery={searchQuery}
                    pageSize={15}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bparty">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Top 10 B-Party Numbers</CardTitle>
                    <CardDescription>Most frequently contacted numbers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bPartyChartData.length > 0 ? (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={bPartyChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <XAxis type="number" stroke="#6b7280" fontSize={12} />
                            <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={50} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #0ea5e9",
                                borderRadius: "8px",
                              }}
                              labelStyle={{ color: "#f9fafb" }}
                              formatter={(value: number, name: string, props: { payload?: { fullNumber: string } }) => [
                                value,
                                props.payload?.fullNumber || name,
                              ]}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                              {bPartyChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        No B-Party data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Top 100 B-Party List</CardTitle>
                    <CardDescription>Complete frequency breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-72 overflow-y-auto space-y-1">
                      {parsedData.analytics?.topBParty?.slice(0, 100).map((item, index) => (
                        <div
                          key={item.number}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-cyan-500/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-xs font-medium text-cyan-300">
                              {index + 1}
                            </span>
                            <span className="font-mono text-sm">{item.number}</span>
                          </div>
                          <span className="text-sm text-cyan-400/70">{item.count} calls</span>
                        </div>
                      )) || <p className="text-center text-muted-foreground py-8">No data available</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      Activity Over Time
                    </CardTitle>
                    <CardDescription>Daily call and SMS activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {timelineChartData.length > 0 ? (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={timelineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                            <YAxis stroke="#6b7280" fontSize={11} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #0ea5e9",
                                borderRadius: "8px",
                              }}
                              labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
                            />
                            <Area
                              type="monotone"
                              dataKey="calls"
                              stackId="1"
                              stroke="#22d3ee"
                              fill="#22d3ee"
                              fillOpacity={0.3}
                              name="Calls"
                            />
                            <Area
                              type="monotone"
                              dataKey="sms"
                              stackId="1"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.3}
                              name="SMS"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                          <p>Timeline data requires date/time column</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Hourly Distribution
                    </CardTitle>
                    <CardDescription>Activity by hour of day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hourlyChartData.length > 0 && hourlyChartData.some((h) => h.count > 0) ? (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={hourlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} interval={2} />
                            <YAxis stroke="#6b7280" fontSize={11} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #0ea5e9",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Activity" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Clock className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                          <p>Hourly distribution requires timestamp data</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="towers">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Tower Activity Summary</CardTitle>
                  <CardDescription>{parsedData.analytics?.towerCount || 0} unique towers detected</CardDescription>
                </CardHeader>
                <CardContent>
                  {parsedData.analytics?.towerLocations && parsedData.analytics.towerLocations.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">LAC</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cell ID</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Hits</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Coordinates</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.analytics.towerLocations.slice(0, 50).map((tower, idx) => (
                            <tr
                              key={`${tower.lac}-${tower.ci}`}
                              className="border-b border-border/50 hover:bg-secondary/30"
                            >
                              <td className="py-3 px-4">
                                <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400">
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono">{tower.lac || "-"}</td>
                              <td className="py-3 px-4 font-mono">{tower.ci || "-"}</td>
                              <td className="py-3 px-4 font-semibold text-cyan-400">{tower.count}</td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {tower.lat && tower.lng ? `${tower.lat.toFixed(4)}, ${tower.lng.toFixed(4)}` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-72 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Radio className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                        <p>Tower activity requires LAC/CI columns</p>
                        <p className="text-xs mt-1">View in GEO Intelligence for map visualization</p>
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
