# Changelog

All notable changes to RTF Forensics Suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-06-04

### Added
- **Dual Theme Mode**: Light and dark theme support with system preference detection
- **Auto/Manual Column Mapping**: AI-powered automatic column detection with manual override option
- **Enhanced File Parser**: Support for multiple date formats, coordinate detection, and timeline generation
- **Timeline Visualization**: Daily and hourly activity charts in CDR Analyzer
- **Co-Presence Detection**: Find devices at same tower within configurable time windows
- **Mutual Communication Analysis**: Detect bidirectional calls and cluster interconnected numbers
- **Health Check API**: `/api/health` endpoint for deployment monitoring
- **Version API**: `/api/version` endpoint for version verification
- **Professional Reports**: Enhanced PDF generation with charts and analysis
- **Developer Credits**: Prominent developer attribution throughout the application
- **Session Management**: Track and manage analysis sessions with statistics

### Changed
- Upgraded Next.js from 15.x to 16.0.7
- Upgraded React to 19.2.0
- Enhanced column mapping with 30+ target columns
- Improved file parsing with better error handling
- Updated UI components for better accessibility
- Refactored data store with session tracking

### Fixed
- IMEI validation now accepts 14-15 digit formats
- Date parsing handles multiple international formats
- Column mapping saves/loads from localStorage correctly
- Theme persistence across page refreshes
- Mobile viewport scaling issues

### Security
- Input validation on all file uploads
- Sanitized data display to prevent XSS
- Rate limiting considerations for API endpoints

## [1.5.0] - 2025-05-15

### Added
- GEO Intelligence module with map visualization
- Drive Test Analyzer for route analysis
- Bangladesh thana/district selector
- Control panel for system administration

### Changed
- Improved sidebar navigation
- Enhanced login page design
- Better error messages

### Fixed
- File upload progress tracking
- Large file handling improvements

## [1.0.0] - 2025-04-01

### Added
- Initial release
- CDR Analyzer module
- Tower Dump Analyzer
- Basic reporting engine
- User authentication
- File upload with drag-and-drop

---

**Developer:** Rifat Ahmed
