"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
} from "lucide-react"
import { transformRowsToCSV } from "@/lib/file-parser"
import { env } from "@/lib/env"

interface DataTableProps {
  columns: string[]
  data: Record<string, string>[]
  searchQuery?: string
  pageSize?: number
  enableSorting?: boolean
  enableExport?: boolean
  title?: string
  maxRowsPreview?: number
}

type SortDirection = "asc" | "desc" | null

export default function DataTable({
  columns,
  data,
  searchQuery = "",
  pageSize = 10,
  enableSorting = true,
  enableExport = false,
  title,
  maxRowsPreview = env.maxRowsPreview,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const limitedData = useMemo(() => {
    if (data.length > maxRowsPreview) {
      return data.slice(0, maxRowsPreview)
    }
    return data
  }, [data, maxRowsPreview])

  const isTruncated = data.length > maxRowsPreview

  const handleSort = useCallback((column: string) => {
    setSortColumn((prevColumn) => {
      if (prevColumn === column) {
        setSortDirection((prev) => {
          if (prev === "asc") return "desc"
          if (prev === "desc") return null
          return "asc"
        })
        return prevColumn === "desc" ? null : column
      } else {
        setSortDirection("asc")
        return column
      }
    })
    setCurrentPage(1)
  }, [])

  const filteredAndSortedData = useMemo(() => {
    let result = limitedData

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query)))
    }

    // Sort
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortColumn] || ""
        const bVal = b[sortColumn] || ""

        // Try numeric sort first
        const aNum = Number.parseFloat(aVal)
        const bNum = Number.parseFloat(bVal)

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum
        }

        // Fall back to string sort
        const comparison = aVal.localeCompare(bVal)
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [limitedData, searchQuery, sortColumn, sortDirection])

  // Reset page when data changes
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  const handleExport = useCallback(() => {
    const csv = transformRowsToCSV(columns, data)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title || "data"}_export_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [columns, data, title])

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  const getSortIcon = (column: string) => {
    if (!enableSorting) return null
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="w-3 h-3 ml-1 text-cyan-400" />
    }
    return <ArrowDown className="w-3 h-3 ml-1 text-cyan-400" />
  }

  return (
    <div className="space-y-4">
      {isTruncated && (
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-200">
          Showing first {maxRowsPreview.toLocaleString()} of {data.length.toLocaleString()} rows for performance. Export
          to view all data.
        </div>
      )}

      {enableExport && filteredAndSortedData.length > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export CSV {isTruncated && `(all ${data.length.toLocaleString()} rows)`}
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap border-b border-border ${
                    enableSorting ? "cursor-pointer hover:bg-secondary/80 select-none" : ""
                  }`}
                  onClick={() => enableSorting && handleSort(column)}
                >
                  <div className="flex items-center">
                    {column}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                      {row[column] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min(endIndex, filteredAndSortedData.length)}</span> of{" "}
            <span className="font-medium text-foreground">{filteredAndSortedData.length.toLocaleString()}</span> records
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-muted-foreground">
                  {page}
                </span>
              ),
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
