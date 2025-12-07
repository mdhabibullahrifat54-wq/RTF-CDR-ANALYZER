// ============================================
// UnwiredLabs Geolocation API Service
// RTF Forensics Suite v2.0
// ============================================

import type {
  UnwiredLabsRequest,
  UnwiredLabsResponse,
  UnwiredLabsCellObject,
  GeolocationRequest,
  GeolocationResponse,
  BatchGeolocationRequest,
  BatchGeolocationResponse,
  RadioType,
  AddressDetails,
} from "./types"
import { env } from "./env"

// API Endpoints by Region
export const UNWIREDLABS_ENDPOINTS = {
  US_EAST: "https://us1.unwiredlabs.com/v2/process.php",
  US_WEST: "https://us2.unwiredlabs.com/v2/process.php",
  EUROPE: "https://eu1.unwiredlabs.com/v2/process.php",
  ASIA_PACIFIC: "https://ap1.unwiredlabs.com/v2/process.php",
} as const

export type UnwiredLabsRegion = keyof typeof UNWIREDLABS_ENDPOINTS

const DEFAULT_CONFIG = {
  region: env.unwiredLabs.region as UnwiredLabsRegion,
  timeout: env.unwiredLabs.timeout,
  retries: env.unwiredLabs.retries,
  retryDelay: 1000,
  includeAddress: true,
  enableFallbacks: env.unwiredLabs.enableFallbacks,
}

function debugLog(message: string, data?: unknown) {
  if (env.enableDebugMode) {
    console.log(`[UnwiredLabs] ${message}`, data !== undefined ? data : "")
  }
}

export interface UnwiredLabsConfig {
  apiToken: string
  region?: UnwiredLabsRegion
  timeout?: number
  retries?: number
  retryDelay?: number
  includeAddress?: boolean
  enableFallbacks?: boolean
}

export class UnwiredLabsService {
  private config: Required<UnwiredLabsConfig>
  private endpoint: string

  constructor(config: UnwiredLabsConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.endpoint = UNWIREDLABS_ENDPOINTS[this.config.region]
    debugLog("Service initialized", { region: this.config.region, endpoint: this.endpoint })
  }

  /**
   * Get geolocation for a single cell tower
   */
  async geolocate(request: GeolocationRequest): Promise<GeolocationResponse> {
    debugLog("Geolocating cell", { lac: request.lac, cid: request.cid })

    try {
      const cellObject: UnwiredLabsCellObject = {
        lac: Number.parseInt(request.lac, 10),
        cid: Number.parseInt(request.cid, 10),
      }

      if (request.mcc) cellObject.mcc = Number.parseInt(request.mcc, 10)
      if (request.mnc) cellObject.mnc = Number.parseInt(request.mnc, 10)
      if (request.signal) cellObject.signal = request.signal

      const apiRequest: UnwiredLabsRequest = {
        token: this.config.apiToken,
        cells: [cellObject],
        address: (request.includeAddress ?? this.config.includeAddress) ? 1 : 0,
      }

      if (request.radio) {
        apiRequest.radio = request.radio
      }

      if (request.mcc) {
        apiRequest.mcc = Number.parseInt(request.mcc, 10)
      }

      if (request.mnc) {
        apiRequest.mnc = Number.parseInt(request.mnc, 10)
      }

      if (this.config.enableFallbacks) {
        apiRequest.fallbacks = {
          lacf: true,
          scf: true,
        }
      }

      const response = await this.makeRequest(apiRequest)

      if (response.status === "ok" && response.lat !== undefined && response.lon !== undefined) {
        debugLog("Geolocation success", { lat: response.lat, lon: response.lon, accuracy: response.accuracy })
        return {
          success: true,
          data: {
            lat: response.lat,
            lng: response.lon,
            accuracy: response.accuracy || 0,
            address: response.address,
            addressDetails: this.parseAddressDetails(response.address_details),
            fallback: response.fallback,
            aged: response.aged,
          },
          balance: response.balance,
        }
      }

      debugLog("Geolocation failed", { status: response.status, message: response.message })
      return {
        success: false,
        error: response.message || "Location not found",
        balance: response.balance,
      }
    } catch (error) {
      debugLog("Geolocation error", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  /**
   * Batch geolocate multiple cell towers
   */
  async batchGeolocate(request: BatchGeolocationRequest): Promise<BatchGeolocationResponse> {
    debugLog("Starting batch geolocation", { cellCount: request.cells.length })

    const results: BatchGeolocationResponse["results"] = []
    let successCount = 0
    let failureCount = 0
    let lastBalance: number | undefined

    // Process in batches to avoid rate limiting
    const batchSize = 10
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    for (let i = 0; i < request.cells.length; i += batchSize) {
      const batch = request.cells.slice(i, i + batchSize)
      debugLog(`Processing batch ${Math.floor(i / batchSize) + 1}`, { size: batch.length })

      const batchPromises = batch.map(async (cell) => {
        const response = await this.geolocate({
          ...cell,
          radio: cell.radio || request.radio,
          includeAddress: request.includeAddress,
        })

        if (response.success) {
          successCount++
        } else {
          failureCount++
        }

        if (response.balance !== undefined) {
          lastBalance = response.balance
        }

        return {
          request: cell,
          response,
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < request.cells.length) {
        await delay(500)
      }
    }

    debugLog("Batch geolocation complete", { total: request.cells.length, success: successCount, failed: failureCount })

    return {
      success: successCount > 0,
      results,
      totalProcessed: request.cells.length,
      successCount,
      failureCount,
      balance: lastBalance,
    }
  }

  /**
   * Geolocate with multiple cells (triangulation)
   */
  async geolocateWithNeighbors(
    servingCell: GeolocationRequest,
    neighborCells: GeolocationRequest[],
    options?: { radio?: RadioType; includeAddress?: boolean },
  ): Promise<GeolocationResponse> {
    debugLog("Geolocating with neighbors", { servingCell, neighborCount: neighborCells.length })

    try {
      const cells: UnwiredLabsCellObject[] = [
        {
          lac: Number.parseInt(servingCell.lac, 10),
          cid: Number.parseInt(servingCell.cid, 10),
          mcc: servingCell.mcc ? Number.parseInt(servingCell.mcc, 10) : undefined,
          mnc: servingCell.mnc ? Number.parseInt(servingCell.mnc, 10) : undefined,
          signal: servingCell.signal,
        },
        ...neighborCells.slice(0, 6).map((cell) => ({
          lac: Number.parseInt(cell.lac, 10),
          cid: Number.parseInt(cell.cid, 10),
          mcc: cell.mcc ? Number.parseInt(cell.mcc, 10) : undefined,
          mnc: cell.mnc ? Number.parseInt(cell.mnc, 10) : undefined,
          signal: cell.signal,
        })),
      ]

      const apiRequest: UnwiredLabsRequest = {
        token: this.config.apiToken,
        cells,
        address: (options?.includeAddress ?? this.config.includeAddress) ? 1 : 0,
        radio: options?.radio || servingCell.radio,
        mcc: servingCell.mcc ? Number.parseInt(servingCell.mcc, 10) : undefined,
        mnc: servingCell.mnc ? Number.parseInt(servingCell.mnc, 10) : undefined,
      }

      if (this.config.enableFallbacks) {
        apiRequest.fallbacks = {
          lacf: true,
          scf: true,
        }
      }

      const response = await this.makeRequest(apiRequest)

      if (response.status === "ok" && response.lat !== undefined && response.lon !== undefined) {
        debugLog("Triangulation success", { lat: response.lat, lon: response.lon })
        return {
          success: true,
          data: {
            lat: response.lat,
            lng: response.lon,
            accuracy: response.accuracy || 0,
            address: response.address,
            addressDetails: this.parseAddressDetails(response.address_details),
            fallback: response.fallback,
            aged: response.aged,
          },
          balance: response.balance,
        }
      }

      return {
        success: false,
        error: response.message || "Location not found",
        balance: response.balance,
      }
    } catch (error) {
      debugLog("Triangulation error", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  /**
   * Make HTTP request to UnwiredLabs API with retry logic
   */
  private async makeRequest(body: UnwiredLabsRequest): Promise<UnwiredLabsResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        debugLog(`API request attempt ${attempt + 1}/${this.config.retries}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        const response = await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }

        const data: UnwiredLabsResponse = await response.json()
        debugLog("API response received", { status: data.status })
        return data
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error")
        debugLog(`Request failed (attempt ${attempt + 1})`, lastError.message)

        if (attempt < this.config.retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay * (attempt + 1)))
        }
      }
    }

    return {
      status: "error",
      message: lastError?.message || "Request failed after retries",
    }
  }

  /**
   * Parse address details from API response
   */
  private parseAddressDetails(details?: UnwiredLabsResponse["address_details"]): AddressDetails | undefined {
    if (!details) return undefined

    return {
      houseNumber: details.house_number,
      road: details.road,
      area: details.area,
      locality: details.locality,
      district: details.district,
      county: details.county,
      city: details.city,
      state: details.state,
      country: details.country,
      countryCode: details.country_code,
      postalCode: details.postal_code,
    }
  }

  /**
   * Validate cell tower parameters
   */
  static validateCellParams(params: GeolocationRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // LAC validation (mandatory)
    if (!params.lac) {
      errors.push("LAC (Location Area Code) is required")
    } else {
      const lacNum = Number.parseInt(params.lac, 10)
      if (isNaN(lacNum) || lacNum < 1 || lacNum > 65533) {
        errors.push("LAC must be between 1 and 65533")
      }
    }

    // CID validation (mandatory)
    if (!params.cid) {
      errors.push("CID (Cell ID) is required")
    } else {
      const cidNum = Number.parseInt(params.cid, 10)
      if (isNaN(cidNum) || cidNum < 0) {
        errors.push("CID must be a positive integer")
      }
      // Different ranges for different radio types
      if (params.radio === "gsm" && cidNum > 65535) {
        errors.push("GSM CID must be between 0 and 65535")
      } else if ((params.radio === "umts" || params.radio === "lte") && cidNum > 268435455) {
        errors.push("UMTS/LTE CID must be between 0 and 268435455")
      }
    }

    // MCC validation (optional but if provided, must be valid)
    if (params.mcc) {
      const mccNum = Number.parseInt(params.mcc, 10)
      if (isNaN(mccNum) || mccNum < 0 || mccNum > 999) {
        errors.push("MCC must be between 0 and 999")
      }
    }

    // MNC validation (optional but if provided, must be valid)
    if (params.mnc) {
      const mncNum = Number.parseInt(params.mnc, 10)
      if (isNaN(mncNum) || mncNum < 0 || mncNum > 999) {
        errors.push("MNC must be between 0 and 999")
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Get operator name from MCC/MNC for Bangladesh
   */
  static getBangladeshOperator(mnc: string): string | null {
    const operators: Record<string, string> = {
      "01": "Grameenphone",
      "02": "Robi",
      "03": "Banglalink",
      "04": "Teletalk",
      "07": "Airtel",
    }
    return operators[mnc] || null
  }

  /**
   * Detect radio type from CID range
   */
  static detectRadioType(cid: string): RadioType {
    const cidNum = Number.parseInt(cid, 10)
    if (isNaN(cidNum)) return "gsm"

    if (cidNum <= 65535) return "gsm"
    if (cidNum <= 268435455) return "lte" // Could also be UMTS
    return "lte"
  }
}

// Export singleton factory - Use centralized env config
let serviceInstance: UnwiredLabsService | null = null

export function getUnwiredLabsService(apiToken?: string): UnwiredLabsService | null {
  const token = apiToken || env.unwiredLabs.apiToken

  if (!token) {
    debugLog("No API token available")
    return null
  }

  if (!serviceInstance || apiToken) {
    serviceInstance = new UnwiredLabsService({
      apiToken: token,
      region: env.unwiredLabs.region as UnwiredLabsRegion,
      timeout: env.unwiredLabs.timeout,
      retries: env.unwiredLabs.retries,
      enableFallbacks: env.unwiredLabs.enableFallbacks,
    })
  }

  return serviceInstance
}
