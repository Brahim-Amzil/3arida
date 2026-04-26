# Firestore Timestamp Conversion Fix

## Issue
500 Internal Server Error when generating PDF report due to Firestore Timestamp objects not being properly converted to JavaScript Date objects.

## Root Cause
When fetching petition data from Firestore using the Admin SDK, timestamp fields (like `createdAt`, `updatedAt`) are returned as Firestore Timestamp objects, not JavaScript Date objects. The PDF generator was trying to use `new Date(petition.createdAt)` which failed because `petition.createdAt` was a Timestamp object, not a string or number.

## Solution
Added a `convertFirestoreData()` helper function that:
1. Iterates through all petition fields
2. Detects Firestore Timestamp objects (objects with `toDate()` method)
3. Converts them to ISO string format
4. Handles timestamps in arrays as well

### Code Added
```typescript
function convertFirestoreData(data: any): any {
  const converted: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && 'toDate' in value) {
      // Convert Firestore Timestamp to ISO string
      converted[key] = value.toDate().toISOString();
    } else if (Array.isArray(value)) {
      // Handle arrays (might contain timestamps)
      converted[key] = value.map(item => 
        item && typeof item === 'object' && 'toDate' in item 
          ? item.toDate().toISOString() 
          : item
      );
    } else {
      converted[key] = value;
    }
  }
  
  return converted;
}
```

### Usage
```typescript
const rawData = petitionDoc.data();
const convertedData = convertFirestoreData(rawData);
petition = { id: petitionDoc.id, ...convertedData } as Petition;
```

## Files Modified
- `src/app/api/petitions/[code]/report/generate/route.ts`
- `src/app/api/petitions/[code]/report/download/route.ts`

## Testing
1. Restart dev server
2. Try downloading a petition report
3. Should now successfully generate PDF without timestamp errors

## Status
✅ Fixed - Firestore Timestamps are now properly converted before PDF generation
