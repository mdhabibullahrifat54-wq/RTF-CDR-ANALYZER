"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle, X, Loader2 } from "lucide-react"
import { parseFile, type ParsedData, formatFileSize } from "@/lib/file-parser"
import { type ColumnMapping, applyMappingsToData } from "@/lib/column-mapping"
import ColumnMapper from "@/components/column-mapper"

interface EnhancedFileUploaderProps {
  onComplete: (data: ParsedData) => void
  moduleType?: "cdr" | "tower"
  acceptedFormats?: string[]
  maxSizeMB?: number
}

type UploadStep = "upload" | "mapping" | "processing" | "complete"

const DEFAULT_ACCEPTED_FORMATS = [".csv", ".xlsx", ".xls", ".txt"]
const DEFAULT_MAX_SIZE_MB = 50

export default function EnhancedFileUploader({
  onComplete,
  moduleType = "cdr",
  acceptedFormats,
  maxSizeMB,
}: EnhancedFileUploaderProps) {
  const formats = acceptedFormats ?? DEFAULT_ACCEPTED_FORMATS
  const maxSize = maxSizeMB ?? DEFAULT_MAX_SIZE_MB

  const [step, setStep] = useState<UploadStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      setError(null)
      setFile(selectedFile)

      // Validate file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        setError(`File size (${formatFileSize(selectedFile.size)}) exceeds ${maxSize}MB limit`)
        return
      }

      // Validate file type
      const extension = "." + selectedFile.name.split(".").pop()?.toLowerCase()
      if (!formats.some((f) => f.toLowerCase() === extension)) {
        setError(`Unsupported file type. Please use: ${formats.join(", ")}`)
        return
      }

      // Parse file
      setStep("processing")
      setProgress(10)

      try {
        // Simulate progress for UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 70))
        }, 100)

        const data = await parseFile(selectedFile)

        clearInterval(progressInterval)
        setProgress(100)

        if (data.rows.length === 0) {
          setError("The file appears to be empty or could not be parsed correctly")
          setStep("upload")
          return
        }

        setParsedData(data)
        setStep("mapping")
      } catch (err) {
        setError(`Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}`)
        setStep("upload")
      }
    },
    [formats, maxSize],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFileSelect(selectedFile)
      }
    },
    [handleFileSelect],
  )

  const handleMappingComplete = useCallback(
    (mappings: ColumnMapping[]) => {
      if (!parsedData) return

      setStep("processing")
      setProgress(0)

      // Apply mappings to transform data
      const transformedRows = applyMappingsToData(parsedData.rows, mappings)
      const mappedHeaders = mappings.filter((m) => m.confidence > 0 && m.targetColumn).map((m) => m.targetColumn)

      // Also include unmapped columns
      const unmappedHeaders = parsedData.headers.filter(
        (h) => !mappings.some((m) => m.sourceColumn === h && m.confidence > 0),
      )

      const finalData: ParsedData = {
        ...parsedData,
        headers: [...mappedHeaders, ...unmappedHeaders],
        rows: transformedRows,
      }

      setProgress(100)
      setStep("complete")

      setTimeout(() => {
        onComplete(finalData)
      }, 500)
    },
    [parsedData, onComplete],
  )

  const handleReset = useCallback(() => {
    setStep("upload")
    setFile(null)
    setParsedData(null)
    setError(null)
    setProgress(0)
  }, [])

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (ext === "csv" || ext === "txt") return FileText
    return FileSpreadsheet
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {["upload", "mapping", "complete"].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s
                  ? "bg-cyan-500 text-white"
                  : ["mapping", "complete"].indexOf(step) > i - 1
                    ? "bg-emerald-500 text-white"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {["mapping", "complete"].indexOf(step) > i - 1 && step !== s ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && (
              <div
                className={`w-16 h-0.5 mx-1 ${
                  ["mapping", "complete"].indexOf(step) > i ? "bg-emerald-500" : "bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-8 text-sm">
        <span className={step === "upload" ? "text-cyan-400" : "text-muted-foreground"}>Upload File</span>
        <span className={step === "mapping" ? "text-cyan-400" : "text-muted-foreground"}>Map Columns</span>
        <span className={step === "complete" ? "text-cyan-400" : "text-muted-foreground"}>Complete</span>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {/* Step: Upload */}
      {step === "upload" && (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? "border-cyan-500 bg-cyan-500/10" : "border-border hover:border-cyan-500/50 bg-card"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Upload className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Drop your file here or click to browse</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Supports {formats.join(", ")} | Max size: {maxSize}MB
              </p>
              <input
                type="file"
                accept={formats.join(",")}
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  asChild
                  className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                >
                  <span>
                    <Upload className="w-4 h-4" />
                    Select File
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Processing */}
      {step === "processing" && (
        <Card className="bg-card border-cyan-500/20">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-spin" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Processing your file...</h3>
              <p className="text-sm text-muted-foreground mb-4">{file?.name}</p>
              <div className="max-w-xs mx-auto">
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {progress < 50 ? "Reading file..." : progress < 80 ? "Analyzing columns..." : "Almost done..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Mapping */}
      {step === "mapping" && parsedData && (
        <div className="space-y-4">
          {/* File Info Bar */}
          <Card className="bg-card border-border">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {file &&
                    (() => {
                      const Icon = getFileIcon(file.name)
                      return <Icon className="w-8 h-8 text-cyan-400" />
                    })()}
                  <div>
                    <p className="font-medium">{file?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {parsedData.rows.length.toLocaleString()} rows | {parsedData.headers.length} columns
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Column Mapper */}
          <ColumnMapper
            sourceColumns={parsedData.headers}
            sampleData={parsedData.rows}
            moduleType={moduleType}
            onMappingComplete={handleMappingComplete}
            onCancel={handleReset}
          />
        </div>
      )}

      {/* Step: Complete */}
      {step === "complete" && (
        <Card className="bg-card border-emerald-500/30">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">File processed successfully!</h3>
              <p className="text-sm text-muted-foreground">
                {parsedData?.rows.length.toLocaleString()} records ready for analysis
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
