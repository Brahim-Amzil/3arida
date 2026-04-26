# Quick Start Guide - Puppeteer PDF Generation

## What's Been Done

1. Installed Dependencies: puppeteer, qrcode.react, date-fns
2. Created print component with Arabic RTL support
3. Created PDF route and API endpoint
4. Created helper library and test script

## How to Use

### Test PDF Generation

**Via API:**
```bash
curl -X POST http://localhost:3000/api/petitions/YOUR_PETITION_ID/report --output test-report.pdf
```

**Via Test Script:**
```bash
node test-pdf-generation.js YOUR_PETITION_ID
```

**View HTML:**
```
http://localhost:3000/pdf/petition/YOUR_PETITION_ID
```

### Integrate in Dashboard

```typescript
async function downloadReport() {
  const response = await fetch(`/api/petitions/${petition.id}/report`, { method: 'POST' });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `petition-report-${petition.referenceCode}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
```

## Configuration

Add to `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Report Contents

1. Cover Page - Logo, title, QR code
2. Details Page - Petition info, publisher, tier
3. Content Page - Full description
4. Statistics Page - Signatures, progress, timeline
5. Verification Page - Download info, legal notice

## Next Steps

1. Add UI button in dashboard
2. Add payment integration
3. Create verification page
4. Add email delivery option
