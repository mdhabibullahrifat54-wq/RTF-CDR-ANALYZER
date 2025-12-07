// ============================================
// Application Constants
// RTF Forensics Suite v8.0
// Bangladesh Law Enforcement Edition
// ============================================

export const APP_CONFIG = {
  name: "RTF Forensics Suite",
  version: "8.0.0",
  developer: "Rifat Ahmed",
  releaseDate: "2025-12-08",
  description: "Professional Telecom Forensics Analysis Platform - Bangladesh Law Enforcement Edition",
  copyright: "2025 Rifat Ahmed. All rights reserved.",
  supportEmail: "support@rtfforensics.com",
  documentationUrl: "/docs",
  edition: "Bangladesh Law Enforcement Edition",
} as const

// Module Configuration
export const MODULES = {
  home: { id: "home", label: "Dashboard", description: "Overview & statistics", icon: "LayoutDashboard" },
  cdr: { id: "cdr", label: "CDR Analyzer", description: "Call detail records analysis", icon: "Phone" },
  tower: { id: "tower", label: "Tower Dump", description: "Cell tower data analysis", icon: "Radio" },
  drive: { id: "drive", label: "Drive Test", description: "Route and coverage analysis", icon: "Route" },
  mutual: { id: "mutual", label: "Mutual Comm", description: "Link and cluster analysis", icon: "Users" },
  geo: { id: "geo", label: "GEO Intelligence", description: "Cell tower geolocation (UnwiredLabs)", icon: "Map" },
  reports: { id: "reports", label: "Reports", description: "Generate PDF reports", icon: "FileText" },
} as const

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  acceptedFormats: [".csv", ".xlsx", ".xls", ".txt"],
  maxRowsPreview: 1000,
  chunkSize: 10000,
  mimeTypes: [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ],
} as const

// Column Types for Mapping
export const COLUMN_TYPES = {
  PHONE_A: "Phone A",
  PHONE_B: "Phone B",
  DATETIME: "Date/Time",
  DURATION: "Duration",
  CALL_TYPE: "Call Type",
  IMEI_A: "IMEI A",
  IMEI_B: "IMEI B",
  IMSI_A: "IMSI A",
  IMSI_B: "IMSI B",
  LAC: "LAC",
  CELL_ID: "Cell ID",
  LATITUDE: "Latitude",
  LONGITUDE: "Longitude",
  AZIMUTH: "Azimuth",
  ADDRESS: "Address",
  OPERATOR: "Operator",
  NETWORK_TYPE: "Network Type",
  SMS_CONTENT: "SMS Content",
  DATA_VOLUME: "Data Volume",
  ROAMING: "Roaming",
  RECORD_ID: "Record ID",
  MCC: "MCC",
  MNC: "MNC",
  SIGNAL_STRENGTH: "Signal Strength",
  FIRST_CELL: "First Cell",
  LAST_CELL: "Last Cell",
  START_TIME: "Start Time",
  END_TIME: "End Time",
} as const

// Analysis Thresholds
export const ANALYSIS_THRESHOLDS = {
  coPresenceWindowMinutes: 30,
  minCallsForCluster: 3,
  highActivityThreshold: 50,
  suspiciousPatternThreshold: 10,
  maxBPartyDisplay: 100,
  minDurationForAnalysis: 1,
  towerProximityMeters: 500,
  timeWindowSeconds: 1800,
} as const

// Report Templates
export const REPORT_TEMPLATES = {
  summary: { id: "summary", label: "Summary Report", description: "Overview of analysis" },
  detailed: { id: "detailed", label: "Detailed Report", description: "Full analysis with charts" },
  timeline: { id: "timeline", label: "Timeline Report", description: "Chronological events" },
  network: { id: "network", label: "Network Report", description: "Communication patterns" },
  tower: { id: "tower", label: "Tower Analysis", description: "Cell tower analysis report" },
  mutual: { id: "mutual", label: "Mutual Analysis", description: "Cross-reference analysis" },
} as const

// Theme Configuration
export const THEME_CONFIG = {
  defaultTheme: "dark",
  storageKey: "rtf-theme",
  themes: ["light", "dark", "system"] as const,
} as const

// Date Formats
export const DATE_FORMATS = [
  "YYYY-MM-DD HH:mm:ss",
  "DD/MM/YYYY HH:mm:ss",
  "MM/DD/YYYY HH:mm:ss",
  "DD-MM-YYYY HH:mm:ss",
  "YYYY/MM/DD HH:mm:ss",
  "DD.MM.YYYY HH:mm:ss",
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
] as const

// Export Formats
export const EXPORT_FORMATS = {
  pdf: { id: "pdf", label: "PDF Document", extension: ".pdf", mimeType: "application/pdf" },
  csv: { id: "csv", label: "CSV Spreadsheet", extension: ".csv", mimeType: "text/csv" },
  xlsx: {
    id: "xlsx",
    label: "Excel Workbook",
    extension: ".xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  json: { id: "json", label: "JSON Data", extension: ".json", mimeType: "application/json" },
  html: { id: "html", label: "HTML Report", extension: ".html", mimeType: "text/html" },
} as const

// Bangladesh Operator Colors
export const OPERATOR_COLORS: Record<string, string> = {
  GP: "#22d3ee",
  Grameenphone: "#22d3ee",
  Robi: "#f43f5e",
  Banglalink: "#3b82f6",
  BL: "#3b82f6",
  Teletalk: "#f59e0b",
  Airtel: "#ef4444",
  default: "#6b7280",
} as const

// Validation Patterns
export const VALIDATION_PATTERNS = {
  bangladeshPhone: /^(?:\+?880|0)?1[3-9]\d{8}$/,
  imei: /^\d{14,15}$/,
  imsi: /^\d{15}$/,
  lac: /^\d{1,5}$/,
  cellId: /^\d{1,10}$/,
  mcc: /^\d{3}$/,
  mnc: /^\d{2,3}$/,
} as const

// API Endpoints
export const API_ENDPOINTS = {
  health: "/api/health",
  version: "/api/version",
  info: "/api/info",
  geolocation: "/api/geolocation",
  geolocationStatus: "/api/geolocation/status",
} as const

// UnwiredLabs Configuration
export const UNWIREDLABS_CONFIG = {
  endpoints: {
    US_EAST: "https://us1.unwiredlabs.com/v2/process.php",
    US_WEST: "https://us2.unwiredlabs.com/v2/process.php",
    EUROPE: "https://eu1.unwiredlabs.com/v2/process.php",
    ASIA_PACIFIC: "https://ap1.unwiredlabs.com/v2/process.php",
  },
  defaultRegion: "ASIA_PACIFIC" as const,
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  maxBatchSize: 100,
  radioTypes: ["gsm", "cdma", "umts", "lte", "nr"] as const,
} as const

// Bangladesh MCC/MNC
export const BANGLADESH_NETWORK = {
  mcc: "470",
  operators: {
    "01": { name: "Grameenphone", shortName: "GP", color: "#22d3ee" },
    "02": { name: "Robi", shortName: "Robi", color: "#f43f5e" },
    "03": { name: "Banglalink", shortName: "BL", color: "#3b82f6" },
    "04": { name: "Teletalk", shortName: "Teletalk", color: "#f59e0b" },
    "07": { name: "Airtel", shortName: "Airtel", color: "#ef4444" },
  },
} as const

// Helper function to get operator info
export function getBangladeshOperator(mnc: string): {
  name: string
  shortName: string
  color: string
} | null {
  const operator = BANGLADESH_NETWORK.operators[mnc as keyof typeof BANGLADESH_NETWORK.operators]
  return operator || null
}
