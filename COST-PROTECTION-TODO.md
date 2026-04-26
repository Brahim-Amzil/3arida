# Cost Protection TODO List - COMPLETE EDITION

## ✅ PHASE 1: COMPLETED (Basic Protection)

### ✅ TODO #1: Rate Limiting Middleware
**Status:** ✅ COMPLETED - middleware.ts created

### ✅ TODO #2: Firestore Security Rules  
**Status:** ✅ COMPLETED - 50KB petition, 5KB signature limits

### ✅ TODO #3: Storage Security Rules
**Status:** ✅ COMPLETED - 3MB image limit

### ✅ TODO #4: Firebase Budget Alerts
**Status:** ✅ COMPLETED - €10 alert set

### ✅ TODO #5: Vercel Spending Limit
**Status:** ✅ N/A - Hobby plan has built-in hard limits (100GB/month)

### ✅ TODO #6: Vercel Analytics
**Status:** ✅ COMPLETED - Packages installed and added to layout

### ✅ TODO #7: Security Audit
**Status:** ✅ COMPLETED - Audit report created

### ✅ TODO #8: Image Optimization Config
**Status:** ✅ COMPLETED - next.config.mjs updated

---

## 🔍 PHASE 2: CODE AUDIT (Verify Existing Implementation)

### ⏳ TODO #9: Verify Signature Counter Implementation (15 min)
**Priority:** HIGH - Prevents 99% of read costs  
**From:** Cost-saving-warning.md #1

**What to check:**
1. Verify petition documents have `currentSignatures` field
2. Ensure NO code uses `.count()` on signatures collection
3. Confirm signatures increment the counter atomically

**How to verify:**
```bash
# Search for dangerous patterns
grep -r "\.count()" src/
grep -r "signatures.*length" src/
```

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #10: Audit Pagination Implementation (15 min)
**Priority:** HIGH - Prevents expensive offset reads  
**From:** Cost-saving-warning.md #4

**What to check:**
1. Search for `.offset()` usage (BAD)
2. Verify using `.startAfter(lastDoc)` (GOOD)
3. Check pagination in signatures list, petitions list

**How to verify:**
```bash
# Search for bad patterns
grep -r "\.offset(" src/
grep -r "startAfter" src/
```

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #11: Audit Real-time Listeners (20 min)
**Priority:** MEDIUM - Prevents exponential read costs  
**From:** Cost-saving-warning.md #3

**What to check:**
1. Find all `onSnapshot` usage
2. Verify only used for counters, not full lists
3. Ensure lists use `.get()` with pagination

**How to verify:**
```bash
# Find all real-time listeners
grep -r "onSnapshot" src/
```

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #12: Verify Image Lazy Loading (10 min)
**Priority:** MEDIUM - Reduces bandwidth  
**From:** Cost-saving-warning.md #2

**What to check:**
1. All `<img>` tags have `loading="lazy"`
2. Next.js `<Image>` components configured properly

**How to verify:**
```bash
grep -r "<img" src/ | grep -v "loading="
```

**Status:** ⬜ NOT STARTED

---

## 🛠️ PHASE 3: IMPLEMENTATION (New Features Needed)

### ⏳ TODO #13: Restrict Firebase API Key (10 min)
**Priority:** HIGH - Prevents API hijacking  
**From:** Cost-saving-warning.md - Monitoring #2

**What to do:**
1. Go to Google Cloud Console
2. APIs & Services > Credentials
3. Find your API key
4. Add "HTTP referrers" restriction
5. Add: `https://yourdomain.com/*` and `http://localhost:3000/*`

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #14: Add Client-Side Image Compression (30 min)
**Priority:** HIGH - Reduces storage & bandwidth by 80%  
**From:** Cost-saving-warning.md #2

**What to do:**
1. Install: `npm install browser-image-compression`
2. Add compression before upload in petition creation
3. Max width: 1200px, quality: 0.8

**Code snippet:**
```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true
};
const compressedFile = await imageCompression(file, options);
```

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #15: Set Firestore Daily Read Quota (5 min)
**Priority:** MEDIUM - Emergency brake  
**From:** Cost-saving-warning.md - Emergency Budget Cap

**What to do:**
1. Go to Google Cloud Console
2. IAM & Admin > Quotas
3. Search "Firestore"
4. Set daily read limit: 50,000

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #16: Implement Maintenance Mode (45 min)
**Priority:** MEDIUM - Emergency kill switch  
**From:** Cost-saving-warning.md - Maintenance Mode Strategy

**What to do:**
1. Set up Firebase Remote Config
2. Add `is_maintenance_mode` boolean
3. Create MaintenancePage component
4. Wrap app in conditional check

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #17: Add Cache Headers for Static Assets (15 min)
**Priority:** LOW - Reduces Vercel requests  
**From:** Cost-saving-warning.md #2

**What to do:**
1. Update `next.config.mjs`
2. Add headers for static assets
3. Set `Cache-Control: max-age=31536000` for images/fonts

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #18: Disable Unused Firestore Indexes (10 min)
**Priority:** LOW - Reduces write costs  
**From:** Cost-saving-warning.md - Summary Table

**What to do:**
1. Go to Firebase Console > Firestore > Indexes
2. Review single-field indexes
3. Disable indexes for fields you don't query

**Status:** ⬜ NOT STARTED

---

### ⏳ TODO #19: Add Write Debouncing (20 min)
**Priority:** LOW - Prevents spam writes  
**From:** Cost-saving-warning.md #3

**What to do:**
1. Add debounce to like/follow buttons
2. Prevent rapid-fire writes
3. Use lodash debounce or custom hook

**Status:** ⬜ NOT STARTED

---

## 📊 PROGRESS SUMMARY

**Phase 1 (Basic Protection):** 8/8 ✅ COMPLETE  
**Phase 2 (Code Audit):** 0/4 ⬜ NOT STARTED  
**Phase 3 (New Features):** 0/7 ⬜ NOT STARTED

**Overall:** 8/19 tasks (42%)

---

## 🎯 RECOMMENDED ORDER

### Do NOW (Before Launch):
1. ✅ Phase 1 - DONE
2. ⏳ TODO #9 - Verify signature counter
3. ⏳ TODO #10 - Audit pagination
4. ⏳ TODO #13 - Restrict API key

### Do THIS WEEK:
5. ⏳ TODO #14 - Image compression
6. ⏳ TODO #11 - Audit listeners
7. ⏳ TODO #15 - Set read quota

### Do BEFORE VIRAL:
8. ⏳ TODO #16 - Maintenance mode
9. ⏳ TODO #12 - Lazy loading
10. ⏳ TODO #17 - Cache headers

### Do EVENTUALLY:
11. ⏳ TODO #18 - Disable unused indexes
12. ⏳ TODO #19 - Write debouncing

---

## 🚨 CRITICAL PATH TO LAUNCH

**Minimum viable protection (can launch):**
- ✅ Rate limiting
- ✅ Size limits
- ✅ Budget alerts
- ⏳ Verify signature counter (TODO #9)
- ⏳ Restrict API key (TODO #13)

**After these 2 audits, you're safe to launch!**

---

## 📝 NOTES

- Phase 1 protects against ABUSE (spam, bots, huge files)
- Phase 2 protects against VIRAL COSTS (read optimization)
- Phase 3 adds ADVANCED PROTECTION (emergency controls)

Current protection level: **7/10** (good for launch)  
After Phase 2: **9/10** (excellent)  
After Phase 3: **10/10** (bulletproof)
