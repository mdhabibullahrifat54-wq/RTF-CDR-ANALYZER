// ============================================
// RTF Forensics Suite - Type Definitions
// Version: 2.0.0
// ============================================

// Module Types
export type ModuleType = "home" | "cdr" | "tower" | "drive" | "mutual" | "geo" | "reports"

// ============================================
// Cell Tower & Geolocation Types
// ============================================

export type RadioType = "gsm" | "cdma" | "umts" | "lte" | "nr"

export interface CellTowerData {
  id: string
  mcc: string
  mnc: string
  lac: string
  cid: string
  radio?: RadioType
  lat?: number
  lng?: number
  accuracy?: number
  provider?: string
  hits?: number
  timestamp?: string
  signal?: number
  psc?: number
  tA?: number
  address?: string
  addressDetails?: AddressDetails
  isLocated?: boolean
  fallback?: string
}

export interface AddressDetails {
  houseNumber?: string
  road?: string
  area?: string
  locality?: string
  district?: string
  county?: string
  city?: string
  state?: string
  country?: string
  countryCode?: string
  postalCode?: string
}

// ============================================
// UnwiredLabs API Types
// ============================================

export interface UnwiredLabsCellObject {
  lac: number
  cid: number
  mcc?: number
  mnc?: number
  radio?: RadioType
  signal?: number
  psc?: number
  tA?: number
  asu?: number
}

export interface UnwiredLabsWifiObject {
  bssid: string
  channel?: number
  frequency?: number
  signal?: number
  signalToNoiseRatio?: number
}

export interface UnwiredLabsFallbacks {
  all?: boolean
  ipf?: boolean
  lacf?: boolean
  scf?: boolean
}

export interface UnwiredLabsRequest {
  token: string
  radio?: RadioType
  mcc?: number
  mnc?: number
  cells: UnwiredLabsCellObject[]
  wifi?: UnwiredLabsWifiObject[]
  address?: 0 | 1 | 2
  fallbacks?: UnwiredLabsFallbacks
  ip?: string
  bt?: 0 | 1 | 2
  id?: string
}

export interface UnwiredLabsResponse {
  status: "ok" | "error"
  message?: string
  balance?: number
  balance_slots?: number
  lat?: number
  lon?: number
  accuracy?: number
  address?: string
  address_details?: {
    house_number?: string
    road?: string
    area?: string
    locality?: string
    district?: string
    county?: string
    city?: string
    state?: string
    country?: string
    country_code?: string
    postal_code?: string
  }
  aged?: boolean
  fallback?: "ipf" | "lacf" | "scf"
}

// ============================================
// Geolocation API Request/Response Types
// ============================================

export interface GeolocationRequest {
  mcc: string
  mnc: string
  lac: string
  cid: string
  radio?: RadioType
  signal?: number
  includeAddress?: boolean
}

export interface GeolocationResponse {
  success: boolean
  data?: {
    lat: number
    lng: number
    accuracy: number
    address?: string
    addressDetails?: AddressDetails
    fallback?: string
    aged?: boolean
  }
  error?: string
  balance?: number
}

export interface BatchGeolocationRequest {
  cells: GeolocationRequest[]
  radio?: RadioType
  includeAddress?: boolean
}

export interface BatchGeolocationResponse {
  success: boolean
  results: Array<{
    request: GeolocationRequest
    response: GeolocationResponse
  }>
  totalProcessed: number
  successCount: number
  failureCount: number
  balance?: number
}

// ============================================
// CDR Analysis Types
// ============================================

export interface CDRRecord {
  id: string
  aParty: string
  bParty: string
  dateTime: string
  duration: number
  callType: "incoming" | "outgoing" | "sms" | "data" | "unknown"
  imei?: string
  imsi?: string
  lac?: string
  cellId?: string
  latitude?: number
  longitude?: number
  operator?: string
  networkType?: string
  address?: string
}

export interface CDRAnalytics {
  totalRecords: number
  uniqueBParty: number
  uniqueIMEI: number
  uniqueIMSI: number
  totalDuration: number
  averageDuration: number
  incomingCalls: number
  outgoingCalls: number
  smsCount: number
  dataCount: number
  timeRange: {
    start: string
    end: string
  }
  topBParty: Array<{ number: string; count: number; totalDuration: number }>
  hourlyDistribution: Array<{ hour: number; count: number }>
  dailyDistribution: Array<{ date: string; count: number }>
  operatorBreakdown: Record<string, number>
  towerUsage: Array<{ lac: string; cid: string; count: number; lat?: number; lng?: number }>
}

// ============================================
// Tower Dump Analysis Types
// ============================================

export interface TowerDumpRecord {
  id: string
  msisdn: string
  imei?: string
  imsi?: string
  dateTime: string
  lac: string
  cellId: string
  duration?: number
  callType?: string
  latitude?: number
  longitude?: number
}

export interface TowerDumpAnalytics {
  totalRecords: number
  uniqueMSISDN: number
  uniqueIMEI: number
  uniqueIMSI: number
  timeRange: {
    start: string
    end: string
  }
  topMSISDN: Array<{ number: string; count: number; firstSeen: string; lastSeen: string }>
  frequentUsers: Array<{ msisdn: string; hitCount: number; percentage: number }>
}

// ============================================
// Mutual Communication Types
// ============================================

export interface MutualContact {
  number: string
  sources: string[]
  totalInteractions: number
  firstInteraction: string
  lastInteraction: string
}

export interface CoPresenceEvent {
  timestamp: string
  lac: string
  cellId: string
  numbers: string[]
  duration: number
}

export interface MutualAnalytics {
  commonContacts: MutualContact[]
  coPresenceEvents: CoPresenceEvent[]
  linkStrength: Record<string, number>
  clusterGroups: Array<{ members: string[]; interactions: number }>
}

// ============================================
// Report Types
// ============================================

export interface ReportConfig {
  id: string
  type: "summary" | "detailed" | "timeline" | "network" | "tower" | "mutual"
  title: string
  description?: string
  includeCharts: boolean
  includeMaps: boolean
  includeRawData: boolean
  dateRange?: {
    start: string
    end: string
  }
  targetNumbers?: string[]
  filters?: Record<string, unknown>
}

export interface GeneratedReport {
  id: string
  config: ReportConfig
  generatedAt: string
  data: unknown
  format: "pdf" | "csv" | "xlsx" | "html" | "json"
  fileSize?: number
  downloadUrl?: string
}

// ============================================
// Session & State Types
// ============================================

export interface AnalysisSession {
  id: string
  module: ModuleType
  fileName: string
  uploadedAt: Date
  data: ParsedData
  status: "pending" | "processing" | "completed" | "error"
  progress?: number
  error?: string
}

export interface ParsedData {
  headers: string[]
  rows: Record<string, string>[]
  analytics?: Record<string, unknown>
  rawText?: string
  metadata?: {
    fileName?: string
    fileSize?: number
    parseDate?: string
    rowCount?: number
    columnCount?: number
  }
}

// ============================================
// Map & Visualization Types
// ============================================

export interface MapMarker {
  id: string
  lat: number
  lng: number
  type: "tower" | "device" | "poi" | "cluster"
  label?: string
  color?: string
  size?: number
  data?: Record<string, unknown>
}

export interface MapPath {
  id: string
  points: Array<{ lat: number; lng: number; timestamp?: string }>
  color?: string
  weight?: number
  opacity?: number
  dashed?: boolean
}

export interface MapHeatmapPoint {
  lat: number
  lng: number
  intensity: number
}

export interface MapViewport {
  center: { lat: number; lng: number }
  zoom: number
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

// ============================================
// Bangladesh Operator Types
// ============================================

export type BangladeshOperator = "GP" | "Robi" | "Banglalink" | "Teletalk" | "Airtel"

export const BANGLADESH_MCC = "470"

export const BANGLADESH_OPERATORS: Record<string, { name: BangladeshOperator; mnc: string[]; color: string }> = {
  GP: { name: "GP", mnc: ["01"], color: "#22d3ee" },
  Robi: { name: "Robi", mnc: ["02"], color: "#f43f5e" },
  Banglalink: { name: "Banglalink", mnc: ["03"], color: "#3b82f6" },
  Teletalk: { name: "Teletalk", mnc: ["04"], color: "#f59e0b" },
  Airtel: { name: "Airtel", mnc: ["07"], color: "#ef4444" },
}

export function getOperatorByMNC(mnc: string): BangladeshOperator | null {
  for (const [key, value] of Object.entries(BANGLADESH_OPERATORS)) {
    if (value.mnc.includes(mnc)) {
      return key as BangladeshOperator
    }
  }
  return null
}

// ============================================
// Utility Types
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface FileUploadResult {
  success: boolean
  fileName: string
  fileSize: number
  rowCount: number
  headers: string[]
  preview: Record<string, string>[]
  error?: string
}
