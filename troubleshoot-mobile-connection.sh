#!/bin/bash

# Mobile Connection Troubleshooting Script
echo "🔍 Troubleshooting Mobile Connection"
echo "====================================="
echo ""

# Check 1: Is Next.js running?
echo "1️⃣ Checking if Next.js is running on port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ✅ Next.js is running on port 3000"
    PID=$(lsof -t -i:3000)
    echo "   Process ID: $PID"
else
    echo "   ❌ Next.js is NOT running on port 3000"
    echo "   → Start it with: npm run dev:mobile"
    echo ""
    exit 1
fi
echo ""

# Check 2: Network interfaces
echo "2️⃣ Checking network interfaces..."
echo "   Available IP addresses:"
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print "   - " $2}'
echo ""

# Check 3: Firewall status
echo "3️⃣ Checking macOS Firewall..."
FIREWALL_STATUS=$(sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null)
if [[ $FIREWALL_STATUS == *"enabled"* ]]; then
    echo "   ⚠️  Firewall is ENABLED"
    echo "   → This might block connections"
    echo "   → Go to: System Preferences > Security & Privacy > Firewall"
    echo "   → Click 'Firewall Options' and allow Node.js"
else
    echo "   ✅ Firewall is disabled or allowing connections"
fi
echo ""

# Check 4: Test local connection
echo "4️⃣ Testing local connection..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ Can connect to localhost:3000"
else
    echo "   ❌ Cannot connect to localhost:3000"
    echo "   → Check if Next.js started correctly"
fi
echo ""

# Check 5: Test network connection
echo "5️⃣ Testing network connection..."
IP=$(ipconfig getifaddr en0 2>/dev/null)
if [ -z "$IP" ]; then
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
fi

if [ ! -z "$IP" ]; then
    echo "   Your IP: $IP"
    if curl -s http://$IP:3000 > /dev/null; then
        echo "   ✅ Can connect to $IP:3000 from this computer"
    else
        echo "   ❌ Cannot connect to $IP:3000 from this computer"
        echo "   → Next.js might not be listening on 0.0.0.0"
        echo "   → Make sure you started with: npm run dev:mobile"
    fi
else
    echo "   ❌ Could not find network IP address"
    echo "   → Check your WiFi connection"
fi
echo ""

# Check 6: WiFi network
echo "6️⃣ Checking WiFi network..."
WIFI_NETWORK=$(networksetup -getairportnetwork en0 2>/dev/null | cut -d ":" -f 2 | xargs)
if [ ! -z "$WIFI_NETWORK" ]; then
    echo "   ✅ Connected to WiFi: $WIFI_NETWORK"
    echo "   → Make sure your mobile device is on the SAME network"
else
    echo "   ❌ Not connected to WiFi"
    echo "   → Connect to WiFi first"
fi
echo ""

# Summary
echo "📋 Summary"
echo "=========="
echo ""
echo "To connect from mobile:"
echo "1. Make sure mobile is on WiFi: $WIFI_NETWORK"
echo "2. Open browser on mobile"
echo "3. Go to: http://$IP:3000"
echo ""
echo "If still not working:"
echo "• Check firewall settings"
echo "• Restart Next.js with: npm run dev:mobile"
echo "• Try using ngrok instead (see LOCAL-MOBILE-TESTING-SETUP.md)"
echo ""
