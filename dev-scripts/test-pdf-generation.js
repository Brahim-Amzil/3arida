#!/usr/bin/env node

/**
 * Test script for Puppeteer PDF generation
 * Run with: node test-pdf-generation.js <petition-id>
 */

const puppeteer = require('puppeteer');

async function testPDFGeneration(petitionId) {
  console.log('🚀 Testing PDF generation for petition:', petitionId);
  
  const url = `http://localhost:3000/pdf/petition/${petitionId}`;
  
  try {
    console.log('📄 Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    console.log('🌐 Navigating to:', url);
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('⏳ Waiting for fonts...');
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('📝 Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    const fs = require('fs');
    const filename = `test-report-${petitionId}.pdf`;
    fs.writeFileSync(filename, pdfBuffer);

    console.log('✅ PDF generated successfully:', filename);
    console.log('📊 Size:', (pdfBuffer.length / 1024).toFixed(2), 'KB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

const petitionId = process.argv[2];
if (!petitionId) {
  console.error('Usage: node test-pdf-generation.js <petition-id>');
  process.exit(1);
}

testPDFGeneration(petitionId);
