"use client"

import { cn } from "@/lib/utils"
import { APP_CONFIG } from "@/lib/constants"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

export default function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 36, text: "text-sm", gap: "gap-2" },
    md: { icon: 48, text: "text-base", gap: "gap-3" },
    lg: { icon: 64, text: "text-xl", gap: "gap-4" },
    xl: { icon: 80, text: "text-2xl", gap: "gap-4" },
  }

  const { icon, text, gap } = sizes[size]

  return (
    <div className={cn("flex items-center", gap, className)}>
      <Image
        src="https://i.postimg.cc/ncnsHjTt/grok-image-xq0k2wl.jpg"
        alt="RTF Forensics Suite Logo"
        width={icon}
        height={icon}
        className="shrink-0 rounded-md object-contain"
        unoptimized
      />
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold tracking-tight leading-tight", text)}>
            <span className="text-primary">RTF</span> <span className="text-foreground">Forensics</span>
          </span>
          <span className="text-xs text-cyan-400 tracking-wider uppercase font-medium">
            {APP_CONFIG.description.split(" ").slice(0, 3).join(" ")}
          </span>
        </div>
      )}
    </div>
  )
}
