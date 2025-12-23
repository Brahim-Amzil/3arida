#!/usr/bin/env node

/**
 * Email System Test Script (With Rate Limit Handling)
 * Sends emails with 1-second delays to avoid rate limiting
 */

const testEmail = process.env.TEST_EMAIL || '3aridapp@gmail.com';
const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007';

console.log('🧪 Testing Email Notification System (Slow Mode)\n');
console.log(`Base URL: ${baseUrl}`);
console.log(`Test Email: ${testEmail}`);
console.log('⏱️  Adding 1-second delays between emails to avoid rate limiting\n');

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testWelcomeEmail() {
  console.log('1️⃣ Testing Welcome Email...');
  try {
    const response = await fetch(`${baseUrl}/api/email/welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Test User',
        userEmail: testEmail,
      }),
    });

    if (response.ok) {
      console.log('   ✅ Welcome email sent successfully');
      return true;
    } else {
      const error = await response.text();
      console.log(`   ❌ Failed: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testPetitionApprovedEmail() {
  console.log('2️⃣ Testing Petition Approved Email...');
  try {
    const response = await fetch(`${baseUrl}/api/email/petition-approved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Test Creator',
        userEmail: testEmail,
        petitionTitle: 'Test Petition for Better Education',
        petitionId: 'test-petition-123',
      }),
    });

    if (response.ok) {
      console.log('   ✅ Petition approved email sent successfully');
      return true;
    } else {
      const error = await response.text();
      console.log(`   ❌ Failed: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testSignatureConfirmationEmail() {
  console.log('3️⃣ Testing Signature Confirmation Email...');
  try {
    const response = await fetch(`${baseUrl}/api/email/signature-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Test Signer',
        userEmail: testEmail,
        petitionTitle: 'Test Petition for Better Education',
        petitionId: 'test-petition-123',
      }),
    });

    if (response.ok) {
      console.log('   ✅ Signature confirmation email sent successfully');
      return true;
    } else {
      const error = await response.text();
      console.log(`   ❌ Failed: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testPetitionUpdateEmail() {
  console.log('4️⃣ Testing Petition Update Email...');
  try {
    const response = await fetch(`${baseUrl}/api/email/petition-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Test Signer',
        userEmail: testEmail,
        petitionTitle: 'Test Petition for Better Education',
        petitionId: 'test-petition-123',
        updateTitle: 'Great Progress Update!',
        updateContent: 'We have reached 500 signatures and the ministry has agreed to meet with us next week. Thank you all for your support!',
      }),
    });

    if (response.ok) {
      console.log('   ✅ Petition update email sent successfully');
      return true;
    } else {
      const error = await response.text();
      console.log(`   ❌ Failed: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testMilestoneEmail() {
  console.log('5️⃣ Testing Milestone Email...');
  try {
    const response = await fetch(`${baseUrl}/api/email/milestone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Test Creator',
        userEmail: testEmail,
        petitionTitle: 'Test Petition for Better Education',
        petitionId: 'test-petition-123',
        milestone: 75,
        currentSignatures: 750,
        targetSignatures: 1000,
      }),
    });

    if (response.ok) {
      console.log('   ✅ Milestone email sent successfully');
      return true;
    } else {
      const error = await response.text();
      console.log(`   ❌ Failed: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════\n');
  
  const results = [];
  
  // Test 1
  results.push(await testWelcomeEmail());
  await wait(1200); // Wait 1.2 seconds
  console.log('');
  
  // Test 2
  results.push(await testPetitionApprovedEmail());
  await wait(1200);
  console.log('');
  
  // Test 3
  results.push(await testSignatureConfirmationEmail());
  await wait(1200);
  console.log('');
  
  // Test 4
  results.push(await testPetitionUpdateEmail());
  await wait(1200);
  console.log('');
  
  // Test 5
  results.push(await testMilestoneEmail());
  console.log('');
  
  console.log('═══════════════════════════════════════════════════\n');
  
  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;
  
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}/5`);
  console.log(`   ❌ Failed: ${failed}/5\n`);
  
  if (failed === 0) {
    console.log('🎉 All email tests passed! Check your inbox at:', testEmail);
    console.log('\n📧 You should receive 5 emails within 1-2 minutes:');
    console.log('   1. Welcome Email');
    console.log('   2. Petition Approved');
    console.log('   3. Signature Confirmation');
    console.log('   4. Petition Update');
    console.log('   5. Milestone Reached (75%)');
    console.log('\n✅ Email system is ready for production!\n');
  } else {
    console.log('⚠️  Some tests failed. Please check:');
    console.log('   1. RESEND_API_KEY is set in .env.local');
    console.log('   2. Development server is running (npm run dev)');
    console.log('   3. API routes are accessible');
    console.log('   4. Check console for error messages\n');
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.log('❌ Server not running. Please start with: npm run dev\n');
    process.exit(1);
  }
}

// Main execution
(async () => {
  await checkServer();
  await runTests();
})();
