/**
 * Test script for appeals API endpoints
 * Run with: node test-appeals-api.js
 */

const BASE_URL = 'http://localhost:3003';

// Test user IDs (replace with actual user IDs from your Firestore)
const TEST_USER_ID = 'TTJl6HqghIMZ3PYRg1eRuu6n8A53';
const TEST_MODERATOR_ID = 'KhpMnLh1DrNAMNdcX0p5Maw9P393';

async function testGetAppeals() {
  console.log('\n🧪 Testing GET /api/appeals...');
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/appeals?userId=${TEST_USER_ID}&userRole=user`
    );
    
    console.log('Status:', response.status);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('Appeals count:', data.appeals?.length || 0);
      console.log('Pagination:', data.pagination);
    } else {
      console.log('❌ Error:', data.error);
      console.log('Details:', data.details);
      console.log('Stack:', data.stack);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function testGetAppealsAsModerator() {
  console.log('\n🧪 Testing GET /api/appeals (as moderator)...');
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/appeals?userId=${TEST_MODERATOR_ID}&userRole=moderator`
    );
    
    console.log('Status:', response.status);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('Appeals count:', data.appeals?.length || 0);
    } else {
      console.log('❌ Error:', data.error);
      console.log('Details:', data.details);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Appeals API Tests...');
  console.log('Base URL:', BASE_URL);
  
  await testGetAppeals();
  await testGetAppealsAsModerator();
  
  console.log('\n✨ Tests complete!');
  console.log('\n📝 Note: If you see errors about missing indexes,');
  console.log('   run: firebase deploy --only firestore:indexes');
}

runTests();
