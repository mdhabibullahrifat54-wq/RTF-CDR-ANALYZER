"use client"

import { APP_CONFIG } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface VersionBadgeProps {
  showDetails?: boolean
  className?: string
}

export function VersionBadge({ showDetails = false, className }: VersionBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className}>
            <Badge variant="outline" className="gap-1.5 px-2 py-0.5 text-xs font-mono border-primary/30 text-primary">
              v{APP_CONFIG.version}
              {showDetails && <Info className="w-3 h-3" />}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1 text-xs">
            <p className="font-semibold">{APP_CONFIG.name}</p>
            <p>Version: {APP_CONFIG.version}</p>
            <p>Release: {APP_CONFIG.releaseDate}</p>
            <p>Developer: {APP_CONFIG.developer}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
