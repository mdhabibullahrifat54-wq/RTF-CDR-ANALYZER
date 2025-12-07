import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/constants"

const VERSION_INFO = {
  name: APP_CONFIG.name,
  version: APP_CONFIG.version,
  releaseDate: APP_CONFIG.releaseDate,
  developer: APP_CONFIG.developer,
  framework: "Next.js 15",
  react: "19",
  features: [
    "CDR Analysis",
    "Tower Dump Analysis",
    "Drive Test Analysis",
    "Mutual Communication",
    "GEO Intelligence (UnwiredLabs API)",
    "Report Generation",
  ],
  integrations: ["UnwiredLabs Geolocation API"],
  changelog: "/CHANGELOG.md",
}

export async function GET() {
  return NextResponse.json(VERSION_INFO, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
