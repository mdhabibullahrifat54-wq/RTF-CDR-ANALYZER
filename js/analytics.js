// Analytics Engine
class AnalyticsEngine {
    constructor() {
        this.data = null;
        this.cache = new Map();
    }

    analyzeData(cdrData) {
        this.data = cdrData;
        this.cache.clear();

        const analysis = {
            basic: this.getBasicAnalytics(),
            contacts: this.getContactAnalysis(),
            locations: this.getLocationAnalysis(),
            temporal: this.getTemporalAnalysis(),
            devices: this.getDeviceAnalysis(),
            charts: this.getChartData()
        };

        return analysis;
    }

    getBasicAnalytics() {
        const cacheKey = 'basic';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const records = this.data.records;
        
        const basicStats = {
            totalCalls: records.length,
            uniqueContacts: this.getUniqueContacts().size,
            uniqueLocations: this.getUniqueLocations().size,
            uniqueDevices: this.getUniqueDevices().size,
            dateRange: this.getDateRange(),
            totalDuration: this.getTotalDuration(),
            internationalCalls: this.getInternationalCallCount()
        };

        this.cache.set(cacheKey, basicStats);
        return basicStats;
    }

    getContactAnalysis() {
        const cacheKey = 'contacts';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const contactMap = new Map();

        this.data.records.forEach(record => {
            if (record.receiver) {
                const number = record.receiver;
                if (!contactMap.has(number)) {
                    contactMap.set(number, {
                        number: number,
                        count: 0,
                        totalDuration: 0,
                        callTypes: {},
                        firstContact: null,
                        lastContact: null,
                        locations: new Set()
                    });
                }

                const contact = contactMap.get(number);
                contact.count++;
                contact.totalDuration += record.duration || 0;
                
                // Track call types
                const callType = record.type || 'Unknown';
                contact.callTypes[callType] = (contact.callTypes[callType] || 0) + 1;
                
                // Track dates
                if (record.timestamp) {
                    if (!contact.firstContact || record.timestamp < contact.firstContact) {
                        contact.firstContact = record.timestamp;
                    }
                    if (!contact.lastContact || record.timestamp > contact.lastContact) {
                        contact.lastContact = record.timestamp;
                    }
                }

                // Track locations
                if (record.location) {
                    contact.locations.add(record.location);
                }
            }
        });

        const contacts = Array.from(contactMap.values()).map(contact => ({
            ...contact,
            locations: Array.from(contact.locations),
            locationCount: contact.locations.size
        }));

        this.cache.set(cacheKey, contacts);
        return contacts;
    }

    getTopContacts(limit = 10) {
        const contacts = this.getContactAnalysis();
        return contacts
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
            .map((contact, index) => ({
                rank: index + 1,
                ...contact
            }));
    }

    getLocationAnalysis() {
        const cacheKey = 'locations';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const locationMap = new Map();

        this.data.records.forEach(record => {
            if (record.location) {
                const location = record.location;
                if (!locationMap.has(location)) {
                    locationMap.set(location, {
                        location: location,
                        count: 0,
                        uniqueCallers: new Set(),
                        firstSeen: null,
                        lastSeen: null,
                        callTypes: {}
                    });
                }

                const loc = locationMap.get(location);
                loc.count++;
                
                if (record.caller) {
                    loc.uniqueCallers.add(record.caller);
                }

                if (record.timestamp) {
                    if (!loc.firstSeen || record.timestamp < loc.firstSeen) {
                        loc.firstSeen = record.timestamp;
                    }
                    if (!loc.lastSeen || record.timestamp > loc.lastSeen) {
                        loc.lastSeen = record.timestamp;
                    }
                }

                const callType = record.type || 'Unknown';
                loc.callTypes[callType] = (loc.callTypes[callType] || 0) + 1;
            }
        });

        const locations = Array.from(locationMap.values()).map(loc => ({
            ...loc,
            uniqueCallerCount: loc.uniqueCallers.size,
            uniqueCallers: Array.from(loc.uniqueCallers)
        }));

        this.cache.set(cacheKey, locations);
        return locations;
    }

    getTemporalAnalysis() {
        const cacheKey = 'temporal';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const hourlyDistribution = Array(24).fill(0);
        const dailyDistribution = Array(7).fill(0);
        const callTypesByHour = {};
        const durationByHour = Array(24).fill(0);
        const callCountByHour = Array(24).fill(0);

        this.data.records.forEach(record => {
            if (record.timestamp) {
                const date = new Date(record.timestamp);
                const hour = date.getHours();
                const day = date.getDay();

                // Hourly distribution
                hourlyDistribution[hour]++;
                
                // Daily distribution
                dailyDistribution[day]++;
                
                // Duration by hour
                durationByHour[hour] += record.duration || 0;
                callCountByHour[hour]++;
                
                // Call types by hour
                if (!callTypesByHour[hour]) {
                    callTypesByHour[hour] = {};
                }
                const callType = record.type || 'Unknown';
                callTypesByHour[hour][callType] = (callTypesByHour[hour][callType] || 0) + 1;
            }
        });

        const temporalData = {
            hourlyDistribution,
            dailyDistribution,
            callTypesByHour,
            averageDurationByHour: durationByHour.map((total, hour) => 
                callCountByHour[hour] > 0 ? Math.round(total / callCountByHour[hour]) : 0
            ),
            peakHours: this.findPeakHours(hourlyDistribution),
            peakDays: this.findPeakDays(dailyDistribution)
        };

        this.cache.set(cacheKey, temporalData);
        return temporalData;
    }

    getDeviceAnalysis() {
        const cacheKey = 'devices';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const deviceMap = new Map();

        this.data.records.forEach(record => {
            if (record.imei) {
                const imei = record.imei;
                if (!deviceMap.has(imei)) {
                    deviceMap.set(imei, {
                        imei: imei,
                        callCount: 0,
                        totalDuration: 0,
                        uniqueNumbers: new Set(),
                        locations: new Set(),
                        firstUsed: null,
                        lastUsed: null
                    });
                }

                const device = deviceMap.get(imei);
                device.callCount++;
                device.totalDuration += record.duration || 0;
                
                if (record.caller) {
                    device.uniqueNumbers.add(record.caller);
                }
                if (record.location) {
                    device.locations.add(record.location);
                }
                if (record.timestamp) {
                    if (!device.firstUsed || record.timestamp < device.firstUsed) {
                        device.firstUsed = record.timestamp;
                    }
                    if (!device.lastUsed || record.timestamp > device.lastUsed) {
                        device.lastUsed = record.timestamp;
                    }
                }
            }
        });

        const devices = Array.from(deviceMap.values()).map(device => ({
            ...device,
            uniqueNumberCount: device.uniqueNumbers.size,
            locationCount: device.locations.size,
            averageCallDuration: device.callCount > 0 ? 
                Math.round(device.totalDuration / device.callCount) : 0
        }));

        this.cache.set(cacheKey, devices);
        return devices;
    }

    getChartData() {
        return {
            callTypeDistribution: this.getCallTypeDistribution(),
            timeDistribution: this.getTimeDistribution(),
            contactFrequency: this.getContactFrequencyData(),
            durationDistribution: this.getDurationDistribution()
        };
    }

    getCallTypeDistribution() {
        const typeCount = {};
        
        this.data.records.forEach(record => {
            const type = record.type || 'Unknown';
            typeCount[type] = (typeCount[type] || 0) + 1;
        });

        return {
            labels: Object.keys(typeCount),
            data: Object.values(typeCount),
            colors: this.generateColors(Object.keys(typeCount).length)
        };
    }

    getTimeDistribution() {
        const temporal = this.getTemporalAnalysis();
        return {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            data: temporal.hourlyDistribution,
            color: '#3498db'
        };
    }

    getContactFrequencyData() {
        const contacts = this.getContactAnalysis();
        const frequencyData = contacts
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
            
        return {
            labels: frequencyData.map(c => c.number),
            data: frequencyData.map(c => c.count),
            colors: this.generateColors(frequencyData.length)
        };
    }

    getDurationDistribution() {
        const durationRanges = [
            { label: '< 1min', min: 0, max: 60, count: 0 },
            { label: '1-5min', min: 60, max: 300, count: 0 },
            { label: '5-15min', min: 300, max: 900, count: 0 },
            { label: '15-30min', min: 900, max: 1800, count: 0 },
            { label: '30+ min', min: 1800, max: Infinity, count: 0 }
        ];

        this.data.records.forEach(record => {
            const duration = record.duration || 0;
            for (const range of durationRanges) {
                if (duration >= range.min && duration < range.max) {
                    range.count++;
                    break;
                }
            }
        });

        return {
            labels: durationRanges.map(r => r.label),
            data: durationRanges.map(r => r.count),
            colors: this.generateColors(durationRanges.length)
        };
    }

    // Search and Filter Methods
    searchByLocation(lac, ci = null) {
        return this.data.records.filter(record => {
            if (!record.location) return false;
            
            if (ci) {
                return record.location.includes(lac) && record.location.includes(ci);
            } else {
                return record.location.includes(lac);
            }
        });
    }

    searchByNumber(phoneNumber) {
        const cleanNumber = this.cleanPhoneNumber(phoneNumber);
        return this.data.records.filter(record => 
            record.caller === cleanNumber || record.receiver === cleanNumber
        );
    }

    searchByImei(imei) {
        return this.data.records.filter(record => record.imei === imei);
    }

    applyFilters(filters) {
        let filteredData = this.data.records;

        // Date range filter
        if (filters.startDate || filters.endDate) {
            filteredData = filteredData.filter(record => {
                if (!record.timestamp) return false;
                
                const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
                const startMatch = !filters.startDate || recordDate >= filters.startDate;
                const endMatch = !filters.endDate || recordDate <= filters.endDate;
                
                return startMatch && endMatch;
            });
        }

        // Phone number filter
        if (filters.phoneNumber) {
            const cleanNumber = this.cleanPhoneNumber(filters.phoneNumber);
            filteredData = filteredData.filter(record =>
                record.caller?.includes(cleanNumber) || record.receiver?.includes(cleanNumber)
            );
        }

        // Call type filter
        if (filters.callType) {
            filteredData = filteredData.filter(record => record.type === filters.callType);
        }

        // Location filter
        if (filters.location) {
            filteredData = filteredData.filter(record =>
                record.location?.includes(filters.location)
            );
        }

        return filteredData;
    }

    // Utility Methods
    getUniqueContacts() {
        const contacts = new Set();
        this.data.records.forEach(record => {
            if (record.caller) contacts.add(record.caller);
            if (record.receiver) contacts.add(record.receiver);
        });
        return contacts;
    }

    getUniqueLocations() {
        const locations = new Set();
        this.data.records.forEach(record => {
            if (record.location) locations.add(record.location);
        });
        return locations;
    }

    getUniqueDevices() {
        const devices = new Set();
        this.data.records.forEach(record => {
            if (record.imei) devices.add(record.imei);
        });
        return devices;
    }

    getDateRange() {
        let minDate = Infinity;
        let maxDate = -Infinity;

        this.data.records.forEach(record => {
            if (record.timestamp) {
                if (record.timestamp < minDate) minDate = record.timestamp;
                if (record.timestamp > maxDate) maxDate = record.timestamp;
            }
        });

        return {
            start: minDate !== Infinity ? new Date(minDate) : null,
            end: maxDate !== -Infinity ? new Date(maxDate) : null
        };
    }

    getTotalDuration() {
        return this.data.records.reduce((total, record) => total + (record.duration || 0), 0);
    }

    getInternationalCallCount() {
        return this.data.records.filter(record => 
            record.receiver?.startsWith('+') || record.caller?.startsWith('+')
        ).length;
    }

    findPeakHours(hourlyDistribution) {
        const maxCalls = Math.max(...hourlyDistribution);
        return hourlyDistribution
            .map((count, hour) => ({ hour, count }))
            .filter(item => item.count === maxCalls)
            .map(item => item.hour);
    }

    findPeakDays(dailyDistribution) {
        const maxCalls = Math.max(...dailyDistribution);
        return dailyDistribution
            .map((count, day) => ({ day, count }))
            .filter(item => item.count === maxCalls)
            .map(item => item.day);
    }

    cleanPhoneNumber(number) {
        return number.toString().replace(/[^\d+]/g, '');
    }

    generateColors(count) {
        const baseColors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
            '#1abc9c', '#34495e', '#d35400', '#c0392b', '#16a085'
        ];
        
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    }

    getDurationAnalysis() {
        const recordsWithDuration = this.data.records.filter(r => r.duration && r.duration > 0);
        const durations = recordsWithDuration.map(r => r.duration);
        
        return {
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            median: this.calculateMedian(durations),
            min: Math.min(...durations),
            max: Math.max(...durations),
            total: durations.reduce((a, b) => a + b, 0)
        };
    }

    calculateMedian(numbers) {
        const sorted = numbers.slice().sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        
        return sorted[middle];
    }
}
