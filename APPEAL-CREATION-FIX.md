# Appeal Creation Fix

**Date:** February 3, 2026  
**Status:** ✅ Fixed

## Problem

Appeal creation was failing with a 500 Internal Server Error.

## Root Cause

The Client SDK cannot run in server-side API routes - it needs browser context.

## Solution

**Removed the API route** and made the modal call Firestore directly using the Client SDK.

### Changes Made

**Updated `src/components/moderation/ContactModeratorModal.tsx`**

- Added: `import { createAppeal } from '@/lib/appeals-service'`
- Removed API fetch call
- Now calls `createAppeal()` directly from the client

### Why This Works

1. ✅ Client SDK runs in browser
2. ✅ Firestore rules provide security
3. ✅ Simpler architecture
4. ✅ Better error messages
5. ✅ No credentials needed

## Files Modified

1. `src/components/moderation/ContactModeratorModal.tsx`

---

**Status:** ✅ Working
