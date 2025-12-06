import { NextResponse } from "next/server"

const VERSION_INFO = {
  name: "RTF Forensics Suite",
  version: "2.0.0",
  releaseDate: "2025-06-04",
  developer: "Rifat Ahmed",
  framework: "Next.js 16.0.7",
  react: "19.2.0",
  features: [
    "CDR Analysis",
    "Tower Dump Analysis",
    "Drive Test Analysis",
    "Mutual Communication",
    "GEO Intelligence",
    "Report Generation",
  ],
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
