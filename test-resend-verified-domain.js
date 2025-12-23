// Test Resend with verified domain
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResendWithDomain() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY not found');
      return;
    }
    
    console.log('Testing with verified domain 3arida.ma...');
    
    const resend = new Resend(apiKey);
    
    // Test 1: Send from noreply@3arida.ma to contact@3arida.ma
    console.log('\nTest 1: noreply@3arida.ma -> contact@3arida.ma');
    const result1 = await resend.emails.send({
      from: '3arida Platform <noreply@3arida.ma>',
      to: 'contact@3arida.ma',
      subject: 'Test from verified domain',
      html: '<p>This is a test email using verified domain</p>',
    });
    
    console.log('Result 1:', result1);
    
    if (result1.error) {
      console.error('❌ Error:', result1.error);
    } else {
      console.log('✅ Success! Message ID:', result1.data?.id);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testResendWithDomain();
