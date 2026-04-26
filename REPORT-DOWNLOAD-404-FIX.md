# Report Download 404 Error - Fixed

## Issue
When trying to download a petition report, users encountered a 404 error:
```
POST http://localhost:3000/api/petitions/RhcqoOtk3Zcx08JuxmvZ/report/generate 404 (Not Found)
Error: Petition not found
```

## Root Cause
The `ReportDownloadButton` component was sending either `petition.referenceCode` OR `petition.id` to the API:
```typescript
const response = await fetch(`/api/petitions/${petition.referenceCode || petition.id}/report/generate`, ...)
```

However, the API routes were **only** querying by the `referenceCode` field:
```typescript
const petitionsSnapshot = await adminDb
  .collection('petitions')
  .where('referenceCode', '==', referenceCode)
  .limit(1)
  .get();
```

When a petition didn't have a `referenceCode` set (older petitions or those created before the reference code system), the button would send the Firestore document ID (e.g., `RhcqoOtk3Zcx08JuxmvZ`). The API would then try to find a petition where `referenceCode == 'RhcqoOtk3Zcx08JuxmvZ'`, which doesn't exist, resulting in a 404.

## Solution
Updated both API routes to handle **both** lookup methods:

1. **First attempt**: Query by `referenceCode` field
2. **Fallback**: If not found, query by document ID directly

### Files Modified

#### 1. `src/app/api/petitions/[code]/report/generate/route.ts`
```typescript
// Try to find petition by reference code first
let petitionsSnapshot = await adminDb
  .collection('petitions')
  .where('referenceCode', '==', code)
  .limit(1)
  .get();

let petition: Petition | null = null;

if (!petitionsSnapshot.empty) {
  const petitionDoc = petitionsSnapshot.docs[0];
  petition = { id: petitionDoc.id, ...petitionDoc.data() } as Petition;
} else {
  // If not found by reference code, try by document ID
  try {
    const petitionDoc = await adminDb.collection('petitions').doc(code).get();
    if (petitionDoc.exists) {
      petition = { id: petitionDoc.id, ...petitionDoc.data() } as Petition;
    }
  } catch (error) {
    console.error('Error fetching petition by ID:', error);
  }
}

if (!petition) {
  return NextResponse.json(
    { success: false, error: { code: 'NOT_FOUND', message: 'Petition not found' } },
    { status: 404 },
  );
}
```

#### 2. `src/app/api/petitions/[code]/report/download/route.ts`
Applied the same dual-lookup logic to ensure downloads work regardless of how the petition is identified.

## Benefits
- ✅ Works with petitions that have `referenceCode` set
- ✅ Works with older petitions that only have document IDs
- ✅ No breaking changes to existing functionality
- ✅ Maintains all access control and payment logic
- ✅ Backward compatible with all petition data

## Testing
To verify the fix:
1. Find a petition without a `referenceCode` (check Firestore)
2. Try to download the report from the UI
3. Should now successfully generate and download the PDF

## Alternative Approaches Considered
1. **Update all petitions to have referenceCode**: Would require a migration script and doesn't solve the immediate problem
2. **Change the button to always use referenceCode**: Would break for petitions without it
3. **Current solution**: Most flexible and backward-compatible ✅

## Status
✅ **Fixed** - Both API routes now handle petition lookup by either referenceCode or document ID

---

## Update: 500 Internal Server Error Fix

### Additional Issue Found
After fixing the 404 error, a 500 Internal Server Error occurred:
```
GET http://localhost:3000/api/petitions/RhcqoOtk3Zcx08JuxmvZ/report/download 500 (Internal Server Error)
Error: Failed to download report
```

### Root Cause
The jsPDF library (version 4.1.0) exports the constructor as a named export, not a default export. The import statement was incorrect:

**Incorrect:**
```typescript
import jsPDF from 'jspdf';  // ❌ This doesn't work
```

**Correct:**
```typescript
import { jsPDF } from 'jspdf';  // ✅ This works
```

### Solution
Fixed the import statement in `src/lib/report-pdf-generator.ts`:

```typescript
// Before
import jsPDF from 'jspdf';

// After
import { jsPDF } from 'jspdf';
```

### Files Modified (Additional)
- `src/lib/report-pdf-generator.ts` - Fixed jsPDF import
- `src/app/api/petitions/[code]/report/download/route.ts` - Added detailed logging

### Testing
Run the test script to verify PDF generation works:
```bash
node -e "const { jsPDF } = require('jspdf'); const doc = new jsPDF(); doc.text('Test', 20, 20); console.log('✅ PDF works!');"
```

## Final Status
✅ **Both issues fixed**:
1. 404 error - API now handles both referenceCode and petition ID
2. 500 error - jsPDF import corrected

The report download feature should now work end-to-end.
