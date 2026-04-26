#!/usr/bin/env node

/**
 * WhatsApp API Test Script
 * Tests sending verification codes via WhatsApp Business API
 */

require('dotenv').config({ path: '.env.local' });

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Get recipient phone number from command line argument
const recipientPhone = process.argv[2];

if (!recipientPhone) {
  console.error('❌ Error: Please provide a recipient phone number');
  console.log('Usage: node test-whatsapp-api.js +212600000000');
  process.exit(1);
}

if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
  console.error('❌ Error: Missing WhatsApp credentials in .env.local');
  console.log('Required variables:');
  console.log('  - WHATSAPP_PHONE_NUMBER_ID');
  console.log('  - WHATSAPP_ACCESS_TOKEN');
  process.exit(1);
}

// Generate a random 6-digit verification code
const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

console.log('🚀 Testing WhatsApp API...');
console.log('📱 Recipient:', recipientPhone);
console.log('🔢 Verification Code:', verificationCode);
console.log('');

async function sendWhatsAppMessage() {
  try {
    const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
    
    const message = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'text',
      text: {
        body: `رمز التحقق الخاص بك في 3arida هو: ${verificationCode}\n\nYour 3arida verification code is: ${verificationCode}\n\nهذا الرمز صالح لمدة 10 دقائق.\nThis code is valid for 10 minutes.`
      }
    };

    console.log('📤 Sending message...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Message sent successfully!');
      console.log('📬 Message ID:', data.messages[0].id);
      console.log('');
      console.log('Check your WhatsApp for the verification code!');
      console.log('');
      console.log('Next steps:');
      console.log('1. Verify you received the message on WhatsApp');
      console.log('2. Configure webhook in Meta Dashboard');
      console.log('3. Deploy to Vercel to enable webhook');
      console.log('4. Test the full verification flow in your app');
    } else {
      console.error('❌ Error sending message:');
      console.error(JSON.stringify(data, null, 2));
      
      if (data.error?.code === 131056) {
        console.log('');
        console.log('💡 This error means the recipient number is not registered for testing.');
        console.log('To fix this:');
        console.log('1. Go to Meta Dashboard > API Setup');
        console.log('2. Add this phone number to "To" field');
        console.log('3. The number must have WhatsApp installed');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendWhatsAppMessage();
