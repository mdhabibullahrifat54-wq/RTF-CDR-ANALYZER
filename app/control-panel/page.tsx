"use client"

import { useState, useEffect } from "react"
import ControlPanelLogin from "@/components/control-panel/control-panel-login"
import ControlPanelDashboard from "@/components/control-panel/control-panel-dashboard"
import { LoadingScreen } from "@/components/loading-screen"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ControlPanelPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<{ username: string; role: string; accessLevel: number } | null>(null)

  useEffect(() => {
    const adminSession = localStorage.getItem("rtf_control_panel_session")
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        const loginTime = new Date(session.loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

        if (hoursDiff < 8) {
          setIsAuthenticated(true)
          setAdminUser({
            username: session.username,
            role: session.role,
            accessLevel: session.accessLevel,
          })
        } else {
          localStorage.removeItem("rtf_control_panel_session")
        }
      } catch {
        localStorage.removeItem("rtf_control_panel_session")
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (username: string, password: string): boolean => {
    if (username === "rifat_admin" && password === "admin123") {
      const session = {
        username,
        role: "System Administrator",
        loginTime: new Date().toISOString(),
        accessLevel: 3,
      }
      localStorage.setItem("rtf_control_panel_session", JSON.stringify(session))
      setIsAuthenticated(true)
      setAdminUser({
        username: session.username,
        role: session.role,
        accessLevel: session.accessLevel,
      })

      const logs = JSON.parse(localStorage.getItem("rtf_admin_audit_logs") || "[]")
      logs.push({
        id: Date.now(),
        action: "Admin Login",
        user: username,
        timestamp: new Date().toISOString(),
        status: "success",
        ip: "192.168.1.1",
      })
      localStorage.setItem("rtf_admin_audit_logs", JSON.stringify(logs.slice(-500)))

      return true
    }
    return false
  }

  const handleLogout = () => {
    if (adminUser) {
      const logs = JSON.parse(localStorage.getItem("rtf_admin_audit_logs") || "[]")
      logs.push({
        id: Date.now(),
        action: "Admin Logout",
        user: adminUser.username,
        timestamp: new Date().toISOString(),
        status: "success",
        ip: "192.168.1.1",
      })
      localStorage.setItem("rtf_admin_audit_logs", JSON.stringify(logs.slice(-500)))
    }

    localStorage.removeItem("rtf_control_panel_session")
    setIsAuthenticated(false)
    setAdminUser(null)
  }

  if (isLoading) {
    return <LoadingScreen message="Loading Control Panel..." />
  }

  return (
    <ErrorBoundary>
      {!isAuthenticated ? (
        <ControlPanelLogin onLogin={handleLogin} />
      ) : (
        <ControlPanelDashboard adminUser={adminUser!} onLogout={handleLogout} />
      )}
    </ErrorBoundary>
  )
}
