# Fix Mobile Connection Issue

**Problem:** Cannot access `http://10.10.183.197:3000` from mobile device

---

## 🔧 Quick Fix (Most Common Issue)

The problem is usually that Next.js is running with `npm run dev` instead of `npm run dev:mobile`.

### Solution:

**1. Stop the current server:**

```bash
# Press Ctrl+C in the terminal where Next.js is running
# Or kill the process:
lsof -ti:3000 | xargs kill -9
```

**2. Start with network access:**

```bash
cd 3arida-app
npm run dev:mobile
```

**3. Look for this in the output:**

```
- Local:    http://localhost:3000
- Network:  http://10.10.183.197:3000  ← This line is important!
```

If you see the "Network:" line, it's working correctly!

**4. Access from mobile:**

- Connect mobile to same WiFi
- Open browser
- Go to: `http://10.10.183.197:3000`

---

## 🔍 Detailed Troubleshooting

### Issue 1: Server not listening on network

**Symptom:** Server only shows "Local: http://localhost:3000"

**Fix:**

```bash
# Stop server (Ctrl+C)
cd 3arida-app

# Start with network access
npm run dev -- -H 0.0.0.0

# Or use the mobile script
npm run dev:mobile
```

---

### Issue 2: Firewall blocking connections

**Symptom:** Server running but mobile can't connect

**Fix on macOS:**

1. Open **System Preferences**
2. Go to **Security & Privacy**
3. Click **Firewall** tab
4. Click **Firewall Options**
5. Find **Node** or **node** in the list
6. Make sure it's set to **Allow incoming connections**
7. If not in list, click **+** and add Node.js

**Or temporarily disable firewall for testing:**

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

**Remember to re-enable after testing:**

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

---

### Issue 3: Wrong WiFi network

**Symptom:** Mobile and computer on different networks

**Fix:**

**Check computer's WiFi:**

```bash
networksetup -getairportnetwork en0
```

**Check mobile's WiFi:**

- Go to Settings > WiFi
- Make sure it's the EXACT same network name

**Common mistake:** Computer on "MyWiFi" and mobile on "MyWiFi-5G"

---

### Issue 4: VPN or network restrictions

**Symptom:** Corporate/school network blocking local connections

**Fix:** Use ngrok instead:

```bash
# Terminal 1: Start Next.js normally
cd 3arida-app
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Access the https:// URL from mobile
```

---

## ✅ Verification Steps

Run these commands to verify everything:

**1. Check if server is running:**

```bash
lsof -i :3000
```

Should show Node.js process

**2. Check your IP:**

```bash
ipconfig getifaddr en0
```

Should show something like `10.10.183.197`

**3. Test local connection:**

```bash
curl http://localhost:3000
```

Should return HTML

**4. Test network connection:**

```bash
curl http://10.10.183.197:3000
```

Should return HTML (if this fails, it's a network/firewall issue)

**5. Check WiFi:**

```bash
networksetup -getairportnetwork en0
```

Note the network name

---

## 🚀 Alternative: Use ngrok (Recommended)

If local network access keeps failing, use ngrok:

**Advantages:**

- ✅ Works from anywhere
- ✅ HTTPS enabled (needed for camera, PWA)
- ✅ Bypasses firewall issues
- ✅ Easy to share with team

**Setup:**

```bash
# Install ngrok
brew install ngrok

# Sign up at https://ngrok.com (free)
# Get your auth token

# Configure ngrok
ngrok config add-authtoken YOUR_TOKEN

# Terminal 1: Start Next.js
cd 3arida-app
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io
# Access this from your mobile device
```

---

## 📱 Step-by-Step: Complete Setup

**On your computer:**

```bash
# 1. Navigate to project
cd 3arida-app

# 2. Stop any running servers
lsof -ti:3000 | xargs kill -9

# 3. Start with network access
npm run dev:mobile

# 4. Note the Network URL shown
# Example: Network: http://10.10.183.197:3000

# 5. Verify it works locally
curl http://10.10.183.197:3000
```

**On your mobile device:**

```
1. Open Settings
2. Go to WiFi
3. Check you're on same network as computer
4. Open browser (Chrome or Safari)
5. Type: http://10.10.183.197:3000
6. Press Go
```

---

## 🐛 Still Not Working?

Try these in order:

**Option 1: Restart everything**

```bash
# Kill server
lsof -ti:3000 | xargs kill -9

# Restart WiFi
networksetup -setairportpower en0 off
sleep 2
networksetup -setairportpower en0 on

# Wait 10 seconds for WiFi to reconnect

# Start server
cd 3arida-app
npm run dev:mobile
```

**Option 2: Use different IP**

```bash
# List all IPs
ifconfig | grep "inet " | grep -v 127.0.0.1

# Try each IP from mobile
```

**Option 3: Use ngrok (easiest)**

```bash
# Just use ngrok - it always works
cd 3arida-app
npm run dev

# In another terminal
ngrok http 3000
```

**Option 4: Use Chrome DevTools Device Mode**

```bash
# Test on desktop instead
# Open Chrome DevTools (F12)
# Click device toolbar (Ctrl+Shift+M)
# Select mobile device
# Test there first
```

---

## 💡 Pro Tips

**Tip 1: Create an alias**

```bash
# Add to ~/.zshrc or ~/.bashrc
alias dev-mobile='cd ~/path/to/3arida-app && npm run dev:mobile'

# Then just run:
dev-mobile
```

**Tip 2: Bookmark on mobile**
Save `http://10.10.183.197:3000` as bookmark for quick access

**Tip 3: Use QR code**

```bash
# Install qrencode
brew install qrencode

# Generate QR code
echo "http://10.10.183.197:3000" | qrencode -t UTF8

# Scan with mobile camera
```

**Tip 4: Check connection**

```bash
# Run troubleshooting script
./troubleshoot-mobile-connection.sh
```

---

## 📞 Need More Help?

**Check these files:**

- `LOCAL-MOBILE-TESTING-SETUP.md` - Complete guide
- `MOBILE-TESTING-QUICK-START.md` - Quick start
- `troubleshoot-mobile-connection.sh` - Diagnostic script

**Common solutions:**

1. Use `npm run dev:mobile` instead of `npm run dev`
2. Check firewall settings
3. Verify same WiFi network
4. Use ngrok if all else fails

---

**Most likely fix:** Stop server and restart with `npm run dev:mobile` 🚀
