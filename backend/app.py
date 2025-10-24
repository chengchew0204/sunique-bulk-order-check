from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
from io import BytesIO
import traceback
import os
from config import Config
from services.inventory_calculator import InventoryCalculator

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Bulk Order API is running"})

@app.route('/api/upload-bulk-order', methods=['POST'])
def upload_bulk_order():
    """
    Upload bulk order Excel file and process calculations
    Expects file with SKU and NEED columns
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        if not file.filename.endswith(('.xlsx', '.xls')):
            return jsonify({"success": False, "error": "Invalid file format. Please upload an Excel file"}), 400
        
        # Read the uploaded file
        df_bulk_order = pd.read_excel(file)
        
        # Validate required columns
        if 'SKU' not in df_bulk_order.columns or 'NEED' not in df_bulk_order.columns:
            return jsonify({
                "success": False,
                "error": "Invalid file format. File must contain 'SKU' and 'NEED' columns"
            }), 400
        
        # Initialize calculator
        calculator = InventoryCalculator(app.config)
        
        # Process calculations
        df_result = calculator.generate_results(df_bulk_order)
        
        # Convert to JSON-friendly format
        results = df_result.to_dict(orient='records')
        
        # Round result column to 2 decimal places for display
        for item in results:
            item['result'] = round(item['result'], 2)
        
        return jsonify({
            "success": True,
            "data": results,
            "message": f"Successfully processed {len(results)} items"
        })
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error processing bulk order: {error_trace}")
        return jsonify({
            "success": False,
            "error": str(e),
            "trace": error_trace if app.debug else None
        }), 500

@app.route('/api/download-excel', methods=['POST'])
def download_excel():
    """
    Generate Excel file with conditional formatting
    Expects JSON data with results
    """
    try:
        data = request.get_json()
        
        if not data or 'results' not in data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        # Convert JSON to DataFrame
        df = pd.DataFrame(data['results'])
        
        # Ensure correct column order: SKU, NEED, result, Stock, Sale, Actual Can Sell
        column_order = ['SKU', 'NEED', 'result', 'Stock', 'Sale', 'Actual Can Sell']
        df = df[column_order]
        
        # Create a temporary file in memory
        output = BytesIO()
        
        # Initialize calculator for formatting
        calculator = InventoryCalculator(app.config)
        
        # Generate Excel with formatting
        temp_file = '/tmp/bulk_order_results.xlsx'
        calculator.generate_excel_with_formatting(df, temp_file)
        
        # Read the file and send it
        with open(temp_file, 'rb') as f:
            output.write(f.read())
        
        # Clean up temp file
        os.remove(temp_file)
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='bulk_order_results.xlsx'
        )
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error generating Excel: {error_trace}")
        return jsonify({
            "success": False,
            "error": str(e),
            "trace": error_trace if app.debug else None
        }), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({
        "success": False,
        "error": "File too large. Maximum file size is 16MB"
    }), 413

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

