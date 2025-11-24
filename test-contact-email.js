const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testContactEmail() {
  console.log('🧪 Testing contact form email...\n');
  console.log('API Key:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: '3aridapp@gmail.com',
      replyTo: 'test@example.com',
      subject: '[Test] 3arida Contact Form',
      html: `
        <h2>Test Contact Form Email</h2>
        <p><strong>Name:</strong> Test User</p>
        <p><strong>Email:</strong> test@example.com</p>
        <p><strong>Reason:</strong> General Inquiry</p>
        <p><strong>Subject:</strong> Test Subject</p>
        <p><strong>Message:</strong> This is a test message from the contact form.</p>
      `,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', data.id);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }
}

testContactEmail();
