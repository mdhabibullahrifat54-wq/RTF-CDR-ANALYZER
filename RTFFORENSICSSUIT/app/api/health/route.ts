import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/constants"

export async function GET() {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 0,
    service: APP_CONFIG.name,
    version: APP_CONFIG.version,
    checks: {
      api: "operational",
      memory: getMemoryStatus(),
      geolocation: process.env.UNWIREDLABS_API_TOKEN ? "configured" : "not_configured",
    },
  }

  return NextResponse.json(healthCheck, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}

function getMemoryStatus(): string {
  if (typeof process !== "undefined" && process.memoryUsage) {
    const used = process.memoryUsage()
    const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024)
    const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024)
    const percentage = Math.round((heapUsedMB / heapTotalMB) * 100)
    return percentage < 90 ? "healthy" : "warning"
  }
  return "unknown"
}
