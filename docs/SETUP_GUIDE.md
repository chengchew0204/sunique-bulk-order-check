# Setup Guide - Bulk Order Checking System

## Quick Start

Follow these steps to get the application running:

### Step 1: Create Environment File

Copy the example environment file and configure with your credentials:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with a text editor. The file already contains the production credentials from ContainerCalc.py:

```
SHAREPOINT_TENANT_ID=your_tenant_id_here
SHAREPOINT_CLIENT_ID=your_client_id_here
SHAREPOINT_CLIENT_SECRET=your_client_secret_here
SHAREPOINT_OBJECT_ID=your_object_id_here

INFLOW_COMPANY_ID=your_company_id_here
INFLOW_API_KEY=your_api_key_here

EMAIL_CLIENT_ID=your_email_client_id_here
EMAIL_CLIENT_SECRET=your_email_client_secret_here
EMAIL_CLIENT_SECRET_VALUE=your_email_client_secret_value_here
EMAIL_TENANT_ID=your_email_tenant_id_here

SHAREPOINT_HOSTNAME=your_sharepoint_hostname_here
SHAREPOINT_SITE_NAME=your_site_name_here
```

### Step 2: Setup Python Environment

```bash
# Create virtual environment
cd backend
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Start the Backend Server

```bash
# Make sure you're in the backend directory with venv activated
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
```

### Step 4: Open the Frontend

In a new terminal window:

```bash
# Go to development-local directory
cd /Users/zackwu204/CursorAI/Sunique/03-bulk-order-ckecking/development-local

# Start a simple HTTP server
python3 -m http.server 8080
```

Open your browser to: `http://localhost:8080`

### Step 5: Test with Sample Data

1. Open `http://localhost:8080` in your browser
2. Upload the `data/BulkOrder.xlsx` file
3. Click "Process File"
4. Wait for results (this may take 30-60 seconds as it fetches data from SharePoint)
5. View color-coded results
6. Click "Download Excel" to export

## Using the Startup Script (macOS/Linux)

For convenience, use the provided startup script:

```bash
# From development-local directory
./start.sh
```

This will:
- Create virtual environment if needed
- Install dependencies
- Check for .env file
- Start the Flask server

## Troubleshooting

### "Module not found" errors
Make sure virtual environment is activated:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "Failed to acquire token" errors
- Verify credentials in `backend/.env`
- Check that SharePoint credentials haven't expired
- Ensure network access to Microsoft services

### CORS errors in browser
- Make sure Flask backend is running on port 5000
- Check browser console for specific error messages
- Verify Flask-CORS is installed: `pip show flask-cors`

### File upload fails
- Check file format (must be .xlsx or .xls)
- Ensure file has 'SKU' and 'NEED' columns
- Check file size (max 16MB)

### SharePoint connection issues
- Verify SharePoint site is accessible
- Check that folder "Technology Stuff (DO NOT CHANGE)" exists
- Ensure required Excel files are present:
  - Sales Order Process Checklist.xlsx
  - Raw Data (Do Not Open in 7-8pm)/Inventory.xlsx
  - Raw Data (Do Not Open in 7-8pm)/Order.xlsx
  - LS order tracking.xlsx

## File Structure

After setup, you should have:

```
development-local/
├── backend/
│   ├── venv/                     # Virtual environment (created)
│   ├── .env                      # Your credentials (create this)
│   ├── .env.example              # Template
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   └── services/
│       ├── __init__.py
│       └── inventory_calculator.py
├── data/
│   └── BulkOrder.xlsx
├── index.html
├── style.css
├── script.js
├── start.sh
├── README.md
├── SETUP_GUIDE.md
└── .gitignore
```

## Next Steps

1. Create `backend/.env` from `backend/.env.example`
2. Run `./start.sh` or follow manual steps above
3. Open browser to `http://localhost:8080`
4. Test with sample data
5. Start using the system for real bulk orders!

## API Testing (Optional)

Test the API directly with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Upload file
curl -X POST -F "file=@data/BulkOrder.xlsx" \
  http://localhost:5000/api/upload-bulk-order
```

