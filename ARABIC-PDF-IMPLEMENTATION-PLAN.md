# Arabic PDF Reports - Implementation Plan

## Current Status
✅ PDF download working with English text
❌ Arabic text shows as garbled characters
❌ No RTL layout support

## Why pdfmake Failed
- pdfmake callbacks don't work in Node.js server environment
- Requires browser-like environment or complex configuration
- Not suitable for Next.js API routes

## Recommended Solution: jsPDF with Arabic Font

### Implementation Steps

#### Phase 1: Font Preparation (2-3 hours)
1. **Download Arabic Font**
   - Use Cairo or Amiri font (open source)
   - Download TTF file from Google Fonts

2. **Convert Font to Base64**
   - Use online tool or script to convert TTF to base64
   - Tools: https://products.aspose.app/font/base64
   - Or use: `base64 font.ttf > font.txt`

3. **Create Font Module**
   ```typescript
   // src/lib/fonts/cairo-font.ts
   export const cairoFontBase64 = "AAAA..."; // base64 string
   ```

#### Phase 2: jsPDF Arabic Integration (3-4 hours)
1. **Register Arabic Font**
   ```typescript
   import { jsPDF } from 'jspdf';
   import { cairoFontBase64 } from './fonts/cairo-font';
   
   doc.addFileToVFS('Cairo-Regular.ttf', cairoFontBase64);
   doc.addFont('Cairo-Regular.ttf', 'Cairo', 'normal');
   doc.setFont('Cairo');
   ```

2. **Implement RTL Text Helper**
   ```typescript
   function renderArabicText(doc: jsPDF, text: string, x: number, y: number) {
     // Reverse text for RTL
     const rtlText = text.split('').reverse().join('');
     doc.text(rtlText, x, y, { align: 'right' });
   }
   ```

3. **Update PDF Generator**
   - Replace all `doc.text()` calls with RTL-aware version
   - Adjust alignment and positioning
   - Handle mixed Arabic/English content

#### Phase 3: Layout Adjustments (2-3 hours)
1. **RTL Page Layout**
   - Flip margins (right becomes left)
   - Adjust table column order
   - Mirror page elements

2. **Text Wrapping**
   - Implement Arabic-aware text wrapping
   - Handle long Arabic words
   - Preserve word boundaries

3. **Number Formatting**
   - Use Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩)
   - Or keep Western numerals based on preference

#### Phase 4: Testing & Refinement (2-3 hours)
1. **Test Cases**
   - Short Arabic text
   - Long paragraphs
   - Mixed Arabic/English
   - Special characters
   - Numbers and dates

2. **Visual QA**
   - Check alignment
   - Verify spacing
   - Test on different PDF viewers
   - Ensure print quality

## Alternative Solutions

### Option A: Server-Side Rendering with Puppeteer
**Pros:**
- Perfect Arabic/RTL support
- Use HTML/CSS (easier)
- Browser-quality rendering

**Cons:**
- Requires Puppeteer (large dependency)
- Slower generation
- More server resources

**Implementation:**
```typescript
import puppeteer from 'puppeteer';

async function generatePDF(html: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdf;
}
```

### Option B: External PDF Service
**Pros:**
- No local implementation
- Professional quality
- Maintained by experts

**Cons:**
- Monthly cost
- API dependency
- Data privacy concerns

**Services:**
- DocRaptor
- PDFShift
- HTML2PDF API

### Option C: React-PDF
**Pros:**
- React components
- Good TypeScript support
- Active maintenance

**Cons:**
- Limited Arabic support
- Complex setup
- Learning curve

## Recommended Approach

**For MVP/Quick Launch:**
- Keep English reports (current solution)
- Add note: "Arabic reports coming soon"

**For Production:**
- Implement jsPDF with Arabic font (Phases 1-4)
- Estimated time: 10-15 hours
- Best balance of quality and effort

**For Enterprise:**
- Use Puppeteer for perfect rendering
- Estimated time: 5-8 hours
- Higher quality, more resources

## Resources

### Fonts
- Cairo: https://fonts.google.com/specimen/Cairo
- Amiri: https://fonts.google.com/specimen/Amiri
- Tajawal: https://fonts.google.com/specimen/Tajawal

### Tools
- Font to Base64: https://products.aspose.app/font/base64
- jsPDF Docs: https://github.com/parallax/jsPDF
- Arabic Text Processing: https://github.com/ahmadnassri/node-arabic

### Examples
- jsPDF Arabic: https://github.com/topics/jspdf-arabic
- RTL PDF: https://stackoverflow.com/questions/tagged/jspdf+arabic

## Timeline Estimate

| Phase | Time | Priority |
|-------|------|----------|
| Font Preparation | 2-3h | High |
| jsPDF Integration | 3-4h | High |
| Layout Adjustments | 2-3h | Medium |
| Testing & QA | 2-3h | High |
| **Total** | **10-15h** | - |

## Next Steps

1. **Immediate:** Test current English PDF download
2. **Short-term:** Create GitHub issue for Arabic support
3. **Medium-term:** Schedule dedicated time for implementation
4. **Long-term:** Consider Puppeteer for v2.0

## Status
📋 **Planned** - Ready for implementation when time permits

---

**Created:** February 10, 2026
**Estimated Effort:** 10-15 hours
**Priority:** Medium (post-MVP)
