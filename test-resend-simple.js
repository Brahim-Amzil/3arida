// Simple test to check if Resend API key works
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResend() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY not found in environment');
      return;
    }
    
    console.log('API Key found:', apiKey.substring(0, 10) + '...');
    
    const resend = new Resend(apiKey);
    
    console.log('Sending test email...');
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'brahimamzil@gmail.com',
      subject: 'Test from 3arida',
      html: '<p>This is a test email from 3arida contact form</p>',
    });
    
    console.log('Result:', result);
    
    if (result.error) {
      console.error('❌ Resend error:', result.error);
    } else {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.data?.id);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testResend();
