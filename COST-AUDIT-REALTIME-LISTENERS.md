# Real-time Listeners Audit Report
**Date:** February 16, 2026  
**Status:** ⚠️ MIXED - Some Good, Some Concerns

---

## Summary

Found 5 `onSnapshot` usages in the codebase. Most are acceptable, but **RealtimeDashboard** and **notifications** need optimization.

---

## ✅ SAFE Usage (3/5)

### 1. WhatsAppPhoneVerification.tsx
**What it listens to:** Single user document (`users/{uid}`)  
**Why it's safe:** 
- Only listens to ONE document (the current user)
- Only active during verification flow (temporary)
- Reads: 1 per verification attempt

**Verdict:** ✅ SAFE

---

### 2. AuthProvider.tsx
**What it listens to:** Single user document (`users/{uid}`)  
**Why it's safe:**
- Only listens to ONE document (the current user's profile)
- Active only when user is logged in
- Reads: 1 per session

**Verdict:** ✅ SAFE

---

### 3. useRealtimePetition.ts
**What it listens to:** Single petition document (`petitions/{id}`)  
**Why it's safe:**
- Only listens to ONE petition at a time
- Used when viewing a specific petition page
- Reads: 1 per page view

**Verdict:** ✅ SAFE

---

## ⚠️ NEEDS OPTIMIZATION (2/5)

### 4. RealtimeDashboard.tsx ⚠️
**What it listens to:** ALL user's petitions  
**Current behavior:**
```typescript
onSnapshot(userPetitionsQuery, (snapshot) => {
  snapshot.forEach((doc) => {
    // Processes ALL petitions
  })
})
```

**The problem:**
- If a user has 50 petitions, this reads 50 documents on EVERY update
- If ANY petition changes, ALL 50 are re-read
- Cost: 50 reads per update × number of updates

**Recommended fix:**
Replace with `.get()` and manual refresh button

**Verdict:** ⚠️ OPTIMIZE - Replace with `.get()` + manual refresh

---

### 5. notifications.ts ⚠️
**What it listens to:** ALL user notifications  
**Current behavior:**
```typescript
onSnapshot(notificationsQuery, (snapshot) => {
  snapshot.forEach((doc) => {
    // Processes ALL notifications
  })
})
```

**The problem:**
- If a user has 100 notifications, this reads 100 documents on EVERY new notification
- Cost: 100 reads per notification received

**Recommended fix:**
Add `.limit(20)` to only listen to recent notifications

**Verdict:** ⚠️ OPTIMIZE - Add limit(20)

---

## 📊 Cost Impact Analysis

### Current State (if user has 50 petitions, 100 notifications):
- WhatsApp verification: 1 read ✅
- Auth provider: 1 read ✅
- Petition view: 1 read ✅
- Dashboard: 50 reads per update ⚠️
- Notifications: 100 reads per new notification ⚠️

### After Optimization:
- Dashboard: 0 reads (use .get() instead) ✅
- Notifications: 20 reads per new notification ✅

**Savings:** ~80% reduction in real-time listener costs

---

## 🎯 Action Items

### Priority 1: Fix Notifications (5 min)
Add `.limit(20)` to notifications query in `src/lib/notifications.ts`

### Priority 2: Fix Dashboard (15 min)
Replace `onSnapshot` with `getDocs` in `src/components/dashboard/RealtimeDashboard.tsx`

---

## ✅ Conclusion

**Overall verdict:** Not critical, but optimization recommended before viral traffic.

The 3 single-document listeners are fine. The 2 collection listeners (dashboard, notifications) should be optimized to prevent exponential costs at scale.
