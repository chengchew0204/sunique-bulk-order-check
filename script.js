const API_BASE_URL = window.ENV?.API_BASE_URL || 'http://localhost:5000/api';

let currentResults = null;

class BulkOrderApp {
    constructor() {
        this.currentStep = 0;
        this.progressSteps = [
            { id: 'validate', label: 'Validating File', progress: 20 },
            { id: 'authenticate', label: 'Authenticating', progress: 40 },
            { id: 'download', label: 'Downloading Data', progress: 60 },
            { id: 'calculate', label: 'Calculating Analysis', progress: 80 },
            { id: 'complete', label: 'Finalizing', progress: 99 }
        ];
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const browseBtn = document.getElementById('browseBtn');
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.getElementById('uploadBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const newCheckBtn = document.getElementById('newCheckBtn');
        
        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        uploadBtn.addEventListener('click', () => this.processFile());
        downloadBtn.addEventListener('click', () => this.downloadExcel());
        newCheckBtn.addEventListener('click', () => this.resetForm());
        
        // Drag and drop handlers
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
        
        uploadArea.addEventListener('click', (e) => {
            if (e.target !== browseBtn) {
                fileInput.click();
            }
        });
        
        // Error modal handlers
        document.getElementById('closeErrorModal').addEventListener('click', () => {
            this.hideError();
        });
        
        document.getElementById('closeErrorBtn').addEventListener('click', () => {
            this.hideError();
        });
        
        document.getElementById('errorModal').addEventListener('click', (e) => {
            if (e.target.id === 'errorModal') {
                this.hideError();
            }
        });
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }
    
    handleFile(file) {
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            this.showError('Please select a valid Excel file (.xlsx or .xls)');
            return;
        }
        
        const fileName = document.getElementById('fileName');
        const fileInfo = document.getElementById('fileInfo');
        fileName.textContent = file.name;
        fileInfo.style.display = 'flex';
    }
    
    async processFile() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showError('Please select a file first');
            return;
        }
        
        try {
            this.showProcessingSection();
            
            const formData = new FormData();
            formData.append('file', file);
            
            console.log('Starting file upload:', file.name);
            
            // Step 1: Validate
            this.updateProgress(0, 'Validating uploaded file...');
            await this.sleep(500);
            
            // Step 2: Authenticate
            this.updateProgress(1, 'Authenticating with SharePoint...');
            await this.sleep(800);
            
            // Step 3: Download
            this.updateProgress(2, 'Downloading inventory data...');
            await this.sleep(500);
            
            // Step 4: Calculate (make API call)
            this.updateProgress(3, 'Calculating inventory analysis...');
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);
            
            const response = await fetch(`${API_BASE_URL}/upload-bulk-order`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            console.log('Response received:', response.status);
            
            const data = await response.json();
            console.log('Data parsed:', data);
            
            if (data.success) {
                // Step 5: Complete
                this.updateProgress(4, 'Finalizing results...');
                await this.sleep(500);
                
                currentResults = data.data;
                console.log('Displaying results:', currentResults.length, 'items');
                await this.sleep(300);
                this.displayResults(data.data);
            } else {
                throw new Error(data.error || 'Failed to process file');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                this.showError('Request timeout. The processing is taking too long. Please try again or contact support.');
            } else {
                this.showError(`Error: ${error.message}`);
            }
            console.error('Upload error:', error);
        }
    }
    
    updateProgress(stepIndex, message) {
        const step = this.progressSteps[stepIndex];
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        const progressMessage = document.getElementById('progressMessage');
        
        progressFill.style.width = `${step.progress}%`;
        progressPercentage.textContent = `${step.progress}%`;
        progressMessage.textContent = message;
        
        // Update progress bar markers
        const progressStepElements = document.querySelectorAll('.progress-step');
        progressStepElements.forEach((el, idx) => {
            if (idx < stepIndex) {
                el.classList.remove('active');
                el.classList.add('completed');
            } else if (idx === stepIndex) {
                el.classList.remove('completed');
                el.classList.add('active');
            } else {
                el.classList.remove('active', 'completed');
            }
        });
        
        // Update processing step list
        const processingSteps = document.querySelectorAll('.processing-step');
        processingSteps.forEach((el, idx) => {
            const icon = el.querySelector('i');
            if (idx < stepIndex) {
                el.classList.remove('active');
                el.classList.add('completed');
                icon.className = 'fas fa-check-circle';
            } else if (idx === stepIndex) {
                el.classList.remove('completed');
                el.classList.add('active');
                icon.className = 'fas fa-circle-notch fa-spin';
            } else {
                el.classList.remove('active', 'completed');
                icon.className = 'fas fa-circle-notch fa-spin';
            }
        });
    }
    
    showProcessingSection() {
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('processing-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        
        // Reset progress bar
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        const progressMessage = document.getElementById('progressMessage');
        
        progressFill.style.width = '0%';
        progressPercentage.textContent = '0%';
        progressMessage.textContent = 'Initializing...';
        
        // Reset progress bar markers
        const progressStepElements = document.querySelectorAll('.progress-step');
        progressStepElements.forEach(el => {
            el.classList.remove('completed', 'active');
        });
        
        // Reset processing steps
        const processingSteps = document.querySelectorAll('.processing-step');
        processingSteps.forEach(step => {
            step.classList.remove('completed', 'active');
            const icon = step.querySelector('i');
            icon.className = 'fas fa-circle-notch fa-spin';
        });
    }
    
    displayResults(results) {
        document.getElementById('processing-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
        
        const resultsBody = document.getElementById('resultsBody');
        resultsBody.innerHTML = '';
        
        results.forEach(item => {
            const row = document.createElement('tr');
            
            let colorClass = 'green';
            if (item.result <= 0) {
                colorClass = 'red';
            } else if (item.result < 4) {
                colorClass = 'yellow';
            }
            
            row.innerHTML = `
                <td><span class="sku-cell ${colorClass}">${item.SKU}</span></td>
                <td>${item.NEED}</td>
                <td>${item.result.toFixed(2)}</td>
                <td>${item.Stock}</td>
                <td>${item.Sale}</td>
                <td>${item['Actual Can Sell']}</td>
            `;
            
            resultsBody.appendChild(row);
        });
        
        // Scroll to top of results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    async downloadExcel() {
        if (!currentResults) {
            this.showError('No results to download');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/download-excel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ results: currentResults })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate Excel file');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bulk_order_results.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            this.showError(`Error downloading file: ${error.message}`);
            console.error('Download error:', error);
        }
    }
    
    showError(message) {
        document.getElementById('processing-section').style.display = 'none';
        document.getElementById('errorModal').classList.add('show');
        document.getElementById('errorText').textContent = message;
    }
    
    hideError() {
        document.getElementById('errorModal').classList.remove('show');
        document.getElementById('upload-section').style.display = 'block';
    }
    
    resetForm() {
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').style.display = 'none';
        currentResults = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new BulkOrderApp();
    console.log('Bulk Order App initialized successfully');
});
