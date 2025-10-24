# Bulk Order Checking System

A Flask-based web application for checking bulk order inventory availability against current stock, sales forecasts, and in-transit inventory.

## Features

- Upload bulk order Excel files (with SKU and NEED columns)
- Automatic data fetching from SharePoint and inFlow API
- Intelligent inventory calculations with 4-month safety stock maintenance
- Color-coded results (Green: Safe, Yellow: Warning, Red: Critical)
- Export results to Excel with conditional formatting

## Project Structure

```
development-local/
├── backend/
│   ├── app.py                    # Flask API endpoints
│   ├── config.py                 # Configuration management
│   ├── requirements.txt          # Python dependencies
│   ├── services/
│   │   └── inventory_calculator.py  # Core business logic
│   └── .env                      # Environment variables (create from .env.example)
├── index.html                    # Frontend UI
├── style.css                     # Styling
├── script.js                     # Frontend logic
└── data/
    └── BulkOrder.xlsx           # Sample bulk order file
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env

# Edit .env file with your credentials
# (The example file already contains the production credentials)
```

### 2. Environment Variables

Edit `backend/.env` with your credentials:

```
SHAREPOINT_TENANT_ID=your-tenant-id
SHAREPOINT_CLIENT_ID=your-client-id
SHAREPOINT_CLIENT_SECRET=your-client-secret
INFLOW_COMPANY_ID=your-company-id
INFLOW_API_KEY=your-api-key
```

### 3. Run the Application

```bash
# Start the Flask backend (from backend directory)
python app.py

# The API will run on http://localhost:5000
```

### 4. Open the Frontend

Open `index.html` in your web browser or use a local server:

```bash
# Using Python's built-in server (from development-local directory)
python -m http.server 8080

# Then open http://localhost:8080 in your browser
```

## Usage

1. **Upload File**: Click "Browse Files" or drag and drop your Excel file
   - File must contain `SKU` and `NEED` columns
   
2. **Process**: Click "Process File" to analyze inventory
   - The system will fetch data from SharePoint and inFlow API
   - Calculations are performed based on 3-month sales history
   
3. **View Results**: Results are displayed with color coding:
   - **Green**: ≥4 months of stock remaining (safe)
   - **Yellow**: 0-4 months of stock (warning)
   - **Red**: ≤0 months of stock (critical shortage)
   
4. **Download**: Click "Download Excel" to export results with formatting

## Calculation Logic

1. **Sales Forecast**: Calculate 2-month sales projection from 3-month history
   - Formula: `(3 months sales / 3) * 2 * 1.5`

2. **Temporary Result**: Calculate months of inventory
   - Formula: `(Stock - NEED) / Monthly Sale`

3. **Stock Adjustment**: If result is 0-4 months, add in-transit inventory

4. **Final Result**: Recalculate with updated stock

5. **Actual Can Sell**: Adjust NEED to maintain 4-month safety stock
   - If result ≥ 4: Keep original NEED
   - If 0 < result < 4: Calculate `Stock - (Sale × 4)`, round to nearest 5
   - If result ≤ 0: Set to 0

## API Endpoints

### POST `/api/upload-bulk-order`
Upload and process bulk order file

**Request**: `multipart/form-data` with file

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "SKU": "SW-3DB21",
      "NEED": 50,
      "result": 3.2,
      "Stock": 180,
      "Sale": 30,
      "Actual Can Sell": 60
    }
  ],
  "message": "Successfully processed 10 items"
}
```

### POST `/api/download-excel`
Generate Excel file with conditional formatting

**Request**:
```json
{
  "results": [/* array of result objects */]
}
```

**Response**: Excel file download

### GET `/api/health`
Health check endpoint

**Response**:
```json
{
  "status": "ok",
  "message": "Bulk Order API is running"
}
```

## Troubleshooting

### Backend Issues

- **Import errors**: Make sure virtual environment is activated and dependencies are installed
- **Authentication errors**: Verify credentials in `.env` file
- **SharePoint connection errors**: Check network access and credentials validity

### Frontend Issues

- **CORS errors**: Make sure Flask-CORS is installed and backend is running
- **API not accessible**: Verify backend is running on port 5000
- **File upload fails**: Check file format (must be .xlsx or .xls with SKU and NEED columns)

## Development

To run in development mode:

```bash
# Backend with debug mode
cd backend
export FLASK_ENV=development
python app.py

# Frontend with live reload (using any local server)
cd ..
python -m http.server 8080
```

## Production Deployment

### Quick Deployment (Recommended)

See [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md) for a fast deployment guide.

**Backend:** Railway  
**Frontend:** Netlify

### Detailed Deployment

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions including:
- Railway backend deployment
- Netlify frontend deployment
- Environment variable configuration
- Custom domain setup
- Troubleshooting guide

### Manual Deployment

1. Set `FLASK_ENV=production` in environment
2. Use `gunicorn` for serving Flask app:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```
3. Serve frontend files with nginx or similar web server
4. Use environment variables for all sensitive credentials

## Documentation

- [Setup Guide](docs/SETUP_GUIDE.md) - Local development setup
- [Deployment Quick Start](DEPLOYMENT_QUICK_START.md) - Fast deployment guide
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- [Testing Guide](docs/TESTING.md) - Testing procedures

## License

Internal use only - Sunique Cabinetry

