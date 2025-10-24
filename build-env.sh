#!/bin/bash

# Build script for Netlify deployment
# This script generates env.js with the API URL from environment variable

if [ -z "$API_BASE_URL" ]; then
    echo "Warning: API_BASE_URL environment variable not set"
    echo "Using placeholder value. Update this in Netlify environment variables."
    API_BASE_URL="https://your-railway-backend-url.railway.app/api"
fi

echo "Generating env.js with API_BASE_URL: $API_BASE_URL"

cat > env.js << EOF
window.ENV = {
  API_BASE_URL: '$API_BASE_URL'
};
EOF

echo "Build completed successfully"

