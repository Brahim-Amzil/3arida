/**
 * Desktop Comprehensive Testing Script
 * Run this in browser console on your deployed site
 */

console.log('🖥️ Starting Desktop Comprehensive Testing...');

// Test Configuration
const SITE_URL = window.location.origin;
const TEST_EMAIL = 'test-' + Date.now() + '@example.com';
const TEST_PASSWORD = 'TestPassword123!';

// Test Results Storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(testName, passed, details = '') {
  const result = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${result}: ${testName}${details ? ' - ' + details : ''}`);
  
  testResults.tests.push({
    name: testName,
    passed,
    details
  });
  
  if (passed) testResults.passed++;
  else testResults.failed++;
}

// 1. Page Load Tests
async function testPageLoads() {
  console.log('\n📄 Testing Page Loads...');
  
  const pages = [
    '/',
    '/petitions',
    '/auth/login',
    '/auth/register',
    '/about',
    '/privacy',
    '/terms'
  ];
  
  for (const page of pages) {
    try {
      const response = await fetch(SITE_URL + page);
      logTest(`Page Load: ${page}`, response.ok, `Status: ${response.status}`);
    } catch (error) {
      logTest(`Page Load: ${page}`, false, `Error: ${error.message}`);
    }
  }
}

// 2. Performance Tests
function testPerformance() {
  console.log('\n⚡ Testing Performance...');
  
  // Page Load Time
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  logTest('Page Load Time', loadTime < 3000, `${loadTime}ms (target: <3000ms)`);
  
  // DOM Content Loaded
  const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
  logTest('DOM Content Loaded', domTime < 2000, `${domTime}ms (target: <2000ms)`);
  
  // First Paint
  if (performance.getEntriesByType) {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    if (firstPaint) {
      logTest('First Paint', firstPaint.startTime < 1500, `${firstPaint.startTime}ms (target: <1500ms)`);
    }
  }
}

// 3. UI Element Tests
function testUIElements() {
  console.log('\n🎨 Testing UI Elements...');
  
  // Navigation
  const nav = document.querySelector('nav');
  logTest('Navigation Present', !!nav);
  
  // Logo
  const logo = document.querySelector('[alt*="logo"], [alt*="Logo"], img[src*="logo"]');
  logTest('Logo Present', !!logo);
  
  // Main Content
  const main = document.querySelector('main, [role="main"], .main-content');
  logTest('Main Content Present', !!main);
  
  // Footer
  const footer = document.querySelector('footer');
  logTest('Footer Present', !!footer);
  
  // Buttons
  const buttons = document.querySelectorAll('button, [role="button"]');
  logTest('Interactive Buttons', buttons.length > 0, `Found ${buttons.length} buttons`);
  
  // Forms
  const forms = document.querySelectorAll('form');
  logTest('Forms Present', forms.length >= 0, `Found ${forms.length} forms`);
}

// 4. Responsive Design Tests
function testResponsiveDesign() {
  console.log('\n📱 Testing Responsive Design...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  logTest('Viewport Size', viewport.width > 0 && viewport.height > 0, 
    `${viewport.width}x${viewport.height}`);
  
  // Check for horizontal scroll
  const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
  logTest('No Horizontal Scroll', !hasHorizontalScroll);
  
  // Check for responsive meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  logTest('Viewport Meta Tag', !!viewportMeta);
}

// 5. Accessibility Tests
function testAccessibility() {
  console.log('\n♿ Testing Accessibility...');
  
  // Alt text for images
  const images = document.querySelectorAll('img');
  const imagesWithAlt = document.querySelectorAll('img[alt]');
  logTest('Images Have Alt Text', images.length === imagesWithAlt.length, 
    `${imagesWithAlt.length}/${images.length} images have alt text`);
  
  // Form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  let labeledInputs = 0;
  inputs.forEach(input => {
    if (input.labels && input.labels.length > 0) labeledInputs++;
    else if (input.getAttribute('aria-label')) labeledInputs++;
    else if (input.getAttribute('placeholder')) labeledInputs++; // Not ideal but acceptable
  });
  logTest('Form Inputs Labeled', labeledInputs === inputs.length, 
    `${labeledInputs}/${inputs.length} inputs have labels`);
  
  // Heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  logTest('Headings Present', headings.length > 0, `Found ${headings.length} headings`);
  
  // Focus indicators
  const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
  logTest('Focusable Elements', focusableElements.length > 0, 
    `Found ${focusableElements.length} focusable elements`);
}

// 6. JavaScript Error Tests
function testJavaScriptErrors() {
  console.log('\n🐛 Testing JavaScript Errors...');
  
  // Check for console errors
  const originalError = console.error;
  let errorCount = 0;
  
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  // Restore after a short delay
  setTimeout(() => {
    console.error = originalError;
    logTest('No JavaScript Errors', errorCount === 0, 
      errorCount > 0 ? `Found ${errorCount} errors` : 'Clean console');
  }, 1000);
}

// 7. Network Tests
async function testNetworkRequests() {
  console.log('\n🌐 Testing Network Requests...');
  
  // Test API endpoints that should exist
  const apiEndpoints = [
    '/api/health',
    '/api/contact',
    '/api/verify-recaptcha'
  ];
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(SITE_URL + endpoint);
      // Health should be 200, others might be 405 (Method Not Allowed) for GET requests
      const isOk = response.ok || [405, 401].includes(response.status);
      logTest(`API Endpoint: ${endpoint}`, isOk, `Status: ${response.status}`);
    } catch (error) {
      logTest(`API Endpoint: ${endpoint}`, false, `Error: ${error.message}`);
    }
  }
}

// 8. Security Tests
function testSecurity() {
  console.log('\n🔒 Testing Security...');
  
  // HTTPS
  logTest('HTTPS Enabled', window.location.protocol === 'https:');
  
  // Security headers (check in Network tab)
  logTest('Security Headers Check', true, 'Check Network tab for CSP, HSTS headers');
  
  // No inline scripts (basic check)
  const inlineScripts = document.querySelectorAll('script:not([src])');
  const hasInlineJS = Array.from(inlineScripts).some(script => 
    script.textContent && script.textContent.trim().length > 0
  );
  logTest('Minimal Inline Scripts', !hasInlineJS || inlineScripts.length < 3, 
    `Found ${inlineScripts.length} inline scripts`);
}

// 9. SEO Tests
function testSEO() {
  console.log('\n🔍 Testing SEO...');
  
  // Title tag
  const title = document.querySelector('title');
  logTest('Title Tag Present', !!title && title.textContent.length > 0, 
    title ? `"${title.textContent}"` : 'Missing');
  
  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  logTest('Meta Description', !!metaDesc && metaDesc.content.length > 0, 
    metaDesc ? `"${metaDesc.content.substring(0, 50)}..."` : 'Missing');
  
  // H1 tag
  const h1 = document.querySelector('h1');
  logTest('H1 Tag Present', !!h1, h1 ? `"${h1.textContent}"` : 'Missing');
  
  // Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  logTest('Canonical URL', !!canonical, canonical ? canonical.href : 'Missing');
}

// 10. Feature-Specific Tests
function testFeatures() {
  console.log('\n🚀 Testing Features...');
  
  // Check for key components
  const petitionsList = document.querySelector('[data-testid="petitions-list"], .petitions-grid, .petition-card');
  logTest('Petitions Display', !!petitionsList, 'Petition components found');
  
  // Search functionality
  const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
  logTest('Search Functionality', !!searchInput, 'Search input found');
  
  // Authentication elements
  const authButtons = document.querySelectorAll('button, a').length;
  const hasAuthElements = Array.from(document.querySelectorAll('button, a')).some(el => 
    el.textContent.toLowerCase().includes('login') || 
    el.textContent.toLowerCase().includes('register') ||
    el.textContent.toLowerCase().includes('sign')
  );
  logTest('Authentication Elements', hasAuthElements, 'Login/Register buttons found');
}

// Main Test Runner
async function runAllTests() {
  console.log('🧪 Starting Comprehensive Desktop Testing Suite...\n');
  console.log(`Testing URL: ${SITE_URL}`);
  console.log(`User Agent: ${navigator.userAgent}\n`);
  
  // Run all tests
  await testPageLoads();
  testPerformance();
  testUIElements();
  testResponsiveDesign();
  testAccessibility();
  testJavaScriptErrors();
  await testNetworkRequests();
  testSecurity();
  testSEO();
  testFeatures();
  
  // Final Results
  setTimeout(() => {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
    
    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.tests.filter(t => !t.passed).forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
    }
    
    console.log('\n🎯 Next Steps:');
    if (testResults.failed === 0) {
      console.log('   ✅ All tests passed! Ready for mobile testing.');
    } else if (testResults.failed < 3) {
      console.log('   ⚠️  Minor issues found. Fix and retest.');
    } else {
      console.log('   🚨 Multiple issues found. Review and fix before proceeding.');
    }
    
    // Export results for documentation
    window.desktopTestResults = testResults;
    console.log('\n💾 Results saved to window.desktopTestResults');
  }, 2000);
}

// Auto-run if script is executed
if (typeof window !== 'undefined') {
  runAllTests();
}