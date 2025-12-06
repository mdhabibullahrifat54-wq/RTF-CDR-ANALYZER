"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, X, CheckCircle, Loader2, AlertTriangle } from "lucide-react"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
  acceptedFormats: string[]
  maxSizeMB?: number
}

export default function FileUploader({
  onFileUpload,
  isProcessing,
  acceptedFormats,
  maxSizeMB = 50,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!acceptedFormats.some((f) => f.toLowerCase() === extension)) {
        return `Invalid file type. Accepted formats: ${acceptedFormats.join(", ")}`
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File too large. Maximum size: ${maxSizeMB}MB`
      }
      return null
    },
    [acceptedFormats, maxSizeMB],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      setError(null)
      const file = e.dataTransfer.files[0]
      if (file) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          return
        }
        setUploadedFile(file)
        onFileUpload(file)
      }
    },
    [onFileUpload, validateFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const file = e.target.files?.[0]
      if (file) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          return
        }
        setUploadedFile(file)
        onFileUpload(file)
      }
    },
    [onFileUpload, validateFile],
  )

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null)
    setError(null)
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <Card
      className={`bg-card border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? "border-cyan-500 bg-cyan-500/5 scale-[1.01]"
          : error
            ? "border-destructive/50 bg-destructive/5"
            : "border-border hover:border-cyan-500/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="py-16">
        {!uploadedFile ? (
          <div className="text-center space-y-5">
            <div
              className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-colors ${
                error ? "bg-destructive/10" : "bg-gradient-to-br from-cyan-500/20 to-blue-500/10"
              }`}
            >
              {error ? (
                <AlertTriangle className="w-10 h-10 text-destructive" />
              ) : (
                <Upload className="w-10 h-10 text-cyan-400" />
              )}
            </div>
            <div>
              <p className="text-xl font-medium text-foreground">
                {error ? "Upload Error" : "Drag and drop your file here"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{error || `or click to browse • Max ${maxSizeMB}MB`}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {acceptedFormats.map((format) => (
                <span
                  key={format}
                  className="text-xs px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-300 font-medium"
                >
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
            <input
              type="file"
              accept={acceptedFormats.join(",")}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="cursor-pointer bg-transparent h-11 px-6 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                asChild
              >
                <span>Select File</span>
              </Button>
            </label>
          </div>
        ) : (
          <div className="text-center space-y-5">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center">
              {isProcessing ? (
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              ) : (
                <CheckCircle className="w-10 h-10 text-cyan-400" />
              )}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
                <div className="text-left">
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              {!isProcessing && (
                <button onClick={handleRemoveFile} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isProcessing ? "Processing file... Please wait" : "File uploaded successfully"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
