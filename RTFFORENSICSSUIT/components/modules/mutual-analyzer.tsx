"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Users, GitBranch, Network, Loader2, FileSpreadsheet, ArrowLeftRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EnhancedFileUploader from "@/components/enhanced-file-uploader"
import DataTable from "@/components/data-table"
import type { ParsedData } from "@/lib/file-parser"
import { useDataStore } from "@/lib/data-store"
import { exportReport } from "@/lib/report-generator"

interface MutualPair {
  numberA: string
  numberB: string
  aToB: number
  bToA: number
  total: number
  firstContact: string
  lastContact: string
}

interface ClusterResult {
  id: number
  members: string[]
  totalInteractions: number
  strength: "strong" | "medium" | "weak"
}

export default function MutualAnalyzer() {
  const [file1Data, setFile1Data] = useState<ParsedData | null>(null)
  const [file2Data, setFile2Data] = useState<ParsedData | null>(null)
  const [uploadStep, setUploadStep] = useState<"file1" | "file2">("file1")
  const [isExporting, setIsExporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { addSession } = useDataStore()

  const handleFile1Complete = useCallback((data: ParsedData) => {
    setFile1Data(data)
    setUploadStep("file2")
  }, [])

  const handleFile2Complete = useCallback(
    (data: ParsedData) => {
      setFile2Data(data)
      addSession("mutual", "Mutual Analysis", data)
    },
    [addSession],
  )

  const handleExport = async (format: string) => {
    if (!file1Data || !file2Data) return
    setIsExporting(true)
    try {
      const config = {
        selectedReports: ["mutual"],
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
      exportReport(config, { mutual: file1Data })
    } finally {
      setIsExporting(false)
    }
  }

  const mutualPairs = useMemo((): MutualPair[] => {
    if (!file1Data || !file2Data) return []

    const getPhoneColumn = (data: ParsedData) => {
      const headers = data.headers.map((h) => h.toLowerCase())
      return data.headers.find(
        (h, i) =>
          headers[i].includes("msisdn") ||
          headers[i].includes("phone") ||
          headers[i].includes("b_party") ||
          headers[i].includes("bparty") ||
          headers[i].includes("called") ||
          headers[i].includes("party b"),
      )
    }

    const getAPartyColumn = (data: ParsedData) => {
      const headers = data.headers.map((h) => h.toLowerCase())
      return data.headers.find(
        (h, i) =>
          headers[i].includes("a_party") ||
          headers[i].includes("aparty") ||
          headers[i].includes("caller") ||
          headers[i].includes("calling") ||
          headers[i].includes("party a"),
      )
    }

    const bCol1 = getPhoneColumn(file1Data)
    const aCol1 = getAPartyColumn(file1Data)
    const bCol2 = getPhoneColumn(file2Data)
    const aCol2 = getAPartyColumn(file2Data)

    if (!bCol1 && !aCol1) return []

    // Get all unique numbers from both files
    const numbers1 = new Set<string>()
    const numbers2 = new Set<string>()

    file1Data.rows.forEach((row) => {
      if (bCol1 && row[bCol1]) numbers1.add(row[bCol1])
      if (aCol1 && row[aCol1]) numbers1.add(row[aCol1])
    })

    file2Data.rows.forEach((row) => {
      if (bCol2 && row[bCol2]) numbers2.add(row[bCol2])
      if (aCol2 && row[aCol2]) numbers2.add(row[aCol2])
    })

    // Find common numbers
    const commonNumbers = Array.from(numbers1).filter((n) => numbers2.has(n))

    // Calculate interactions between common numbers
    const interactions: Record<string, MutualPair> = {}

    // Analyze file1 for interactions
    if (aCol1 && bCol1) {
      file1Data.rows.forEach((row) => {
        const a = row[aCol1]
        const b = row[bCol1]
        if (a && b && commonNumbers.includes(a) && commonNumbers.includes(b)) {
          const key = [a, b].sort().join("-")
          if (!interactions[key]) {
            interactions[key] = {
              numberA: a < b ? a : b,
              numberB: a < b ? b : a,
              aToB: 0,
              bToA: 0,
              total: 0,
              firstContact: "",
              lastContact: "",
            }
          }
          if (a < b) {
            interactions[key].aToB++
          } else {
            interactions[key].bToA++
          }
          interactions[key].total++
        }
      })
    }

    return Object.values(interactions)
      .filter((p) => p.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 100)
  }, [file1Data, file2Data])

  const clusters = useMemo((): ClusterResult[] => {
    if (mutualPairs.length === 0) return []

    // Simple clustering based on connected components
    const adjacency: Record<string, Set<string>> = {}

    mutualPairs.forEach((pair) => {
      if (!adjacency[pair.numberA]) adjacency[pair.numberA] = new Set()
      if (!adjacency[pair.numberB]) adjacency[pair.numberB] = new Set()
      adjacency[pair.numberA].add(pair.numberB)
      adjacency[pair.numberB].add(pair.numberA)
    })

    const visited = new Set<string>()
    const clusterResults: ClusterResult[] = []
    let clusterId = 0

    const dfs = (node: string, cluster: Set<string>) => {
      if (visited.has(node)) return
      visited.add(node)
      cluster.add(node)
      adjacency[node]?.forEach((neighbor) => dfs(neighbor, cluster))
    }

    Object.keys(adjacency).forEach((node) => {
      if (!visited.has(node)) {
        const cluster = new Set<string>()
        dfs(node, cluster)
        if (cluster.size >= 2) {
          const members = Array.from(cluster)
          const interactions = mutualPairs
            .filter((p) => cluster.has(p.numberA) && cluster.has(p.numberB))
            .reduce((sum, p) => sum + p.total, 0)

          clusterResults.push({
            id: ++clusterId,
            members,
            totalInteractions: interactions,
            strength: interactions > 50 ? "strong" : interactions > 20 ? "medium" : "weak",
          })
        }
      }
    })

    return clusterResults.sort((a, b) => b.totalInteractions - a.totalInteractions)
  }, [mutualPairs])

  // Stats for common numbers
  const commonNumbersCount = useMemo(() => {
    if (!file1Data || !file2Data) return 0

    const getNumbers = (data: ParsedData) => {
      const headers = data.headers.map((h) => h.toLowerCase())
      const col = data.headers.find(
        (h, i) => headers[i].includes("msisdn") || headers[i].includes("phone") || headers[i].includes("number"),
      )
      if (!col) return new Set<string>()
      return new Set(data.rows.map((r) => r[col]).filter(Boolean))
    }

    const nums1 = getNumbers(file1Data)
    const nums2 = getNumbers(file2Data)

    return Array.from(nums1).filter((n) => nums2.has(n)).length
  }, [file1Data, file2Data])

  const hasAllData = file1Data && file2Data

  const stats = hasAllData
    ? [
        {
          label: "File 1 Records",
          value: file1Data.rows.length.toLocaleString(),
          icon: FileSpreadsheet,
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
        },
        {
          label: "File 2 Records",
          value: file2Data.rows.length.toLocaleString(),
          icon: FileSpreadsheet,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Common Numbers",
          value: commonNumbersCount.toLocaleString(),
          icon: Users,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
        },
        {
          label: "Mutual Pairs",
          value: mutualPairs.length.toLocaleString(),
          icon: ArrowLeftRight,
          color: "text-amber-400",
          bgColor: "bg-amber-500/10",
        },
      ]
    : []

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Mutual Communication Analyzer
          </h1>
          <p className="text-muted-foreground mt-1">Detect communication clusters and interaction patterns</p>
        </div>
        {hasAllData && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent border-border hover:border-cyan-500/50"
              onClick={() => {
                setFile1Data(null)
                setFile2Data(null)
                setUploadStep("file1")
              }}
            >
              Start New Analysis
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

      {!hasAllData && (
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${file1Data ? "text-cyan-400" : "text-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  file1Data ? "bg-cyan-500 text-primary-foreground" : "bg-secondary text-foreground"
                }`}
              >
                1
              </div>
              <span className="text-sm">CDR File 1</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div
              className={`flex items-center gap-2 ${uploadStep === "file2" ? "text-foreground" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  file2Data
                    ? "bg-cyan-500 text-primary-foreground"
                    : uploadStep === "file2"
                      ? "bg-secondary text-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="text-sm">CDR File 2</span>
            </div>
          </div>

          {uploadStep === "file1" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Upload First CDR File</h3>
              <p className="text-sm text-muted-foreground">Upload the first CDR file for mutual analysis</p>
              <EnhancedFileUploader
                onComplete={handleFile1Complete}
                moduleType="cdr"
                acceptedFormats={[".xls", ".xlsx", ".csv", ".txt"]}
              />
            </div>
          )}

          {uploadStep === "file2" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Upload Second CDR File</h3>
                  <p className="text-sm text-muted-foreground">Upload the second CDR file to compare</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setUploadStep("file1")}>
                  Change First File
                </Button>
              </div>
              <EnhancedFileUploader
                onComplete={handleFile2Complete}
                moduleType="cdr"
                acceptedFormats={[".xls", ".xlsx", ".csv", ".txt"]}
              />
            </div>
          )}
        </div>
      )}

      {hasAllData && (
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

          <Tabs defaultValue="mutual" className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="mutual">Mutual Calls ({mutualPairs.length})</TabsTrigger>
              <TabsTrigger value="clusters">Clusters ({clusters.length})</TabsTrigger>
              <TabsTrigger value="file1">File 1 Data</TabsTrigger>
              <TabsTrigger value="file2">File 2 Data</TabsTrigger>
            </TabsList>

            <TabsContent value="mutual">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Mutual Call Detection</CardTitle>
                  <CardDescription>Numbers that communicated in both directions (A to B and B to A)</CardDescription>
                </CardHeader>
                <CardContent>
                  {mutualPairs.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Number A</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Number B</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground">A → B</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground">B → A</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mutualPairs.map((pair, idx) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30">
                              <td className="py-3 px-4 font-mono text-xs">{pair.numberA}</td>
                              <td className="py-3 px-4 font-mono text-xs">{pair.numberB}</td>
                              <td className="py-3 px-4 text-center text-cyan-400">{pair.aToB}</td>
                              <td className="py-3 px-4 text-center text-blue-400">{pair.bToA}</td>
                              <td className="py-3 px-4 text-center font-semibold text-emerald-400">{pair.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <GitBranch className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                        <p>No mutual communication pairs detected</p>
                        <p className="text-xs mt-1">Requires A-Party and B-Party columns in both files</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clusters">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Communication Clusters</CardTitle>
                  <CardDescription>Groups of numbers with interconnected communication</CardDescription>
                </CardHeader>
                <CardContent>
                  {clusters.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {clusters.map((cluster) => (
                        <div
                          key={cluster.id}
                          className={`p-4 rounded-lg border ${
                            cluster.strength === "strong"
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : cluster.strength === "medium"
                                ? "border-amber-500/30 bg-amber-500/5"
                                : "border-border bg-secondary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Network
                                className={`w-4 h-4 ${
                                  cluster.strength === "strong"
                                    ? "text-emerald-400"
                                    : cluster.strength === "medium"
                                      ? "text-amber-400"
                                      : "text-muted-foreground"
                                }`}
                              />
                              <span className="font-medium">Cluster #{cluster.id}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  cluster.strength === "strong"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : cluster.strength === "medium"
                                      ? "bg-amber-500/20 text-amber-400"
                                      : "bg-secondary text-muted-foreground"
                                }`}
                              >
                                {cluster.strength}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {cluster.totalInteractions} interactions
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cluster.members.slice(0, 8).map((num) => (
                              <span
                                key={num}
                                className="px-2 py-1 text-xs font-mono bg-background rounded border border-border"
                              >
                                {num}
                              </span>
                            ))}
                            {cluster.members.length > 8 && (
                              <span className="px-2 py-1 text-xs text-muted-foreground">
                                +{cluster.members.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Network className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                        <p>No clusters detected</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="file1">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      File 1 Records ({file1Data.rows.length.toLocaleString()})
                    </CardTitle>
                    <div className="relative w-64">
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
                  <DataTable columns={file1Data.headers} data={file1Data.rows} searchQuery={searchQuery} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="file2">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      File 2 Records ({file2Data.rows.length.toLocaleString()})
                    </CardTitle>
                    <div className="relative w-64">
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
                  <DataTable columns={file2Data.headers} data={file2Data.rows} searchQuery={searchQuery} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
