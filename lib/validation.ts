// Validation utilities for telecom data

import { VALIDATION_PATTERNS } from "./constants"

// Phone number validation
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "")
  // Bangladesh numbers: 880XXXXXXXXXX (13 digits) or 0XXXXXXXXXX (11 digits)
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function isValidBangladeshPhone(phone: string): boolean {
  return VALIDATION_PATTERNS.bangladeshPhone.test(phone)
}

// IMEI validation (14-15 digits)
export function isValidIMEI(imei: string): boolean {
  const cleaned = imei.replace(/\D/g, "")
  return VALIDATION_PATTERNS.imei.test(cleaned)
}

export function isValidIMEIWithLuhn(imei: string): boolean {
  const cleaned = imei.replace(/\D/g, "")
  if (cleaned.length !== 15) return false

  // Luhn algorithm check
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let digit = Number.parseInt(cleaned[i], 10)
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === Number.parseInt(cleaned[14], 10)
}

// IMSI validation (15 digits)
export function isValidIMSI(imsi: string): boolean {
  const cleaned = imsi.replace(/\D/g, "")
  return VALIDATION_PATTERNS.imsi.test(cleaned)
}

// LAC validation (1-5 digits)
export function isValidLAC(lac: string): boolean {
  const cleaned = lac.replace(/\D/g, "")
  return VALIDATION_PATTERNS.lac.test(cleaned)
}

// Cell ID validation (1-10 digits)
export function isValidCellID(ci: string): boolean {
  const cleaned = ci.replace(/\D/g, "")
  return VALIDATION_PATTERNS.cellId.test(cleaned)
}

export function isValidMCC(mcc: string): boolean {
  return VALIDATION_PATTERNS.mcc.test(mcc)
}

export function isValidMNC(mnc: string): boolean {
  return VALIDATION_PATTERNS.mnc.test(mnc)
}

// Coordinate validation
export function isValidLatitude(lat: number): boolean {
  return !isNaN(lat) && lat >= -90 && lat <= 90
}

export function isValidLongitude(lng: number): boolean {
  return !isNaN(lng) && lng >= -180 && lng <= 180
}

export function isValidCoordinates(lat: number, lng: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lng) && !(lat === 0 && lng === 0)
}

// Duration validation (in seconds)
export function isValidDuration(duration: number): boolean {
  return !isNaN(duration) && duration >= 0 && duration < 86400 * 365 // Less than a year in seconds
}

// Date range validation
export function isValidDateRange(start: Date, end: Date): boolean {
  return start <= end && !isNaN(start.getTime()) && !isNaN(end.getTime())
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize string input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

// Validate file extension
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = "." + filename.split(".").pop()?.toLowerCase()
  return allowedExtensions.some((allowed) => allowed.toLowerCase() === ext)
}

// Validate file size (in bytes)
export function isValidFileSize(size: number, maxSizeBytes: number): boolean {
  return size > 0 && size <= maxSizeBytes
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateDataRow(row: Record<string, string>, requiredFields: string[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  requiredFields.forEach((field) => {
    if (!row[field] || row[field].trim() === "") {
      errors.push(`Missing required field: ${field}`)
    }
  })

  // Validate phone numbers if present
  Object.entries(row).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase()
    if (
      (lowerKey.includes("phone") || lowerKey.includes("msisdn") || lowerKey.includes("party")) &&
      value &&
      !isValidPhoneNumber(value)
    ) {
      warnings.push(`Invalid phone format in ${key}: ${value}`)
    }

    if (lowerKey.includes("imei") && value && !isValidIMEI(value)) {
      warnings.push(`Invalid IMEI format in ${key}: ${value}`)
    }

    if (lowerKey.includes("imsi") && value && !isValidIMSI(value)) {
      warnings.push(`Invalid IMSI format in ${key}: ${value}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateDataset(
  rows: Record<string, string>[],
  requiredFields: string[] = [],
): { validRows: number; invalidRows: number; totalWarnings: number } {
  let validRows = 0
  let invalidRows = 0
  let totalWarnings = 0

  rows.forEach((row) => {
    const result = validateDataRow(row, requiredFields)
    if (result.isValid) {
      validRows++
    } else {
      invalidRows++
    }
    totalWarnings += result.warnings.length
  })

  return { validRows, invalidRows, totalWarnings }
}
