import type React from "react"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "RTF Control Panel | Website Administration",
  description:
    "Administrative Control Panel for RTF Forensics Suite - User Management, Security, and System Configuration",
  keywords: ["admin", "control panel", "user management", "security"],
  authors: [{ name: "Rifat Ahmed" }],
  robots: "noindex, nofollow",
}

export const viewport: Viewport = {
  themeColor: "#d97706",
  width: 1280,
  initialScale: 0.5,
  minimumScale: 0.25,
  maximumScale: 2,
  userScalable: true,
}

export default function ControlPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-w-[1280px]">{children}</div>
}
