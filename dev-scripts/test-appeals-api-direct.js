/**
 * Test the appeals API endpoint directly
 */

async function testAPI() {
  const userId = 'TTJl6HqghIMZ3PYRg1eRuu6n8A53';
  const url = `http://localhost:3008/api/appeals?userId=${userId}&userRole=user`;

  console.log(`🔍 Testing API: ${url}\n`);

  try {
    const response = await fetch(url);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    
    console.log('\n📊 Response data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.appeals) {
      console.log(`\n✅ Found ${data.appeals.length} appeals`);
      data.appeals.forEach((appeal, i) => {
        console.log(`\nAppeal ${i + 1}:`);
        console.log(`  ID: ${appeal.id}`);
        console.log(`  Petition: ${appeal.petitionTitle}`);
        console.log(`  Status: ${appeal.status}`);
        console.log(`  Messages: ${appeal.messages?.length || 0}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPI();
