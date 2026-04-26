/**
 * Manual Desktop Testing - Step by Step
 * Simple tests that run immediately
 */

console.log('🖥️ Manual Desktop Testing Started');
console.log('================================');

// Test 1: Basic Page Elements
console.log('\n1️⃣ BASIC PAGE ELEMENTS:');
console.log('✅ Site loaded:', document.readyState === 'complete' ? 'YES' : 'NO');
console.log('✅ Title present:', document.title ? `"${document.title}"` : 'NO');
console.log('✅ Navigation found:', document.querySelector('nav, header') ? 'YES' : 'NO');
console.log('✅ Main content found:', document.querySelector('main, [role="main"]') ? 'YES' : 'NO');

// Test 2: Authentication Elements
console.log('\n2️⃣ AUTHENTICATION:');
const loginBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
  el.textContent.toLowerCase().includes('login') || el.href?.includes('/auth/login')
);
console.log('✅ Login button found:', loginBtn ? `"${loginBtn.textContent.trim()}"` : 'NO');

const registerBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
  el.textContent.toLowerCase().includes('register') || el.href?.includes('/auth/register')
);
console.log('✅ Register button found:', registerBtn ? `"${registerBtn.textContent.trim()}"` : 'NO');

// Test 3: Petition Elements
console.log('\n3️⃣ PETITION FEATURES:');
const petitionsLink = Array.from(document.querySelectorAll('a')).find(el => 
  el.textContent.toLowerCase().includes('petition') || el.href?.includes('/petitions')
);
console.log('✅ Petitions link found:', petitionsLink ? `"${petitionsLink.textContent.trim()}"` : 'NO');

const createBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
  el.textContent.toLowerCase().includes('create') || el.href?.includes('/petitions/create')
);
console.log('✅ Create petition button:', createBtn ? `"${createBtn.textContent.trim()}"` : 'NO');

// Test 4: Performance
console.log('\n4️⃣ PERFORMANCE:');
const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
console.log('✅ Page load time:', `${loadTime}ms`, loadTime < 3000 ? '(GOOD)' : '(SLOW)');

// Test 5: Responsive Design
console.log('\n5️⃣ RESPONSIVE DESIGN:');
console.log('✅ Viewport meta tag:', document.querySelector('meta[name="viewport"]') ? 'YES' : 'NO');
console.log('✅ Screen width:', `${window.innerWidth}px`);
console.log('✅ No horizontal scroll:', document.body.scrollWidth <= window.innerWidth ? 'YES' : 'NO');

// Test 6: Security
console.log('\n6️⃣ SECURITY:');
console.log('✅ HTTPS enabled:', window.location.protocol === 'https:' ? 'YES' : 'NO');
console.log('✅ Secure context:', window.isSecureContext ? 'YES' : 'NO');

// Test 7: Interactive Elements
console.log('\n7️⃣ INTERACTIVE ELEMENTS:');
const buttons = document.querySelectorAll('button');
const links = document.querySelectorAll('a');
console.log('✅ Buttons found:', buttons.length);
console.log('✅ Links found:', links.length);
console.log('✅ Total interactive:', buttons.length + links.length);

// Test 8: Images
console.log('\n8️⃣ IMAGES:');
const images = document.querySelectorAll('img');
const imagesWithAlt = document.querySelectorAll('img[alt]');
console.log('✅ Total images:', images.length);
console.log('✅ Images with alt text:', `${imagesWithAlt.length}/${images.length}`);

// Summary
console.log('\n📊 QUICK ASSESSMENT:');
const checks = [
  document.readyState === 'complete',
  !!document.title,
  !!document.querySelector('nav, header'),
  !!loginBtn,
  !!petitionsLink,
  loadTime < 3000,
  window.location.protocol === 'https:',
  (buttons.length + links.length) > 5
];

const passed = checks.filter(Boolean).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`✅ Passed: ${passed}/${total} (${percentage}%)`);

if (percentage >= 90) {
  console.log('🟢 EXCELLENT - Desktop ready!');
} else if (percentage >= 75) {
  console.log('🟡 GOOD - Minor issues only');
} else {
  console.log('🔴 NEEDS WORK - Major issues found');
}

console.log('\n🎯 NEXT STEPS:');
if (percentage >= 75) {
  console.log('✅ Desktop testing complete');
  console.log('📱 Ready for mobile testing');
  console.log('🚀 Mobile = 95% of your users');
} else {
  console.log('🔧 Fix desktop issues first');
}

console.log('\n================================');
console.log('Manual Desktop Testing Complete');