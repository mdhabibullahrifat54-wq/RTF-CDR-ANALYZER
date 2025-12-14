"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowRight,
  Check,
  X,
  AlertTriangle,
  Info,
  Save,
  FileText,
  Trash2,
  RotateCcw,
  Zap,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Download,
  Settings2,
  Wand2,
  Hand,
} from "lucide-react"
import {
  type ColumnMapping,
  type MappingTemplate,
  type ValidationResult,
  autoMapColumns,
  validateMappedData,
  saveMappingTemplate,
  getMappingTemplates,
  deleteTemplate,
  applyTemplate,
  suggestTemplate,
  TARGET_COLUMNS,
} from "@/lib/column-mapping"

type MappingMode = "auto" | "manual"

interface ColumnMapperProps {
  sourceColumns: string[]
  sampleData: Record<string, string>[]
  moduleType?: "cdr" | "tower"
  onMappingComplete: (mappings: ColumnMapping[]) => void
  onCancel?: () => void
}

export default function ColumnMapper({
  sourceColumns,
  sampleData,
  moduleType = "cdr",
  onMappingComplete,
  onCancel,
}: ColumnMapperProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [templates, setTemplates] = useState<MappingTemplate[]>([])
  const [suggestedTemplate, setSuggestedTemplate] = useState<MappingTemplate | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDesc, setTemplateDesc] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [expandedSource, setExpandedSource] = useState<string | null>(null)
  const [mappingMode, setMappingMode] = useState<MappingMode>("auto")
  const [showModeDialog, setShowModeDialog] = useState(true)

  // Initialize mappings based on mode
  useEffect(() => {
    if (mappingMode === "auto") {
      const autoMappings = autoMapColumns(sourceColumns, sampleData, moduleType)
      setMappings(autoMappings)
    } else {
      // Manual mode - initialize with empty mappings
      const manualMappings: ColumnMapping[] = sourceColumns.map((sourceCol) => {
        const sampleValues = sampleData.slice(0, 10).map((row) => row[sourceCol] || "")
        return {
          sourceColumn: sourceCol,
          targetColumn: "",
          confidence: 0,
          matchType: "none" as const,
          sampleData: sampleValues.slice(0, 3),
          dataType: "text" as const,
        }
      })
      setMappings(manualMappings)
    }

    // Check for suggested template
    const suggested = suggestTemplate(sourceColumns)
    setSuggestedTemplate(suggested)

    // Load templates
    setTemplates(getMappingTemplates())
  }, [sourceColumns, sampleData, moduleType, mappingMode])

  // Validate whenever mappings change
  useEffect(() => {
    if (mappings.length > 0) {
      const result = validateMappedData(sampleData, mappings, moduleType)
      setValidation(result)
    }
  }, [mappings, sampleData, moduleType])

  const targetCols = TARGET_COLUMNS[moduleType]
  const mappedTargets = new Set(mappings.filter((m) => m.confidence > 0).map((m) => m.targetColumn))

  const handleMappingChange = useCallback((sourceCol: string, targetCol: string) => {
    setMappings((prev) =>
      prev.map((m) => {
        if (m.sourceColumn === sourceCol) {
          return {
            ...m,
            targetColumn: targetCol,
            confidence: targetCol ? 100 : 0,
            matchType: targetCol ? "manual" : "none",
          }
        }
        // Clear any other mapping to the same target
        if (targetCol && m.targetColumn === targetCol && m.sourceColumn !== sourceCol) {
          return { ...m, targetColumn: "", confidence: 0, matchType: "none" }
        }
        return m
      }),
    )
  }, [])

  const handleAutoMap = useCallback(() => {
    const autoMappings = autoMapColumns(sourceColumns, sampleData, moduleType)
    setMappings(autoMappings)
    setMappingMode("auto")
  }, [sourceColumns, sampleData, moduleType])

  const handleClearAll = useCallback(() => {
    setMappings((prev) =>
      prev.map((m) => ({
        ...m,
        targetColumn: "",
        confidence: 0,
        matchType: "none",
      })),
    )
    setMappingMode("manual")
  }, [])

  const handleModeSelect = useCallback((mode: MappingMode) => {
    setMappingMode(mode)
    setShowModeDialog(false)
  }, [])

  const handleApplyTemplate = useCallback(
    (templateId: string) => {
      const applied = applyTemplate(templateId, sourceColumns)
      if (applied) {
        setMappings(applied)
      }
    },
    [sourceColumns],
  )

  const handleSaveTemplate = useCallback(() => {
    if (!templateName.trim()) return

    saveMappingTemplate({
      name: templateName,
      description: templateDesc,
      sourceSystem: "Custom",
      mappings: mappings.filter((m) => m.confidence > 0),
    })

    setTemplates(getMappingTemplates())
    setShowSaveDialog(false)
    setTemplateName("")
    setTemplateDesc("")
  }, [templateName, templateDesc, mappings])

  const handleDeleteTemplate = useCallback((templateId: string) => {
    deleteTemplate(templateId)
    setTemplates(getMappingTemplates())
  }, [])

  const getConfidenceBadge = (confidence: number, matchType: string) => {
    if (matchType === "manual") {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Manual</Badge>
    }
    if (confidence >= 90) {
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">High ({confidence}%)</Badge>
    } else if (confidence >= 70) {
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medium ({confidence}%)</Badge>
    } else if (confidence >= 50) {
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Low ({confidence}%)</Badge>
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Not Mapped
      </Badge>
    )
  }

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case "exact":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case "synonym":
        return <Check className="w-4 h-4 text-cyan-400" />
      case "pattern":
        return <Zap className="w-4 h-4 text-amber-400" />
      case "manual":
        return <Hand className="w-4 h-4 text-blue-400" />
      default:
        return <X className="w-4 h-4 text-muted-foreground" />
    }
  }

  const highConfidenceCount = mappings.filter((m) => m.confidence >= 90).length
  const mediumConfidenceCount = mappings.filter((m) => m.confidence >= 70 && m.confidence < 90).length
  const lowConfidenceCount = mappings.filter((m) => m.confidence >= 50 && m.confidence < 70).length
  const unmappedCount = mappings.filter((m) => m.confidence < 50).length
  const manualCount = mappings.filter((m) => m.matchType === "manual").length

  return (
    <div className="space-y-6">
      <Dialog open={showModeDialog} onOpenChange={setShowModeDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-cyan-400" />
              Select Mapping Mode
            </DialogTitle>
            <DialogDescription>Choose how you want to map your data columns to the target format</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-6">
            <Card
              className="cursor-pointer hover:border-cyan-500 transition-colors bg-card"
              onClick={() => handleModeSelect("auto")}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Auto Mapping</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered automatic column detection and mapping based on column names and data patterns
                </p>
                <Badge className="mt-3 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Recommended</Badge>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:border-blue-500 transition-colors bg-card"
              onClick={() => handleModeSelect("manual")}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Hand className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Manual Mapping</h3>
                <p className="text-sm text-muted-foreground">
                  Manually select target columns for each source column with full control
                </p>
                <Badge className="mt-3 bg-blue-500/20 text-blue-400 border-blue-500/30">Full Control</Badge>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header with stats and mode toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Column Mapping
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Map your file columns to the target format</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
            <Hand className={`w-4 h-4 ${mappingMode === "manual" ? "text-blue-400" : "text-muted-foreground"}`} />
            <Switch
              checked={mappingMode === "auto"}
              onCheckedChange={(checked) => {
                setMappingMode(checked ? "auto" : "manual")
                if (checked) {
                  handleAutoMap()
                } else {
                  handleClearAll()
                }
              }}
            />
            <Wand2 className={`w-4 h-4 ${mappingMode === "auto" ? "text-cyan-400" : "text-muted-foreground"}`} />
            <span className="text-sm font-medium">{mappingMode === "auto" ? "Auto" : "Manual"}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleAutoMap} className="gap-2 bg-transparent">
            <Zap className="w-4 h-4" />
            Re-Auto Map
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Suggested Template Alert */}
      {suggestedTemplate && (
        <Alert className="border-cyan-500/30 bg-cyan-500/10">
          <Info className="h-4 w-4 text-cyan-400" />
          <AlertDescription className="flex items-center justify-between">
            <span>Template &quot;{suggestedTemplate.name}&quot; matches your file structure.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyTemplate(suggestedTemplate.id)}
              className="ml-4"
            >
              Apply Template
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{highConfidenceCount}</p>
            <p className="text-xs text-emerald-400/70">High Confidence</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{mediumConfidenceCount}</p>
            <p className="text-xs text-amber-400/70">Medium Confidence</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{lowConfidenceCount}</p>
            <p className="text-xs text-orange-400/70">Low Confidence</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{manualCount}</p>
            <p className="text-xs text-blue-400/70">Manual Mapped</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{unmappedCount}</p>
            <p className="text-xs text-muted-foreground">Unmapped</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mapping" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="mapping">Column Mapping</TabsTrigger>
          <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
          <TabsTrigger value="preview">Data Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-4">
          {/* Validation Messages */}
          {validation && (
            <div className="space-y-2">
              {validation.errors
                .filter((e) => e.severity === "error")
                .map((error, i) => (
                  <Alert key={i} className="border-red-500/30 bg-red-500/10">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">{error.message}</AlertDescription>
                  </Alert>
                ))}
              {validation.warnings.map((warning, i) => (
                <Alert key={i} className="border-amber-500/30 bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-200">
                    {warning.message} ({warning.affectedRows} rows affected)
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Mapping Interface */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Column Mappings
                <Badge variant="outline" className={mappingMode === "auto" ? "text-cyan-400" : "text-blue-400"}>
                  {mappingMode === "auto" ? "Auto Mode" : "Manual Mode"}
                </Badge>
              </CardTitle>
              <CardDescription>
                {mappingMode === "auto"
                  ? "Columns are automatically mapped. Adjust any mappings as needed."
                  : "Manually select the target column for each source column."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {mappings.map((mapping) => {
                    const isExpanded = expandedSource === mapping.sourceColumn
                    return (
                      <div
                        key={mapping.sourceColumn}
                        className={`p-4 rounded-lg border transition-all ${
                          mapping.matchType === "manual"
                            ? "border-blue-500/30 bg-blue-500/5"
                            : mapping.confidence >= 90
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : mapping.confidence >= 70
                                ? "border-amber-500/30 bg-amber-500/5"
                                : mapping.confidence >= 50
                                  ? "border-orange-500/30 bg-orange-500/5"
                                  : "border-border bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Source Column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {getMatchTypeIcon(mapping.matchType)}
                              <span className="font-medium truncate">{mapping.sourceColumn}</span>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {mapping.dataType}
                              </Badge>
                            </div>
                            {mapping.sampleData && mapping.sampleData.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                Sample: {mapping.sampleData.filter(Boolean).slice(0, 2).join(", ")}
                              </p>
                            )}
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />

                          {/* Target Column Selector */}
                          <div className="w-48 shrink-0">
                            <Select
                              value={mapping.targetColumn || "none"}
                              onValueChange={(val) =>
                                handleMappingChange(mapping.sourceColumn, val === "none" ? "" : val)
                              }
                            >
                              <SelectTrigger className="bg-secondary border-border">
                                <SelectValue placeholder="Select target..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-- Don&apos;t Map --</SelectItem>
                                {targetCols.map((col) => (
                                  <SelectItem
                                    key={col.name}
                                    value={col.name}
                                    disabled={mappedTargets.has(col.name) && mapping.targetColumn !== col.name}
                                  >
                                    <span className="flex items-center gap-2">
                                      {col.name}
                                      {col.required && <span className="text-red-400">*</span>}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Confidence Badge */}
                          <div className="w-28 shrink-0">
                            {getConfidenceBadge(mapping.confidence, mapping.matchType)}
                          </div>

                          {/* Expand Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => setExpandedSource(isExpanded ? null : mapping.sourceColumn)}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">Sample Data:</p>
                            <div className="flex flex-wrap gap-2">
                              {mapping.sampleData?.map((val, i) => (
                                <Badge key={i} variant="outline" className="font-mono text-xs">
                                  {val || "(empty)"}
                                </Badge>
                              ))}
                            </div>
                            {mapping.targetColumn && (
                              <p className="text-xs text-muted-foreground mt-3">
                                {targetCols.find((c) => c.name === mapping.targetColumn)?.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Saved Templates</CardTitle>
                  <CardDescription>Reuse mapping configurations for similar files</CardDescription>
                </div>
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Current as Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Mapping Template</DialogTitle>
                      <DialogDescription>Save your current column mappings as a reusable template</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Template Name</Label>
                        <Input
                          placeholder="e.g., Grameenphone CDR Format"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description (optional)</Label>
                        <Input
                          placeholder="Brief description of when to use this template"
                          value={templateDesc}
                          onChange={(e) => setTemplateDesc(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                        Save Template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No saved templates yet</p>
                  <p className="text-sm">Save your current mapping to create a template</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{template.name}</h4>
                        {template.description && (
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.mappings.length} mappings | Used {template.usageCount} times
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleApplyTemplate(template.id)}>
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Data Preview</CardTitle>
                  <CardDescription>See how your data will look after mapping</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={showPreview ? "default" : "outline"}
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? "Mapped View" : "Original View"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {(showPreview
                          ? mappings.filter((m) => m.confidence > 0).map((m) => m.targetColumn)
                          : sourceColumns
                        ).map((col) => (
                          <th key={col} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                          {(showPreview
                            ? mappings
                                .filter((m) => m.confidence > 0)
                                .map((m) => ({ target: m.targetColumn, source: m.sourceColumn }))
                            : sourceColumns.map((c) => ({ target: c, source: c }))
                          ).map(({ target, source }) => (
                            <td key={target} className="p-3 whitespace-nowrap">
                              {row[source] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {validation?.isValid ? (
            <span className="text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Ready to import ({mappingMode === "auto" ? "Auto" : "Manual"} mode)
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Please fix errors before continuing
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={() => onMappingComplete(mappings)}
            disabled={!validation?.isValid}
            className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            <Download className="w-4 h-4" />
            Apply Mapping & Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
