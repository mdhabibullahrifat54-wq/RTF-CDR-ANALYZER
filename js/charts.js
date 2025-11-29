// Chart Management System
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        };
    }

    createCallTypeChart(chartData) {
        const ctx = document.getElementById('callTypeChart').getContext('2d');
        
        this.destroyChart('callTypeChart');
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: chartData.colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Call Type Distribution'
                    }
                }
            }
        });

        this.charts.set('callTypeChart', chart);
        return chart;
    }

    createTimeDistributionChart(chartData) {
        const ctx = document.getElementById('timeDistributionChart').getContext('2d');
        
        this.destroyChart('timeDistributionChart');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Calls per Hour',
                    data: chartData.data,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: chartData.color,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Call Distribution by Hour'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hour of Day'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Calls'
                        },
                        beginAtZero: true
                    }
                }
            }
        });

        this.charts.set('timeDistributionChart', chart);
        return chart;
    }

    createRelationshipGraph(cdrData, canvas) {
        const ctx = canvas.getContext('2d');
        this.destroyChart('relationshipGraph');

        // Prepare relationship data
        const relationships = this.prepareRelationshipData(cdrData);
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: relationships.labels,
                datasets: [{
                    label: 'Communication Frequency',
                    data: relationships.data,
                    backgroundColor: this.generateGradient(ctx, '#3498db', '#2ecc71'),
                    borderColor: '#2980b9',
                    borderWidth: 1
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Top Contact Relationships'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Interactions'
                        }
                    }
                }
            }
        });

        this.charts.set('relationshipGraph', chart);
        return chart;
    }

    createDurationAnalysis(durationData, canvas) {
        const ctx = canvas.getContext('2d');
        this.destroyChart('durationAnalysis');

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Average', 'Median', 'Minimum', 'Maximum'],
                datasets: [{
                    label: 'Call Duration (seconds)',
                    data: [
                        Math.round(durationData.average),
                        Math.round(durationData.median),
                        durationData.min,
                        durationData.max
                    ],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ],
                    borderColor: [
                        '#2980b9',
                        '#27ae60',
                        '#f39c12',
                        '#c0392b'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Call Duration Analysis'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Duration (seconds)'
                        }
                    }
                }
            }
        });

        this.charts.set('durationAnalysis', chart);
        return chart;
    }

    createLocationPatterns(locationData, canvas) {
        const ctx = canvas.getContext('2d');
        this.destroyChart('locationPatterns');

        // Get top locations
        const topLocations = locationData
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: topLocations.map(loc => this.shortenLocation(loc.location)),
                datasets: [{
                    label: 'Call Activity',
                    data: topLocations.map(loc => loc.count),
                    backgroundColor: this.generateColors(topLocations.length),
                    borderColor: '#2c3e50',
                    borderWidth: 1
                }]
            },
            options: {
                ...this.defaultOptions,
                indexAxis: 'y',
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Top Locations by Call Activity'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Calls'
                        }
                    }
                }
            }
        });

        this.charts.set('locationPatterns', chart);
        return chart;
    }

    createTemporalAnalysis(temporalData, canvas) {
        const ctx = canvas.getContext('2d');
        this.destroyChart('temporalAnalysis');

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Calls per Day',
                    data: temporalData.dailyDistribution,
                    backgroundColor: 'rgba(155, 89, 182, 0.7)',
                    borderColor: '#8e44ad',
                    borderWidth: 1
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Weekly Call Distribution'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Calls'
                        }
                    }
                }
            }
        });

        this.charts.set('temporalAnalysis', chart);
        return chart;
    }

    createContactFrequencyChart(contactData, canvas) {
        const ctx = canvas.getContext('2d');
        this.destroyChart('contactFrequency');

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: contactData.labels,
                datasets: [{
                    label: 'Call Count',
                    data: contactData.data,
                    backgroundColor: contactData.colors,
                    borderColor: '#2c3e50',
                    borderWidth: 1
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Top Contacted Numbers'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Calls'
                        }
                    }
                }
            }
        });

        this.charts.set('contactFrequency', chart);
        return chart;
    }

    createDurationDistributionChart(durationData, canvas) {
        const ctx = canvas.getContext('2d');
        this.destroyChart('durationDistribution');

        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: durationData.labels,
                datasets: [{
                    data: durationData.data,
                    backgroundColor: durationData.colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Call Duration Distribution'
                    }
                }
            }
        });

        this.charts.set('durationDistribution', chart);
        return chart;
    }

    // Utility Methods
    prepareRelationshipData(cdrData) {
        const contactCounts = {};
        
        cdrData.records.forEach(record => {
            if (record.caller && record.receiver) {
                const key = `${record.caller} -> ${record.receiver}`;
                contactCounts[key] = (contactCounts[key] || 0) + 1;
            }
        });

        // Get top relationships
        const topRelationships = Object.entries(contactCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15);

        return {
            labels: topRelationships.map(([label]) => this.shortenLabel(label)),
            data: topRelationships.map(([,count]) => count)
        };
    }

    shortenLabel(label) {
        if (label.length > 25) {
            return label.substring(0, 22) + '...';
        }
        return label;
    }

    shortenLocation(location) {
        if (location.length > 20) {
            return location.substring(0, 17) + '...';
        }
        return location;
    }

    generateGradient(ctx, color1, color2) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    generateColors(count) {
        const baseColors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
            '#1abc9c', '#34495e', '#d35400', '#c0392b', '#16a085',
            '#2980b9', '#27ae60', '#c0392b', '#d35400', '#8e44ad'
        ];
        
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    }

    destroyChart(chartId) {
        if (this.charts.has(chartId)) {
            this.charts.get(chartId).destroy();
            this.charts.delete(chartId);
        }
    }

    // Export chart as image
    exportChartAsImage(chartId, filename = 'chart') {
        if (this.charts.has(chartId)) {
            const chart = this.charts.get(chartId);
            const image = chart.toBase64Image();
            this.downloadImage(image, filename);
        }
    }

    downloadImage(imageData, filename) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `${filename}.png`;
        link.click();
    }

    // Update chart data
    updateChartData(chartId, newData) {
        if (this.charts.has(chartId)) {
            const chart = this.charts.get(chartId);
            chart.data.datasets[0].data = newData.data;
            if (newData.labels) {
                chart.data.labels = newData.labels;
            }
            chart.update();
        }
    }

    // Resize all charts (for responsive behavior)
    resizeCharts() {
        this.charts.forEach(chart => {
            chart.resize();
        });
    }
}

// Initialize chart manager and handle window resize
document.addEventListener('DOMContentLoaded', () => {
    window.chartManager = new ChartManager();
    
    window.addEventListener('resize', () => {
        setTimeout(() => {
            window.chartManager.resizeCharts();
        }, 100);
    });
});
