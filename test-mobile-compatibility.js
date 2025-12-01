/**
 * Mobile Compatibility Test Script
 * Run this in browser console to check mobile-specific issues
 * 
 * Usage: Copy and paste into browser console on mobile device or DevTools
 */

(function() {
  console.log('🔍 3arida Mobile Compatibility Test\n');
  
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  // Test 1: Viewport Meta Tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && viewport.content.includes('width=device-width')) {
    results.passed.push('✅ Viewport meta tag configured correctly');
  } else {
    results.failed.push('❌ Viewport meta tag missing or incorrect');
  }
  
  // Test 2: Touch Target Size
  const buttons = document.querySelectorAll('button, a');
  let smallTargets = 0;
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      smallTargets++;
    }
  });
  if (smallTargets === 0) {
    results.passed.push('✅ All touch targets are 44x44px or larger');
  } else {
    results.warnings.push(`⚠️  ${smallTargets} touch targets smaller than 44x44px`);
  }
  
  // Test 3: Horizontal Scroll
  const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  if (!hasHorizontalScroll) {
    results.passed.push('✅ No horizontal scroll detected');
  } else {
    results.failed.push('❌ Horizontal scroll detected - layout issue');
  }
  
  // Test 4: Font Size
  const body = document.body;
  const fontSize = window.getComputedStyle(body).fontSize;
  const fontSizeNum = parseInt(fontSize);
  if (fontSizeNum >= 16) {
    results.passed.push(`✅ Base font size is ${fontSize} (readable)`);
  } else {
    results.warnings.push(`⚠️  Base font size is ${fontSize} (may be too small)`);
  }
  
  // Test 5: Images
  const images = document.querySelectorAll('img');
  let oversizedImages = 0;
  images.forEach(img => {
    if (img.naturalWidth > 2000) {
      oversizedImages++;
    }
  });
  if (oversizedImages === 0) {
    results.passed.push('✅ No oversized images detected');
  } else {
    results.warnings.push(`⚠️  ${oversizedImages} images larger than 2000px (may slow loading)`);
  }
  
  // Test 6: PWA Manifest
  const manifest = document.querySelector('link[rel="manifest"]');
  if (manifest) {
    results.passed.push('✅ PWA manifest linked');
  } else {
    results.warnings.push('⚠️  PWA manifest not found');
  }
  
  // Test 7: Theme Color
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    results.passed.push(`✅ Theme color set to ${themeColor.content}`);
  } else {
    results.warnings.push('⚠️  Theme color not set');
  }
  
  // Test 8: Apple Touch Icon
  const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (appleTouchIcon) {
    results.passed.push('✅ Apple touch icon configured');
  } else {
    results.warnings.push('⚠️  Apple touch icon not found');
  }
  
  // Test 9: Input Types
  const inputs = document.querySelectorAll('input');
  let properInputTypes = 0;
  inputs.forEach(input => {
    const type = input.type;
    const name = input.name || input.id;
    if (name && name.includes('email') && type === 'email') properInputTypes++;
    if (name && name.includes('tel') && type === 'tel') properInputTypes++;
    if (name && name.includes('phone') && type === 'tel') properInputTypes++;
  });
  if (properInputTypes > 0) {
    results.passed.push(`✅ ${properInputTypes} inputs using proper mobile types`);
  }
  
  // Test 10: Performance
  if (window.performance && window.performance.timing) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    const loadSeconds = (loadTime / 1000).toFixed(2);
    if (loadTime < 3000) {
      results.passed.push(`✅ Page loaded in ${loadSeconds}s (fast)`);
    } else if (loadTime < 5000) {
      results.warnings.push(`⚠️  Page loaded in ${loadSeconds}s (acceptable)`);
    } else {
      results.failed.push(`❌ Page loaded in ${loadSeconds}s (too slow)`);
    }
  }
  
  // Test 11: Device Detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  console.log(`\n📱 Device Info:`);
  console.log(`   User Agent: ${navigator.userAgent}`);
  console.log(`   Mobile Device: ${isMobile ? 'Yes' : 'No'}`);
  console.log(`   Touch Support: ${isTouch ? 'Yes' : 'No'}`);
  console.log(`   Screen Size: ${window.innerWidth}x${window.innerHeight}`);
  console.log(`   Device Pixel Ratio: ${window.devicePixelRatio}`);
  
  // Test 12: Network Info (if available)
  if (navigator.connection) {
    const connection = navigator.connection;
    console.log(`\n🌐 Network Info:`);
    console.log(`   Type: ${connection.effectiveType || 'unknown'}`);
    console.log(`   Downlink: ${connection.downlink || 'unknown'} Mbps`);
    console.log(`   RTT: ${connection.rtt || 'unknown'} ms`);
    console.log(`   Save Data: ${connection.saveData ? 'Yes' : 'No'}`);
  }
  
  // Print Results
  console.log('\n📊 Test Results:\n');
  
  if (results.passed.length > 0) {
    console.log('%c✅ PASSED TESTS:', 'color: green; font-weight: bold');
    results.passed.forEach(test => console.log(`   ${test}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n%c⚠️  WARNINGS:', 'color: orange; font-weight: bold');
    results.warnings.forEach(test => console.log(`   ${test}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n%c❌ FAILED TESTS:', 'color: red; font-weight: bold');
    results.failed.forEach(test => console.log(`   ${test}`));
  }
  
  // Overall Score
  const total = results.passed.length + results.warnings.length + results.failed.length;
  const score = Math.round((results.passed.length / total) * 100);
  console.log(`\n🎯 Mobile Compatibility Score: ${score}%`);
  
  if (score >= 90) {
    console.log('%c🎉 Excellent mobile compatibility!', 'color: green; font-weight: bold; font-size: 14px');
  } else if (score >= 70) {
    console.log('%c👍 Good mobile compatibility, minor improvements needed', 'color: orange; font-weight: bold; font-size: 14px');
  } else {
    console.log('%c⚠️  Mobile compatibility needs improvement', 'color: red; font-weight: bold; font-size: 14px');
  }
  
  console.log('\n💡 Tip: Run this script on different devices and browsers to ensure compatibility');
  
  return {
    score,
    passed: results.passed.length,
    warnings: results.warnings.length,
    failed: results.failed.length,
    details: results
  };
})();
