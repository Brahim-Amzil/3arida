# Mobile-First Cross-Browser Testing Guide

**Platform:** 3arida Petition Platform  
**Focus:** Mobile-First (Morocco market)  
**Date:** December 2, 2025

---

## 📱 Mobile-First Priority

Morocco has **high mobile usage** - most users will access 3arida on mobile devices. Testing priority:

1. **Mobile Browsers** (80% of users)
2. **Tablet Browsers** (10% of users)
3. **Desktop Browsers** (10% of users)

---

## 🎯 Critical Mobile Browsers (Morocco Market)

### Priority 1: Android (70% market share)

**Chrome Mobile (Android)**

- Most popular browser in Morocco
- Test on Android 10+
- Focus on touch interactions
- Test on 3G/4G networks

**Samsung Internet**

- Pre-installed on Samsung devices
- Popular in Morocco
- Test basic functionality

### Priority 2: iOS (25% market share)

**Safari Mobile (iOS)**

- iPhone users
- Test on iOS 14+
- Check PWA functionality
- Test touch gestures

### Priority 3: Desktop (5% market share)

**Chrome Desktop**

- Admin users
- Petition creators
- Quick verification only

---

## ✅ Mobile Testing Checklist

### 1. Device Testing (Physical Devices)

**Android Devices:**

- [ ] Budget Android (Android 10, 720p screen)
- [ ] Mid-range Android (Android 12, 1080p screen)
- [ ] Flagship Android (Android 13+, high-res screen)

**iOS Devices:**

- [ ] iPhone SE (small screen, 4.7")
- [ ] iPhone 12/13 (standard, 6.1")
- [ ] iPhone 14 Pro Max (large, 6.7")

**Test on each device:**

- [ ] Portrait orientation (primary)
- [ ] Landscape orientation (secondary)
- [ ] Touch interactions (tap, swipe, pinch)
- [ ] Keyboard input
- [ ] Form filling
- [ ] Image upload from camera/gallery

---

### 2. Mobile Browser Testing

**Chrome Mobile (Android) - CRITICAL**

Test URL: `http://localhost:3000` (dev) or `https://3arida.ma` (prod)

- [ ] **Home Page**
  - Loads within 3 seconds on 4G
  - Hero section visible
  - CTA buttons tappable (min 44x44px)
  - Images load properly
  - No horizontal scroll

- [ ] **Registration**
  - Form fields large enough to tap
  - Keyboard appears correctly
  - Email validation works
  - Password visibility toggle works
  - Submit button accessible

- [ ] **Login**
  - Email/password fields work
  - Google OAuth button works
  - Remember me checkbox tappable
  - Forgot password link works

- [ ] **Petition Creation**
  - All form fields accessible
  - Image upload from camera works
  - Image upload from gallery works
  - Category dropdown works
  - Text areas expand properly
  - Submit button always visible

- [ ] **Petition Signing**
  - Phone number input works
  - OTP input works (6 digits)
  - reCAPTCHA works on mobile
  - Signature confirmation shows

- [ ] **Petition Details**
  - Images load and are zoomable
  - Progress bar visible
  - Sign button always accessible
  - Comments section scrollable
  - Share button works

- [ ] **Comments**
  - Comment input expands
  - Keyboard doesn't hide input
  - Reply button works
  - Like button responsive
  - Nested replies visible

- [ ] **Navigation**
  - Hamburger menu works
  - Menu items tappable
  - Back button works
  - Bottom navigation (if any) works

---

**Safari Mobile (iOS) - IMPORTANT**

- [ ] All Chrome Mobile tests above
- [ ] **iOS-Specific:**
  - Safe area insets respected
  - Notch doesn't hide content
  - Bounce scroll works naturally
  - Form autofill works
  - Camera access works
  - Share sheet works

---

**Samsung Internet - VERIFY**

- [ ] Basic functionality works
- [ ] No layout breaks
- [ ] Forms submit correctly

---

### 3. Touch Interaction Testing

**Tap Targets (WCAG 2.1 Level AAA)**

- [ ] All buttons min 44x44px
- [ ] Links have enough spacing
- [ ] Form inputs easy to tap
- [ ] Checkboxes/radios large enough

**Gestures**

- [ ] Swipe to navigate (if applicable)
- [ ] Pull to refresh (if applicable)
- [ ] Pinch to zoom images
- [ ] Long press for context menu

**Scrolling**

- [ ] Smooth scrolling
- [ ] No janky animations
- [ ] Fixed headers stay fixed
- [ ] Infinite scroll works (if applicable)

---

### 4. Mobile Performance Testing

**Network Conditions (Morocco)**

Test with Chrome DevTools Network Throttling:

**Slow 3G (Common in rural areas)**

- [ ] Page loads within 10 seconds
- [ ] Critical content visible within 5 seconds
- [ ] Images lazy load
- [ ] No timeout errors

**Fast 3G (Common in cities)**

- [ ] Page loads within 5 seconds
- [ ] Smooth interactions
- [ ] Images load progressively

**4G (Urban areas)**

- [ ] Page loads within 3 seconds
- [ ] All features work smoothly

**Test on each network:**

- [ ] Home page
- [ ] Petition list
- [ ] Petition details
- [ ] Image upload
- [ ] Form submission

---

### 5. Mobile-Specific Features

**PWA Features**

- [ ] Install prompt appears
- [ ] Add to home screen works
- [ ] App icon displays correctly
- [ ] Splash screen shows
- [ ] Offline page works (if applicable)

**Camera & Media**

- [ ] Camera access permission
- [ ] Take photo works
- [ ] Choose from gallery works
- [ ] Image preview shows
- [ ] Image upload completes

**Notifications**

- [ ] Push notification permission
- [ ] Notifications appear
- [ ] Notification tap opens app
- [ ] Notification actions work

**Geolocation (if used)**

- [ ] Location permission
- [ ] Location detection works
- [ ] Fallback for denied permission

---

### 6. Mobile Form Testing

**Input Types**

- [ ] `type="email"` shows email keyboard
- [ ] `type="tel"` shows number pad
- [ ] `type="number"` shows numeric keyboard
- [ ] `type="url"` shows URL keyboard
- [ ] `type="date"` shows date picker

**Form Behavior**

- [ ] Keyboard doesn't hide submit button
- [ ] Form scrolls to error fields
- [ ] Validation messages visible
- [ ] Autocomplete works
- [ ] Paste works in all fields

**Phone Verification**

- [ ] Phone input accepts Moroccan format (+212)
- [ ] OTP input auto-focuses next field
- [ ] OTP paste works (from SMS)
- [ ] Resend OTP button works
- [ ] Timer countdown visible

---

### 7. Mobile Layout Testing

**Responsive Breakpoints**

Test at these widths:

- [ ] 320px (iPhone SE, small Android)
- [ ] 375px (iPhone 12/13)
- [ ] 390px (iPhone 14 Pro)
- [ ] 414px (iPhone 14 Pro Max)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)

**Layout Checks**

- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Images scale properly
- [ ] Buttons don't overlap
- [ ] Cards stack vertically
- [ ] Modals fit screen
- [ ] Dropdowns don't overflow

---

### 8. Mobile Typography

**Readability**

- [ ] Body text min 16px
- [ ] Headings properly sized
- [ ] Line height comfortable (1.5+)
- [ ] Contrast ratio 4.5:1+
- [ ] No text truncation issues

**Arabic Text (RTL)**

- [ ] Arabic text displays correctly
- [ ] RTL layout works
- [ ] Numbers display correctly
- [ ] Mixed AR/EN text works

---

### 9. Mobile Navigation

**Header**

- [ ] Logo visible and tappable
- [ ] Hamburger menu works
- [ ] Menu slides in smoothly
- [ ] Menu items tappable
- [ ] Close button works

**Footer**

- [ ] Links tappable
- [ ] Doesn't hide content
- [ ] Social icons work
- [ ] Copyright visible

**Tabs/Pills**

- [ ] Tabs scrollable horizontally
- [ ] Active tab highlighted
- [ ] Tap switches tabs
- [ ] Content updates

---

### 10. Mobile Modals & Overlays

**Cookie Consent**

- [ ] Appears on first visit
- [ ] Buttons tappable
- [ ] Doesn't block critical content
- [ ] Can be dismissed
- [ ] Preferences saveable

**Modals**

- [ ] Centers on screen
- [ ] Close button accessible
- [ ] Scrollable if tall
- [ ] Backdrop dismisses (optional)
- [ ] Keyboard doesn't hide content

**Dropdowns**

- [ ] Opens on tap
- [ ] Options tappable
- [ ] Scrollable if many options
- [ ] Closes on selection
- [ ] Closes on outside tap

---

## 🔧 Testing Tools

### Browser DevTools

**Chrome DevTools (Desktop)**

```
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test responsive behavior
```

**Responsive Devices to Test:**

- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPhone 14 Pro Max (430x932)
- Pixel 5 (393x851)
- Samsung Galaxy S20 (360x800)
- iPad (768x1024)

### Network Throttling

**Chrome DevTools Network Tab:**

- Slow 3G: 400ms RTT, 400kb/s down, 400kb/s up
- Fast 3G: 150ms RTT, 1.6Mb/s down, 750kb/s up
- 4G: 20ms RTT, 4Mb/s down, 3Mb/s up

### Remote Debugging

**Android (Chrome)**

```bash
# Enable USB debugging on Android
# Connect device via USB
# Open chrome://inspect in desktop Chrome
# Click "inspect" on your device
```

**iOS (Safari)**

```bash
# Enable Web Inspector on iOS (Settings > Safari > Advanced)
# Connect device via USB
# Open Safari > Develop > [Your Device]
# Select page to inspect
```

---

## 🐛 Common Mobile Issues to Check

### Layout Issues

- [ ] Horizontal scroll on small screens
- [ ] Content cut off by notch/safe area
- [ ] Fixed elements overlap content
- [ ] Modals too large for screen
- [ ] Images overflow container

### Touch Issues

- [ ] Buttons too small to tap
- [ ] Links too close together
- [ ] Accidental taps on nearby elements
- [ ] Double-tap zoom interferes
- [ ] Swipe gestures conflict

### Performance Issues

- [ ] Slow page load on 3G
- [ ] Images too large
- [ ] Too many network requests
- [ ] JavaScript blocking render
- [ ] Memory leaks on long sessions

### Form Issues

- [ ] Keyboard hides submit button
- [ ] Input fields too small
- [ ] Validation errors not visible
- [ ] Autocomplete doesn't work
- [ ] Can't paste in fields

### Browser-Specific Issues

- [ ] Safari: 100vh includes address bar
- [ ] Safari: Date picker format
- [ ] Chrome: Autofill styling
- [ ] Samsung: Default zoom level
- [ ] iOS: Bounce scroll on fixed elements

---

## ✅ Mobile Testing Script

Run this test flow on each mobile browser:

### Quick Test (5 minutes)

1. Open home page
2. Tap "Get Started"
3. Fill registration form
4. Submit form
5. Check email verification
6. Browse petitions
7. Tap a petition
8. Scroll through details
9. Tap "Sign Petition"
10. Complete phone verification

### Full Test (15 minutes)

1. Complete Quick Test above
2. Create a petition
3. Upload image from camera
4. Submit petition
5. View dashboard
6. Add comment to petition
7. Reply to comment
8. Like a comment
9. Share petition
10. Test admin functions (if admin)
11. Logout and login again
12. Test forgot password

---

## 📊 Mobile Testing Report Template

```markdown
## Mobile Test Report

**Date:** [Date]
**Tester:** [Name]
**Device:** [Device Model]
**OS:** [OS Version]
**Browser:** [Browser Name & Version]
**Network:** [3G/4G/WiFi]

### Test Results

#### Home Page

- Load Time: [X seconds]
- Layout: ✅ / ❌
- Images: ✅ / ❌
- Buttons: ✅ / ❌
- Issues: [List any issues]

#### Registration

- Form: ✅ / ❌
- Validation: ✅ / ❌
- Submit: ✅ / ❌
- Issues: [List any issues]

[Continue for each section...]

### Critical Issues

1. [Issue description]
2. [Issue description]

### Minor Issues

1. [Issue description]
2. [Issue description]

### Recommendations

1. [Recommendation]
2. [Recommendation]
```

---

## 🚀 Next Steps

After mobile testing:

1. **Fix Critical Issues** - Blocking launch
2. **Fix High Priority Issues** - Should fix before launch
3. **Document Minor Issues** - Fix post-launch
4. **Update Documentation** - Note any mobile-specific behavior
5. **Retest** - Verify fixes work on mobile

---

**Status:** Ready for mobile-first testing  
**Priority:** Test on Android Chrome first (70% of users)  
**Timeline:** 2-3 hours for comprehensive mobile testing
