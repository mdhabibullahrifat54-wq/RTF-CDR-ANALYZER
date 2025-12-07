// ============================================
// Geolocation API Status Route
// RTF Forensics Suite v2.0
// ============================================

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiToken = request.headers.get("x-api-token") || process.env.UNWIREDLABS_API_TOKEN

  const isConfigured = !!apiToken

  return NextResponse.json({
    status: "ok",
    service: "UnwiredLabs Geolocation API",
    configured: isConfigured,
    region: process.env.UNWIREDLABS_REGION || "ASIA_PACIFIC",
    endpoints: {
      single: "/api/geolocation (POST/GET)",
      batch: "/api/geolocation (POST with cells array)",
      status: "/api/geolocation/status (GET)",
    },
    documentation: "https://unwiredlabs.com/api",
    timestamp: new Date().toISOString(),
  })
}
