"use client"

import { APP_CONFIG } from "@/lib/constants"
import Logo from "@/components/logo"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <Logo size="xl" className="justify-center" />

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>

          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        <p className="text-xs text-muted-foreground">
          v{APP_CONFIG.version} | {APP_CONFIG.developer}
        </p>
      </div>
    </div>
  )
}
