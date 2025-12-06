"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, AlertCircle, Monitor, Shield, Search, Activity, Code2, Heart } from "lucide-react"
import Logo from "@/components/logo"
import ThanaSelector from "@/components/thana-selector"
import { getTotalThanaCount } from "@/lib/bangladesh-thanas"
import { ThemeToggle } from "@/components/theme-toggle"
import { APP_CONFIG } from "@/lib/constants"

export default function LoginPage() {
  const [selectedThana, setSelectedThana] = useState("")
  const [thanaDetails, setThanaDetails] = useState({ division: "", district: "", thana: "" })
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleThanaChange = (value: string, details: { division: string; district: string; thana: string }) => {
    setSelectedThana(value)
    setThanaDetails(details)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedThana) {
      setError("Please select a Police Station (Thana)")
      return
    }

    if (!password) {
      setError("Please enter your password")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    const success = login(selectedThana, password, thanaDetails)
    if (!success) {
      setError("Invalid credentials. Please try again.")
    }
    setIsLoading(false)
  }

  const totalThanas = getTotalThanaCount()

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Branding panel */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden flex-col justify-between p-12">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-background to-blue-950/30 dark:from-cyan-950/50 dark:via-background dark:to-blue-950/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Logo size="xl" />
          <p className="mt-8 text-lg text-muted-foreground max-w-lg leading-relaxed">
            Professional telecom forensics analysis platform for law enforcement and investigation agencies.
          </p>

          {/* Feature highlights */}
          <div className="mt-10 flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Shield className="w-4 h-4" />
              <span>Secure Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Search className="w-4 h-4" />
              <span>Deep Insights</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Activity className="w-4 h-4" />
              <span>Real-time Processing</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-cyan-950/30 dark:bg-cyan-950/30 bg-cyan-100/50 border border-cyan-500/20 backdrop-blur-sm">
              <h3 className="font-semibold text-sm text-primary">CDR Analysis</h3>
              <p className="text-xs text-muted-foreground mt-1">Call detail record processing</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/30 dark:bg-blue-950/30 bg-blue-100/50 border border-blue-500/20 backdrop-blur-sm">
              <h3 className="font-semibold text-sm text-accent">Tower Dump</h3>
              <p className="text-xs text-muted-foreground mt-1">Cell tower data analysis</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/30 dark:bg-blue-950/30 bg-blue-100/50 border border-blue-500/20 backdrop-blur-sm">
              <h3 className="font-semibold text-sm text-accent">GEO Intelligence</h3>
              <p className="text-xs text-muted-foreground mt-1">Location-based mapping</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-950/30 dark:bg-cyan-950/30 bg-cyan-100/50 border border-cyan-500/20 backdrop-blur-sm">
              <h3 className="font-semibold text-sm text-primary">Link Analysis</h3>
              <p className="text-xs text-muted-foreground mt-1">Communication patterns</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Monitor className="w-4 h-4" />
              <span>Optimized for desktop use</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="text-xs text-primary">{totalThanas}+ Police Stations Connected</div>
          </div>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Developed by</p>
              <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {APP_CONFIG.developer}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Version {APP_CONFIG.version} | {APP_CONFIG.name}
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 border-l border-border bg-card/50">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Logo size="lg" className="justify-center" />
          </div>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Select your Police Station and enter credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="thana" className="text-sm font-medium">
                    Police Station (Thana)
                  </Label>
                  <ThanaSelector
                    value={selectedThana}
                    onChange={handleThanaChange}
                    placeholder="Select your Police Station"
                  />
                  {thanaDetails.division && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {thanaDetails.district} District, {thanaDetails.division}
                    </p>
                  )}
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
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 bg-secondary/50 border-border focus:border-primary/50 focus:ring-primary/20"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:hidden space-y-3">
            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm">
                Developed by{" "}
                <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {APP_CONFIG.developer}
                </span>
              </span>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Version {APP_CONFIG.version} | {APP_CONFIG.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
