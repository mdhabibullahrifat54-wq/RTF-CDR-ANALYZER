import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/constants"

export async function GET() {
  const appInfo = {
    name: APP_CONFIG.name,
    version: APP_CONFIG.version,
    developer: APP_CONFIG.developer,
    description: APP_CONFIG.description,
    releaseDate: APP_CONFIG.releaseDate,
    status: "operational",
    environment: process.env.NODE_ENV,
    features: {
      cdrAnalysis: true,
      towerDump: true,
      driveTest: true,
      mutualCommunication: true,
      geoIntelligence: true,
      reporting: true,
      darkMode: true,
      lightMode: true,
    },
    endpoints: {
      health: "/api/health",
      version: "/api/version",
      info: "/api/info",
    },
  }

  return NextResponse.json(appInfo, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
