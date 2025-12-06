"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DeveloperCredit } from "@/components/developer-credit"
import {
  FileText,
  Download,
  FileSpreadsheet,
  File,
  Printer,
  Calendar,
  User,
  Hash,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useDataStore } from "@/lib/data-store"
import { exportReport, type ReportConfig, type ReportData } from "@/lib/report-generator"

const reportTypes = [
  { id: "cdr", label: "CDR Analysis Report", icon: FileText, description: "Call Detail Records analysis" },
  { id: "tower", label: "Tower Dump Report", icon: FileText, description: "Cell tower dump analysis" },
  { id: "drive", label: "Drive Test Combined Report", icon: FileText, description: "Drive test route analysis" },
  { id: "mutual", label: "Mutual Communication Report", icon: FileText, description: "Communication patterns" },
  { id: "map", label: "Map Summary Report", icon: FileText, description: "Geographic visualization" },
  { id: "cluster", label: "Cluster & Link Analysis Report", icon: FileText, description: "Network clustering" },
]

const exportFormats = [
  { id: "pdf", label: "PDF", icon: File, description: "Print to PDF via browser" },
  { id: "excel", label: "Excel", icon: FileSpreadsheet, description: "XLSX spreadsheet format" },
  { id: "csv", label: "CSV", icon: FileText, description: "Comma-separated values" },
  { id: "html", label: "HTML (Printable)", icon: Printer, description: "Web-based printable report" },
]

export default function ReportingEngine() {
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf")
  const [caseInfo, setCaseInfo] = useState({
    caseNumber: "",
    investigator: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeMaps, setIncludeMaps] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const { sessions } = useDataStore()

  const toggleReport = (reportId: string) => {
    setSelectedReports((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
    setResult(null)
  }

  // Get available data from sessions
  const getReportData = (): ReportData => {
    const data: ReportData = {}

    sessions.forEach((session) => {
      switch (session.module) {
        case "cdr":
          if (!data.cdr) data.cdr = session.data
          break
        case "tower":
          if (!data.tower) data.tower = session.data
          break
        case "drive":
          if (!data.drive) data.drive = session.data
          break
        case "mutual":
          if (!data.mutual) data.mutual = session.data
          break
        case "geo":
          if (!data.geo) data.geo = session.data
          break
      }
    })

    return data
  }

  // Check which report types have data available
  const availableReports = new Set(sessions.map((s) => s.module))

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setResult(null)

    try {
      const config: ReportConfig = {
        selectedReports,
        selectedFormat,
        caseInfo,
        includeCharts,
        includeMaps,
        includeTables,
        includeSummary,
      }

      const data = getReportData()

      // Simulate a small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const exportResult = exportReport(config, data)
      setResult(exportResult)
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const hasAvailableData = sessions.length > 0

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Reporting Engine
          </h1>
          <p className="text-muted-foreground mt-1">Generate unified reports for all analysis modules</p>
        </div>
      </div>

      {/* Status Alert */}
      {!hasAvailableData && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            No analysis data available. Please upload and analyze files in the respective modules (CDR Analyzer, Tower
            Dump, etc.) before generating reports.
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert
          className={result.success ? "border-emerald-500/50 bg-emerald-500/10" : "border-red-500/50 bg-red-500/10"}
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription className={result.success ? "text-emerald-200" : "text-red-200"}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-base">Select Report Types</CardTitle>
              <CardDescription>Choose which reports to include (modules with data are highlighted)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon
                  const isSelected = selectedReports.includes(report.id)
                  const hasData = availableReports.has(report.id)
                  return (
                    <div
                      key={report.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500/10"
                          : hasData
                            ? "border-emerald-500/30 hover:border-cyan-500/50"
                            : "border-border hover:border-cyan-500/50 opacity-60"
                      }`}
                      onClick={() => toggleReport(report.id)}
                    >
                      <Checkbox checked={isSelected} />
                      <Icon
                        className={`w-5 h-5 ${isSelected ? "text-cyan-400" : hasData ? "text-emerald-400" : "text-muted-foreground"}`}
                      />
                      <div className="flex-1">
                        <span className={`text-sm block ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                          {report.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{report.description}</span>
                      </div>
                      {hasData && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          Data Ready
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Case Information (Optional)</CardTitle>
              <CardDescription>Add case details to the report header</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    Case Number
                  </Label>
                  <Input
                    placeholder="Enter case number"
                    value={caseInfo.caseNumber}
                    onChange={(e) => setCaseInfo({ ...caseInfo, caseNumber: e.target.value })}
                    className="bg-secondary border-border focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Investigator Name
                  </Label>
                  <Input
                    placeholder="Enter investigator name"
                    value={caseInfo.investigator}
                    onChange={(e) => setCaseInfo({ ...caseInfo, investigator: e.target.value })}
                    className="bg-secondary border-border focus:border-cyan-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Report Date
                </Label>
                <Input
                  type="date"
                  value={caseInfo.date}
                  onChange={(e) => setCaseInfo({ ...caseInfo, date: e.target.value })}
                  className="bg-secondary border-border focus:border-cyan-500/50 w-48"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes / Remarks</Label>
                <Textarea
                  placeholder="Add any additional notes or remarks..."
                  value={caseInfo.notes}
                  onChange={(e) => setCaseInfo({ ...caseInfo, notes: e.target.value })}
                  className="bg-secondary border-border focus:border-cyan-500/50 min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Report Elements</CardTitle>
              <CardDescription>Select what to include in the report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                  />
                  <span className="text-sm">Charts & Visualizations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox checked={includeMaps} onCheckedChange={(checked) => setIncludeMaps(checked as boolean)} />
                  <span className="text-sm">Map Screenshots</span>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={includeTables}
                    onCheckedChange={(checked) => setIncludeTables(checked as boolean)}
                  />
                  <span className="text-sm">Data Tables</span>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={includeSummary}
                    onCheckedChange={(checked) => setIncludeSummary(checked as boolean)}
                  />
                  <span className="text-sm">Summary Interpretation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-base">Export Format</CardTitle>
              <CardDescription>Choose output format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {exportFormats.map((format) => {
                const Icon = format.icon
                const isSelected = selectedFormat === format.id
                return (
                  <div
                    key={format.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected ? "border-cyan-500 bg-cyan-500/10" : "border-border hover:border-cyan-500/50"
                    }`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-cyan-500" : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                    </div>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-cyan-400" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <span className={`text-sm block ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                        {format.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{format.description}</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reports Selected</span>
                <span className="font-medium text-cyan-400">{selectedReports.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Export Format</span>
                <span className="font-medium uppercase">{selectedFormat}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Elements</span>
                <span className="font-medium">
                  {[includeCharts, includeMaps, includeTables, includeSummary].filter(Boolean).length}/4
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Available</span>
                <span className="font-medium text-emerald-400">{sessions.length} session(s)</span>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            disabled={selectedReports.length === 0 || isGenerating}
            onClick={handleGenerateReport}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Report
              </>
            )}
          </Button>

          {selectedReports.length === 0 && (
            <p className="text-xs text-center text-muted-foreground">Select at least one report type to continue</p>
          )}

          <DeveloperCredit variant="compact" className="justify-center pt-4" />
        </div>
      </div>
    </div>
  )
}
