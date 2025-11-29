// Export Manager
class ExportManager {
    constructor() {
        this.formats = {
            EXCEL: 'xlsx',
            PDF: 'pdf',
            CSV: 'csv'
        };
    }

    // Export contacts to Excel
    exportContacts(contacts, filename = 'cdr_contacts') {
        try {
            const wb = XLSX.utils.book_new();
            
            // Prepare data for Excel
            const excelData = contacts.map(contact => ({
                'Rank': contact.rank,
                'Phone Number': contact.number,
                'Call Count': contact.count,
                'Total Duration (seconds)': contact.totalDuration,
                'Average Duration (seconds)': Math.round(contact.totalDuration / contact.count),
                'Location Count': contact.locationCount,
                'First Contact': contact.firstContact ? new Date(contact.firstContact).toLocaleString() : 'N/A',
                'Last Contact': contact.lastContact ? new Date(contact.lastContact).toLocaleString() : 'N/A',
                'Call Types': Object.entries(contact.callTypes).map(([type, count]) => `${type}: ${count}`).join(', ')
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, 'Contact Analysis');
            
            // Generate and download
            XLSX.writeFile(wb, `${filename}.xlsx`);
            
            this.showExportSuccess(`${filename}.xlsx`);
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showExportError('Failed to export contacts');
        }
    }

    // Export filtered data
    exportFilteredData(data, filename = 'filtered_results') {
        try {
            const wb = XLSX.utils.book_new();
            
            const excelData = data.map(record => ({
                'Timestamp': record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A',
                'Caller': record.caller || 'N/A',
                'Receiver': record.receiver || 'N/A',
                'Duration (seconds)': record.duration || 0,
                'Call Type': record.type || 'Unknown',
                'Location': record.location || 'N/A',
                'IMEI': record.imei || 'N/A'
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, 'Filtered Results');
            
            XLSX.writeFile(wb, `${filename}.xlsx`);
            this.showExportSuccess(`${filename}.xlsx`);
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showExportError('Failed to export filtered data');
        }
    }

    // Export complete analysis report
    exportAnalysisReport(analysis, filename = 'cdr_analysis_report') {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            let yPosition = 20;
            
            // Title
            doc.setFontSize(20);
            doc.setTextColor(52, 152, 219);
            doc.text('CDR Analysis Report', 20, yPosition);
            yPosition += 15;
            
            // Report Info
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
            yPosition += 20;
            
            // Basic Statistics
            doc.setFontSize(16);
            doc.setTextColor(44, 62, 80);
            doc.text('Basic Statistics', 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const basicStats = [
                `Total Calls: ${analysis.basic.totalCalls.toLocaleString()}`,
                `Unique Contacts: ${analysis.basic.uniqueContacts.toLocaleString()}`,
                `Unique Locations: ${analysis.basic.uniqueLocations.toLocaleString()}`,
                `Unique Devices: ${analysis.basic.uniqueDevices.toLocaleString()}`,
                `Total Duration: ${this.formatDuration(analysis.basic.totalDuration)}`,
                `International Calls: ${analysis.basic.internationalCalls}`
            ];
            
            basicStats.forEach(stat => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(stat, 25, yPosition);
                yPosition += 7;
            });
            
            yPosition += 10;
            
            // Top Contacts
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(16);
            doc.setTextColor(44, 62, 80);
            doc.text('Top 10 Contacts', 20, yPosition);
            yPosition += 15;
            
            const topContacts = analysis.contacts.slice(0, 10);
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            
            // Table headers
            doc.text('Rank', 25, yPosition);
            doc.text('Number', 40, yPosition);
            doc.text('Calls', 80, yPosition);
            doc.text('Duration', 100, yPosition);
            doc.text('Locations', 130, yPosition);
            yPosition += 5;
            
            // Table rows
            topContacts.forEach((contact, index) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                    // Repeat headers
                    doc.text('Rank', 25, yPosition);
                    doc.text('Number', 40, yPosition);
                    doc.text('Calls', 80, yPosition);
                    doc.text('Duration', 100, yPosition);
                    doc.text('Locations', 130, yPosition);
                    yPosition += 5;
                }
                
                doc.text((index + 1).toString(), 25, yPosition);
                doc.text(this.shortenText(contact.number, 15), 40, yPosition);
                doc.text(contact.count.toString(), 80, yPosition);
                doc.text(this.formatDuration(contact.totalDuration), 100, yPosition);
                doc.text(contact.locationCount.toString(), 130, yPosition);
                yPosition += 5;
            });
            
            // Save PDF
            doc.save(`${filename}.pdf`);
            this.showExportSuccess(`${filename}.pdf`);
            
        } catch (error) {
            console.error('PDF export failed:', error);
            this.showExportError('Failed to generate PDF report');
        }
    }

    // Export charts as images
    exportCharts(chartManager, prefix = 'cdr_charts') {
        try {
            let chartCount = 0;
            
            chartManager.charts.forEach((chart, chartId) => {
                try {
                    const image = chart.toBase64Image();
                    this.downloadImage(image, `${prefix}_${chartId}.png`);
                    chartCount++;
                } catch (error) {
                    console.error(`Failed to export chart ${chartId}:`, error);
                }
            });
            
            if (chartCount > 0) {
                this.showExportSuccess(`${chartCount} charts exported`);
            } else {
                this.showExportError('No charts available to export');
            }
            
        } catch (error) {
            console.error('Chart export failed:', error);
            this.showExportError('Failed to export charts');
        }
    }

    // Export raw data
    exportRawData(cdrData, filename = 'cdr_raw_data') {
        try {
            const wb = XLSX.utils.book_new();
            
            // Add processed data sheet
            const processedData = cdrData.records.map(record => ({
                'Timestamp': record.timestamp ? new Date(record.timestamp).toLocaleString() : '',
                'Caller': record.caller || '',
                'Receiver': record.receiver || '',
                'Duration (seconds)': record.duration || 0,
                'Call Type': record.type || '',
                'Location': record.location || '',
                'IMEI': record.imei || ''
            }));
            
            const processedWs = XLSX.utils.json_to_sheet(processedData);
            XLSX.utils.book_append_sheet(wb, processedWs, 'Processed Data');
            
            // Add raw data sheet if available
            if (cdrData.rawData && cdrData.rawData.length > 0) {
                const rawWs = XLSX.utils.aoa_to_sheet(cdrData.rawData);
                XLSX.utils.book_append_sheet(wb, rawWs, 'Raw Data');
            }
            
            XLSX.writeFile(wb, `${filename}.xlsx`);
            this.showExportSuccess(`${filename}.xlsx`);
            
        } catch (error) {
            console.error('Raw data export failed:', error);
            this.showExportError('Failed to export raw data');
        }
    }

    // Export to CSV
    exportToCSV(data, filename = 'cdr_data') {
        try {
            if (!data || data.length === 0) {
                throw new Error('No data to export');
            }
            
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => {
                        const value = row[header];
                        // Handle values that might contain commas
                        if (typeof value === 'string' && value.includes(',')) {
                            return `"${value}"`;
                        }
                        return value;
                    }).join(',')
                )
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            this.downloadBlob(blob, `${filename}.csv`);
            this.showExportSuccess(`${filename}.csv`);
            
        } catch (error) {
            console.error('CSV export failed:', error);
            this.showExportError('Failed to export CSV');
        }
    }

    // Utility Methods
    downloadImage(imageData, filename) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadBlob(blob, filename) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    formatDuration(seconds) {
        if (!seconds) return '0s';
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    shortenText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    showExportSuccess(filename) {
        this.showMessage(`Successfully exported: ${filename}`, 'success');
    }

    showExportError(message) {
        this.showMessage(`Export failed: ${message}`, 'error');
    }

    showMessage(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = '#27ae60';
        } else {
            notification.style.background = '#e74c3c';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Batch export multiple formats
    async batchExport(analysis, cdrData, formats = ['xlsx', 'pdf']) {
        const exportPromises = [];
        
        if (formats.includes('xlsx')) {
            exportPromises.push(this.exportContacts(analysis.contacts.slice(0, 50), 'cdr_contacts'));
        }
        
        if (formats.includes('pdf')) {
            exportPromises.push(this.exportAnalysisReport(analysis));
        }
        
        if (formats.includes('csv')) {
            exportPromises.push(this.exportToCSV(analysis.contacts.slice(0, 50), 'cdr_contacts'));
        }
        
        try {
            await Promise.all(exportPromises);
            this.showMessage('Batch export completed successfully', 'success');
        } catch (error) {
            console.error('Batch export failed:', error);
            this.showExportError('Batch export partially failed');
        }
    }
}

// Initialize export manager
document.addEventListener('DOMContentLoaded', () => {
    window.exportManager = new ExportManager();
});
