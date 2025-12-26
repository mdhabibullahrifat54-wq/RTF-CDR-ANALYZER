import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsightsProvider } from "@/components/speed-insights"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "RTF Forensics Suite | Professional Telecom Analysis Platform",
  description:
    "Professional Telecom Forensics Analysis Platform v2.0 for law enforcement and investigation agencies. CDR Analysis, Tower Dump, GEO Intelligence, and more. Developer: Rifat Ahmed",
  keywords: ["forensics", "telecom", "CDR analysis", "tower dump", "law enforcement", "investigation"],
  authors: [{ name: "Rifat Ahmed" }],
  creator: "Rifat Ahmed",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0891b2",
  width: 1280,
  initialScale: 0.5,
  minimumScale: 0.25,
  maximumScale: 2,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-w-[1280px]`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <SpeedInsightsProvider />
      </body>
    </html>
  )
}
