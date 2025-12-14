"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { ChevronDown, Search, MapPin, Building2, X, Check } from "lucide-react"
import { bangladeshThanas, getAllThanas, type ThanaOption } from "@/lib/bangladesh-thanas"
import { cn } from "@/lib/utils"

interface ThanaSelectorProps {
  value: string
  onChange: (value: string, details: { division: string; district: string; thana: string }) => void
  placeholder?: string
  className?: string
}

export default function ThanaSelector({
  value,
  onChange,
  placeholder = "Select Police Station",
  className,
}: ThanaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDivisions, setExpandedDivisions] = useState<string[]>([])
  const [expandedDistricts, setExpandedDistricts] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const allThanas = useMemo(() => getAllThanas(), [])

  // Filter thanas based on search
  const filteredThanas = useMemo(() => {
    if (!searchQuery.trim()) return null
    const query = searchQuery.toLowerCase()
    return allThanas.filter(
      (t) =>
        t.thana.toLowerCase().includes(query) ||
        t.district.toLowerCase().includes(query) ||
        t.division.toLowerCase().includes(query),
    )
  }, [searchQuery, allThanas])

  // Get selected thana details
  const selectedThana = useMemo(() => {
    if (!value) return null
    return allThanas.find((t) => t.value === value)
  }, [value, allThanas])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const toggleDivision = (division: string) => {
    setExpandedDivisions((prev) => (prev.includes(division) ? prev.filter((d) => d !== division) : [...prev, division]))
  }

  const toggleDistrict = (district: string) => {
    setExpandedDistricts((prev) => (prev.includes(district) ? prev.filter((d) => d !== district) : [...prev, district]))
  }

  const handleSelect = (thana: ThanaOption) => {
    onChange(thana.value, {
      division: thana.division,
      district: thana.district,
      thana: thana.thana,
    })
    setIsOpen(false)
    setSearchQuery("")
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("", { division: "", district: "", thana: "" })
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-3 flex items-center justify-between gap-2 rounded-md border transition-colors text-left",
          "bg-secondary/50 border-border hover:border-cyan-500/50",
          isOpen && "border-cyan-500/50 ring-2 ring-cyan-500/20",
          !value && "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="w-4 h-4 shrink-0 text-muted-foreground" />
          {selectedThana ? (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">{selectedThana.thana} PS</span>
              <span className="text-xs text-muted-foreground truncate">
                {selectedThana.district}, {selectedThana.division.replace(" Division", "")}
              </span>
            </div>
          ) : (
            <span className="text-sm">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <button type="button" onClick={clearSelection} className="p-1 hover:bg-muted rounded">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl max-h-[400px] overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search thana, district, or division..."
                className="w-full h-9 pl-9 pr-3 text-sm bg-secondary/50 border border-border rounded-md focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1">
            {filteredThanas ? (
              // Search results
              filteredThanas.length > 0 ? (
                <div className="p-1">
                  {filteredThanas.slice(0, 50).map((thana) => (
                    <button
                      key={thana.value}
                      type="button"
                      onClick={() => handleSelect(thana)}
                      className={cn(
                        "w-full px-3 py-2 text-left rounded-md hover:bg-cyan-500/10 transition-colors flex items-center gap-2",
                        value === thana.value && "bg-cyan-500/20",
                      )}
                    >
                      <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{thana.thana} PS</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {thana.district}, {thana.division}
                        </div>
                      </div>
                      {value === thana.value && <Check className="w-4 h-4 text-cyan-500 shrink-0" />}
                    </button>
                  ))}
                  {filteredThanas.length > 50 && (
                    <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                      Showing first 50 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No police stations found</p>
                </div>
              )
            ) : (
              // Hierarchical view
              <div className="p-1">
                {Object.entries(bangladeshThanas).map(([division, districts]) => (
                  <div key={division} className="mb-1">
                    {/* Division Header */}
                    <button
                      type="button"
                      onClick={() => toggleDivision(division)}
                      className="w-full px-3 py-2 text-left rounded-md hover:bg-muted/50 flex items-center gap-2 font-medium text-sm"
                    >
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform text-cyan-500",
                          !expandedDivisions.includes(division) && "-rotate-90",
                        )}
                      />
                      <Building2 className="w-4 h-4 text-cyan-500" />
                      <span>{division}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {Object.values(districts).flat().length} PS
                      </span>
                    </button>

                    {/* Districts */}
                    {expandedDivisions.includes(division) && (
                      <div className="ml-4 border-l border-border/50">
                        {Object.entries(districts).map(([district, thanaList]) => (
                          <div key={district} className="ml-2">
                            {/* District Header */}
                            <button
                              type="button"
                              onClick={() => toggleDistrict(`${division}-${district}`)}
                              className="w-full px-3 py-1.5 text-left rounded-md hover:bg-muted/50 flex items-center gap-2 text-sm"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 transition-transform text-blue-500",
                                  !expandedDistricts.includes(`${division}-${district}`) && "-rotate-90",
                                )}
                              />
                              <span className="text-muted-foreground">{district}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{thanaList.length}</span>
                            </button>

                            {/* Thanas */}
                            {expandedDistricts.includes(`${division}-${district}`) && (
                              <div className="ml-6 py-1">
                                {thanaList.map((thana) => {
                                  const thanaValue = `${thana} PS, ${district}`
                                  return (
                                    <button
                                      key={thana}
                                      type="button"
                                      onClick={() =>
                                        handleSelect({
                                          value: thanaValue,
                                          label: `${thana} PS`,
                                          division,
                                          district,
                                          thana,
                                        })
                                      }
                                      className={cn(
                                        "w-full px-3 py-1.5 text-left rounded-md hover:bg-cyan-500/10 flex items-center gap-2 text-sm",
                                        value === thanaValue && "bg-cyan-500/20",
                                      )}
                                    >
                                      <MapPin className="w-3 h-3 text-cyan-500/70" />
                                      <span>{thana} PS</span>
                                      {value === thanaValue && <Check className="w-3 h-3 text-cyan-500 ml-auto" />}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
