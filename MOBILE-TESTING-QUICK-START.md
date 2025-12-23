# Mobile Testing - Quick Start Guide

**Goal:** Test 3arida app on your mobile device in 2 minutes

---

## 🚀 Super Quick Method (Recommended)

### Option 1: Automated Script

```bash
cd 3arida-app
./start-mobile-testing.sh
```

The script will:

- ✅ Find your IP address automatically
- ✅ Show QR code (if qrencode installed)
- ✅ Display mobile access URL
- ✅ Start Next.js with network access

Then on your mobile:

1. Connect to same WiFi
2. Scan QR code OR type the URL shown
3. Start testing!

---

### Option 2: Manual (2 commands)

```bash
# 1. Get your IP address
ipconfig getifaddr en0

# 2. Start Next.js with network access
cd 3arida-app
npm run dev:mobile
```

Then on your mobile:

1. Connect to same WiFi
2. Open browser
3. Go to: `http://YOUR_IP:3000` (replace YOUR_IP with the IP from step 1)

**Example:** If your IP is `192.168.1.100`, go to `http://192.168.1.100:3000`

---

## 📱 What to Test

Quick 5-minute test:

1. **Home page** - Does it load?
2. **Register** - Can you create account?
3. **Login** - Can you sign in?
4. **Create petition** - Can you upload image from camera?
5. **Sign petition** - Does phone verification work?
6. **Comments** - Can you add comment?

---

## 🐛 Troubleshooting

### Can't connect from mobile?

**Check 1:** Same WiFi network?

- Computer and mobile must be on SAME WiFi

**Check 2:** Correct IP address?

```bash
# Try this command
ipconfig getifaddr en0
```

**Check 3:** Firewall blocking?

- macOS: System Preferences > Security & Privacy > Firewall
- Allow Node.js through firewall

### Need HTTPS for camera/PWA features?

Use ngrok instead:

```bash
# Terminal 1
cd 3arida-app
npm run dev

# Terminal 2
ngrok http 3000

# Access the https:// URL shown by ngrok
```

---

## 💡 Pro Tips

### Tip 1: Bookmark the URL on mobile

Save `http://YOUR_IP:3000` as bookmark for quick access

### Tip 2: Add to home screen

Test PWA features by adding to home screen

### Tip 3: Use Chrome DevTools

Connect via USB and debug from desktop:

- Android: `chrome://inspect`
- iOS: Safari > Develop > [Your Device]

---

## 📚 More Info

- **Detailed guide:** LOCAL-MOBILE-TESTING-SETUP.md
- **Full testing checklist:** MOBILE-FIRST-TESTING.md
- **Test script:** test-mobile-compatibility.js

---

**That's it!** You're ready to test on mobile. 🎉
