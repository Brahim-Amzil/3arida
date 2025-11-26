const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46');

async function checkDomain() {
  try {
    console.log('Checking Resend domain status...\n');
    
    // List all domains
    const domains = await resend.domains.list();
    console.log('Domains:', JSON.stringify(domains, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDomain();
