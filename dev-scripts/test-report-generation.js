/**
 * Test Report Generation Locally
 * This helps debug PDF generation issues
 */

const { jsPDF } = require('jspdf');

console.log('Testing PDF generation...\n');

// Test 1: Basic jsPDF
try {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  doc.setFontSize(16);
  doc.text('Test PDF', 20, 20);
  
  const buffer = Buffer.from(doc.output('arraybuffer'));
  console.log('✅ Test 1: Basic jsPDF works');
  console.log('   Buffer size:', buffer.length, 'bytes\n');
} catch (error) {
  console.error('❌ Test 1 Failed:', error.message);
  process.exit(1);
}

// Test 2: Date handling
try {
  const isoString = '2024-01-15T10:30:00.000Z';
  const date = new Date(isoString);
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  console.log('✅ Test 2: Date conversion works');
  console.log('   ISO:', isoString);
  console.log('   Formatted:', formatted, '\n');
} catch (error) {
  console.error('❌ Test 2 Failed:', error.message);
  process.exit(1);
}

// Test 3: QRCode generation
try {
  const QRCode = require('qrcode');
  QRCode.toDataURL('https://test.com', (err, url) => {
    if (err) {
      console.error('❌ Test 3 Failed:', err.message);
      process.exit(1);
    }
    console.log('✅ Test 3: QRCode generation works');
    console.log('   URL length:', url.length, '\n');
    
    console.log('🎉 All tests passed! PDF generation should work.\n');
    console.log('If you still get errors, please check:');
    console.log('1. Server terminal for detailed error logs');
    console.log('2. That dev server was restarted after code changes');
    console.log('3. Firebase Admin SDK is properly initialized');
  });
} catch (error) {
  console.error('❌ Test 3 Failed:', error.message);
  process.exit(1);
}
