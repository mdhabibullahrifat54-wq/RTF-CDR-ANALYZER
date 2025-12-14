// RTF Forensics Suite - Intelligent Column Mapping Engine
// Comprehensive auto-mapping with synonym matching, pattern recognition, and confidence scoring

export interface ColumnMapping {
  sourceColumn: string
  targetColumn: string
  confidence: number
  matchType: "exact" | "synonym" | "pattern" | "fuzzy" | "manual" | "none"
  sampleData?: string[]
  dataType?: "text" | "number" | "date" | "time" | "phone" | "imei" | "imsi" | "coordinates"
}

export interface MappingTemplate {
  id: string
  name: string
  description: string
  sourceSystem: string
  mappings: ColumnMapping[]
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  column: string
  row?: number
  message: string
  severity: "error" | "warning"
}

export interface ValidationWarning {
  column: string
  message: string
  affectedRows: number
}

export const TARGET_COLUMNS = {
  cdr: [
    {
      name: "Operator",
      required: false,
      description: "Telecom operator/provider name",
      aliases: [
        "Provider",
        "ProviderName",
        "Carrier",
        "TelecomCompany",
        "Network",
        "ServiceProvider",
        "Telco",
        "Company",
      ],
    },
    {
      name: "Party A",
      required: true,
      description: "Calling/source number",
      aliases: [
        "Aparty",
        "A_Party",
        "A-Party",
        "Caller",
        "Source",
        "Originator",
        "CallingNumber",
        "FromNumber",
        "MSISDN_A",
        "Calling",
        "From",
        "SourceNumber",
        "OriginatingNumber",
        "CallerID",
        "CLI",
      ],
    },
    {
      name: "Party B",
      required: true,
      description: "Called/destination number",
      aliases: [
        "Bparty",
        "B_Party",
        "B-Party",
        "Called",
        "Destination",
        "Recipient",
        "CalledNumber",
        "ToNumber",
        "MSISDN_B",
        "To",
        "Dialed",
        "DestNumber",
        "TerminatingNumber",
        "DialedNumber",
      ],
    },
    {
      name: "Start",
      required: true,
      description: "Call start date/time",
      aliases: [
        "StartTime",
        "Start_Time",
        "DateTime",
        "CallStart",
        "StartDateTime",
        "Timestamp",
        "Date",
        "Time",
        "CallDate",
        "CallDateTime",
      ],
    },
    {
      name: "End",
      required: false,
      description: "Call end date/time",
      aliases: ["EndTime", "End_Time", "CallEnd", "EndDateTime", "FinishTime", "StopTime"],
    },
    {
      name: "Call Duration",
      required: false,
      description: "Duration of call in seconds",
      aliases: [
        "Duration",
        "CallTime",
        "TalkTime",
        "Seconds",
        "CallLength",
        "DurationSec",
        "TotalDuration",
        "Length",
        "Sec",
        "DurationSeconds",
      ],
    },
    {
      name: "Usage Type",
      required: false,
      description: "Type of service (Voice/SMS/Data)",
      aliases: [
        "ServiceType",
        "CallType",
        "UsageCategory",
        "Type",
        "Direction",
        "Service",
        "ActivityType",
        "Category",
        "EventType",
      ],
    },
    {
      name: "Call Direction",
      required: false,
      description: "Incoming/Outgoing direction",
      aliases: ["Direction", "CallDirection", "InOut", "IO", "MOC_MTC", "Orientation"],
    },
    {
      name: "IMEI",
      required: false,
      description: "Device identifier (15 digits)",
      aliases: [
        "DeviceID",
        "Device_ID",
        "HandsetIMEI",
        "EquipmentID",
        "TAC",
        "Device",
        "Handset",
        "IMEI_A",
        "EquipmentIdentity",
      ],
    },
    {
      name: "IMEI B",
      required: false,
      description: "B-Party device identifier",
      aliases: ["IMEI_B", "DeviceID_B", "HandsetIMEI_B", "EquipmentID_B"],
    },
    {
      name: "IMSI",
      required: false,
      description: "Subscriber identifier (15 digits)",
      aliases: ["SubscriberID", "Subscriber_ID", "SIM_ID", "SIMID", "SubscriberIdentity", "SIM", "IMSI_A"],
    },
    {
      name: "IMSI B",
      required: false,
      description: "B-Party subscriber identifier",
      aliases: ["IMSI_B", "SubscriberID_B", "SIM_ID_B"],
    },
    {
      name: "LAC",
      required: false,
      description: "Location Area Code",
      aliases: ["LAC_ID", "LAC-ID", "LocationAreaCode", "AreaCode", "LA", "Location_Area", "LAC_A"],
    },
    {
      name: "LAC B",
      required: false,
      description: "B-Party Location Area Code",
      aliases: ["LAC_B", "LAC_ID_B", "LocationAreaCode_B"],
    },
    {
      name: "Cell ID",
      required: false,
      description: "Cell tower identifier",
      aliases: ["CI", "CellIdentifier", "Cell_ID", "CID", "CGI", "CellSite", "TowerID", "Cell", "CellNo", "CI_A"],
    },
    {
      name: "Cell ID B",
      required: false,
      description: "B-Party Cell tower identifier",
      aliases: ["CI_B", "CellIdentifier_B", "Cell_ID_B", "CID_B"],
    },
    {
      name: "Bts Address",
      required: false,
      description: "Tower location/address",
      aliases: [
        "Address",
        "Location",
        "SiteAddress",
        "TowerAddress",
        "CellAddress",
        "SiteName",
        "BTSLocation",
        "Site",
        "Tower",
        "CellLocation",
      ],
    },
    {
      name: "Latitude",
      required: false,
      description: "GPS latitude coordinate",
      aliases: ["Lat", "GPS_Lat", "GeoLat", "Y_Coord", "Y", "Lat_A"],
    },
    {
      name: "Longitude",
      required: false,
      description: "GPS longitude coordinate",
      aliases: ["Long", "Lng", "GPS_Long", "GeoLong", "X_Coord", "X", "Lon", "Long_A"],
    },
    {
      name: "Latitude B",
      required: false,
      description: "B-Party GPS latitude",
      aliases: ["Lat_B", "GPS_Lat_B", "GeoLat_B"],
    },
    {
      name: "Longitude B",
      required: false,
      description: "B-Party GPS longitude",
      aliases: ["Long_B", "Lng_B", "GPS_Long_B", "GeoLong_B"],
    },
    {
      name: "Azimuth",
      required: false,
      description: "Cell tower azimuth/direction",
      aliases: ["Bearing", "Direction", "Angle", "CellAzimuth", "TowerAzimuth"],
    },
    {
      name: "First Cell",
      required: false,
      description: "First cell during call",
      aliases: ["FirstCI", "StartCell", "OriginatingCell", "InitialCell"],
    },
    {
      name: "Last Cell",
      required: false,
      description: "Last cell during call",
      aliases: ["LastCI", "EndCell", "TerminatingCell", "FinalCell"],
    },
    {
      name: "Roaming",
      required: false,
      description: "Roaming indicator",
      aliases: ["IsRoaming", "RoamingStatus", "Roamer", "RoamingFlag"],
    },
    {
      name: "Network Type",
      required: false,
      description: "Network technology (2G/3G/4G/5G)",
      aliases: ["Technology", "RAT", "RadioAccessType", "NetworkTech", "2G3G4G"],
    },
    {
      name: "SMS Content",
      required: false,
      description: "SMS message content",
      aliases: ["Message", "SMSText", "MessageContent", "Text", "Content"],
    },
    {
      name: "Data Volume",
      required: false,
      description: "Data usage in bytes/KB/MB",
      aliases: ["DataUsage", "Volume", "Bytes", "DataBytes", "DownloadVolume", "UploadVolume", "TotalVolume"],
    },
    {
      name: "Record ID",
      required: false,
      description: "Unique record identifier",
      aliases: ["ID", "RecordNo", "SequenceNo", "SerialNo", "TransactionID", "CDR_ID"],
    },
  ],
  tower: [
    {
      name: "MSISDN",
      required: true,
      description: "Mobile number",
      aliases: ["PhoneNumber", "Phone", "Number", "Mobile", "MobileNumber", "Subscriber", "MSISDN_No", "PartyA"],
    },
    {
      name: "IMEI",
      required: false,
      description: "Device identifier (15 digits)",
      aliases: ["DeviceID", "Device_ID", "HandsetIMEI", "EquipmentID", "TAC", "Device"],
    },
    {
      name: "IMSI",
      required: false,
      description: "Subscriber identifier (15 digits)",
      aliases: ["SubscriberID", "Subscriber_ID", "SIM_ID", "SIMID", "SIM"],
    },
    {
      name: "DateTime",
      required: true,
      description: "Activity timestamp",
      aliases: ["Timestamp", "Date", "Time", "Start", "ActivityTime", "EventTime", "RecordTime"],
    },
    {
      name: "LAC",
      required: true,
      description: "Location Area Code",
      aliases: ["LAC_ID", "LAC-ID", "LocationAreaCode", "AreaCode", "LA"],
    },
    {
      name: "Cell ID",
      required: true,
      description: "Cell identifier",
      aliases: ["CI", "CellIdentifier", "Cell_ID", "CID", "CGI", "TowerID"],
    },
    {
      name: "Bts Address",
      required: false,
      description: "Tower location/address",
      aliases: ["Address", "Location", "SiteAddress", "TowerAddress", "SiteName"],
    },
    {
      name: "Latitude",
      required: false,
      description: "GPS latitude coordinate",
      aliases: ["Lat", "GPS_Lat", "GeoLat", "Y_Coord"],
    },
    {
      name: "Longitude",
      required: false,
      description: "GPS longitude coordinate",
      aliases: ["Long", "Lng", "GPS_Long", "GeoLong", "X_Coord", "Lon"],
    },
    {
      name: "Azimuth",
      required: false,
      description: "Cell tower azimuth/direction",
      aliases: ["Bearing", "Direction", "Angle", "CellAzimuth"],
    },
    {
      name: "Event Type",
      required: false,
      description: "Type of event (Call/SMS/Data)",
      aliases: ["Type", "ActivityType", "UsageType", "ServiceType"],
    },
    {
      name: "Duration",
      required: false,
      description: "Event duration in seconds",
      aliases: ["Seconds", "Length", "TalkTime", "CallDuration"],
    },
    {
      name: "Operator",
      required: false,
      description: "Network operator",
      aliases: ["Provider", "Network", "Carrier", "Telco"],
    },
  ],
}

const SYNONYM_MAP: Record<string, string[]> = {
  operator: [
    "provider",
    "providername",
    "carrier",
    "telecomcompany",
    "network",
    "serviceprovider",
    "telco",
    "company",
    "networkoperator",
  ],
  "party a": [
    "aparty",
    "a_party",
    "a-party",
    "caller",
    "source",
    "originator",
    "callingnumber",
    "fromnumber",
    "msisdn_a",
    "calling",
    "from",
    "sourcenumber",
    "originatingnumber",
    "callerid",
    "cli",
    "anumber",
  ],
  "party b": [
    "bparty",
    "b_party",
    "b-party",
    "called",
    "destination",
    "recipient",
    "callednumber",
    "tonumber",
    "msisdn_b",
    "to",
    "dialed",
    "destnumber",
    "terminatingnumber",
    "dialednumber",
    "bnumber",
  ],
  start: [
    "starttime",
    "start_time",
    "datetime",
    "callstart",
    "startdatetime",
    "timestamp",
    "date",
    "time",
    "calldate",
    "calltime",
    "eventtime",
    "recordtime",
    "activitytime",
  ],
  end: ["endtime", "end_time", "callend", "enddatetime", "finishtime", "stoptime"],
  "call duration": [
    "duration",
    "calltime",
    "talktime",
    "seconds",
    "calllength",
    "durationsec",
    "totalduration",
    "length",
    "sec",
    "durationseconds",
    "billedseconds",
  ],
  "call direction": ["direction", "calldirection", "inout", "io", "moc_mtc", "orientation", "callorientation"],
  "usage type": [
    "servicetype",
    "calltype",
    "usagecategory",
    "type",
    "direction",
    "service",
    "activitytype",
    "category",
    "eventtype",
  ],
  imei: [
    "deviceid",
    "device_id",
    "handsetimei",
    "equipmentid",
    "tac",
    "device",
    "handset",
    "imei_a",
    "equipmentidentity",
  ],
  "imei b": ["imei_b", "deviceid_b", "handsetimei_b", "equipmentid_b"],
  imsi: ["subscriberid", "subscriber_id", "sim_id", "simid", "subscriberidentity", "sim", "imsi_a"],
  "imsi b": ["imsi_b", "subscriberid_b", "sim_id_b"],
  lac: ["lac_id", "lac-id", "locationareacode", "areacode", "la", "location_area", "lac_a"],
  "lac b": ["lac_b", "lac_id_b", "locationareacode_b"],
  "cell id": ["ci", "cellidentifier", "cell_id", "cid", "cgi", "cellsite", "towerid", "cell", "cellno", "ci_a"],
  "cell id b": ["ci_b", "cellidentifier_b", "cell_id_b", "cid_b"],
  "bts address": [
    "address",
    "location",
    "siteaddress",
    "toweraddress",
    "celladdress",
    "sitename",
    "btslocation",
    "site",
    "tower",
    "celllocation",
    "towersite",
  ],
  latitude: ["lat", "gps_lat", "geolat", "y_coord", "y", "lat_a"],
  longitude: ["long", "lng", "gps_long", "geolong", "x_coord", "x", "lon", "long_a"],
  "latitude b": ["lat_b", "gps_lat_b", "geolat_b"],
  "longitude b": ["long_b", "lng_b", "gps_long_b", "geolong_b"],
  azimuth: ["bearing", "direction", "angle", "cellazimuth", "towerazimuth", "sectorangle"],
  "first cell": ["firstci", "startcell", "originatingcell", "initialcell"],
  "last cell": ["lastci", "endcell", "terminatingcell", "finalcell"],
  roaming: ["isroaming", "roamingstatus", "roamer", "roamingflag"],
  "network type": ["technology", "rat", "radioaccesstype", "networktech", "2g3g4g", "accesstechnology"],
  "sms content": ["message", "smstext", "messagecontent", "text", "content"],
  "data volume": ["datausage", "volume", "bytes", "databytes", "downloadvolume", "uploadvolume", "totalvolume"],
  "record id": ["id", "recordno", "sequenceno", "serialno", "transactionid", "cdr_id"],
  msisdn: ["phonenumber", "phone", "number", "mobile", "mobilenumber", "subscriber", "msisdn_no", "partya"],
}

const PATTERN_RULES: Array<{ pattern: RegExp; targetColumn: string; dataPattern?: RegExp }> = [
  { pattern: /^(start|begin|call).*(date|time)/i, targetColumn: "Start" },
  { pattern: /^(date|time|timestamp)/i, targetColumn: "Start" },
  { pattern: /^(end|stop|finish).*(date|time)/i, targetColumn: "End" },
  { pattern: /(duration|length|seconds|sec)/i, targetColumn: "Call Duration" },
  { pattern: /^imei$/i, targetColumn: "IMEI" },
  { pattern: /^imei.?b/i, targetColumn: "IMEI B" },
  { pattern: /^imsi$/i, targetColumn: "IMSI" },
  { pattern: /^imsi.?b/i, targetColumn: "IMSI B" },
  { pattern: /^(lac|location.*area)/i, targetColumn: "LAC" },
  { pattern: /^lac.?b/i, targetColumn: "LAC B" },
  { pattern: /^(cell|ci|cid|cgi)$/i, targetColumn: "Cell ID" },
  { pattern: /^(cell|ci|cid).?b/i, targetColumn: "Cell ID B" },
  { pattern: /(address|location|site|tower|bts)/i, targetColumn: "Bts Address" },
  { pattern: /^(lat|latitude)$/i, targetColumn: "Latitude" },
  { pattern: /^(lat|latitude).?b/i, targetColumn: "Latitude B" },
  { pattern: /^(lon|lng|long|longitude)$/i, targetColumn: "Longitude" },
  { pattern: /^(lon|lng|long|longitude).?b/i, targetColumn: "Longitude B" },
  { pattern: /(operator|provider|carrier|network|telco)/i, targetColumn: "Operator" },
  { pattern: /(type|category|service)/i, targetColumn: "Usage Type" },
  { pattern: /(direction|inout|moc|mtc)/i, targetColumn: "Call Direction" },
  { pattern: /(azimuth|bearing|angle)/i, targetColumn: "Azimuth" },
  { pattern: /(roam)/i, targetColumn: "Roaming" },
  { pattern: /(first.*cell|start.*cell)/i, targetColumn: "First Cell" },
  { pattern: /(last.*cell|end.*cell)/i, targetColumn: "Last Cell" },
  { pattern: /(sms|message|content)/i, targetColumn: "SMS Content" },
  { pattern: /(data.*volume|volume|bytes|usage)/i, targetColumn: "Data Volume" },
  { pattern: /^(id|record.*id|transaction)/i, targetColumn: "Record ID" },
]

export function detectDataType(values: string[]): ColumnMapping["dataType"] {
  const nonEmptyValues = values.filter((v) => v && v.trim() !== "").slice(0, 50)
  if (nonEmptyValues.length === 0) return "text"

  // Check for IMEI (15 digits)
  const imeiPattern = /^\d{15}$/
  if (nonEmptyValues.every((v) => imeiPattern.test(v.replace(/[-\s]/g, "")))) {
    return "imei"
  }

  // Check for IMSI (15 digits, often starts with country code)
  const imsiPattern = /^\d{15}$/
  if (nonEmptyValues.every((v) => imsiPattern.test(v.replace(/[-\s]/g, "")))) {
    return "imsi"
  }

  // Check for coordinates (latitude/longitude)
  const coordPattern = /^-?\d{1,3}\.\d{4,}$/
  if (nonEmptyValues.filter((v) => coordPattern.test(v)).length > nonEmptyValues.length * 0.7) {
    return "coordinates"
  }

  // Check for phone numbers (10-15 digits, may have + or country code)
  const phonePattern = /^[+]?[\d\s\-()]{10,18}$/
  if (nonEmptyValues.filter((v) => phonePattern.test(v)).length > nonEmptyValues.length * 0.7) {
    return "phone"
  }

  // Check for dates
  const datePatterns = [
    /^\d{4}[-/]\d{2}[-/]\d{2}/, // YYYY-MM-DD
    /^\d{2}[-/]\d{2}[-/]\d{4}/, // DD-MM-YYYY
    /^\d{2}[-/]\d{2}[-/]\d{2}/, // DD-MM-YY
  ]
  if (nonEmptyValues.some((v) => datePatterns.some((p) => p.test(v)))) {
    return "date"
  }

  // Check for time
  const timePattern = /^\d{1,2}:\d{2}(:\d{2})?(\s*(AM|PM))?$/i
  if (nonEmptyValues.filter((v) => timePattern.test(v)).length > nonEmptyValues.length * 0.7) {
    return "time"
  }

  // Check for numbers
  const numberPattern = /^-?[\d,]+\.?\d*$/
  if (nonEmptyValues.filter((v) => numberPattern.test(v.replace(/,/g, ""))).length > nonEmptyValues.length * 0.8) {
    return "number"
  }

  return "text"
}

// Normalize column name for comparison
function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s_\-.]+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
}

// Calculate string similarity (Levenshtein-based)
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()

  if (s1 === s2) return 1
  if (s1.length === 0 || s2.length === 0) return 0

  const matrix: number[][] = []

  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
    }
  }

  const maxLen = Math.max(s1.length, s2.length)
  return 1 - matrix[s1.length][s2.length] / maxLen
}

// Main auto-mapping function
export function autoMapColumns(
  sourceColumns: string[],
  sampleData: Record<string, string>[],
  moduleType: "cdr" | "tower" = "cdr",
): ColumnMapping[] {
  const targetCols = TARGET_COLUMNS[moduleType]
  const mappings: ColumnMapping[] = []
  const usedTargets = new Set<string>()

  for (const sourceCol of sourceColumns) {
    const normalizedSource = normalizeColumnName(sourceCol)
    const sampleValues = sampleData.slice(0, 10).map((row) => row[sourceCol] || "")
    const dataType = detectDataType(sampleValues)

    let bestMatch: ColumnMapping = {
      sourceColumn: sourceCol,
      targetColumn: "",
      confidence: 0,
      matchType: "none",
      sampleData: sampleValues.slice(0, 3),
      dataType,
    }

    for (const target of targetCols) {
      if (usedTargets.has(target.name)) continue

      const normalizedTarget = normalizeColumnName(target.name)
      let confidence = 0
      let matchType: ColumnMapping["matchType"] = "none"

      // 1. Exact match (highest priority)
      if (normalizedSource === normalizedTarget) {
        confidence = 100
        matchType = "exact"
      }
      // 2. Synonym match
      else {
        const synonyms = SYNONYM_MAP[normalizedTarget] || []
        const allSynonyms = [
          normalizedTarget,
          ...synonyms,
          ...(target.aliases?.map((a) => normalizeColumnName(a)) || []),
        ]

        if (
          allSynonyms.some(
            (syn) => normalizedSource === syn || normalizedSource.includes(syn) || syn.includes(normalizedSource),
          )
        ) {
          confidence = 90
          matchType = "synonym"
        }
        // 3. Pattern match
        else {
          for (const rule of PATTERN_RULES) {
            if (rule.targetColumn === target.name && rule.pattern.test(sourceCol)) {
              confidence = 80
              matchType = "pattern"
              break
            }
          }
        }

        // 4. Fuzzy match
        if (matchType === "none") {
          const similarity = calculateSimilarity(normalizedSource, normalizedTarget)
          if (similarity > 0.7) {
            confidence = Math.round(similarity * 70)
            matchType = "fuzzy"
          }
        }
      }

      // Data type validation boost/penalty
      if (confidence > 0) {
        if (target.name === "IMEI" && dataType === "imei") confidence = Math.min(100, confidence + 10)
        if (target.name === "IMSI" && dataType === "imsi") confidence = Math.min(100, confidence + 10)
        if (target.name === "Start" && (dataType === "date" || dataType === "time"))
          confidence = Math.min(100, confidence + 5)
        if (target.name === "End" && (dataType === "date" || dataType === "time"))
          confidence = Math.min(100, confidence + 5)
        if (target.name === "Call Duration" && dataType === "number") confidence = Math.min(100, confidence + 5)
        if ((target.name === "Party A" || target.name === "Party B") && dataType === "phone")
          confidence = Math.min(100, confidence + 5)
        if ((target.name === "Latitude" || target.name === "Longitude") && dataType === "coordinates")
          confidence = Math.min(100, confidence + 10)
        if ((target.name === "Latitude B" || target.name === "Longitude B") && dataType === "coordinates")
          confidence = Math.min(100, confidence + 10)
      }

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          sourceColumn: sourceCol,
          targetColumn: target.name,
          confidence,
          matchType,
          sampleData: sampleValues.slice(0, 3),
          dataType,
        }
      }
    }

    if (bestMatch.confidence >= 50) {
      usedTargets.add(bestMatch.targetColumn)
    }

    mappings.push(bestMatch)
  }

  return mappings
}

// Validate mapped data
export function validateMappedData(
  data: Record<string, string>[],
  mappings: ColumnMapping[],
  moduleType: "cdr" | "tower" = "cdr",
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const targetCols = TARGET_COLUMNS[moduleType]

  // Check required columns
  const requiredCols = targetCols.filter((c) => c.required)
  for (const reqCol of requiredCols) {
    const mapping = mappings.find((m) => m.targetColumn === reqCol.name && m.confidence > 0)
    if (!mapping) {
      errors.push({
        column: reqCol.name,
        message: `Required column "${reqCol.name}" is not mapped`,
        severity: "error",
      })
    }
  }

  // Validate IMEI format
  const imeiMapping = mappings.find((m) => m.targetColumn === "IMEI" && m.confidence > 0)
  if (imeiMapping) {
    let invalidCount = 0
    data.forEach((row, idx) => {
      const val = row[imeiMapping.sourceColumn]?.replace(/[-\s]/g, "")
      if (val && !/^\d{14,15}$/.test(val)) {
        invalidCount++
        if (invalidCount <= 3) {
          errors.push({
            column: "IMEI",
            row: idx + 1,
            message: `Invalid IMEI format: "${val}" (must be 14-15 digits)`,
            severity: "warning",
          })
        }
      }
    })
    if (invalidCount > 3) {
      warnings.push({
        column: "IMEI",
        message: `${invalidCount} rows have invalid IMEI format`,
        affectedRows: invalidCount,
      })
    }
  }

  // Validate IMSI format
  const imsiMapping = mappings.find((m) => m.targetColumn === "IMSI" && m.confidence > 0)
  if (imsiMapping) {
    let invalidCount = 0
    data.forEach((row) => {
      const val = row[imsiMapping.sourceColumn]?.replace(/[-\s]/g, "")
      if (val && !/^\d{15}$/.test(val)) {
        invalidCount++
      }
    })
    if (invalidCount > 0) {
      warnings.push({
        column: "IMSI",
        message: `${invalidCount} rows have invalid IMSI format`,
        affectedRows: invalidCount,
      })
    }
  }

  // Check for duplicate mappings
  const targetCounts: Record<string, number> = {}
  mappings.forEach((m) => {
    if (m.targetColumn && m.confidence > 0) {
      targetCounts[m.targetColumn] = (targetCounts[m.targetColumn] || 0) + 1
    }
  })
  for (const [target, count] of Object.entries(targetCounts)) {
    if (count > 1) {
      errors.push({
        column: target,
        message: `Column "${target}" is mapped multiple times`,
        severity: "error",
      })
    }
  }

  return {
    isValid: errors.filter((e) => e.severity === "error").length === 0,
    errors,
    warnings,
  }
}

// Template management functions
export function saveMappingTemplate(
  template: Omit<MappingTemplate, "id" | "createdAt" | "updatedAt" | "usageCount">,
): MappingTemplate {
  const templates = getMappingTemplates()
  const newTemplate: MappingTemplate = {
    ...template,
    id: `template_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  }
  templates.push(newTemplate)
  localStorage.setItem("rtf_mapping_templates", JSON.stringify(templates))
  return newTemplate
}

export function getMappingTemplates(): MappingTemplate[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("rtf_mapping_templates")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function deleteTemplate(templateId: string): void {
  const templates = getMappingTemplates().filter((t) => t.id !== templateId)
  localStorage.setItem("rtf_mapping_templates", JSON.stringify(templates))
}

export function applyTemplate(templateId: string, sourceColumns: string[]): ColumnMapping[] | null {
  const templates = getMappingTemplates()
  const template = templates.find((t) => t.id === templateId)
  if (!template) return null

  // Update usage count
  template.usageCount++
  template.updatedAt = new Date().toISOString()
  localStorage.setItem("rtf_mapping_templates", JSON.stringify(templates))

  // Apply template mappings to current source columns
  return sourceColumns.map((sourceCol) => {
    const templateMapping = template.mappings.find(
      (m) => normalizeColumnName(m.sourceColumn) === normalizeColumnName(sourceCol),
    )
    if (templateMapping) {
      return {
        ...templateMapping,
        sourceColumn: sourceCol,
        matchType: "manual" as const,
      }
    }
    return {
      sourceColumn: sourceCol,
      targetColumn: "",
      confidence: 0,
      matchType: "none" as const,
    }
  })
}

// Find best matching template for given columns
export function suggestTemplate(sourceColumns: string[]): MappingTemplate | null {
  const templates = getMappingTemplates()
  let bestMatch: { template: MappingTemplate; score: number } | null = null

  for (const template of templates) {
    const templateCols = template.mappings.map((m) => normalizeColumnName(m.sourceColumn))
    const sourceCols = sourceColumns.map((c) => normalizeColumnName(c))

    let matchCount = 0
    for (const col of sourceCols) {
      if (templateCols.some((tc) => tc === col || calculateSimilarity(tc, col) > 0.8)) {
        matchCount++
      }
    }

    const score = matchCount / Math.max(templateCols.length, sourceCols.length)

    if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { template, score }
    }
  }

  return bestMatch?.template || null
}

// Apply mappings to transform data
export function applyMappingsToData(
  data: Record<string, string>[],
  mappings: ColumnMapping[],
): Record<string, string>[] {
  return data.map((row) => {
    const newRow: Record<string, string> = {}
    for (const mapping of mappings) {
      if (mapping.targetColumn && mapping.confidence > 0) {
        newRow[mapping.targetColumn] = row[mapping.sourceColumn] || ""
      }
    }
    // Keep unmapped columns with original names
    for (const key of Object.keys(row)) {
      const mapping = mappings.find((m) => m.sourceColumn === key)
      if (!mapping || mapping.confidence === 0 || !mapping.targetColumn) {
        newRow[key] = row[key]
      }
    }
    return newRow
  })
}
