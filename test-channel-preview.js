// Test script to verify channel preview API
// Run with: node test-channel-preview.js

const testUrl = 'https://www.youtube.com/@RHINO';

async function testChannelPreview() {
  console.log('🧪 Testing channel preview API...');
  console.log('📍 URL:', testUrl);
  
  try {
    const response = await fetch('http://localhost:3000/api/channel-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: testUrl }),
    });

    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('📝 Name:', data.name);
      console.log('🖼️ Image:', data.image);
      console.log('📄 Description:', data.description);
      console.log('🌐 Platform:', data.platform);
      console.log('\n📦 Full response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testChannelPreview();
