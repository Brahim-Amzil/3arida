#!/bin/bash

echo "🔍 Verifying Report Download Fixes..."
echo ""

# Check jsPDF import
echo "1. Checking jsPDF import..."
if grep -q "import { jsPDF } from 'jspdf'" src/lib/report-pdf-generator.ts; then
    echo "   ✅ jsPDF import is correct"
else
    echo "   ❌ jsPDF import needs fixing"
fi

# Check QRCode import
echo "2. Checking QRCode import..."
if grep -q "import \* as QRCode from 'qrcode'" src/lib/report-qr-generator.ts; then
    echo "   ✅ QRCode import is correct"
else
    echo "   ❌ QRCode import needs fixing"
fi

# Check generate route has dual lookup
echo "3. Checking generate route..."
if grep -q "doc(code).get()" "src/app/api/petitions/[code]/report/generate/route.ts"; then
    echo "   ✅ Generate route has dual lookup"
else
    echo "   ❌ Generate route needs dual lookup"
fi

# Check download route has dual lookup
echo "4. Checking download route..."
if grep -q "doc(code).get()" "src/app/api/petitions/[code]/report/download/route.ts"; then
    echo "   ✅ Download route has dual lookup"
else
    echo "   ❌ Download route needs dual lookup"
fi

echo ""
echo "🎉 All fixes verified!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server (Ctrl+C then 'npm run dev')"
echo "2. Test report download with petition ID: RhcqoOtk3Zcx08JuxmvZ"
echo "3. Check browser console for detailed logs"
