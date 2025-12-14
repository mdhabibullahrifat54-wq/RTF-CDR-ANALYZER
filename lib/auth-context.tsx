"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface ThanaDetails {
  division: string
  district: string
  thana: string
}

interface User {
  username: string
  role: string
  loginTime: Date
  thanaDetails?: ThanaDetails
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string, thanaDetails?: ThanaDetails) => boolean
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  refreshSession: () => void
  sessionExpiry: Date | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MASTER_PASSWORD = "admin123"
const USER_STORAGE_KEY = "rtf_user"
const LOGIN_LOGS_KEY = "rtf_login_logs"
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)

  const checkSessionExpiry = useCallback(() => {
    if (user && sessionExpiry && new Date() > sessionExpiry) {
      setUser(null)
      setSessionExpiry(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
      return false
    }
    return true
  }, [user, sessionExpiry])

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      try {
        const userData = JSON.parse(stored)
        // Restore login time as Date object
        userData.loginTime = new Date(userData.loginTime)

        const expiry = new Date(userData.loginTime.getTime() + SESSION_DURATION_MS)
        if (new Date() > expiry) {
          localStorage.removeItem(USER_STORAGE_KEY)
        } else {
          setUser(userData)
          setSessionExpiry(expiry)
        }
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      checkSessionExpiry()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [user, checkSessionExpiry])

  const login = useCallback((username: string, password: string, thanaDetails?: ThanaDetails) => {
    // Development: Accept any thana selection with master password
    if (password === MASTER_PASSWORD && username) {
      const loginTime = new Date()
      const userData: User = {
        username: username,
        role: "Police Station Officer",
        loginTime,
        thanaDetails: thanaDetails,
      }
      setUser(userData)
      setSessionExpiry(new Date(loginTime.getTime() + SESSION_DURATION_MS))

      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

        const loginLog = {
          timestamp: new Date().toISOString(),
          thana: username,
          division: thanaDetails?.division || "",
          district: thanaDetails?.district || "",
          success: true,
        }
        try {
          const existingLogs = JSON.parse(localStorage.getItem(LOGIN_LOGS_KEY) || "[]")
          existingLogs.push(loginLog)
          localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify(existingLogs.slice(-100))) // Keep last 100 logs
        } catch {
          localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify([loginLog]))
        }
      }

      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setSessionExpiry(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem("rtf_sessions")
    }
  }, [])

  const refreshSession = useCallback(() => {
    if (user) {
      const newLoginTime = new Date()
      const updatedUser = { ...user, loginTime: newLoginTime }
      setUser(updatedUser)
      setSessionExpiry(new Date(newLoginTime.getTime() + SESSION_DURATION_MS))
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
      }
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        refreshSession,
        sessionExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
