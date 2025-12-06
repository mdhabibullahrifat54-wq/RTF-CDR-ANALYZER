# RTF Forensics Suite v2.0

Professional Telecom Forensics Analysis Platform for law enforcement and investigation agencies.

## Overview

RTF Forensics Suite is a comprehensive telecom analysis platform designed for investigators and law enforcement agencies. It provides powerful tools for analyzing Call Detail Records (CDR), tower dumps, drive tests, and generating geo-intelligence reports.

**Developer:** Rifat Ahmed

## Features

- **CDR Analyzer** - Parse and analyze call detail records with timeline visualization
- **Tower Dump Analysis** - Analyze cell tower data with hit frequency and co-presence detection
- **Drive Test Analyzer** - Route analysis and coverage mapping
- **Mutual Communication** - Link analysis between multiple numbers
- **GEO Intelligence** - Map visualization with tower locations and movement patterns
- **Report Generation** - Professional PDF reports with charts and analysis

## Tech Stack

- **Framework:** Next.js 16.0.7
- **UI:** React 19.2, Tailwind CSS, shadcn/ui
- **Charts:** Recharts
- **Maps:** Leaflet
- **PDF Generation:** jsPDF

## Installation

### Using shadcn CLI (Recommended)

\`\`\`bash
npx shadcn@latest init
\`\`\`

### Manual Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## Environment Variables

Create a `.env.local` file:

\`\`\`env
# Application
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_NAME=RTF Forensics Suite

# Optional: API endpoints
# API_BASE_URL=https://api.example.com
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── control-panel/     # Admin control panel
│   └── page.tsx           # Main entry point
├── components/            # React components
│   ├── modules/           # Feature modules
│   └── ui/                # UI components
├── lib/                   # Utilities and helpers
│   ├── auth-context.tsx   # Authentication
│   ├── data-store.tsx     # State management
│   ├── file-parser.ts     # File parsing utilities
│   └── column-mapping.ts  # Column mapping logic
└── public/                # Static assets
\`\`\`

## Modules

### CDR Analyzer
- Upload and parse CDR files (CSV, Excel)
- Auto/Manual column mapping
- Timeline visualization
- Call pattern analysis

### Tower Dump Analyzer
- Cell tower data analysis
- Hit frequency charts
- Co-presence detection
- Multiple file comparison

### Mutual Communication
- Two-file analysis
- Mutual contact detection
- Cluster analysis
- Communication pattern visualization

### GEO Intelligence
- Interactive map visualization
- Tower location plotting
- Movement pattern analysis
- Heat maps

### Report Engine
- Professional PDF generation
- Multiple report templates
- Custom branding
- Chart exports

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/version` | GET | Version info |

## Deployment

### Vercel (Recommended)

Click the "Publish" button in v0 or deploy via Vercel CLI:

\`\`\`bash
vercel deploy
\`\`\`

### Docker

\`\`\`bash
docker build -t rtf-forensics-suite .
docker run -p 3000:3000 rtf-forensics-suite
\`\`\`

## Testing

\`\`\`bash
# Run tests
npm test

# Run linting
npm run lint

# Type check
npm run type-check
\`\`\`

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

Proprietary - All rights reserved.

## Support

For support inquiries, contact the development team.

---

**RTF Forensics Suite v2.0** - Professional Telecom Analysis Platform  
Developed by **Rifat Ahmed**
