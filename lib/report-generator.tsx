// Report Generator Library for RTF Forensics Suite
// Supports PDF, Excel, CSV, and HTML export formats

export interface ReportConfig {
  selectedReports: string[]
  selectedFormat: string
  caseInfo: {
    caseNumber: string
    investigator: string
    date: string
    notes: string
  }
  includeCharts: boolean
  includeMaps: boolean
  includeTables: boolean
  includeSummary: boolean
}

export interface ReportData {
  cdr?: any
  tower?: any
  drive?: any
  mutual?: any
  geo?: any
}

// Utility to escape HTML special characters
function escapeHtml(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Format date for display
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

// Generate HTML report
function generateHTMLReport(config: ReportConfig, data: ReportData): string {
  const { caseInfo, selectedReports, includeTables, includeSummary } = config

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RTF Forensics Report${caseInfo.caseNumber ? ` - Case ${caseInfo.caseNumber}` : ""}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: #f8fafc; 
      color: #1e293b;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { 
      background: linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%); 
      color: white; 
      padding: 40px; 
      border-radius: 16px;
      margin-bottom: 32px;
      box-shadow: 0 10px 40px rgba(8, 145, 178, 0.2);
    }
    .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .header .subtitle { opacity: 0.9; font-size: 16px; }
    .case-info { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 24px; 
      background: white; 
      padding: 24px; 
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .case-info-item label { 
      display: block; 
      font-size: 12px; 
      color: #64748b; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .case-info-item span { font-weight: 600; color: #0f172a; }
    .section { 
      background: white; 
      border-radius: 12px; 
      padding: 24px; 
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .section h2 { 
      font-size: 18px; 
      color: #0891b2; 
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card { 
      background: #f1f5f9; 
      padding: 16px; 
      border-radius: 8px;
      text-align: center;
    }
    .stat-card .value { 
      font-size: 24px; 
      font-weight: 700; 
      color: #0891b2;
    }
    .stat-card .label { 
      font-size: 12px; 
      color: #64748b;
      margin-top: 4px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 16px;
      font-size: 13px;
    }
    th, td { 
      padding: 12px 16px; 
      text-align: left; 
      border-bottom: 1px solid #e2e8f0;
    }
    th { 
      background: #f8fafc; 
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    tr:hover { background: #f8fafc; }
    .footer { 
      text-align: center; 
      padding: 24px; 
      color: #94a3b8; 
      font-size: 12px;
    }
    .notes { 
      background: #fef3c7; 
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 16px;
    }
    .notes h3 { color: #92400e; font-size: 14px; margin-bottom: 8px; }
    .notes p { color: #78350f; font-size: 14px; }
    @media print {
      body { background: white; }
      .container { padding: 0; }
      .section { box-shadow: none; border: 1px solid #e2e8f0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RTF Forensics Analysis Report</h1>
      <div class="subtitle">Generated on ${formatDate(new Date().toISOString())}</div>
    </div>
    
    <div class="case-info">
      <div class="case-info-item">
        <label>Case Number</label>
        <span>${escapeHtml(caseInfo.caseNumber) || "Not Specified"}</span>
      </div>
      <div class="case-info-item">
        <label>Investigator</label>
        <span>${escapeHtml(caseInfo.investigator) || "Not Specified"}</span>
      </div>
      <div class="case-info-item">
        <label>Report Date</label>
        <span>${formatDate(caseInfo.date)}</span>
      </div>
      <div class="case-info-item">
        <label>Report Types</label>
        <span>${selectedReports.map((r) => r.toUpperCase()).join(", ")}</span>
      </div>
    </div>
    
    ${
      caseInfo.notes
        ? `
    <div class="notes">
      <h3>Notes & Remarks</h3>
      <p>${escapeHtml(caseInfo.notes)}</p>
    </div>
    `
        : ""
    }
`

  // CDR Report Section
  if (selectedReports.includes("cdr") && data.cdr) {
    const cdrData = data.cdr
    html += `
    <div class="section">
      <h2>CDR Analysis Report</h2>
      ${
        includeSummary
          ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${cdrData.rows?.length?.toLocaleString() || 0}</div>
          <div class="label">Total Records</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.uniqueBParty?.toLocaleString() || 0}</div>
          <div class="label">Unique B-Party</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.incomingCalls?.toLocaleString() || 0}</div>
          <div class="label">Incoming Calls</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.outgoingCalls?.toLocaleString() || 0}</div>
          <div class="label">Outgoing Calls</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.smsCount?.toLocaleString() || 0}</div>
          <div class="label">SMS Messages</div>
        </div>
        <div class="stat-card">
          <div class="value">${cdrData.analytics?.towerHits?.toLocaleString() || 0}</div>
          <div class="label">Tower Hits</div>
        </div>
      </div>
      `
          : ""
      }
      
      ${
        includeTables && cdrData.analytics?.topBParty
          ? `
      <h3 style="font-size: 14px; margin: 24px 0 12px; color: #475569;">Top 20 B-Party Numbers</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Phone Number</th>
            <th>Call Count</th>
          </tr>
        </thead>
        <tbody>
          ${cdrData.analytics.topBParty
            .slice(0, 20)
            .map(
              (item: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td style="font-family: monospace;">${escapeHtml(item.number)}</td>
            <td>${item.count}</td>
          </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      `
          : ""
      }
    </div>
`
  }

  // Tower Dump Report Section
  if (selectedReports.includes("tower") && data.tower) {
    const towerData = data.tower
    html += `
    <div class="section">
      <h2>Tower Dump Analysis Report</h2>
      ${
        includeSummary
          ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${towerData.rows?.length?.toLocaleString() || 0}</div>
          <div class="label">Total Records</div>
        </div>
        <div class="stat-card">
          <div class="value">${towerData.analytics?.uniqueIMSI?.toLocaleString() || 0}</div>
          <div class="label">Unique IMSI</div>
        </div>
        <div class="stat-card">
          <div class="value">${towerData.analytics?.uniqueIMEI?.toLocaleString() || 0}</div>
          <div class="label">Unique IMEI</div>
        </div>
        <div class="stat-card">
          <div class="value">${towerData.analytics?.uniqueMSISDN?.toLocaleString() || 0}</div>
          <div class="label">Unique MSISDN</div>
        </div>
      </div>
      `
          : ""
      }
      
      ${
        includeTables && towerData.rows?.length > 0
          ? `
      <h3 style="font-size: 14px; margin: 24px 0 12px; color: #475569;">Sample Records (First 50)</h3>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              ${
                towerData.headers
                  ?.slice(0, 8)
                  .map((h: string) => `<th>${escapeHtml(h)}</th>`)
                  .join("") || ""
              }
            </tr>
          </thead>
          <tbody>
            ${towerData.rows
              .slice(0, 50)
              .map(
                (row: any) => `
            <tr>
              ${
                towerData.headers
                  ?.slice(0, 8)
                  .map((h: string) => `<td>${escapeHtml(String(row[h] || ""))}</td>`)
                  .join("") || ""
              }
            </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      `
          : ""
      }
    </div>
`
  }

  // Drive Test Report Section
  if (selectedReports.includes("drive") && data.drive) {
    const driveData = data.drive
    html += `
    <div class="section">
      <h2>Drive Test Analysis Report</h2>
      ${
        includeSummary
          ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${driveData.rows?.length?.toLocaleString() || 0}</div>
          <div class="label">Total Points</div>
        </div>
        <div class="stat-card">
          <div class="value">${driveData.analytics?.uniqueTowers?.toLocaleString() || 0}</div>
          <div class="label">Unique Towers</div>
        </div>
        <div class="stat-card">
          <div class="value">${driveData.analytics?.avgSignal?.toFixed(1) || "N/A"}</div>
          <div class="label">Avg Signal (dBm)</div>
        </div>
      </div>
      `
          : ""
      }
    </div>
`
  }

  // Mutual Analysis Report Section
  if (selectedReports.includes("mutual") && data.mutual) {
    const mutualData = data.mutual
    html += `
    <div class="section">
      <h2>Mutual Communication Analysis Report</h2>
      ${
        includeSummary
          ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${mutualData.commonNumbers?.length?.toLocaleString() || 0}</div>
          <div class="label">Common Numbers</div>
        </div>
        <div class="stat-card">
          <div class="value">${mutualData.file1Records?.toLocaleString() || 0}</div>
          <div class="label">File 1 Records</div>
        </div>
        <div class="stat-card">
          <div class="value">${mutualData.file2Records?.toLocaleString() || 0}</div>
          <div class="label">File 2 Records</div>
        </div>
      </div>
      `
          : ""
      }
      
      ${
        includeTables && mutualData.commonNumbers?.length > 0
          ? `
      <h3 style="font-size: 14px; margin: 24px 0 12px; color: #475569;">Common Numbers Found</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Phone Number</th>
            <th>File 1 Count</th>
            <th>File 2 Count</th>
          </tr>
        </thead>
        <tbody>
          ${mutualData.commonNumbers
            .slice(0, 50)
            .map(
              (item: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td style="font-family: monospace;">${escapeHtml(item.number)}</td>
            <td>${item.file1Count || 0}</td>
            <td>${item.file2Count || 0}</td>
          </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      `
          : ""
      }
    </div>
`
  }

  html += `
    <div class="footer">
      <p>Generated by RTF Forensics Suite</p>
      <p>This report is confidential and intended for authorized personnel only.</p>
    </div>
  </div>
</body>
</html>
`

  return html
}

// Generate CSV content
function generateCSVReport(config: ReportConfig, data: ReportData): string {
  const lines: string[] = []
  const { selectedReports } = config

  // Helper to escape CSV values
  const escapeCSV = (val: any): string => {
    const str = String(val ?? "")
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  // Add header info
  lines.push("RTF Forensics Report")
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push(`Case Number: ${config.caseInfo.caseNumber || "N/A"}`)
  lines.push(`Investigator: ${config.caseInfo.investigator || "N/A"}`)
  lines.push("")

  // CDR Data
  if (selectedReports.includes("cdr") && data.cdr?.rows?.length > 0) {
    lines.push("=== CDR ANALYSIS ===")
    lines.push(`Total Records: ${data.cdr.rows.length}`)
    lines.push("")

    // Headers
    if (data.cdr.headers) {
      lines.push(data.cdr.headers.map(escapeCSV).join(","))
    }

    // Data rows
    data.cdr.rows.forEach((row: any) => {
      const values = data.cdr.headers.map((h: string) => escapeCSV(row[h]))
      lines.push(values.join(","))
    })
    lines.push("")
  }

  // Tower Data
  if (selectedReports.includes("tower") && data.tower?.rows?.length > 0) {
    lines.push("=== TOWER DUMP ANALYSIS ===")
    lines.push(`Total Records: ${data.tower.rows.length}`)
    lines.push("")

    if (data.tower.headers) {
      lines.push(data.tower.headers.map(escapeCSV).join(","))
    }

    data.tower.rows.forEach((row: any) => {
      const values = data.tower.headers.map((h: string) => escapeCSV(row[h]))
      lines.push(values.join(","))
    })
    lines.push("")
  }

  // Mutual Analysis Data
  if (selectedReports.includes("mutual") && data.mutual?.commonNumbers?.length > 0) {
    lines.push("=== MUTUAL COMMUNICATION ANALYSIS ===")
    lines.push(`Common Numbers Found: ${data.mutual.commonNumbers.length}`)
    lines.push("")
    lines.push("Number,File1Count,File2Count")

    data.mutual.commonNumbers.forEach((item: any) => {
      lines.push(`${escapeCSV(item.number)},${item.file1Count || 0},${item.file2Count || 0}`)
    })
  }

  return lines.join("\n")
}

// Generate Excel-compatible XML (Excel 2003 XML format)
function generateExcelReport(config: ReportConfig, data: ReportData): string {
  const { selectedReports, caseInfo } = config

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Size="11"/>
      <Interior ss:Color="#0891b2" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF"/>
    </Style>
    <Style ss:ID="Title">
      <Font ss:Bold="1" ss:Size="14"/>
    </Style>
    <Style ss:ID="SubTitle">
      <Font ss:Size="11" ss:Color="#666666"/>
    </Style>
  </Styles>
`

  // Summary Sheet
  xml += `
  <Worksheet ss:Name="Summary">
    <Table>
      <Row><Cell ss:StyleID="Title"><Data ss:Type="String">RTF Forensics Analysis Report</Data></Cell></Row>
      <Row><Cell ss:StyleID="SubTitle"><Data ss:Type="String">Generated: ${new Date().toISOString()}</Data></Cell></Row>
      <Row></Row>
      <Row><Cell><Data ss:Type="String">Case Number:</Data></Cell><Cell><Data ss:Type="String">${caseInfo.caseNumber || "N/A"}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Investigator:</Data></Cell><Cell><Data ss:Type="String">${caseInfo.investigator || "N/A"}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Report Date:</Data></Cell><Cell><Data ss:Type="String">${caseInfo.date}</Data></Cell></Row>
      <Row></Row>
      <Row><Cell ss:StyleID="Header"><Data ss:Type="String">Module</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Records</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Status</Data></Cell></Row>
`

  if (selectedReports.includes("cdr")) {
    xml += `<Row><Cell><Data ss:Type="String">CDR Analysis</Data></Cell><Cell><Data ss:Type="Number">${data.cdr?.rows?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.cdr ? "Included" : "No Data"}</Data></Cell></Row>`
  }
  if (selectedReports.includes("tower")) {
    xml += `<Row><Cell><Data ss:Type="String">Tower Dump</Data></Cell><Cell><Data ss:Type="Number">${data.tower?.rows?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.tower ? "Included" : "No Data"}</Data></Cell></Row>`
  }
  if (selectedReports.includes("mutual")) {
    xml += `<Row><Cell><Data ss:Type="String">Mutual Analysis</Data></Cell><Cell><Data ss:Type="Number">${data.mutual?.commonNumbers?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.mutual ? "Included" : "No Data"}</Data></Cell></Row>`
  }
  if (selectedReports.includes("drive")) {
    xml += `<Row><Cell><Data ss:Type="String">Drive Test</Data></Cell><Cell><Data ss:Type="Number">${data.drive?.rows?.length || 0}</Data></Cell><Cell><Data ss:Type="String">${data.drive ? "Included" : "No Data"}</Data></Cell></Row>`
  }

  xml += `
    </Table>
  </Worksheet>
`

  // CDR Data Sheet
  if (selectedReports.includes("cdr") && data.cdr?.rows?.length > 0) {
    xml += `
  <Worksheet ss:Name="CDR Data">
    <Table>
      <Row>
        ${data.cdr.headers.map((h: string) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join("")}
      </Row>
`
    data.cdr.rows.slice(0, 10000).forEach((row: any) => {
      xml += `<Row>${data.cdr.headers.map((h: string) => `<Cell><Data ss:Type="String">${String(row[h] ?? "").replace(/[<>&]/g, "")}</Data></Cell>`).join("")}</Row>\n`
    })
    xml += `
    </Table>
  </Worksheet>
`
  }

  // Tower Data Sheet
  if (selectedReports.includes("tower") && data.tower?.rows?.length > 0) {
    xml += `
  <Worksheet ss:Name="Tower Data">
    <Table>
      <Row>
        ${data.tower.headers.map((h: string) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join("")}
      </Row>
`
    data.tower.rows.slice(0, 10000).forEach((row: any) => {
      xml += `<Row>${data.tower.headers.map((h: string) => `<Cell><Data ss:Type="String">${String(row[h] ?? "").replace(/[<>&]/g, "")}</Data></Cell>`).join("")}</Row>\n`
    })
    xml += `
    </Table>
  </Worksheet>
`
  }

  // Mutual Analysis Sheet
  if (selectedReports.includes("mutual") && data.mutual?.commonNumbers?.length > 0) {
    xml += `
  <Worksheet ss:Name="Mutual Analysis">
    <Table>
      <Row>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Number</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">File 1 Count</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">File 2 Count</Data></Cell>
      </Row>
`
    data.mutual.commonNumbers.forEach((item: any) => {
      xml += `<Row><Cell><Data ss:Type="String">${item.number}</Data></Cell><Cell><Data ss:Type="Number">${item.file1Count || 0}</Data></Cell><Cell><Data ss:Type="Number">${item.file2Count || 0}</Data></Cell></Row>\n`
    })
    xml += `
    </Table>
  </Worksheet>
`
  }

  xml += `</Workbook>`
  return xml
}

// Download file helper
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Open HTML in new window for printing
function openHTMLForPrint(html: string): void {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    // Delay print to ensure content is loaded
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }
}

// Main export function
export function exportReport(config: ReportConfig, data: ReportData): { success: boolean; message: string } {
  try {
    const { selectedFormat, caseInfo } = config
    const timestamp = new Date().toISOString().slice(0, 10)
    const casePrefix = caseInfo.caseNumber ? `${caseInfo.caseNumber}_` : ""

    switch (selectedFormat) {
      case "pdf":
        // Generate HTML and open print dialog for PDF
        const pdfHtml = generateHTMLReport(config, data)
        openHTMLForPrint(pdfHtml)
        return {
          success: true,
          message: "PDF print dialog opened. Use your browser's print function to save as PDF.",
        }

      case "html":
        const html = generateHTMLReport(config, data)
        downloadFile(html, `${casePrefix}RTF_Report_${timestamp}.html`, "text/html")
        return { success: true, message: "HTML report downloaded successfully." }

      case "csv":
        const csv = generateCSVReport(config, data)
        downloadFile(csv, `${casePrefix}RTF_Report_${timestamp}.csv`, "text/csv")
        return { success: true, message: "CSV report downloaded successfully." }

      case "excel":
        const excel = generateExcelReport(config, data)
        downloadFile(excel, `${casePrefix}RTF_Report_${timestamp}.xml`, "application/vnd.ms-excel")
        return {
          success: true,
          message: "Excel report downloaded. Open with Microsoft Excel or compatible software.",
        }

      default:
        return { success: false, message: `Unknown format: ${selectedFormat}` }
    }
  } catch (error) {
    console.error("Report generation error:", error)
    return {
      success: false,
      message: `Failed to generate report: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Export individual module data
export function exportModuleData(moduleType: string, data: any, format: string): { success: boolean; message: string } {
  const config: ReportConfig = {
    selectedReports: [moduleType],
    selectedFormat: format,
    caseInfo: {
      caseNumber: "",
      investigator: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
    includeCharts: true,
    includeMaps: false,
    includeTables: true,
    includeSummary: true,
  }

  const reportData: ReportData = {}
  switch (moduleType) {
    case "cdr":
      reportData.cdr = data
      break
    case "tower":
      reportData.tower = data
      break
    case "drive":
      reportData.drive = data
      break
    case "mutual":
      reportData.mutual = data
      break
    case "geo":
      reportData.geo = data
      break
  }

  return exportReport(config, reportData)
}
