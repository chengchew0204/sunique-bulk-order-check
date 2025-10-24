#!/bin/bash

echo "Starting Bulk Order Checking System..."
echo "========================================"

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment and install dependencies
echo "Installing dependencies..."
cd backend
source venv/bin/activate
pip install -q -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found!"
    echo "Please create backend/.env from backend/.env.example"
    echo "and add your credentials."
    exit 1
fi

# Start Flask server
echo ""
echo "Starting Flask API on http://localhost:5000"
echo "========================================"
python app.py

