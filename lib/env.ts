// Environment configuration helper
// This file centralizes environment variable access

export const env = {
  // Application
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "RTF Forensics Suite",
  appDeveloper: "Rifat Ahmed",

  // Feature flags
  enableDebugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "false",

  // API configuration (for future use)
  apiBaseUrl: process.env.API_BASE_URL || "",
  apiTimeout: Number(process.env.API_TIMEOUT) || 30000,

  // Validation
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",

  maxUploadSizeMB: Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB) || 50,
  maxRowsPreview: Number(process.env.NEXT_PUBLIC_MAX_ROWS_PREVIEW) || 1000,

  sessionDurationHours: Number(process.env.SESSION_DURATION_HOURS) || 24,
} as const

// Type-safe environment variable getter
export function getEnvVar(key: string, defaultValue = ""): string {
  if (typeof window !== "undefined") {
    // Client-side: only NEXT_PUBLIC_ vars are available
    return (process.env as Record<string, string | undefined>)[`NEXT_PUBLIC_${key}`] || defaultValue
  }
  // Server-side: all vars are available
  return (process.env as Record<string, string | undefined>)[key] || defaultValue
}

export function checkRequiredEnvVars(required: string[]): { missing: string[]; valid: boolean } {
  const missing = required.filter((key) => !process.env[key])
  return {
    missing,
    valid: missing.length === 0,
  }
}

export function getBuildInfo(): { version: string; buildTime: string; environment: string } {
  return {
    version: env.appVersion,
    buildTime: new Date().toISOString(),
    environment: env.isProduction ? "production" : env.isDevelopment ? "development" : "test",
  }
}
