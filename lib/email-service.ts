import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@arida.com';
const FROM_NAME = process.env.FROM_NAME || '3arida Platform';
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Generate HTML email template
function generateVerificationEmailHTML(verificationUrl: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - 3arida Platform</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .email-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .verify-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 30px;
          transition: transform 0.2s;
        }
        .verify-button:hover {
          transform: translateY(-2px);
        }
        .fallback {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .fallback-title {
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .fallback-url {
          word-break: break-all;
          color: #667eea;
          font-family: monospace;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .footer-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
        .warning-icon {
          font-size: 18px;
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-card">
          <div class="header">
            <div class="logo">3arida</div>
            <div class="subtitle">Petition Platform</div>
          </div>
          
          <div class="content">
            <h1 class="title">Verify Your Email Address</h1>
            
            <p class="message">
              Welcome to 3arida! To complete your account setup and start creating or signing petitions, 
              please verify your email address by clicking the button below.
            </p>
            
            <a href="${verificationUrl}" class="verify-button">
              Verify Email Address
            </a>
            
            <div class="warning">
              <span class="warning-icon">⚠️</span>
              <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
            </div>
            
            <div class="fallback">
              <div class="fallback-title">Can't click the button?</div>
              <div>Copy and paste this URL into your browser:</div>
              <div class="fallback-url">${verificationUrl}</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              This email was sent to <strong>${email}</strong>
            </div>
            <div class="footer-text">
              If you didn't create an account with 3arida, you can safely ignore this email.
            </div>
            <div class="footer-text">
              © 2024 3arida Platform. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email template
function generateVerificationEmailText(verificationUrl: string, email: string): string {
  return `
Verify Your Email Address - 3arida Platform

Welcome to 3arida!

To complete your account setup and start creating or signing petitions, please verify your email address by visiting the following link:

${verificationUrl}

IMPORTANT: This verification link will expire in 24 hours for security reasons.

If you can't click the link, copy and paste the URL above into your browser.

This email was sent to ${email}

If you didn't create an account with 3arida, you can safely ignore this email.

© 2024 3arida Platform. All rights reserved.
  `;
}

// Send verification email using Resend
export async function sendVerificationEmailWithResend(
  email: string, 
  token: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    // Construct verification URL
    const verificationUrl = `${NEXTAUTH_URL}/auth/verify-email-token?token=${encodeURIComponent(token)}`;
    
    // Generate email content
    const htmlContent = generateVerificationEmailHTML(verificationUrl, email);
    const textContent = generateVerificationEmailText(verificationUrl, email);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [email],
      subject: 'Verify Your Email Address - 3arida Platform',
      html: htmlContent,
      text: textContent,
      tags: [
        {
          name: 'category',
          value: 'email_verification'
        },
        {
          name: 'environment',
          value: process.env.NODE_ENV || 'development'
        }
      ]
    });

    if (error) {
      console.error('Resend API error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email' 
      };
    }

    console.log('Verification email sent successfully:', {
      messageId: data?.id,
      email,
      verificationUrl
    });

    return { 
      success: true, 
      messageId: data?.id 
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get email service configuration status
export function getEmailServiceStatus(): {
  configured: boolean;
  missingVars: string[];
} {
  const requiredVars = ['RESEND_API_KEY', 'FROM_EMAIL', 'NEXTAUTH_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  return {
    configured: missingVars.length === 0,
    missingVars
  };
}