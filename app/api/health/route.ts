import { NextResponse } from "next/server"

export async function GET() {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 0,
    service: "RTF Forensics Suite",
    version: "2.0.0",
    checks: {
      api: "operational",
      memory: getMemoryStatus(),
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
