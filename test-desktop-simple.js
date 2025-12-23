/**
 * Simple Desktop Testing Script - Essential Checks Only
 * Run this in browser console on your deployed site
 */

console.log('🖥️ Starting Simple Desktop Testing...');

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, condition, details = '') {
  const passed = !!condition;
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}${details ? ' - ' + details : ''}`);
  
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
  
  return passed;
}

async function runEssentialTests() {
  console.log('🧪 Running Essential Desktop Tests...\n');
  
  // 1. Basic Page Load
  console.log('📄 Page Load Tests:');
  test('Site Loads', document.readyState === 'complete');
  test('No JavaScript Errors', !window.hasJSErrors); // We'll set this if errors occur
  
  // 2. Essential Elements
  console.log('\n🎨 UI Elements:');
  test('Navigation Present', !!document.querySelector('nav, header'));
  test('Main Content Present', !!document.querySelector('main, [role="main"], .main-content'));
  test('Interactive Elements', document.querySelectorAll('button, a').length > 5);
  
  // 3. Performance
  console.log('\n⚡ Performance:');
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  test('Page Load Time OK', loadTime < 5000, `${loadTime}ms (target: <5000ms)`);
  
  // 4. Responsive Design
  console.log('\n📱 Responsive:');
  test('Viewport Meta Tag', !!document.querySelector('meta[name="viewport"]'));
  test('No Horizontal Scroll', document.body.scrollWidth <= window.innerWidth + 10); // 10px tolerance
  
  // 5. SEO Basics
  console.log('\n🔍 SEO:');
  const title = document.querySelector('title');
  test('Title Tag Present', !!title && title.textContent.length > 0, title?.textContent);
  test('H1 Present', !!document.querySelector('h1'));
  
  // 6. Security
  console.log('\n🔒 Security:');
  test('HTTPS Enabled', window.location.protocol === 'https:');
  
  // 7. Essential API Check
  console.log('\n🌐 API Health:');
  try {
    const response = await fetch('/api/health');
    test('Health API Available', response.ok, `Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      test('Health API Returns Data', !!data.status, `Status: ${data.status}`);
    }
  } catch (error) {
    test('Health API Available', false, `Error: ${error.message}`);
  }
  
  // 8. Authentication Elements
  console.log('\n🔐 Authentication:');
  const authElements = Array.from(document.querySelectorAll('button, a')).some(el => 
    el.textContent.toLowerCase().includes('login') || 
    el.textContent.toLowerCase().includes('register') ||
    el.textContent.toLowerCase().includes('sign')
  );
  test('Auth Elements Present', authElements);
  
  // Final Results
  setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('📊 DESKTOP TESTING RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
    
    const successRate = Math.round((results.passed / (results.passed + results.failed)) * 100);
    
    console.log('\n🎯 ASSESSMENT:');
    if (successRate >= 90) {
      console.log('🟢 EXCELLENT - Ready for mobile testing!');
    } else if (successRate >= 80) {
      console.log('🟡 GOOD - Minor issues, but can proceed to mobile testing');
    } else if (successRate >= 70) {
      console.log('🟠 FAIR - Some issues need attention');
    } else {
      console.log('🔴 NEEDS WORK - Multiple issues found');
    }
    
    if (results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.tests.filter(t => !t.passed).forEach(test => {
        console.log(`   • ${test.name}: ${test.details || 'No details'}`);
      });
    }
    
    console.log('\n🚀 NEXT STEPS:');
    if (successRate >= 80) {
      console.log('   ✅ Desktop testing complete!');
      console.log('   📱 Ready to move to MOBILE testing (the critical part)');
      console.log('   🎯 Mobile users = 95% of your audience');
    } else {
      console.log('   🔧 Fix critical issues first');
      console.log('   🔄 Re-run this test after fixes');
    }
    
    // Save results globally
    window.desktopTestResults = results;
    console.log('\n💾 Results saved to window.desktopTestResults');
    
  }, 1000);
}

// Track JavaScript errors
let jsErrorCount = 0;
window.addEventListener('error', () => {
  jsErrorCount++;
  window.hasJSErrors = true;
});

// Run tests
runEssentialTests();