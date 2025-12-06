"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Route, MapPin, Signal, AlertTriangle, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import FileUploader from "@/components/file-uploader"
import { parseFile, type ParsedData } from "@/lib/file-parser"
import { useDataStore } from "@/lib/data-store"
import { exportReport } from "@/lib/report-generator"

export default function DriveTestAnalyzer() {
  const [driveTestData, setDriveTestData] = useState<ParsedData | null>(null)
  const [cdrData, setCdrData] = useState<ParsedData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [uploadStep, setUploadStep] = useState<"drive" | "cdr">("drive")
  const { addSession } = useDataStore()

  const handleDriveTestUpload = useCallback(
    async (file: File) => {
      setIsProcessing(true)
      try {
        const data = await parseFile(file)
        setDriveTestData(data)
        addSession("drive", file.name, data)
        setUploadStep("cdr")
      } catch (error) {
        console.error("Error parsing file:", error)
      } finally {
        setIsProcessing(false)
      }
    },
    [addSession],
  )

  const handleCDRUpload = useCallback(async (file: File) => {
    setIsProcessing(true)
    try {
      const data = await parseFile(file)
      setCdrData(data)
    } catch (error) {
      console.error("Error parsing file:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleExport = async (format: string) => {
    if (!driveTestData) return
    setIsExporting(true)
    try {
      const config = {
        selectedReports: ["drive"],
        selectedFormat: format,
        caseInfo: {
          caseNumber: "",
          investigator: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
        },
        includeCharts: true,
        includeMaps: true,
        includeTables: true,
        includeSummary: true,
      }
      exportReport(config, { drive: driveTestData })
    } finally {
      setIsExporting(false)
    }
  }

  const hasAllData = driveTestData && cdrData

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Drive Test Route Analyzer
          </h1>
          <p className="text-muted-foreground mt-1">Overlay CDR data onto operator drive test routes</p>
        </div>
        {hasAllData && (
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
        )}
      </div>

      {!hasAllData && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${driveTestData ? "text-cyan-400" : "text-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${driveTestData ? "bg-cyan-500 text-primary-foreground" : "bg-secondary text-foreground"}`}
              >
                1
              </div>
              <span className="text-sm">Drive Test Log</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div
              className={`flex items-center gap-2 ${cdrData ? "text-cyan-400" : uploadStep === "cdr" ? "text-foreground" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${cdrData ? "bg-cyan-500 text-primary-foreground" : uploadStep === "cdr" ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span className="text-sm">Target CDR File</span>
            </div>
          </div>

          {uploadStep === "drive" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Upload Drive Test Log</h3>
              <p className="text-sm text-muted-foreground">Supported formats: TEMS, NEMO, ROMES drive test logs</p>
              <FileUploader
                onFileUpload={handleDriveTestUpload}
                isProcessing={isProcessing}
                acceptedFormats={[".xls", ".xlsx", ".csv", ".txt"]}
              />
            </div>
          )}

          {uploadStep === "cdr" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Upload Target CDR File</h3>
                  <p className="text-sm text-muted-foreground">CDR data to overlay on the drive test route</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setUploadStep("drive")}>
                  Change Drive Test File
                </Button>
              </div>
              <FileUploader
                onFileUpload={handleCDRUpload}
                isProcessing={isProcessing}
                acceptedFormats={[".xls", ".xlsx", ".csv", ".txt"]}
              />
            </div>
          )}
        </div>
      )}

      {hasAllData && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Route Points",
                value: driveTestData.rows.length.toLocaleString(),
                icon: MapPin,
                color: "text-cyan-400",
                bgColor: "bg-cyan-500/10",
              },
              {
                label: "CDR Events",
                value: cdrData.rows.length.toLocaleString(),
                icon: Route,
                color: "text-blue-400",
                bgColor: "bg-blue-500/10",
              },
              { label: "Weak Zones", value: "0", icon: Signal, color: "text-teal-400", bgColor: "bg-teal-500/10" },
              {
                label: "Call Drops",
                value: "0",
                icon: AlertTriangle,
                color: "text-amber-400",
                bgColor: "bg-amber-500/10",
              },
            ].map((stat) => {
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

          <Tabs defaultValue="route" className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="route">Route Map</TabsTrigger>
              <TabsTrigger value="overlay">CDR Overlay</TabsTrigger>
              <TabsTrigger value="signal">Signal Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="route">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Drive Test Route</CardTitle>
                  <CardDescription>GPS route path with signal levels</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Route className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                    <p>Route visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overlay">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">CDR Overlay</CardTitle>
                  <CardDescription>Customer calls mapped along route</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                    <p>CDR overlay visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signal">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Signal Level Analysis</CardTitle>
                  <CardDescription>Coverage quality along route</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Signal className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                    <p>Signal analysis will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Performance Analysis</CardTitle>
                  <CardDescription>Weak coverage and no service zones</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-cyan-500/30" />
                    <p>Performance analysis will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-border hover:border-cyan-500/50 bg-transparent"
              onClick={() => {
                setDriveTestData(null)
                setCdrData(null)
                setUploadStep("drive")
              }}
            >
              Start New Analysis
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
