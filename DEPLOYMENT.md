# RTF Forensics Suite - Deployment Guide

## Quick Deploy to Vercel

1. Click the **Publish** button in v0
2. Follow the prompts to deploy to Vercel
3. Your app will be live in minutes!

## Manual Deployment

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

\`\`\`bash
# Clone or download the project
git clone <repository-url>
cd rtf-forensics-suite

# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Environment Variables

Create a \`.env.local\` file (optional):

\`\`\`env
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_NAME=RTF Forensics Suite
\`\`\`

### Docker Deployment

\`\`\`dockerfile
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

Build and run:

\`\`\`bash
docker build -t rtf-forensics-suite .
docker run -p 3000:3000 rtf-forensics-suite
\`\`\`

## Post-Deployment Verification

### Health Check

\`\`\`bash
curl https://your-domain.com/api/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "healthy",
  "service": "RTF Forensics Suite",
  "version": "2.0.0"
}
\`\`\`

### Version Check

\`\`\`bash
curl https://your-domain.com/api/version
\`\`\`

## Default Credentials

### Main Application
- **Police Station:** Select any from dropdown
- **Password:** admin123

### Control Panel
- **Username:** rifat_admin
- **Password:** admin123

**Important:** Change these credentials immediately after deployment!

## Features Included

- CDR Analysis with timeline charts
- Tower Dump with co-presence detection
- Drive Test route analysis
- Mutual Communication clustering
- GEO Intelligence mapping
- PDF Report generation
- Light/Dark theme support
- Auto/Manual column mapping

## Support

For issues or questions, contact the development team.

---

**RTF Forensics Suite v2.0.0**  
Developed by **Rifat Ahmed**
\`\`\`
