// ============================================
// Environment Configuration
// RTF Forensics Suite v2.0
// ============================================

export const env = {
  // Application
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "RTF Forensics Suite",
  appDeveloper: "Rifat Ahmed",

  // Feature flags
  enableDebugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "false",

  // API configuration
  apiBaseUrl: process.env.API_BASE_URL || "",
  apiTimeout: Number(process.env.API_TIMEOUT) || 30000,

  // UnwiredLabs configuration
  unwiredLabs: {
    apiToken: process.env.UNWIREDLABS_API_TOKEN || "",
    region: (process.env.UNWIREDLABS_REGION as "US_EAST" | "US_WEST" | "EUROPE" | "ASIA_PACIFIC") || "ASIA_PACIFIC",
    timeout: Number(process.env.UNWIREDLABS_TIMEOUT) || 30000,
    retries: Number(process.env.UNWIREDLABS_RETRIES) || 3,
    enableFallbacks: process.env.UNWIREDLABS_ENABLE_FALLBACKS !== "false",
  },

  // Validation
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",

  // File upload and data preview limits
  maxUploadSizeMB: Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB) || 50,
  maxRowsPreview: Number(process.env.NEXT_PUBLIC_MAX_ROWS_PREVIEW) || 1000,

  // Session configuration
  sessionDurationHours: Number(process.env.SESSION_DURATION_HOURS) || 24,
} as const

// Type for the env object
export type EnvConfig = typeof env

// Type-safe environment variable getter
export function getEnvVar(key: string, defaultValue = ""): string {
  if (typeof window !== "undefined") {
    // Client-side: only NEXT_PUBLIC_ vars are available
    return (process.env as Record<string, string | undefined>)[`NEXT_PUBLIC_${key}`] || defaultValue
  }
  // Server-side: all vars are available
  return (process.env as Record<string, string | undefined>)[key] || defaultValue
}

// Check if required environment variables are set
export function checkRequiredEnvVars(required: string[]): { missing: string[]; valid: boolean } {
  const missing = required.filter((key) => !process.env[key])
  return {
    missing,
    valid: missing.length === 0,
  }
}

// Check UnwiredLabs configuration status
export function checkUnwiredLabsConfig(): {
  configured: boolean
  region: string
  hasToken: boolean
  timeout: number
  retries: number
} {
  return {
    configured: !!env.unwiredLabs.apiToken,
    region: env.unwiredLabs.region,
    hasToken: !!env.unwiredLabs.apiToken,
    timeout: env.unwiredLabs.timeout,
    retries: env.unwiredLabs.retries,
  }
}

// Get build information
export function getBuildInfo(): {
  version: string
  buildTime: string
  environment: string
  debugMode: boolean
  analyticsEnabled: boolean
} {
  return {
    version: env.appVersion,
    buildTime: new Date().toISOString(),
    environment: env.isProduction ? "production" : env.isDevelopment ? "development" : "test",
    debugMode: env.enableDebugMode,
    analyticsEnabled: env.enableAnalytics,
  }
}

// Debug logging helper - can be imported and used across the app
export function debugLog(component: string, message: string, data?: unknown) {
  if (env.enableDebugMode) {
    console.log(`[${component}] ${message}`, data !== undefined ? data : "")
  }
}

// Required environment variables documentation
export const REQUIRED_ENV_VARS = {
  optional: [
    "UNWIREDLABS_API_TOKEN", // Required for GEO Intelligence geolocation
    "UNWIREDLABS_REGION", // API region (US_EAST, US_WEST, EUROPE, ASIA_PACIFIC)
    "UNWIREDLABS_TIMEOUT", // Request timeout in milliseconds
    "UNWIREDLABS_RETRIES", // Number of retry attempts
    "UNWIREDLABS_ENABLE_FALLBACKS", // Enable LAC/single cell fallbacks
    "NEXT_PUBLIC_DEBUG_MODE", // Enable debug logging
    "NEXT_PUBLIC_ENABLE_ANALYTICS", // Enable analytics
    "NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB", // Max file upload size in MB
    "NEXT_PUBLIC_MAX_ROWS_PREVIEW", // Max rows to display in preview tables
    "API_BASE_URL", // Base URL for backend API
    "API_TIMEOUT", // API request timeout in milliseconds
  ],
  forGeolocation: ["UNWIREDLABS_API_TOKEN"],
} as const
