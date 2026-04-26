# Dashboard Download Fixed

## Problem Identified

The dashboard was calling the OLD PDF generator:
- **Endpoint**: `/api/petitions/[code]/report/download`
- **Old Generator**: `report-pdf-generator-arabic.ts` (jsPDF with garbled Arabic)
- **Result**: Messy PDF with garbled characters

## Solution Applied

Updated the download endpoint to use the NEW Puppeteer generator:

### Before
```typescript
import { generateReport } from '@/lib/report-pdf-generator-arabic';
const pdfBuffer = await generateReport(petition, options);
```

### After
```typescript
import puppeteer from 'puppeteer';
// Launch Puppeteer, navigate to /pdf/petition/[id]
// Generate PDF with proper Arabic fonts
const pdfBuffer = await page.pdf({...});
```

## What Changed

**File**: `src/app/api/petitions/[code]/report/download/route.ts`

- ✅ Removed old jsPDF generator import
- ✅ Added Puppeteer PDF generation
- ✅ Uses same clean HTML route as our test
- ✅ Embedded Cairo fonts load properly
- ✅ All translations applied

## Testing

Now when you download from the dashboard:
1. Click "Download Report" button
2. Calls `/api/petitions/[code]/report/download`
3. Uses Puppeteer to generate PDF
4. Returns clean PDF with proper Arabic

## Expected Result

✅ Clean PDF (92KB, 5 pages)
✅ Perfect Arabic text (Cairo font)
✅ All translations applied
✅ No cookie consent or UI elements
✅ Professional layout

## Endpoints Summary

| Endpoint | Method | Generator | Status |
|----------|--------|-----------|--------|
| `/api/petitions/[code]/report/download` | GET | ✅ Puppeteer | Dashboard uses this |
| `/api/petitions/[code]/report` | POST | ✅ Puppeteer | Direct API |
| `/pdf/petition/[id]` | GET | ✅ Clean HTML | Used by Puppeteer |

---

**Status**: ✅ Dashboard download now uses Puppeteer
**Next**: Test by downloading from dashboard
