// Dashboard Management System
class Dashboard {
    constructor() {
        this.currentTab = 'dashboard';
        this.cdrData = null;
        this.analytics = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeModules();
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // File upload
        document.getElementById('browseBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // Initialize analytics module
        this.analytics = new AnalyticsEngine();
    }

    switchTab(e) {
        const targetTab = e.target.closest('.tab-btn').dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.closest('.tab-btn').classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');

        this.currentTab = targetTab;

        // Load tab-specific content
        this.loadTabContent(targetTab);
    }

    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['.xlsx', '.xls', '.csv', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            alert('Please select a valid file type: Excel, CSV, or Text file.');
            return;
        }

        try {
            this.showLoading('Processing file...');
            
            const fileProcessor = new FileProcessor();
            this.cdrData = await fileProcessor.processFile(file);
            
            // Run analytics
            const analysisResults = this.analytics.analyzeData(this.cdrData);
            
            // Update dashboard
            this.updateDashboard(analysisResults);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file: ' + error.message);
            this.hideLoading();
        }
    }

    updateDashboard(analysis) {
        // Update statistics cards
        document.getElementById('totalCalls').textContent = analysis.basic.totalCalls.toLocaleString();
        document.getElementById('uniqueContacts').textContent = analysis.basic.uniqueContacts.toLocaleString();
        document.getElementById('uniqueLocations').textContent = analysis.basic.uniqueLocations.toLocaleString();
        document.getElementById('uniqueDevices').textContent = analysis.basic.uniqueDevices.toLocaleString();

        // Show statistics and charts sections
        document.getElementById('statsSection').classList.remove('hidden');
        document.getElementById('quickCharts').classList.remove('hidden');

        // Update charts
        this.updateCharts(analysis);
    }

    updateCharts(analysis) {
        const chartManager = new ChartManager();
        
        // Call Type Distribution Chart
        chartManager.createCallTypeChart(analysis.charts.callTypeDistribution);
        
        // Time Distribution Chart
        chartManager.createTimeDistributionChart(analysis.charts.timeDistribution);
    }

    loadTabContent(tabName) {
        switch (tabName) {
            case 'track':
                this.loadTrackTraceContent();
                break;
            case 'contacts':
                this.loadContactAnalysisContent();
                break;
            case 'graphs':
                this.loadGraphsContent();
                break;
            case 'search':
                this.loadSearchContent();
                break;
        }
    }

    loadTrackTraceContent() {
        const section = document.querySelector('#track .analysis-section');
        if (!this.cdrData) {
            section.innerHTML = this.getNoDataMessage();
            return;
        }

        section.innerHTML = `
            <div class="search-options">
                <div class="search-type-selector">
                    <h3>Search By:</h3>
                    <div class="search-tabs">
                        <button class="search-tab active" data-type="location">Location (LAC/CI)</button>
                        <button class="search-tab" data-type="number">Phone Number</button>
                        <button class="search-tab" data-type="imei">IMEI Device</button>
                    </div>
                </div>
                
                <div id="searchForms">
                    <!-- Search forms will be loaded here based on type -->
                </div>
                
                <div id="searchResults" class="search-results">
                    <!-- Results will be displayed here -->
                </div>
            </div>
        `;

        this.bindSearchEvents();
    }

    loadContactAnalysisContent() {
        const section = document.querySelector('#contacts .analysis-section');
        if (!this.cdrData) {
            section.innerHTML = this.getNoDataMessage();
            return;
        }

        const topContacts = this.analytics.getTopContacts(20);
        
        section.innerHTML = `
            <div class="contact-analysis">
                <div class="analysis-controls">
                    <div class="control-group">
                        <label>Show Top:</label>
                        <select id="contactLimit">
                            <option value="10">10 Contacts</option>
                            <option value="20" selected>20 Contacts</option>
                            <option value="50">50 Contacts</option>
                        </select>
                    </div>
                    <button id="exportContacts" class="export-btn">
                        <i class="fas fa-download"></i> Export Contacts
                    </button>
                </div>
                
                <div class="contacts-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Phone Number</th>
                                <th>Call Count</th>
                                <th>Total Duration</th>
                                <th>Call Types</th>
                                <th>First Contact</th>
                                <th>Last Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topContacts.map((contact, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${contact.number}</td>
                                    <td>${contact.count}</td>
                                    <td>${this.formatDuration(contact.totalDuration)}</td>
                                    <td>${this.formatCallTypes(contact.callTypes)}</td>
                                    <td>${this.formatDate(contact.firstContact)}</td>
                                    <td>${this.formatDate(contact.lastContact)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.bindContactEvents();
    }

    loadGraphsContent() {
        const section = document.querySelector('#graphs .analysis-section');
        if (!this.cdrData) {
            section.innerHTML = this.getNoDataMessage();
            return;
        }

        section.innerHTML = `
            <div class="graphs-container">
                <div class="graph-controls">
                    <h3>Visualization Options</h3>
                    <div class="graph-buttons">
                        <button class="graph-btn active" data-graph="relationship">Contact Relationship</button>
                        <button class="graph-btn" data-graph="duration">Call Duration Analysis</button>
                        <button class="graph-btn" data-graph="location">Location Patterns</button>
                        <button class="graph-btn" data-graph="temporal">Temporal Analysis</button>
                    </div>
                </div>
                
                <div class="graph-display">
                    <canvas id="advancedChart" width="800" height="400"></canvas>
                </div>
            </div>
        `;

        this.bindGraphEvents();
    }

    loadSearchContent() {
        const section = document.querySelector('#search .analysis-section');
        section.innerHTML = `
            <div class="advanced-search">
                <div class="search-filters">
                    <h3>Advanced Search Filters</h3>
                    
                    <div class="filter-grid">
                        <div class="filter-group">
                            <label>Date Range:</label>
                            <input type="date" id="startDate">
                            <input type="date" id="endDate">
                        </div>
                        
                        <div class="filter-group">
                            <label>Phone Number:</label>
                            <input type="text" id="phoneFilter" placeholder="Search number...">
                        </div>
                        
                        <div class="filter-group">
                            <label>Call Type:</label>
                            <select id="callTypeFilter">
                                <option value="">All Types</option>
                                <option value="Voice">Voice Call</option>
                                <option value="SMS">SMS</option>
                                <option value="Data">Data</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Location (LAC/CI):</label>
                            <input type="text" id="locationFilter" placeholder="LAC or CI...">
                        </div>
                    </div>
                    
                    <button id="applyFilters" class="search-btn">
                        <i class="fas fa-search"></i> Apply Filters
                    </button>
                </div>
                
                <div id="filterResults" class="filter-results">
                    <p>Upload a CDR file and apply filters to see results</p>
                </div>
            </div>
        `;

        this.bindSearchFilterEvents();
    }

    bindSearchEvents() {
        // Search tab switching
        document.querySelectorAll('.search-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.loadSearchForm(e.target.dataset.type);
            });
        });

        // Load initial search form
        this.loadSearchForm('location');
    }

    loadSearchForm(type) {
        const formsContainer = document.getElementById('searchForms');
        
        const forms = {
            location: `
                <div class="search-form">
                    <h4>Search by Location</h4>
                    <div class="form-row">
                        <input type="text" id="lacInput" placeholder="LAC (Location Area Code)">
                        <input type="text" id="ciInput" placeholder="CI (Cell ID)">
                        <button id="searchLocation" class="search-btn">
                            <i class="fas fa-search"></i> Search Location
                        </button>
                    </div>
                </div>
            `,
            number: `
                <div class="search-form">
                    <h4>Search by Phone Number</h4>
                    <div class="form-row">
                        <input type="text" id="numberInput" placeholder="Enter phone number">
                        <button id="searchNumber" class="search-btn">
                            <i class="fas fa-search"></i> Search Number
                        </button>
                    </div>
                </div>
            `,
            imei: `
                <div class="search-form">
                    <h4>Search by IMEI</h4>
                    <div class="form-row">
                        <input type="text" id="imeiInput" placeholder="Enter IMEI number">
                        <button id="searchImei" class="search-btn">
                            <i class="fas fa-search"></i> Search IMEI
                        </button>
                    </div>
                </div>
            `
        };

        formsContainer.innerHTML = forms[type] || '';
        this.bindSearchFormEvents(type);
    }

    bindSearchFormEvents(type) {
        // This would bind events for the specific search form
        // Implementation depends on the specific search type
    }

    bindContactEvents() {
        document.getElementById('contactLimit').addEventListener('change', (e) => {
            const limit = parseInt(e.target.value);
            this.updateContactTable(limit);
        });

        document.getElementById('exportContacts').addEventListener('click', () => {
            this.exportContacts();
        });
    }

    bindGraphEvents() {
        document.querySelectorAll('.graph-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.graph-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadGraph(e.target.dataset.graph);
            });
        });

        // Load initial graph
        this.loadGraph('relationship');
    }

    bindSearchFilterEvents() {
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.applyAdvancedFilters();
        });
    }

    updateContactTable(limit) {
        const topContacts = this.analytics.getTopContacts(limit);
        // Update the contacts table with new data
    }

    exportContacts() {
        const exportManager = new ExportManager();
        exportManager.exportContacts(this.analytics.getTopContacts(50));
    }

    loadGraph(graphType) {
        const chartManager = new ChartManager();
        const canvas = document.getElementById('advancedChart');
        
        switch (graphType) {
            case 'relationship':
                chartManager.createRelationshipGraph(this.cdrData, canvas);
                break;
            case 'duration':
                chartManager.createDurationAnalysis(this.analytics.getDurationAnalysis(), canvas);
                break;
            case 'location':
                chartManager.createLocationPatterns(this.analytics.getLocationAnalysis(), canvas);
                break;
            case 'temporal':
                chartManager.createTemporalAnalysis(this.analytics.getTemporalAnalysis(), canvas);
                break;
        }
    }

    applyAdvancedFilters() {
        if (!this.cdrData) return;

        const filters = {
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            phoneNumber: document.getElementById('phoneFilter').value,
            callType: document.getElementById('callTypeFilter').value,
            location: document.getElementById('locationFilter').value
        };

        const filteredData = this.analytics.applyFilters(filters);
        this.displayFilterResults(filteredData);
    }

    displayFilterResults(data) {
        const resultsContainer = document.getElementById('filterResults');
        
        if (data.length === 0) {
            resultsContainer.innerHTML = '<p>No records found matching the filters.</p>';
            return;
        }

        resultsContainer.innerHTML = `
            <div class="results-header">
                <h4>Found ${data.length} records</h4>
                <button id="exportResults" class="export-btn">
                    <i class="fas fa-download"></i> Export Results
                </button>
            </div>
            <div class="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date/Time</th>
                            <th>Caller</th>
                            <th>Receiver</th>
                            <th>Duration</th>
                            <th>Type</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.slice(0, 100).map(record => `
                            <tr>
                                <td>${this.formatDate(record.timestamp)}</td>
                                <td>${record.caller}</td>
                                <td>${record.receiver}</td>
                                <td>${this.formatDuration(record.duration)}</td>
                                <td>${record.type}</td>
                                <td>${record.location || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${data.length > 100 ? `<p class="results-more">... and ${data.length - 100} more records</p>` : ''}
            </div>
        `;

        document.getElementById('exportResults').addEventListener('click', () => {
            this.exportFilteredResults(data);
        });
    }

    exportFilteredResults(data) {
        const exportManager = new ExportManager();
        exportManager.exportFilteredData(data, 'filtered_results');
    }

    // Utility methods
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

    formatCallTypes(callTypes) {
        return Object.entries(callTypes)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ');
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString();
    }

    getNoDataMessage() {
        return `
            <div class="no-data-message">
                <i class="fas fa-file-upload"></i>
                <h3>No CDR Data Loaded</h3>
                <p>Please upload a CDR file from the Dashboard tab to begin analysis.</p>
                <button onclick="dashboard.switchToDashboard()" class="upload-btn">
                    <i class="fas fa-arrow-left"></i> Go to Dashboard
                </button>
            </div>
        `;
    }

    switchToDashboard() {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector('[data-tab="dashboard"]').classList.add('active');
        document.getElementById('dashboard').classList.add('active');
        
        this.currentTab = 'dashboard';
    }

    showLoading(message) {
        // Implementation for loading indicator
        console.log('Loading:', message);
    }

    hideLoading() {
        // Implementation to hide loading indicator
        console.log('Loading complete');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
