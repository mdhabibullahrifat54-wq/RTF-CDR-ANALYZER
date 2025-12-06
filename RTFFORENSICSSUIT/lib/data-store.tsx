"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { ParsedData } from "@/lib/file-parser"

interface AnalysisSession {
  id: string
  module: string
  fileName: string
  uploadedAt: Date
  data: ParsedData
}

interface DataStoreContextType {
  sessions: AnalysisSession[]
  activeSession: AnalysisSession | null
  addSession: (module: string, fileName: string, data: ParsedData) => string
  setActiveSession: (id: string | null) => void
  getSessionsByModule: (module: string) => AnalysisSession[]
  removeSession: (id: string) => void
  clearAllSessions: () => void
  updateSession: (id: string, data: Partial<Omit<AnalysisSession, "id">>) => void
  stats: {
    totalSessions: number
    totalRecordsProcessed: number
    modulesUsed: string[]
  }
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

const STORAGE_KEY = "rtf_analysis_sessions"

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<AnalysisSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Restore dates as Date objects
          const restored = parsed.map((s: AnalysisSession) => ({
            ...s,
            uploadedAt: new Date(s.uploadedAt),
          }))
          setSessions(restored)
        }
      } catch (error) {
        console.error("Failed to restore sessions:", error)
        localStorage.removeItem(STORAGE_KEY)
      }
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        // Only store essential data to avoid localStorage limits
        const toStore = sessions.map((s) => ({
          id: s.id,
          module: s.module,
          fileName: s.fileName,
          uploadedAt: s.uploadedAt.toISOString(),
          data: {
            headers: s.data.headers,
            rows: s.data.rows.slice(0, 100), // Limit stored rows
            analytics: s.data.analytics,
            metadata: s.data.metadata,
          },
        }))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
      } catch (error) {
        console.error("Failed to persist sessions:", error)
      }
    }
  }, [sessions, isInitialized])

  const addSession = useCallback((module: string, fileName: string, data: ParsedData) => {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newSession: AnalysisSession = {
      id,
      module,
      fileName,
      uploadedAt: new Date(),
      data,
    }
    setSessions((prev) => [...prev, newSession])
    setActiveSessionId(id)
    return id
  }, [])

  const setActiveSession = useCallback((id: string | null) => {
    setActiveSessionId(id)
  }, [])

  const getSessionsByModule = useCallback(
    (module: string) => {
      return sessions.filter((s) => s.module === module)
    },
    [sessions],
  )

  const removeSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id))
      if (activeSessionId === id) {
        setActiveSessionId(null)
      }
    },
    [activeSessionId],
  )

  const clearAllSessions = useCallback(() => {
    setSessions([])
    setActiveSessionId(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const updateSession = useCallback((id: string, data: Partial<Omit<AnalysisSession, "id">>) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return { ...s, ...data }
        }
        return s
      }),
    )
  }, [])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null

  const stats = {
    totalSessions: sessions.length,
    totalRecordsProcessed: sessions.reduce((sum, s) => sum + s.data.rows.length, 0),
    modulesUsed: [...new Set(sessions.map((s) => s.module))],
  }

  return (
    <DataStoreContext.Provider
      value={{
        sessions,
        activeSession,
        addSession,
        setActiveSession,
        getSessionsByModule,
        removeSession,
        clearAllSessions,
        updateSession,
        stats,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  )
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
