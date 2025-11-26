const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46');

async function checkDelivery() {
  try {
    console.log('Checking recent email deliveries...\n');
    
    // Get recent emails
    const emails = await resend.emails.list({ limit: 10 });
    
    if (emails.data && emails.data.data) {
      console.log(`Found ${emails.data.data.length} recent emails:\n`);
      
      emails.data.data.forEach((email, index) => {
        console.log(`${index + 1}. Email ID: ${email.id}`);
        console.log(`   To: ${email.to}`);
        console.log(`   Subject: ${email.subject}`);
        console.log(`   Status: ${email.last_event || 'sent'}`);
        console.log(`   Created: ${email.created_at}`);
        console.log('');
      });
    } else {
      console.log('No recent emails found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDelivery();
