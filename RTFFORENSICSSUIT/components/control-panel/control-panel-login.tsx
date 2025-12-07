"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, Shield, AlertCircle, Server, Key, Users, Activity, Database } from "lucide-react"
import { APP_CONFIG } from "@/lib/constants"

interface ControlPanelLoginProps {
  onLogin: (username: string, password: string) => boolean
}

export default function ControlPanelLogin({ onLogin }: ControlPanelLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockUntil, setLockUntil] = useState<Date | null>(null)
  const [remainingMinutes, setRemainingMinutes] = useState(0)

  // Check lock status on mount
  useEffect(() => {
    const lockData = localStorage.getItem("rtf_admin_lockout")
    if (lockData) {
      const { lockedUntil, failedAttempts } = JSON.parse(lockData)
      const lockTime = new Date(lockedUntil)
      if (new Date() < lockTime) {
        setIsLocked(true)
        setLockUntil(lockTime)
        setAttempts(failedAttempts)
      } else {
        localStorage.removeItem("rtf_admin_lockout")
      }
    }
  }, [])

  // Update remaining time for lock
  useEffect(() => {
    if (isLocked && lockUntil) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockUntil.getTime() - new Date().getTime()) / 60000)
        if (remaining <= 0) {
          setIsLocked(false)
          setLockUntil(null)
          setAttempts(0)
          localStorage.removeItem("rtf_admin_lockout")
        } else {
          setRemainingMinutes(remaining)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isLocked, lockUntil])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLocked) {
      setError(`Account locked. Try again in ${remainingMinutes} minutes.`)
      return
    }

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = onLogin(username, password)

    if (!success) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      // Log failed attempt
      const logs = JSON.parse(localStorage.getItem("rtf_admin_audit_logs") || "[]")
      logs.push({
        id: Date.now(),
        action: "Failed Super Admin Login Attempt",
        user: username,
        timestamp: new Date().toISOString(),
        status: "failed",
        ip: "192.168.1.1",
      })
      localStorage.setItem("rtf_admin_audit_logs", JSON.stringify(logs.slice(-500)))

      if (newAttempts >= 5) {
        const lockoutTime = new Date(Date.now() + 30 * 60 * 1000)
        setIsLocked(true)
        setLockUntil(lockoutTime)
        setRemainingMinutes(30)
        localStorage.setItem(
          "rtf_admin_lockout",
          JSON.stringify({
            lockedUntil: lockoutTime.toISOString(),
            failedAttempts: newAttempts,
          }),
        )
        setError("Too many failed attempts. Account locked for 30 minutes.")

        // Log account lockout
        logs.push({
          id: Date.now(),
          action: "Super Admin Account Locked",
          user: username,
          timestamp: new Date().toISOString(),
          status: "warning",
          ip: "System",
        })
        localStorage.setItem("rtf_admin_audit_logs", JSON.stringify(logs.slice(-500)))
      } else {
        setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden flex-col justify-between p-12">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-background to-red-950/20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/3 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Super Administrator</h1>
              <p className="text-sm text-red-400">RTF Control Panel Access</p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">System Administration Center</h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Full system control for RTF Forensics Suite v8.0. Manage users, security policies, password rotation, and
              system configuration while maintaining active police station sessions.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
              <Key className="w-4 h-4" />
              <span>Password Control</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
              <Activity className="w-4 h-4" />
              <span>Audit Logging</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-card/50 border border-red-500/20 backdrop-blur-sm">
            <Server className="w-6 h-6 text-red-400 mb-3" />
            <h3 className="font-semibold text-sm text-foreground">User Account Control</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Create, edit, lock/unlock user accounts with role-based access
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card/50 border border-red-500/20 backdrop-blur-sm">
            <Key className="w-6 h-6 text-red-400 mb-3" />
            <h3 className="font-semibold text-sm text-foreground">30-Day Password Rotation</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Automated monthly password expiry with compliance tracking
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card/50 border border-red-500/20 backdrop-blur-sm">
            <Shield className="w-6 h-6 text-red-400 mb-3" />
            <h3 className="font-semibold text-sm text-foreground">Security Audit Trail</h3>
            <p className="text-xs text-muted-foreground mt-1">Complete logging of all system access and changes</p>
          </div>
          <div className="p-5 rounded-xl bg-card/50 border border-red-500/20 backdrop-blur-sm">
            <Database className="w-6 h-6 text-red-400 mb-3" />
            <h3 className="font-semibold text-sm text-foreground">Permanent Case Storage</h3>
            <p className="text-xs text-muted-foreground mt-1">All forensic cases automatically saved with unique IDs</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Control Panel v{APP_CONFIG.version} | Developed by{" "}
            <span className="text-red-400">{APP_CONFIG.developer}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>System Online 24/7</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 border-l border-border bg-card/30">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-foreground">Super Administrator</h1>
                <p className="text-xs text-red-400">RTF Control Panel</p>
              </div>
            </div>
          </div>

          <Card className="border-red-500/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-red-500/5">
            <CardHeader className="space-y-1 pb-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/30 flex items-center justify-center">
                <Shield className="w-10 h-10 text-red-400" />
              </div>
              <CardTitle className="text-2xl">Super Administrator Access</CardTitle>
              <CardDescription>Enter your administrator credentials to access full system control</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {isLocked && (
                  <div className="flex items-center gap-2 p-3 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Account locked for {remainingMinutes} more minutes</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="rifat_admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 bg-secondary/50 border-border focus:border-red-500/50 focus:ring-red-500/20"
                      disabled={isLocked}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 bg-secondary/50 border-border focus:border-red-500/50 focus:ring-red-500/20"
                      disabled={isLocked}
                      autoComplete="current-password"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Password is masked for security</p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium shadow-lg shadow-red-500/20"
                  disabled={isLoading || isLocked}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      LOGIN
                    </span>
                  )}
                </Button>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>5 failed attempts = 30-minute lockout</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground lg:hidden">
            Control Panel v{APP_CONFIG.version} | Developed by{" "}
            <span className="text-red-400">{APP_CONFIG.developer}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
