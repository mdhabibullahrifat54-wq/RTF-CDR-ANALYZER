"use client"

import { APP_CONFIG } from "@/lib/constants"
import { Code2, Heart, Shield } from "lucide-react"

interface AppFooterProps {
  className?: string
  showVersion?: boolean
}

export function AppFooter({ className, showVersion = true }: AppFooterProps) {
  return (
    <footer className={`border-t border-border bg-card/50 py-4 px-6 ${className}`}>
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>{APP_CONFIG.name}</span>
          </div>
          {showVersion && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">v{APP_CONFIG.version}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Developed by</span>
          <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {APP_CONFIG.developer}
          </span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 ml-1" />
        </div>

        <div className="text-xs text-muted-foreground">Professional Telecom Forensics Platform</div>
      </div>
    </footer>
  )
}
