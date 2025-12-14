"use client"

import { APP_CONFIG } from "@/lib/constants"
import { Code2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeveloperCreditProps {
  variant?: "default" | "compact" | "full"
  className?: string
}

export function DeveloperCredit({ variant = "default", className }: DeveloperCreditProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Code2 className="w-3 h-3" />
        <span>by</span>
        <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {APP_CONFIG.developer}
        </span>
      </div>
    )
  }

  if (variant === "full") {
    return (
      <div
        className={cn(
          "p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 border border-primary/20",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Developed by</p>
            <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {APP_CONFIG.developer}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{APP_CONFIG.description}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Version {APP_CONFIG.version}</span>
          <span>Released {APP_CONFIG.releaseDate}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-primary/10",
        className,
      )}
    >
      <Code2 className="w-4 h-4 text-primary" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground">Developer</p>
        <p className="text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent truncate">
          {APP_CONFIG.developer}
        </p>
      </div>
    </div>
  )
}
