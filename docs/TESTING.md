# Testing Guide - Bulk Order Checking System

## Prerequisites

Before testing, ensure:
1. Backend virtual environment is created and activated
2. All dependencies are installed (`pip install -r requirements.txt`)
3. `.env` file exists in `backend/` directory with valid credentials
4. Flask server is running on port 5000
5. Frontend is accessible via HTTP server on port 8080

## Manual Testing Checklist

### 1. Backend API Testing

#### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Bulk Order API is running"
}
```

#### Test File Upload Endpoint
```bash
curl -X POST \
  -F "file=@data/BulkOrder.xlsx" \
  http://localhost:5000/api/upload-bulk-order
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "SKU": "...",
      "NEED": 50,
      "result": 3.2,
      "Stock": 180,
      "Sale": 30,
      "Actual Can Sell": 60
    }
  ],
  "message": "Successfully processed X items"
}
```

### 2. Frontend UI Testing

#### Test File Upload Interface

1. **Open the application**
   - Navigate to `http://localhost:8080`
   - Verify page loads correctly
   - Check that upload area is visible

2. **Test drag and drop**
   - Drag `BulkOrder.xlsx` onto upload area
   - Verify border changes color on drag over
   - Verify file name appears after drop
   - Verify "Process File" button appears

3. **Test browse button**
   - Click "Browse Files" button
   - Select `BulkOrder.xlsx` from file picker
   - Verify file name appears
   - Verify "Process File" button appears

4. **Test invalid file handling**
   - Try uploading a .txt file
   - Verify error message appears
   - Try uploading Excel without SKU/NEED columns
   - Verify appropriate error message

#### Test Processing Flow

1. **Upload valid file**
   - Upload `data/BulkOrder.xlsx`
   - Click "Process File"
   - Verify loading spinner appears
   - Wait for processing (30-60 seconds)

2. **Verify results display**
   - Check that results table appears
   - Verify all columns are present:
     - SKU, NEED, Result (Months), Stock, Sale, Actual Can Sell
   - Verify color coding:
     - Green SKUs: result >= 4
     - Yellow SKUs: 0 < result < 4
     - Red SKUs: result <= 0

3. **Test Excel download**
   - Click "Download Excel" button
   - Verify file downloads as `bulk_order_results.xlsx`
   - Open the downloaded file
   - Verify conditional formatting is applied
   - Verify data matches web display

### 3. Integration Testing

#### Test SharePoint Connection

Check the following in Flask console logs:
- "获取访问令牌成功" or successful token acquisition
- No "获取 Site ID 失败" errors
- No "获取 Drive ID 失败" errors
- Successful file downloads

#### Test Data Processing

1. **Verify sales forecast calculation**
   - Check that sales data is from last 3 months
   - Verify bulk orders are excluded
   - Verify only cabinet products are included (FG-, GB-, SSW-, SW-, ET-, SSO-, SWB-)

2. **Verify stock adjustment**
   - For items with 0-4 months inventory
   - Verify in-transit stock is added
   - Check console logs for stock updates

3. **Verify NEED calculation**
   - For items with result >= 4: NEED unchanged
   - For items with 0 < result < 4: NEED adjusted for 4-month safety stock
   - For items with result <= 0: NEED set to 0

### 4. Error Handling Testing

#### Test Backend Errors

1. **Missing credentials**
   - Remove credentials from .env
   - Restart server
   - Attempt file upload
   - Verify error message returned

2. **SharePoint connection failure**
   - Use invalid SharePoint credentials
   - Attempt file upload
   - Verify appropriate error message

3. **Invalid file format**
   - Upload file without SKU column
   - Verify error: "Invalid file format. File must contain 'SKU' and 'NEED' columns"

4. **File too large**
   - Upload file > 16MB
   - Verify error: "File too large. Maximum file size is 16MB"

#### Test Frontend Errors

1. **API unavailable**
   - Stop Flask server
   - Attempt file upload
   - Verify error message displays in UI

2. **Network errors**
   - Simulate slow network
   - Verify loading spinner remains visible
   - Verify appropriate timeout handling

### 5. Browser Compatibility Testing

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari

Verify:
- File upload works
- Drag and drop works
- Results display correctly
- Excel download works
- Styling is consistent

### 6. Performance Testing

1. **Small file (< 10 items)**
   - Upload and process
   - Record processing time
   - Expected: < 30 seconds

2. **Medium file (10-50 items)**
   - Upload and process
   - Record processing time
   - Expected: 30-60 seconds

3. **Large file (50+ items)**
   - Upload and process
   - Record processing time
   - Expected: 60-120 seconds

## Expected Test Data

Using `data/BulkOrder.xlsx`:
- File should contain SKU and NEED columns
- Each SKU should match products in inventory system
- Results should show color-coded inventory status

## Known Limitations

1. **Processing time**: First request may take longer due to SharePoint authentication
2. **Rate limits**: inFlow API has rate limits - may need delays for large files
3. **Time window**: SharePoint files should not be opened during 7-8pm (as noted in folder name)

## Test Results Template

```
Date: ___________
Tester: ___________

Backend Health Check: ☐ Pass ☐ Fail
File Upload API: ☐ Pass ☐ Fail
Frontend UI Load: ☐ Pass ☐ Fail
Drag & Drop: ☐ Pass ☐ Fail
Browse Upload: ☐ Pass ☐ Fail
Processing Flow: ☐ Pass ☐ Fail
Results Display: ☐ Pass ☐ Fail
Color Coding: ☐ Pass ☐ Fail
Excel Download: ☐ Pass ☐ Fail
Error Handling: ☐ Pass ☐ Fail

Notes:
_________________________________
_________________________________
```

## Troubleshooting Test Failures

### API Returns 500 Error
- Check Flask console for stack traces
- Verify SharePoint credentials
- Verify SharePoint folder structure
- Check that required Excel files exist

### Results Don't Match Expected
- Verify calculation logic in inventory_calculator.py
- Check that sales data is from correct date range
- Verify bulk orders are being excluded
- Check stock on sea data

### Excel Download Fails
- Verify openpyxl is installed
- Check /tmp/ directory permissions
- Verify pandas DataFrame is valid

### Color Coding Incorrect
- Check JavaScript result value parsing
- Verify CSS classes are applied correctly
- Check conditional formatting in Excel export

## Automated Testing (Future)

Consider implementing:
- Unit tests for calculation functions
- Integration tests for API endpoints
- E2E tests with Selenium/Playwright
- Mock SharePoint responses for faster testing

