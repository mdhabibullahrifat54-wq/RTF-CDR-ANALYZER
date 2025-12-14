import * as XLSX from "xlsx"

export interface ParsedData {
  headers: string[]
  rows: Record<string, string>[]
  analytics?: {
    uniqueBParty?: number
    totalDuration?: string
    totalDurationSeconds?: number
    towerHits?: number
    uniqueMSISDN?: number
    uniqueIMEI?: number
    uniqueIMSI?: number
    timeSpan?: string
    towerCount?: number
    firstActivity?: string
    lastActivity?: string
    incomingCalls?: number
    outgoingCalls?: number
    smsCount?: number
    dataUsage?: string
    topBParty?: Array<{ number: string; count: number }>
    providers?: Record<string, number>
    timelineData?: Array<{ date: string; calls: number; sms: number; data: number }>
    hourlyDistribution?: Array<{ hour: number; count: number }>
    towerLocations?: Array<{ lac: string; ci: string; lat?: number; lng?: number; count: number }>
    callDirections?: { incoming: number; outgoing: number; unknown: number }
    weekdayDistribution?: Array<{ day: string; count: number }>
    topTowers?: Array<{ lac: string; ci: string; count: number; percentage: number }>
    averageCallDuration?: number
    longestCall?: { duration: number; bParty: string; date: string }
    peakHour?: { hour: number; count: number }
    uniqueLocations?: number
  }
  rawText?: string
  metadata?: {
    fileName?: string
    fileSize?: number
    parseDate?: string
    rowCount?: number
    columnCount?: number
  }
}

export async function parseFile(file: File): Promise<ParsedData> {
  const extension = file.name.split(".").pop()?.toLowerCase()

  let result: ParsedData

  if (extension === "xlsx" || extension === "xls") {
    result = await parseExcelFile(file)
  } else {
    result = await parseTextFile(file)
  }

  result.metadata = {
    fileName: file.name,
    fileSize: file.size,
    parseDate: new Date().toISOString(),
    rowCount: result.rows.length,
    columnCount: result.headers.length,
  }

  return result
}

async function parseExcelFile(file: File): Promise<ParsedData> {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: "array" })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { defval: "" })

  if (jsonData.length === 0) {
    return { headers: [], rows: [] }
  }

  const headers = Object.keys(jsonData[0])
  const rows = jsonData
    .map((row) => {
      const cleanRow: Record<string, string> = {}
      headers.forEach((header) => {
        cleanRow[header] = String(row[header] ?? "").trim()
      })
      return cleanRow
    })
    .filter((row) => Object.values(row).some((v) => v !== ""))

  const analytics = generateAnalytics(headers, rows)
  return { headers, rows, analytics }
}

async function parseTextFile(file: File): Promise<ParsedData> {
  const text = await file.text()
  const lines = text.trim().split("\n")

  if (lines.length === 0) {
    return { headers: [], rows: [], rawText: text }
  }

  const firstLine = lines[0]
  let delimiter = ","
  if (firstLine.includes("\t")) delimiter = "\t"
  else if (firstLine.includes(";")) delimiter = ";"
  else if (firstLine.includes("|")) delimiter = "|"

  const headers = firstLine.split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ""))

  const rows = lines
    .slice(1)
    .map((line) => {
      const values = line.split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ""))
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      return row
    })
    .filter((row) => Object.values(row).some((v) => v !== ""))

  const analytics = generateAnalytics(headers, rows)
  return { headers, rows, analytics, rawText: text }
}

function generateAnalytics(headers: string[], rows: Record<string, string>[]) {
  const analytics: NonNullable<ParsedData["analytics"]> = {}
  const lowerHeaders = headers.map((h) => h.toLowerCase())

  // Find MSISDN/Phone columns
  const msisdnColumn = headers.find(
    (h, i) =>
      lowerHeaders[i].includes("msisdn") ||
      lowerHeaders[i].includes("phone") ||
      lowerHeaders[i].includes("number") ||
      lowerHeaders[i].includes("b_party") ||
      lowerHeaders[i].includes("b-party") ||
      lowerHeaders[i].includes("bparty") ||
      lowerHeaders[i].includes("called") ||
      lowerHeaders[i].includes("calling"),
  )

  const aPartyColumn = headers.find(
    (h, i) =>
      lowerHeaders[i].includes("a_party") ||
      lowerHeaders[i].includes("a-party") ||
      lowerHeaders[i].includes("aparty") ||
      lowerHeaders[i].includes("caller") ||
      lowerHeaders[i].includes("calling"),
  )

  if (msisdnColumn) {
    const uniqueNumbers = new Set(rows.map((r) => r[msisdnColumn]).filter(Boolean))
    analytics.uniqueBParty = uniqueNumbers.size
    analytics.uniqueMSISDN = uniqueNumbers.size

    // Calculate top B-party numbers
    const bPartyCount: Record<string, number> = {}
    rows.forEach((r) => {
      const num = r[msisdnColumn]
      if (num) {
        bPartyCount[num] = (bPartyCount[num] || 0) + 1
      }
    })
    analytics.topBParty = Object.entries(bPartyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100)
      .map(([number, count]) => ({ number, count }))
  }

  // Find IMEI column
  const imeiColumn = headers.find((h, i) => lowerHeaders[i].includes("imei"))
  if (imeiColumn) {
    const uniqueIMEI = new Set(rows.map((r) => r[imeiColumn]).filter(Boolean))
    analytics.uniqueIMEI = uniqueIMEI.size
  }

  const imsiColumn = headers.find((h, i) => lowerHeaders[i].includes("imsi"))
  if (imsiColumn) {
    const uniqueIMSI = new Set(rows.map((r) => r[imsiColumn]).filter(Boolean))
    analytics.uniqueIMSI = uniqueIMSI.size
  }

  // Find LAC/CI columns for tower analysis
  const lacColumn = headers.find((h, i) => lowerHeaders[i].includes("lac"))
  const ciColumn = headers.find((h, i) => lowerHeaders[i].includes("ci") || lowerHeaders[i].includes("cell"))

  if (lacColumn || ciColumn) {
    const towerSet = new Set(rows.map((r) => `${r[lacColumn || ""] || ""}-${r[ciColumn || ""] || ""}`))
    analytics.towerHits = rows.length
    analytics.towerCount = towerSet.size
    analytics.uniqueLocations = towerSet.size

    const towerCounts: Record<string, { lac: string; ci: string; count: number }> = {}
    rows.forEach((r) => {
      const lac = r[lacColumn || ""] || ""
      const ci = r[ciColumn || ""] || ""
      const key = `${lac}-${ci}`
      if (!towerCounts[key]) {
        towerCounts[key] = { lac, ci, count: 0 }
      }
      towerCounts[key].count++
    })

    // Find lat/lng columns for tower locations
    const latColumn = headers.find((h, i) => lowerHeaders[i].includes("lat") || lowerHeaders[i].includes("latitude"))
    const lngColumn = headers.find(
      (h, i) =>
        lowerHeaders[i].includes("lon") || lowerHeaders[i].includes("lng") || lowerHeaders[i].includes("longitude"),
    )

    analytics.towerLocations = Object.values(towerCounts)
      .map((t) => {
        const row = rows.find((r) => (r[lacColumn || ""] || "") === t.lac && (r[ciColumn || ""] || "") === t.ci)
        const lat = latColumn && row ? Number.parseFloat(row[latColumn]) || undefined : undefined
        const lng = lngColumn && row ? Number.parseFloat(row[lngColumn]) || undefined : undefined
        return isValidCoordinate(lat, lng) ? { ...t, lat, lng } : { ...t }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 100)

    const totalHits = rows.length
    analytics.topTowers = Object.values(towerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map((t) => ({
        ...t,
        percentage: Math.round((t.count / totalHits) * 100 * 10) / 10,
      }))
  }

  // Find time/date column
  const timeColumn = headers.find(
    (h, i) =>
      lowerHeaders[i].includes("time") ||
      lowerHeaders[i].includes("date") ||
      lowerHeaders[i].includes("timestamp") ||
      lowerHeaders[i].includes("start"),
  )

  if (timeColumn && rows.length > 0) {
    const sortedRows = [...rows].sort((a, b) => {
      const dateA = parseAnyDate(a[timeColumn] || "")
      const dateB = parseAnyDate(b[timeColumn] || "")
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
    })
    analytics.firstActivity = formatDateTime(sortedRows[0][timeColumn])
    analytics.lastActivity = formatDateTime(sortedRows[sortedRows.length - 1][timeColumn])
    analytics.timeSpan = `${analytics.firstActivity} - ${analytics.lastActivity}`

    const dateGroups: Record<string, { calls: number; sms: number; data: number }> = {}
    const hourGroups: Record<number, number> = {}
    const weekdayGroups: Record<number, number> = {}
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    // Find call type column
    const typeCol = headers.find(
      (h, i) =>
        lowerHeaders[i].includes("type") ||
        lowerHeaders[i].includes("direction") ||
        lowerHeaders[i].includes("call_type") ||
        lowerHeaders[i].includes("service"),
    )

    rows.forEach((r) => {
      const dateStr = r[timeColumn]
      if (dateStr) {
        const date = parseAnyDate(dateStr)
        if (date) {
          const dateKey = date.toISOString().split("T")[0]
          const hour = date.getHours()
          const weekday = date.getDay()

          if (!dateGroups[dateKey]) {
            dateGroups[dateKey] = { calls: 0, sms: 0, data: 0 }
          }

          const type = typeCol ? r[typeCol]?.toLowerCase() || "" : ""
          if (type.includes("sms") || type.includes("message")) {
            dateGroups[dateKey].sms++
          } else if (type.includes("data") || type.includes("gprs")) {
            dateGroups[dateKey].data++
          } else {
            dateGroups[dateKey].calls++
          }

          hourGroups[hour] = (hourGroups[hour] || 0) + 1
          weekdayGroups[weekday] = (weekdayGroups[weekday] || 0) + 1
        }
      }
    })

    analytics.timelineData = Object.entries(dateGroups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, counts]) => ({ date, ...counts }))

    analytics.hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourGroups[hour] || 0,
    }))

    analytics.weekdayDistribution = weekdays.map((day, index) => ({
      day,
      count: weekdayGroups[index] || 0,
    }))

    const peakHourEntry = Object.entries(hourGroups).sort((a, b) => b[1] - a[1])[0]
    if (peakHourEntry) {
      analytics.peakHour = { hour: Number.parseInt(peakHourEntry[0]), count: peakHourEntry[1] }
    }
  }

  // Find call type column for incoming/outgoing analysis
  const typeColumn = headers.find(
    (h, i) =>
      lowerHeaders[i].includes("type") ||
      lowerHeaders[i].includes("direction") ||
      lowerHeaders[i].includes("call_type"),
  )

  if (typeColumn) {
    let incoming = 0
    let outgoing = 0
    let sms = 0
    let unknown = 0

    rows.forEach((r) => {
      const type = r[typeColumn]?.toLowerCase() || ""
      if (type.includes("in") || type.includes("mt") || type.includes("received") || type.includes("terminating")) {
        incoming++
      } else if (
        type.includes("out") ||
        type.includes("mo") ||
        type.includes("dialed") ||
        type.includes("originating")
      ) {
        outgoing++
      } else {
        unknown++
      }
      if (type.includes("sms") || type.includes("message")) {
        sms++
      }
    })

    analytics.incomingCalls = incoming
    analytics.outgoingCalls = outgoing
    analytics.smsCount = sms
    analytics.callDirections = { incoming, outgoing, unknown }
  }

  // Find duration column
  const durationColumn = headers.find(
    (h, i) =>
      lowerHeaders[i].includes("duration") || lowerHeaders[i].includes("length") || lowerHeaders[i].includes("seconds"),
  )

  if (durationColumn) {
    let totalSeconds = 0
    let maxDuration = 0
    let longestCallRow: Record<string, string> | null = null

    rows.forEach((row) => {
      const val = Number.parseInt(row[durationColumn]) || 0
      totalSeconds += val
      if (val > maxDuration) {
        maxDuration = val
        longestCallRow = row
      }
    })

    analytics.totalDuration = formatDuration(totalSeconds)
    analytics.totalDurationSeconds = totalSeconds
    analytics.averageCallDuration = rows.length > 0 ? Math.round(totalSeconds / rows.length) : 0

    if (longestCallRow && maxDuration > 0) {
      analytics.longestCall = {
        duration: maxDuration,
        bParty: msisdnColumn ? longestCallRow[msisdnColumn] || "" : "",
        date: timeColumn ? longestCallRow[timeColumn] || "" : "",
      }
    }
  } else {
    analytics.totalDuration = "N/A"
  }

  // Find provider/operator column
  const providerColumn = headers.find(
    (h, i) =>
      lowerHeaders[i].includes("provider") ||
      lowerHeaders[i].includes("operator") ||
      lowerHeaders[i].includes("network"),
  )

  if (providerColumn) {
    const providers: Record<string, number> = {}
    rows.forEach((r) => {
      const provider = r[providerColumn]
      if (provider) {
        providers[provider] = (providers[provider] || 0) + 1
      }
    })
    analytics.providers = providers
  }

  return analytics
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return ""
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12 || 12

    return `${year}-${month}-${day} ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`
  } catch {
    return dateStr
  }
}

export function normalizeIMEI(imei: string): string {
  const cleaned = imei.replace(/\D/g, "")
  if (cleaned.length === 14 || cleaned.length === 15) {
    return cleaned
  }
  return imei
}

export function normalizeMSISDN(msisdn: string): string {
  const cleaned = msisdn.replace(/\D/g, "")
  // Handle Bangladesh numbers
  if (cleaned.startsWith("880")) {
    return cleaned
  } else if (cleaned.startsWith("0")) {
    return "880" + cleaned.substring(1)
  }
  return cleaned
}

export function parseAnyDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // Trim whitespace
  const trimmed = dateStr.trim()

  // Try standard ISO parsing first
  const standard = new Date(trimmed)
  if (!isNaN(standard.getTime()) && standard.getFullYear() > 1970) return standard

  // DD/MM/YYYY HH:mm:ss format
  const ddmmyyyyTime = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})\s+(\d{1,2}):(\d{2}):?(\d{2})?/)
  if (ddmmyyyyTime) {
    const [, day, month, year, hours, minutes, seconds] = ddmmyyyyTime
    return new Date(
      Number.parseInt(year),
      Number.parseInt(month) - 1,
      Number.parseInt(day),
      Number.parseInt(hours),
      Number.parseInt(minutes),
      Number.parseInt(seconds || "0"),
    )
  }

  // DD/MM/YYYY format
  const ddmmyyyy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/)
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  // YYYY-MM-DD format
  const yyyymmdd = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/)
  if (yyyymmdd) {
    const [, year, month, day] = yyyymmdd
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  // DD.MM.YYYY format (European)
  const dotFormat = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (dotFormat) {
    const [, day, month, year] = dotFormat
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  // DD/MM/YY format
  const ddmmyy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2})(?:\s|$)/)
  if (ddmmyy) {
    const [, day, month, year] = ddmmyy
    const fullYear = Number.parseInt(year) > 50 ? 1900 + Number.parseInt(year) : 2000 + Number.parseInt(year)
    return new Date(fullYear, Number.parseInt(month) - 1, Number.parseInt(day))
  }

  // MM/DD/YYYY format (US)
  const mmddyyyy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/)
  if (mmddyyyy) {
    const [, month, day, year] = mmddyyyy
    // Only use this if the first number is 12 or less (more likely to be month)
    if (Number.parseInt(month) <= 12) {
      return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    }
  }

  return null
}

export function isValidCoordinate(lat?: number, lng?: number): boolean {
  if (lat === undefined || lng === undefined) return false
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !(lat === 0 && lng === 0)
}

// IMSI validation
export function validateIMSI(imsi: string): boolean {
  const cleaned = imsi.replace(/\D/g, "")
  return cleaned.length === 15
}

export function validateIMEI(imei: string): boolean {
  const cleaned = imei.replace(/\D/g, "")
  return cleaned.length === 14 || cleaned.length === 15
}

// Phone number formatting
export function formatPhoneNumber(phone: string, countryCode = "880"): string {
  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.startsWith(countryCode)) {
    return `+${cleaned}`
  }

  if (cleaned.startsWith("0")) {
    return `+${countryCode}${cleaned.substring(1)}`
  }

  return `+${countryCode}${cleaned}`
}

// Duration formatting helper
export function formatDuration(seconds: number): string {
  if (seconds < 0) return "0s"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function transformRowsToCSV(headers: string[], rows: Record<string, string>[]): string {
  const escapeCSV = (val: string): string => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`
    }
    return val
  }

  const headerLine = headers.map(escapeCSV).join(",")
  const dataLines = rows.map((row) => headers.map((h) => escapeCSV(row[h] || "")).join(","))

  return [headerLine, ...dataLines].join("\n")
}

export function processBatch<T, R>(items: T[], batchSize: number, processor: (batch: T[]) => R[]): R[] {
  const results: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    results.push(...processor(batch))
  }
  return results
}
