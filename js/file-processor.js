// File Processing Engine
class FileProcessor {
    constructor() {
        this.supportedFormats = ['.xlsx', '.xls', '.csv', '.txt'];
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
    }

    async processFile(file) {
        this.validateFile(file);
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        let processedData;

        try {
            switch (fileExtension) {
                case '.xlsx':
                case '.xls':
                    processedData = await this.processExcelFile(file);
                    break;
                case '.csv':
                    processedData = await this.processCsvFile(file);
                    break;
                case '.txt':
                    processedData = await this.processTextFile(file);
                    break;
                default:
                    throw new Error('Unsupported file format');
            }

            return this.normalizeData(processedData);
            
        } catch (error) {
            throw new Error(`File processing failed: ${error.message}`);
        }
    }

    validateFile(file) {
        if (!file) {
            throw new Error('No file selected');
        }

        if (file.size > this.maxFileSize) {
            throw new Error('File size exceeds 50MB limit');
        }

        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!this.supportedFormats.includes(fileExtension)) {
            throw new Error('Unsupported file format');
        }
    }

    async processExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Get first sheet
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // Convert to JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    resolve(jsonData);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    async processCsvFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const csvText = e.target.result;
                    const lines = csvText.split('\n');
                    const result = [];
                    
                    // Parse CSV lines
                    lines.forEach(line => {
                        if (line.trim()) {
                            // Simple CSV parsing (can be enhanced for quoted fields)
                            const fields = line.split(',').map(field => field.trim());
                            result.push(fields);
                        }
                    });
                    
                    resolve(result);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    async processTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n');
                    const result = [];
                    
                    // Parse text file lines
                    lines.forEach(line => {
                        if (line.trim()) {
                            // Split by common delimiters
                            const fields = line.split(/[\t,;|]+/).map(field => field.trim());
                            result.push(fields);
                        }
                    });
                    
                    resolve(result);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    normalizeData(rawData) {
        if (!rawData || rawData.length < 2) {
            throw new Error('No data found in file');
        }

        const headers = this.detectHeaders(rawData[0]);
        const records = [];

        // Start from row 1 (skip headers)
        for (let i = 1; i < rawData.length; i++) {
            const row = rawData[i];
            if (row && row.length >= 3) { // Minimum required fields
                const record = this.parseRecord(row, headers);
                if (record) {
                    records.push(record);
                }
            }
        }

        if (records.length === 0) {
            throw new Error('No valid CDR records found');
        }

        return {
            rawData: rawData,
            headers: headers,
            records: records,
            totalRecords: records.length,
            fileInfo: {
                processedAt: new Date().toISOString(),
                recordCount: records.length
            }
        };
    }

    detectHeaders(firstRow) {
        const headerMap = {
            'timestamp': ['timestamp', 'date', 'time', 'datetime'],
            'caller': ['caller', 'a-party', 'aparty', 'from', 'source'],
            'receiver': ['receiver', 'b-party', 'bparty', 'to', 'destination'],
            'duration': ['duration', 'call duration', 'call_duration'],
            'type': ['type', 'call type', 'service', 'service type'],
            'location': ['location', 'cell', 'bts', 'lac', 'ci'],
            'imei': ['imei', 'device', 'equipment']
        };

        const headers = {};
        const firstRowLower = firstRow.map(h => h.toString().toLowerCase().trim());

        Object.keys(headerMap).forEach(key => {
            const foundIndex = firstRowLower.findIndex(header => 
                headerMap[key].some(alias => header.includes(alias))
            );
            headers[key] = foundIndex !== -1 ? foundIndex : null;
        });

        return headers;
    }

    parseRecord(row, headers) {
        try {
            const record = {};

            // Parse timestamp
            if (headers.timestamp !== null) {
                record.timestamp = this.parseTimestamp(row[headers.timestamp]);
            }

            // Parse caller number
            if (headers.caller !== null) {
                record.caller = this.parsePhoneNumber(row[headers.caller]);
            }

            // Parse receiver number
            if (headers.receiver !== null) {
                record.receiver = this.parsePhoneNumber(row[headers.receiver]);
            }

            // Parse duration
            if (headers.duration !== null) {
                record.duration = this.parseDuration(row[headers.duration]);
            }

            // Parse call type
            if (headers.type !== null) {
                record.type = this.parseCallType(row[headers.type]);
            }

            // Parse location
            if (headers.location !== null) {
                record.location = this.parseLocation(row[headers.location]);
            }

            // Parse IMEI
            if (headers.imei !== null) {
                record.imei = this.parseImei(row[headers.imei]);
            }

            // Add raw data for reference
            record.raw = row;

            return record;

        } catch (error) {
            console.warn('Failed to parse record:', row, error);
            return null;
        }
    }

    parseTimestamp(timestampStr) {
        if (!timestampStr) return null;
        
        // Try various date formats
        const date = new Date(timestampStr);
        return isNaN(date.getTime()) ? null : date.getTime();
    }

    parsePhoneNumber(numberStr) {
        if (!numberStr) return null;
        
        // Clean phone number - remove non-digit characters except +
        let cleaned = numberStr.toString().replace(/[^\d+]/g, '');
        
        // Handle international numbers
        if (cleaned.startsWith('+')) {
            return cleaned;
        }
        
        // Handle local numbers
        if (cleaned.length >= 10) {
            return cleaned.slice(-10); // Take last 10 digits
        }
        
        return cleaned || null;
    }

    parseDuration(durationStr) {
        if (!durationStr) return 0;
        
        const str = durationStr.toString().toLowerCase();
        
        // Handle seconds
        if (str.includes('sec') || !isNaN(parseInt(str))) {
            return parseInt(str) || 0;
        }
        
        // Handle MM:SS format
        if (str.includes(':')) {
            const parts = str.split(':');
            if (parts.length === 2) {
                return parseInt(parts[0]) * 60 + parseInt(parts[1]);
            }
        }
        
        return 0;
    }

    parseCallType(typeStr) {
        if (!typeStr) return 'Unknown';
        
        const type = typeStr.toString().toLowerCase();
        
        if (type.includes('voice') || type.includes('call')) return 'Voice';
        if (type.includes('sms') || type.includes('message')) return 'SMS';
        if (type.includes('data')) return 'Data';
        if (type.includes('moc')) return 'Voice'; // Mobile Originated Call
        if (type.includes('mtc')) return 'Voice'; // Mobile Terminated Call
        
        return 'Unknown';
    }

    parseLocation(locationStr) {
        if (!locationStr) return null;
        return locationStr.toString().trim();
    }

    parseImei(imeiStr) {
        if (!imeiStr) return null;
        
        // Basic IMEI validation (15 digits)
        const imei = imeiStr.toString().replace(/\D/g, '');
        return imei.length === 15 ? imei : null;
    }

    // Method to manually map columns if auto-detection fails
    manualColumnMapping(headers, userMapping) {
        Object.keys(userMapping).forEach(key => {
            if (userMapping[key] !== null && userMapping[key] >= 0) {
                headers[key] = userMapping[key];
            }
        });
        return headers;
    }
}
