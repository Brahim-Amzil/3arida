# Firestore Undefined Values Fix

## Issue
500 Internal Server Error when recording download:
```
Cannot use "undefined" as a Firestore value (found in field "reportDownloadHistory.0.paymentId")
```

## Root Cause
The `recordDownload` function was creating a `DownloadRecord` object with optional fields (`paymentId`, `ipAddress`) that could be `undefined`. Firestore rejects documents containing `undefined` values.

## Solution
Modified the `recordDownload` function to only include optional fields if they have actual values:

### Before (Broken)
```typescript
const newRecord: DownloadRecord = {
  downloadedAt: new Date(),
  downloadedBy: userId,
  downloadNumber: currentDownloads + 1,
  paymentId,        // Could be undefined ❌
  ipAddress,        // Could be undefined ❌
};
```

### After (Fixed)
```typescript
const newRecord: any = {
  downloadedAt: new Date(),
  downloadedBy: userId,
  downloadNumber: currentDownloads + 1,
};

// Only add optional fields if they have values
if (paymentId) {
  newRecord.paymentId = paymentId;
}
if (ipAddress) {
  newRecord.ipAddress = ipAddress;
}
```

## File Modified
- `src/lib/report-download-tracker.ts`

## Testing
1. Restart dev server
2. Try downloading a petition report
3. Should now successfully record the download and generate PDF

## Status
✅ Fixed - Undefined values are now excluded from Firestore documents
