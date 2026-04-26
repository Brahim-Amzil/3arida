// Helper functions to trigger email notifications
import { queueEmail } from './email-queue';
import {
  welcomeEmail,
  petitionApprovedEmail,
  signatureConfirmationEmail,
  petitionUpdateEmail,
  milestoneReachedEmail,
} from './email-templates';

// Option to use queue (recommended for production)
const USE_QUEUE = process.env.USE_EMAIL_QUEUE === 'true';

export async function sendWelcomeEmail(userName: string, userEmail: string) {
  if (USE_QUEUE) {
    const html = welcomeEmail(userName, userEmail);
    await queueEmail(userEmail, 'مرحبا بك في 3arida - Welcome to 3arida', html);
    return true;
  }

  // Direct send
  try {
    // Check if we're on server or client
    const isServer = typeof window === 'undefined';

    if (isServer) {
      // Server-side: call email service directly
      const { sendEmail } = await import('./email-service');
      const html = welcomeEmail(userName, userEmail);
      const result = await sendEmail({
        to: userEmail,
        subject: 'مرحبا بك في 3arida - Welcome to 3arida',
        html,
      });
      return result.success;
    } else {
      // Client-side: call API endpoint
      const response = await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userEmail }),
      });
      return response.ok;
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function sendPetitionApprovedEmail(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  petitionId: string,
) {
  console.log('📧 sendPetitionApprovedEmail called with:', {
    userName,
    userEmail,
    petitionTitle,
    petitionId,
  });

  try {
    // Check if we're on server or client
    const isServer = typeof window === 'undefined';
    console.log('📧 Running on:', isServer ? 'SERVER' : 'CLIENT');

    if (isServer) {
      // Server-side: call email service directly
      console.log('📧 SERVER: Importing email service...');
      const { sendEmail } = await import('./email-service');
      const { petitionApprovedEmail } = await import('./email-templates');
      console.log('📧 SERVER: Generating email HTML...');
      const html = petitionApprovedEmail(
        userName,
        petitionTitle,
        petitionId,
        userEmail,
      );
      console.log('📧 SERVER: Sending email...');
      const result = await sendEmail({
        to: userEmail,
        subject: `✅ تمت الموافقة على عريضتك: ${petitionTitle}`,
        html,
      });
      console.log('📧 SERVER: Email result:', result);
      return result.success;
    } else {
      // Client-side: call API endpoint
      console.log('📧 CLIENT: Calling API endpoint...');
      const response = await fetch('/api/email/petition-approved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          petitionTitle,
          petitionId,
        }),
      });
      console.log('📧 CLIENT: API response status:', response.status);
      const data = await response.json();
      console.log('📧 CLIENT: API response data:', data);
      return response.ok;
    }
  } catch (error) {
    console.error('❌ Failed to send petition approved email:', error);
    console.error('❌ Error details:', error);
    return false;
  }
}

export async function sendSignatureConfirmationEmail(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  petitionId: string,
) {
  try {
    // Check if we're on server or client
    const isServer = typeof window === 'undefined';

    if (isServer) {
      // Server-side: call email service directly
      const { sendEmail } = await import('./email-service');
      const { signatureConfirmationEmail } = await import('./email-templates');
      const html = signatureConfirmationEmail(
        userName,
        petitionTitle,
        petitionId,
        userEmail,
      );
      const result = await sendEmail({
        to: userEmail,
        subject: `✍️ شكرا على توقيعك: ${petitionTitle}`,
        html,
      });
      return result.success;
    } else {
      // Client-side: call API endpoint
      const response = await fetch('/api/email/signature-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          petitionTitle,
          petitionId,
        }),
      });
      return response.ok;
    }
  } catch (error) {
    console.error('Failed to send signature confirmation email:', error);
    return false;
  }
}

export async function sendPetitionUpdateEmail(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  petitionId: string,
  updateTitle: string,
  updateContent: string,
) {
  try {
    const response = await fetch('/api/email/petition-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName,
        userEmail,
        petitionTitle,
        petitionId,
        updateTitle,
        updateContent,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to send petition update email:', error);
    return false;
  }
}

export async function sendMilestoneEmail(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  petitionId: string,
  milestone: number,
  currentSignatures: number,
  targetSignatures: number,
) {
  try {
    const response = await fetch('/api/email/milestone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName,
        userEmail,
        petitionTitle,
        petitionId,
        milestone,
        currentSignatures,
        targetSignatures,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to send milestone email:', error);
    return false;
  }
}

// Batch email sending for petition updates (to all signers)
export async function sendBatchPetitionUpdateEmails(
  signers: Array<{ name: string; email: string }>,
  petitionTitle: string,
  petitionId: string,
  updateTitle: string,
  updateContent: string,
) {
  const results = await Promise.allSettled(
    signers.map((signer) =>
      sendPetitionUpdateEmail(
        signer.name,
        signer.email,
        petitionTitle,
        petitionId,
        updateTitle,
        updateContent,
      ),
    ),
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  console.log(`Batch email results: ${successful} sent, ${failed} failed`);
  return { successful, failed };
}

export async function sendPetitionRejectedEmail(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  petitionId: string,
  reason: string,
) {
  try {
    const isServer = typeof window === 'undefined';

    if (isServer) {
      const { sendEmail } = await import('./email-service');
      const { petitionRejectedEmail } = await import('./email-templates');
      const html = petitionRejectedEmail(
        userName,
        petitionTitle,
        petitionId,
        reason,
        userEmail,
      );
      const result = await sendEmail({
        to: userEmail,
        subject: `❌ تم رفض عريضتك: ${petitionTitle}`,
        html,
      });
      return result.success;
    } else {
      const response = await fetch('/api/email/petition-rejected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          petitionTitle,
          petitionId,
          reason,
        }),
      });
      return response.ok;
    }
  } catch (error) {
    console.error('Failed to send petition rejected email:', error);
    return false;
  }
}

export async function sendPetitionPausedEmail(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  petitionId: string,
  reason: string,
) {
  try {
    const isServer = typeof window === 'undefined';

    if (isServer) {
      const { sendEmail } = await import('./email-service');
      const { petitionPausedEmail } = await import('./email-templates');
      const html = petitionPausedEmail(
        userName,
        petitionTitle,
        petitionId,
        reason,
        userEmail,
      );
      const result = await sendEmail({
        to: userEmail,
        subject: `⏸️ تم إيقاف عريضتك مؤقتًا: ${petitionTitle}`,
        html,
      });
      return result.success;
    } else {
      const response = await fetch('/api/email/petition-paused', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          petitionTitle,
          petitionId,
          reason,
        }),
      });
      return response.ok;
    }
  } catch (error) {
    console.error('Failed to send petition paused email:', error);
    return false;
  }
}

export async function sendPetitionDeletedEmail(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  reason: string,
) {
  try {
    const isServer = typeof window === 'undefined';

    if (isServer) {
      const { sendEmail } = await import('./email-service');
      const { petitionDeletedEmail } = await import('./email-templates');
      const html = petitionDeletedEmail(
        userName,
        petitionTitle,
        reason,
        userEmail,
      );
      const result = await sendEmail({
        to: userEmail,
        subject: `🗑️ تم حذف عريضتك: ${petitionTitle}`,
        html,
      });
      return result.success;
    } else {
      const response = await fetch('/api/email/petition-deleted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          petitionTitle,
          reason,
        }),
      });
      return response.ok;
    }
  } catch (error) {
    console.error('Failed to send petition deleted email:', error);
    return false;
  }
}
