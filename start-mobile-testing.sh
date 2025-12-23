#!/bin/bash

# 3arida Mobile Testing Setup Script
# This script helps you quickly start testing on mobile devices

echo "🚀 3arida Mobile Testing Setup"
echo "================================"
echo ""

# Get local IP address
echo "📡 Finding your local IP address..."
IP=$(ipconfig getifaddr en0 2>/dev/null)

if [ -z "$IP" ]; then
    # Try alternative method
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
fi

if [ -z "$IP" ]; then
    echo "❌ Could not find local IP address"
    echo "   Please check your network connection"
    exit 1
fi

echo "✅ Your local IP address: $IP"
echo ""

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use"
    echo "   Stopping existing process..."
    kill $(lsof -t -i:3000) 2>/dev/null
    sleep 2
fi

# Generate QR code if qrencode is installed
if command -v qrencode &> /dev/null; then
    echo "📱 QR Code for mobile access:"
    echo ""
    echo "http://$IP:3000" | qrencode -t UTF8
    echo ""
else
    echo "💡 Tip: Install qrencode to get a QR code"
    echo "   brew install qrencode"
    echo ""
fi

# Display access instructions
echo "📱 Mobile Access Instructions:"
echo "================================"
echo ""
echo "1. Connect your mobile device to the SAME WiFi network"
echo "2. Open browser on your mobile device"
echo "3. Go to: http://$IP:3000"
echo ""
echo "Or scan the QR code above (if available)"
echo ""

# Display testing checklist
echo "✅ Mobile Testing Checklist:"
echo "================================"
echo ""
echo "□ Home page loads"
echo "□ Registration works"
echo "□ Login works"
echo "□ Create petition"
echo "□ Upload image from camera"
echo "□ Sign petition"
echo "□ Phone verification"
echo "□ Comments work"
echo ""

# Ask if user wants to start the server
echo "🚀 Ready to start Next.js dev server?"
echo "   Press Enter to continue, or Ctrl+C to cancel"
read -r

echo ""
echo "Starting Next.js with network access..."
echo "================================"
echo ""
echo "Local:   http://localhost:3000"
echo "Network: http://$IP:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Next.js with network access
cd "$(dirname "$0")"
npm run dev -- -H 0.0.0.0
