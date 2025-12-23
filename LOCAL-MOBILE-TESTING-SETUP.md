# Testing Local App on Mobile Devices

**Platform:** 3arida Next.js App  
**Goal:** Access localhost:3000 from mobile devices  
**Date:** December 1, 2025

---

## 🎯 Quick Start (Recommended Method)

### Method 1: Local Network Access (Easiest)

**Requirements:**

- Computer and mobile device on same WiFi network
- Next.js dev server running

**Steps:**

1. **Find Your Computer's Local IP Address**

   **On macOS:**

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

   Look for something like: `192.168.1.100`

   **Or use this simpler command:**

   ```bash
   ipconfig getifaddr en0
   ```

2. **Start Next.js with Network Access**

   ```bash
   cd 3arida-app
   npm run dev -- -H 0.0.0.0
   ```

   Or add to package.json:

   ```json
   {
     "scripts": {
       "dev": "next dev",
       "dev:mobile": "next dev -H 0.0.0.0"
     }
   }
   ```

   Then run:

   ```bash
   npm run dev:mobile
   ```

3. **Access from Mobile Device**

   On your mobile device, open browser and go to:

   ```
   http://192.168.1.100:3000
   ```

   (Replace with your actual IP address)

4. **Test the App**
   - Browse pages
   - Test forms
   - Test camera upload
   - Test phone verification

---

## 📱 Method 2: ngrok (Best for Remote Testing)

**Use when:** You need to test from anywhere, not just local network

**Setup:**

1. **Install ngrok**

   ```bash
   # macOS
   brew install ngrok

   # Or download from https://ngrok.com/download
   ```

2. **Sign up for free account**
   - Go to https://ngrok.com/signup
   - Get your auth token

3. **Configure ngrok**

   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. **Start Next.js**

   ```bash
   cd 3arida-app
   npm run dev
   ```

5. **Start ngrok in another terminal**

   ```bash
   ngrok http 3000
   ```

6. **Access from Mobile**
   - ngrok will show a URL like: `https://abc123.ngrok.io`
   - Open this URL on your mobile device
   - Works from anywhere with internet!

**Advantages:**

- ✅ Works from anywhere (not just local network)
- ✅ HTTPS enabled (test PWA features)
- ✅ Share with team members
- ✅ Test on multiple devices simultaneously

**Free tier limits:**

- 1 online ngrok process
- 40 connections/minute
- Random URL (changes each restart)

---

## 🔧 Method 3: Tailscale (Best for Team Testing)

**Use when:** Multiple team members need to test

**Setup:**

1. **Install Tailscale**

   ```bash
   # macOS
   brew install tailscale
   ```

2. **Start Tailscale**

   ```bash
   sudo tailscale up
   ```

3. **Install Tailscale on mobile devices**
   - iOS: App Store
   - Android: Play Store

4. **Start Next.js**

   ```bash
   cd 3arida-app
   npm run dev
   ```

5. **Access from Mobile**
   - Get your Tailscale IP: `tailscale ip -4`
   - Access: `http://100.x.x.x:3000`

---

## 🚀 Method 4: Vercel Preview (Production-like)

**Use when:** You want to test in production-like environment

**Setup:**

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel Preview**

   ```bash
   cd 3arida-app
   vercel
   ```

3. **Access Preview URL**
   - Vercel will give you a URL like: `https://3arida-app-xyz.vercel.app`
   - Access from any device
   - HTTPS enabled
   - Production-like environment

---

## 📋 Step-by-Step: Local Network Method (Detailed)

### Step 1: Get Your IP Address

```bash
# Run this command
ipconfig getifaddr en0
```

**Example output:** `192.168.1.100`

If that doesn't work, try:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Step 2: Update Next.js Config (Optional)

Create or update `3arida-app/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config

  // Allow access from local network
  experimental: {
    // This is usually not needed, Next.js allows it by default
  },
};

module.exports = nextConfig;
```

### Step 3: Start Dev Server

```bash
cd 3arida-app

# Start with network access
npm run dev -- -H 0.0.0.0

# You should see:
# - Local:    http://localhost:3000
# - Network:  http://192.168.1.100:3000
```

### Step 4: Connect Mobile Device

**On your mobile device:**

1. **Connect to same WiFi** as your computer
2. **Open browser** (Chrome on Android, Safari on iOS)
3. **Type URL:** `http://192.168.1.100:3000`
4. **Bookmark it** for easy access

### Step 5: Test the App

Run through the mobile testing checklist:

- [ ] Home page loads
- [ ] Registration works
- [ ] Login works
- [ ] Create petition
- [ ] Upload image from camera
- [ ] Sign petition
- [ ] Test phone verification

---

## 🐛 Troubleshooting

### Issue: Can't connect from mobile

**Check 1: Same WiFi Network**

```bash
# On computer, check WiFi name
networksetup -getairportnetwork en0

# On mobile, check WiFi settings
# Make sure it's the EXACT same network
```

**Check 2: Firewall**

```bash
# macOS - Allow Node.js through firewall
# System Preferences > Security & Privacy > Firewall > Firewall Options
# Make sure Node.js is allowed
```

**Check 3: Correct IP**

```bash
# Double-check your IP
ipconfig getifaddr en0

# Try all network interfaces
ifconfig | grep "inet "
```

**Check 4: Port 3000 accessible**

```bash
# Check if port 3000 is listening
lsof -i :3000
```

### Issue: HTTPS required for some features

**Solution:** Use ngrok or Vercel preview

Some features require HTTPS:

- Camera access
- Geolocation
- Push notifications
- Service workers

### Issue: Slow loading on mobile

**Check network speed:**

```bash
# Use Chrome DevTools Network throttling
# Or test on actual 3G/4G network
```

### Issue: Firebase Auth not working

**Update Firebase Console:**

1. Go to Firebase Console
2. Authentication > Settings > Authorized domains
3. Add your local IP: `192.168.1.100`
4. Or use ngrok URL

---

## 🎯 Recommended Testing Flow

### For Quick Testing (Local Network)

```bash
# Terminal 1: Start Next.js
cd 3arida-app
npm run dev -- -H 0.0.0.0

# Get your IP
ipconfig getifaddr en0

# Access from mobile:
# http://YOUR_IP:3000
```

### For Full Testing (ngrok)

```bash
# Terminal 1: Start Next.js
cd 3arida-app
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Access from mobile:
# https://abc123.ngrok.io
```

### For Production Testing (Vercel)

```bash
# Deploy to preview
cd 3arida-app
vercel

# Access from mobile:
# https://3arida-app-xyz.vercel.app
```

---

## 📱 Mobile Testing Checklist

Once connected, test these:

### Basic Functionality

- [ ] Home page loads
- [ ] Images display
- [ ] Navigation works
- [ ] Forms work
- [ ] Buttons are tappable

### Authentication

- [ ] Register with email
- [ ] Login with email
- [ ] Google OAuth (may need HTTPS)
- [ ] Logout

### Petition Features

- [ ] Browse petitions
- [ ] View petition details
- [ ] Create petition
- [ ] Upload image from camera
- [ ] Upload image from gallery
- [ ] Sign petition
- [ ] Phone verification
- [ ] Comment on petition

### Mobile-Specific

- [ ] Touch interactions smooth
- [ ] No horizontal scroll
- [ ] Keyboard doesn't hide buttons
- [ ] Camera access works
- [ ] Images load quickly
- [ ] No layout issues

---

## 🔒 Security Notes

### Local Network Testing

- ✅ Safe for development
- ✅ Only accessible on your WiFi
- ⚠️ Don't use on public WiFi

### ngrok Testing

- ✅ Temporary URL
- ✅ HTTPS enabled
- ⚠️ Don't share URL publicly
- ⚠️ URL expires when ngrok stops

### Vercel Preview

- ✅ Production-like environment
- ✅ HTTPS enabled
- ⚠️ Preview URLs are public
- ⚠️ Use for testing only

---

## 💡 Pro Tips

### Tip 1: Create QR Code for Easy Access

```bash
# Install qrencode
brew install qrencode

# Generate QR code for your local URL
echo "http://192.168.1.100:3000" | qrencode -t UTF8
```

Scan with mobile camera to access instantly!

### Tip 2: Use Chrome Remote Debugging

**Android:**

1. Enable USB debugging on Android
2. Connect via USB
3. Open `chrome://inspect` on desktop Chrome
4. Debug mobile browser from desktop

**iOS:**

1. Enable Web Inspector on iOS
2. Connect via USB
3. Open Safari > Develop > [Your Device]
4. Debug mobile Safari from desktop

### Tip 3: Save as Home Screen App

On mobile browser:

- **iOS:** Share > Add to Home Screen
- **Android:** Menu > Add to Home Screen

Test PWA functionality!

### Tip 4: Test on Slow Network

Use Chrome DevTools:

1. Open DevTools (F12)
2. Network tab
3. Throttling dropdown
4. Select "Slow 3G" or "Fast 3G"

---

## 📊 Quick Reference

| Method        | Speed  | HTTPS | Remote | Best For        |
| ------------- | ------ | ----- | ------ | --------------- |
| Local Network | Fast   | ❌    | ❌     | Quick testing   |
| ngrok         | Medium | ✅    | ✅     | Full testing    |
| Tailscale     | Fast   | ❌    | ✅     | Team testing    |
| Vercel        | Fast   | ✅    | ✅     | Production-like |

---

## 🚀 Next Steps

1. **Choose a method** (Local Network for quick testing)
2. **Start dev server** with network access
3. **Connect mobile device** to same WiFi
4. **Access the app** using your IP address
5. **Run mobile tests** from MOBILE-FIRST-TESTING.md
6. **Fix any issues** found
7. **Retest** on mobile

---

**Ready to test!** Start with Local Network method for quickest setup.
