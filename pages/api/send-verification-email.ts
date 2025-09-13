import { NextApiRequest, NextApiResponse } from 'next';
import { sendVerificationEmailWithResend, isValidEmail, getEmailServiceStatus } from '@/lib/email-service';

// API route handler for sending verification emails
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { email, token } = req.body;

    // Validate required fields
    if (!email || !token) {
      return res.status(400).json({
        success: false,
        error: 'Email and token are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check email service configuration
    const serviceStatus = getEmailServiceStatus();
    if (!serviceStatus.configured) {
      console.error('Email service not configured. Missing variables:', serviceStatus.missingVars);
      return res.status(500).json({
        success: false,
        error: 'Email service not configured properly'
      });
    }

    // Send verification email
    const result = await sendVerificationEmailWithResend(email, token);

    if (result.success) {
      console.log('Verification email sent successfully:', {
        email,
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({
        success: true,
        message: 'Verification email sent successfully',
        messageId: result.messageId
      });
    } else {
      console.error('Failed to send verification email:', {
        email,
        error: result.error,
        timestamp: new Date().toISOString()
      });

      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('API route error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Export configuration for API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};