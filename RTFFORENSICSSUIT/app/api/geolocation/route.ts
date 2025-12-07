// ============================================
// Cell Tower Geolocation API Route
// RTF Forensics Suite v2.0
// Uses UnwiredLabs Location API
// ============================================

import { type NextRequest, NextResponse } from "next/server"
import { UnwiredLabsService } from "@/lib/unwiredlabs-service"
import type {
  GeolocationRequest,
  GeolocationResponse,
  BatchGeolocationRequest,
  BatchGeolocationResponse,
  RadioType,
} from "@/lib/types"

// Response helper
function jsonResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

// POST /api/geolocation - Single or batch cell tower geolocation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check for API token
    const apiToken = request.headers.get("x-api-token") || process.env.UNWIREDLABS_API_TOKEN

    if (!apiToken) {
      return errorResponse(
        "UnwiredLabs API token not configured. Please set UNWIREDLABS_API_TOKEN environment variable or provide x-api-token header.",
        401,
      )
    }

    const service = new UnwiredLabsService({
      apiToken,
      region: (process.env.UNWIREDLABS_REGION as "US_EAST" | "US_WEST" | "EUROPE" | "ASIA_PACIFIC") || "ASIA_PACIFIC",
    })

    // Check if this is a batch request
    if (body.cells && Array.isArray(body.cells)) {
      return handleBatchRequest(service, body as BatchGeolocationRequest)
    }

    // Single cell request
    return handleSingleRequest(service, body as GeolocationRequest)
  } catch (error) {
    console.error("[Geolocation API Error]:", error)
    return errorResponse(error instanceof Error ? error.message : "Internal server error", 500)
  }
}

// Handle single cell geolocation
async function handleSingleRequest(service: UnwiredLabsService, request: GeolocationRequest): Promise<NextResponse> {
  // Validate request
  const validation = UnwiredLabsService.validateCellParams(request)
  if (!validation.valid) {
    return errorResponse(`Validation failed: ${validation.errors.join(", ")}`)
  }

  // Auto-detect radio type if not provided
  if (!request.radio) {
    request.radio = UnwiredLabsService.detectRadioType(request.cid)
  }

  const response = await service.geolocate(request)

  return jsonResponse<GeolocationResponse & { timestamp: string }>({
    ...response,
    timestamp: new Date().toISOString(),
  })
}

// Handle batch geolocation
async function handleBatchRequest(
  service: UnwiredLabsService,
  request: BatchGeolocationRequest,
): Promise<NextResponse> {
  // Validate all cells
  const validationErrors: string[] = []
  request.cells.forEach((cell, index) => {
    const validation = UnwiredLabsService.validateCellParams(cell)
    if (!validation.valid) {
      validationErrors.push(`Cell ${index + 1}: ${validation.errors.join(", ")}`)
    }
  })

  if (validationErrors.length > 0) {
    return errorResponse(`Validation failed:\n${validationErrors.join("\n")}`)
  }

  // Limit batch size
  if (request.cells.length > 100) {
    return errorResponse("Batch size exceeds maximum limit of 100 cells")
  }

  const response = await service.batchGeolocate(request)

  return jsonResponse<BatchGeolocationResponse & { timestamp: string }>({
    ...response,
    timestamp: new Date().toISOString(),
  })
}

// GET /api/geolocation - Quick single cell lookup via query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const mcc = searchParams.get("mcc") || ""
    const mnc = searchParams.get("mnc") || ""
    const lac = searchParams.get("lac")
    const cid = searchParams.get("cid")
    const radio = searchParams.get("radio") as RadioType | null

    if (!lac || !cid) {
      return errorResponse("LAC and CID are required query parameters")
    }

    const apiToken = request.headers.get("x-api-token") || process.env.UNWIREDLABS_API_TOKEN

    if (!apiToken) {
      return errorResponse(
        "UnwiredLabs API token not configured. Please set UNWIREDLABS_API_TOKEN environment variable or provide x-api-token header.",
        401,
      )
    }

    const service = new UnwiredLabsService({
      apiToken,
      region: (process.env.UNWIREDLABS_REGION as "US_EAST" | "US_WEST" | "EUROPE" | "ASIA_PACIFIC") || "ASIA_PACIFIC",
    })

    const geoRequest: GeolocationRequest = {
      mcc,
      mnc,
      lac,
      cid,
      radio: radio || UnwiredLabsService.detectRadioType(cid),
      includeAddress: searchParams.get("address") !== "false",
    }

    // Validate
    const validation = UnwiredLabsService.validateCellParams(geoRequest)
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors.join(", ")}`)
    }

    const response = await service.geolocate(geoRequest)

    return jsonResponse<GeolocationResponse & { timestamp: string }>({
      ...response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Geolocation API Error]:", error)
    return errorResponse(error instanceof Error ? error.message : "Internal server error", 500)
  }
}
