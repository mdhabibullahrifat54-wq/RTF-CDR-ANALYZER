// Utility Functions
class Utils {
    static formatPhoneNumber(number) {
        if (!number) return 'N/A';
        
        // Clean the number
        const cleaned = number.toString().replace(/\D/g, '');
        
        // Format based on length
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
        } else if (cleaned.length > 10) {
            return `+${cleaned}`;
        }
        
        return cleaned;
    }

    static formatDuration(seconds) {
        if (!seconds) return '0s';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    static formatDate(timestamp, includeTime = true) {
        if (!timestamp) return 'N/A';
        
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return date.toLocaleDateString('en-US', options);
    }

    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\D/g, ''));
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(resolve).catch(reject);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (error) {
                    reject(error);
                }
                document.body.removeChild(textArea);
            }
        });
    }

    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    static readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    static readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    static formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return num.toLocaleString();
    }

    static parseCSV(csvText, delimiter = ',') {
        const lines = csvText.split('\n');
        const result = [];
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const obj = {};
            const currentLine = lines[i].split(delimiter);

            for (let j = 0; j < headers.length; j++) {
                let value = currentLine[j] || '';
                value = value.trim().replace(/^"|"$/g, '');
                obj[headers[j]] = value;
            }

            result.push(obj);
        }

        return result;
    }

    static arrayToCSV(data, headers = null) {
        const actualHeaders = headers || Object.keys(data[0] || {});
        const csvContent = [
            actualHeaders.join(','),
            ...data.map(row => 
                actualHeaders.map(header => {
                    const value = row[header];
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        return csvContent;
    }

    static getColorForValue(value, maxValue) {
        const ratio = value / maxValue;
        const hue = ((1 - ratio) * 120).toString(10);
        return `hsl(${hue}, 100%, 50%)`;
    }

    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    static sortByKey(array, key, ascending = true) {
        return array.sort((a, b) => {
            if (a[key] < b[key]) return ascending ? -1 : 1;
            if (a[key] > b[key]) return ascending ? 1 : -1;
            return 0;
        });
    }

    static filterByDateRange(data, startDate, endDate, dateField = 'timestamp') {
        return data.filter(item => {
            const itemDate = new Date(item[dateField]);
            const start = startDate ? new Date(startDate) : new Date(-8640000000000000);
            const end = endDate ? new Date(endDate) : new Date(8640000000000000);
            
            return itemDate >= start && itemDate <= end;
        });
    }

    static calculatePercentile(array, percentile) {
        const sorted = array.slice().sort((a, b) => a - b);
        const index = (percentile / 100) * (sorted.length - 1);
        
        if (Math.floor(index) === index) {
            return sorted[index];
        }
        
        const lower = sorted[Math.floor(index)];
        const upper = sorted[Math.ceil(index)];
        return lower + (upper - lower) * (index - Math.floor(index));
    }

    static detectOutliers(array, threshold = 1.5) {
        const sorted = array.slice().sort((a, b) => a - b);
        const q1 = this.calculatePercentile(sorted, 25);
        const q3 = this.calculatePercentile(sorted, 75);
        const iqr = q3 - q1;
        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;
        
        return array.filter(value => value < lowerBound || value > upperBound);
    }

    static createLoadingIndicator(text = 'Loading...') {
        const loader = document.createElement('div');
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">${text}</div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            text-align: center;
        `;
        
        const spinner = loader.querySelector('.loading-spinner');
        spinner.style.cssText = `
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        `;
        
        document.body.appendChild(loader);
        return loader;
    }

    static removeLoadingIndicator(loader) {
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    }

    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
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
        
        const colors = {
            info: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        
        notification.style.background = colors[type] || colors.info;
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        return notification;
    }

    static isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        
        return {
            browser,
            isMobile: this.isMobileDevice(),
            isTouch: this.isTouchDevice(),
            userAgent: ua
        };
    }

    static measurePerformance(fn, ...args) {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        
        return {
            result,
            duration: end - start
        };
    }

    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static mergeObjects(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
}

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Make utils available globally
window.Utils = Utils;
