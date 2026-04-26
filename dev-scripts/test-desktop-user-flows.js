/**
 * Desktop User Flow Testing - Critical Paths
 * Tests the actual user journeys that matter for launch
 */

console.log('🚀 Testing Critical User Flows on Desktop...');

const flowResults = {
  passed: 0,
  failed: 0,
  flows: []
};

function testFlow(name, condition, details = '') {
  const passed = !!condition;
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}${details ? ' - ' + details : ''}`);
  
  flowResults.flows.push({ name, passed, details });
  if (passed) flowResults.passed++;
  else flowResults.failed++;
  
  return passed;
}

async function testCriticalUserFlows() {
  console.log('🧪 Testing Critical User Flows...\n');
  
  // 1. HOME PAGE FLOW
  console.log('🏠 Home Page Flow:');
  
  // Check if we're on home page or can navigate to it
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
  testFlow('Home Page Accessible', isHomePage || document.querySelector('a[href="/"], a[href=""]'));
  
  // Key home page elements
  testFlow('Hero Section Present', !!document.querySelector('h1, .hero, [class*="hero"]'));
  testFlow('Call-to-Action Buttons', document.querySelectorAll('button, a').length >= 3);
  testFlow('Navigation Menu', !!document.querySelector('nav, header'));
  
  // 2. AUTHENTICATION FLOW
  console.log('\n🔐 Authentication Flow:');
  
  // Look for auth elements
  const loginButton = Array.from(document.querySelectorAll('a, button')).find(el => 
    el.textContent.toLowerCase().includes('login') || 
    el.textContent.toLowerCase().includes('connexion') ||
    el.href?.includes('/auth/login')
  );
  testFlow('Login Button Found', !!loginButton, loginButton ? `Text: "${loginButton.textContent.trim()}"` : 'Not found');
  
  const registerButton = Array.from(document.querySelectorAll('a, button')).find(el => 
    el.textContent.toLowerCase().includes('register') || 
    el.textContent.toLowerCase().includes('inscription') ||
    el.textContent.toLowerCase().includes('sign up') ||
    el.href?.includes('/auth/register')
  );
  testFlow('Register Button Found', !!registerButton, registerButton ? `Text: "${registerButton.textContent.trim()}"` : 'Not found');
  
  // Test login page accessibility
  if (loginButton && loginButton.href) {
    try {
      const loginResponse = await fetch(loginButton.href);
      testFlow('Login Page Loads', loginResponse.ok, `Status: ${loginResponse.status}`);
    } catch (error) {
      testFlow('Login Page Loads', false, `Error: ${error.message}`);
    }
  }
  
  // 3. PETITION BROWSING FLOW
  console.log('\n📋 Petition Browsing Flow:');
  
  // Look for petitions link
  const petitionsLink = Array.from(document.querySelectorAll('a')).find(el => 
    el.textContent.toLowerCase().includes('petition') ||
    el.href?.includes('/petitions')
  );
  testFlow('Petitions Link Found', !!petitionsLink, petitionsLink ? `Text: "${petitionsLink.textContent.trim()}"` : 'Not found');
  
  // Test petitions page
  if (petitionsLink && petitionsLink.href) {
    try {
      const petitionsResponse = await fetch(petitionsLink.href);
      testFlow('Petitions Page Loads', petitionsResponse.ok, `Status: ${petitionsResponse.status}`);
    } catch (error) {
      testFlow('Petitions Page Loads', false, `Error: ${error.message}`);
    }
  }
  
  // 4. PETITION CREATION FLOW
  console.log('\n✍️ Petition Creation Flow:');
  
  // Look for create petition button
  const createButton = Array.from(document.querySelectorAll('a, button')).find(el => 
    el.textContent.toLowerCase().includes('create') ||
    el.textContent.toLowerCase().includes('créer') ||
    el.textContent.toLowerCase().includes('new petition') ||
    el.href?.includes('/petitions/create')
  );
  testFlow('Create Petition Button Found', !!createButton, createButton ? `Text: "${createButton.textContent.trim()}"` : 'Not found');
  
  // Test create page
  if (createButton && createButton.href) {
    try {
      const createResponse = await fetch(createButton.href);
      testFlow('Create Petition Page Loads', createResponse.ok, `Status: ${createResponse.status}`);
    } catch (error) {
      testFlow('Create Petition Page Loads', false, `Error: ${createResponse.status || error.message}`);
    }
  }
  
  // 5. RESPONSIVE DESIGN FLOW
  console.log('\n📱 Responsive Design Flow:');
  
  // Test different viewport sizes
  const originalWidth = window.innerWidth;
  
  // Test mobile width simulation
  testFlow('Mobile Viewport Meta', !!document.querySelector('meta[name="viewport"]'));
  testFlow('No Horizontal Scroll', document.body.scrollWidth <= window.innerWidth + 20);
  
  // Check for mobile-friendly elements
  const mobileMenu = document.querySelector('[class*="mobile"], [class*="hamburger"], [class*="menu-toggle"]');
  testFlow('Mobile Menu Elements', !!mobileMenu || window.innerWidth > 768, 
    window.innerWidth > 768 ? 'Desktop width - mobile menu not needed' : 'Mobile menu found');
  
  // 6. PERFORMANCE FLOW
  console.log('\n⚡ Performance Flow:');
  
  // Page load performance
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  testFlow('Fast Page Load', loadTime < 3000, `${loadTime}ms (target: <3000ms)`);
  
  // Resource loading
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) loadedImages++;
  });
  testFlow('Images Load Properly', images.length === 0 || loadedImages / images.length > 0.8, 
    `${loadedImages}/${images.length} images loaded`);
  
  // 7. SEO & ACCESSIBILITY FLOW
  console.log('\n🔍 SEO & Accessibility Flow:');
  
  // Essential SEO elements
  const title = document.querySelector('title');
  testFlow('Page Title Present', !!title && title.textContent.length > 10, 
    title ? `"${title.textContent.substring(0, 50)}..."` : 'Missing');
  
  const metaDesc = document.querySelector('meta[name="description"]');
  testFlow('Meta Description Present', !!metaDesc && metaDesc.content.length > 50, 
    metaDesc ? `"${metaDesc.content.substring(0, 50)}..."` : 'Missing');
  
  // Accessibility basics
  const h1 = document.querySelector('h1');
  testFlow('H1 Heading Present', !!h1, h1 ? `"${h1.textContent.substring(0, 50)}..."` : 'Missing');
  
  const altImages = document.querySelectorAll('img[alt]');
  testFlow('Images Have Alt Text', images.length === 0 || altImages.length / images.length > 0.8, 
    `${altImages.length}/${images.length} images have alt text`);
  
  // 8. SECURITY FLOW
  console.log('\n🔒 Security Flow:');
  
  testFlow('HTTPS Protocol', window.location.protocol === 'https:');
  testFlow('No Mixed Content', !document.querySelector('img[src^="http:"], script[src^="http:"], link[href^="http:"]'));
  
  // Check for security headers (basic)
  testFlow('Secure Context', window.isSecureContext);
  
  // Final Results
  setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CRITICAL USER FLOWS TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${flowResults.passed}`);
    console.log(`❌ Failed: ${flowResults.failed}`);
    console.log(`📈 Success Rate: ${Math.round((flowResults.passed / (flowResults.passed + flowResults.failed)) * 100)}%`);
    
    const successRate = Math.round((flowResults.passed / (flowResults.passed + flowResults.failed)) * 100);
    
    console.log('\n🎯 FLOW ASSESSMENT:');
    if (successRate >= 95) {
      console.log('🟢 EXCELLENT - All critical flows working perfectly!');
    } else if (successRate >= 85) {
      console.log('🟡 GOOD - Most critical flows working, minor issues');
    } else if (successRate >= 75) {
      console.log('🟠 FAIR - Some critical flows have issues');
    } else {
      console.log('🔴 CRITICAL - Major flow issues need immediate attention');
    }
    
    if (flowResults.failed > 0) {
      console.log('\n❌ Failed Flows:');
      flowResults.flows.filter(f => !f.passed).forEach(flow => {
        console.log(`   • ${flow.name}: ${flow.details || 'No details'}`);
      });
      
      console.log('\n🔧 PRIORITY FIXES NEEDED:');
      const criticalFails = flowResults.flows.filter(f => !f.passed && (
        f.name.includes('Login') || 
        f.name.includes('Register') || 
        f.name.includes('Petitions') ||
        f.name.includes('Create')
      ));
      
      if (criticalFails.length > 0) {
        console.log('   🚨 CRITICAL USER FLOWS BROKEN:');
        criticalFails.forEach(flow => {
          console.log(`     - ${flow.name}`);
        });
      }
    }
    
    console.log('\n🚀 NEXT STEPS:');
    if (successRate >= 85) {
      console.log('   ✅ Desktop user flows working well!');
      console.log('   📱 Ready for MOBILE testing (95% of users)');
      console.log('   🎯 Focus on mobile user experience next');
    } else {
      console.log('   🔧 Fix critical user flow issues first');
      console.log('   🔄 Re-test flows after fixes');
      console.log('   ⚠️  Don\'t proceed to mobile until flows work');
    }
    
    // Save results
    window.desktopFlowResults = flowResults;
    console.log('\n💾 Results saved to window.desktopFlowResults');
    
  }, 2000);
}

// Run the critical flow tests
testCriticalUserFlows();