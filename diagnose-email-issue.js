const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46');

async function diagnose() {
  console.log('=== EMAIL DELIVERY DIAGNOSTIC ===\n');
  
  // 1. Check domain status
  console.log('1. Checking Resend domain status...');
  const domains = await resend.domains.list();
  const domain = domains.data?.data?.[0];
  
  if (domain) {
    console.log(`   Domain: ${domain.name}`);
    console.log(`   Status: ${domain.status}`);
    console.log(`   Region: ${domain.region}`);
    console.log(`   Sending: ${domain.capabilities?.sending}`);
  }
  
  // 2. Check recent emails
  console.log('\n2. Checking recent email deliveries...');
  const emails = await resend.emails.list({ limit: 5 });
  
  if (emails.data?.data) {
    emails.data.data.forEach((email, i) => {
      console.log(`\n   Email ${i + 1}:`);
      console.log(`   - ID: ${email.id}`);
      console.log(`   - To: ${email.to}`);
      console.log(`   - From: ${email.from}`);
      console.log(`   - Subject: ${email.subject}`);
      console.log(`   - Status: ${email.last_event || 'sent'}`);
      console.log(`   - Created: ${email.created_at}`);
    });
  }
  
  // 3. Check environment variables
  console.log('\n3. Checking configuration...');
  console.log(`   RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || 'noreply@3arida.ma'}`);
  console.log(`   CONTACT_EMAIL: ${process.env.CONTACT_EMAIL || 'contact@3arida.ma'}`);
  
  // 4. Send a test email with detailed tracking
  console.log('\n4. Sending test email...');
  const testResult = await resend.emails.send({
    from: '3arida Platform <noreply@3arida.ma>',
    to: 'contact@3arida.ma',
    subject: 'Diagnostic Test Email',
    html: `
      <h1>Email Delivery Test</h1>
      <p>This is a diagnostic test email sent at ${new Date().toISOString()}</p>
      <p>If you receive this, the email delivery is working!</p>
      <hr>
      <p><strong>Configuration:</strong></p>
      <ul>
        <li>From: noreply@3arida.ma</li>
        <li>To: contact@3arida.ma</li>
        <li>Domain: 3arida.ma (verified)</li>
        <li>Service: Resend via Amazon SES</li>
      </ul>
    `,
  });
  
  if (testResult.error) {
    console.log(`   ❌ Error: ${testResult.error.message}`);
  } else {
    console.log(`   ✅ Email sent successfully`);
    console.log(`   Message ID: ${testResult.data.id}`);
  }
  
  console.log('\n=== DIAGNOSTIC COMPLETE ===');
  console.log('\nNext steps:');
  console.log('1. Check contact@3arida.ma inbox (including spam folder)');
  console.log('2. Check Hostinger webmail: https://webmail.hostinger.com');
  console.log('3. Look for emails from noreply@3arida.ma');
  console.log('4. Check for any email filters or forwarding rules in Hostinger');
  console.log('5. Wait 5-10 minutes for delivery (emails can be delayed)');
}

diagnose().catch(console.error);
