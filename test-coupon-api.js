// Test script to check coupon API
const fetch = require('node-fetch');

async function testCouponAPI() {
  console.log('🧪 Testing Coupon API...\n');

  // Test with a sample coupon code
  const testCode = 'INFL10-ABC';

  try {
    console.log('📡 Testing validation endpoint...');
    console.log('Code:', testCode);
    
    const response = await fetch('http://localhost:3004/api/coupons/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: testCode }),
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Coupon validation successful!');
    } else {
      console.log('❌ Coupon validation failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testCouponAPI();
