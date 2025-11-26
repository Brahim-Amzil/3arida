const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46');

async function testSend() {
  try {
    console.log('Sending test email to contact@3arida.ma...\n');
    
    const result = await resend.emails.send({
      from: '3arida Platform <noreply@3arida.ma>',
      to: 'contact@3arida.ma',
      subject: 'Test Email - Contact Form',
      html: '<h1>Test Email</h1><p>This is a test email to verify delivery to contact@3arida.ma</p>',
    });
    
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('\n❌ Error:', result.error);
    } else {
      console.log('\n✅ Email sent successfully!');
      console.log('Message ID:', result.data.id);
      console.log('\nPlease check:');
      console.log('1. Inbox at contact@3arida.ma');
      console.log('2. Spam/Junk folder');
      console.log('3. Wait a few minutes for delivery');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSend();
