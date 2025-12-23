// Test contact form locally
const testContactForm = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        reason: 'general',
        subject: 'Test Subject',
        message: 'This is a test message',
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Contact form test passed!');
    } else {
      console.log('❌ Contact form test failed:', data.error);
      if (data.details) {
        console.log('Error details:', data.details);
      }
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

testContactForm();
