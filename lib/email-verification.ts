import { db } from './firebase/config';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';

// Email verification token interface
interface VerificationToken {
  userId: string;
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
}

// Generate a unique verification token
export function generateVerificationToken(): string {
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return `${randomString}_${timestamp}`;
}

// Create and store verification token in Firestore
export async function createVerificationToken(userId: string, email: string): Promise<string> {
  const token = generateVerificationToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const verificationToken: VerificationToken = {
    userId,
    email,
    token,
    createdAt: now,
    expiresAt,
    isUsed: false
  };

  try {
    await setDoc(doc(db, 'emailVerificationTokens', token), verificationToken);
    console.log('Verification token created:', token);
    return token;
  } catch (error) {
    console.error('Error creating verification token:', error);
    throw new Error('Failed to create verification token');
  }
}

// Send verification email using local Resend API
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  try {
    console.log('Email verification token generated:', token);
    console.log('Sending verification email to:', email);
    
    // Call local API endpoint for email sending
    const response = await fetch('/api/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        token
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to send verification email:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('Verification email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error in email verification process:', error);
    return false;
  }
}

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
        }
        .fallback {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
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
            
            <div class="fallback">
              <div>Can't click the button? Copy and paste this URL into your browser:</div>
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

// Verify email with token using client SDK
export async function verifyEmailWithToken(token: string): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    console.log('verifyEmailWithToken: Starting verification for token:', token);
    
    // Get token document from Firestore using client SDK
    const tokenDoc = await getDoc(doc(db, 'emailVerificationTokens', token));
    
    if (!tokenDoc.exists()) {
      console.log('verifyEmailWithToken: Token document does not exist');
      return {
        success: false,
        message: 'Invalid verification token'
      };
    }

    const tokenData = tokenDoc.data() as VerificationToken;
    console.log('verifyEmailWithToken: Token data:', { userId: tokenData.userId, isUsed: tokenData.isUsed, email: tokenData.email });

    // Check if token is already used
    if (tokenData.isUsed) {
      console.log('verifyEmailWithToken: Token already used');
      return {
        success: false,
        message: 'Verification token has already been used'
      };
    }

    // Check if token is expired
    const expiresAt = tokenData.expiresAt instanceof Date 
      ? tokenData.expiresAt 
      : (tokenData.expiresAt && typeof (tokenData.expiresAt as any).toDate === 'function') 
        ? (tokenData.expiresAt as any).toDate() 
        : new Date(tokenData.expiresAt as any);
    
    if (new Date() > expiresAt) {
      console.log('verifyEmailWithToken: Token expired');
      return {
        success: false,
        message: 'Verification token has expired'
      };
    }

    console.log('verifyEmailWithToken: Marking token as used');
    // Mark token as used
    await updateDoc(doc(db, 'emailVerificationTokens', token), {
      isUsed: true
    });

    console.log('verifyEmailWithToken: Creating/updating user document with verifiedEmail: true');
    // Create or update user's email verification status
    const userDocRef = doc(db, 'users', tokenData.userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update existing user document
      await updateDoc(userDocRef, {
        verifiedEmail: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Create new user document (for existing users who don't have one)
      await setDoc(userDocRef, {
        id: tokenData.userId,
        email: tokenData.email,
        verifiedEmail: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
        status: 'active'
      });
    }

    console.log('verifyEmailWithToken: Verification completed successfully');
    return {
      success: true,
      message: 'Email verified successfully!',
      userId: tokenData.userId
    };
  } catch (error) {
    console.error('Error verifying email token:', error);
    return { success: false, message: 'Failed to verify email' };
  }
}

// Resend verification email
export async function resendVerificationEmail(userId: string, email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user already has a valid token
    const tokensQuery = query(
      collection(db, 'emailVerificationTokens'),
      where('userId', '==', userId),
      where('isUsed', '==', false)
    );
    
    const existingTokens = await getDocs(tokensQuery);
    
    // Delete any existing unused tokens
    for (const tokenDoc of existingTokens.docs) {
      await deleteDoc(tokenDoc.ref);
    }

    // Create new token
    const newToken = await createVerificationToken(userId, email);
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, newToken);
    
    if (emailSent) {
      return { success: true, message: 'Verification email sent successfully!' };
    } else {
      return { success: false, message: 'Failed to send verification email' };
    }
  } catch (error) {
    console.error('Error resending verification email:', error);
    return { success: false, message: 'Failed to resend verification email' };
  }
}

// Get user verification status
export async function getUserVerificationStatus(userId: string): Promise<{ isVerified: boolean; email?: string }> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { isVerified: false };
    }

    const userData = userDoc.data();
    return {
      isVerified: userData.verifiedEmail || false,
      email: userData.email
    };
  } catch (error) {
    console.error('Error getting user verification status:', error);
    return { isVerified: false };
  }
}

// Clean up expired tokens (utility function)
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    const now = new Date();
    const tokensQuery = query(collection(db, 'emailVerificationTokens'));
    const allTokens = await getDocs(tokensQuery);
    
    const deletePromises: Promise<void>[] = [];
    
    for (const tokenDoc of allTokens.docs) {
      const tokenData = tokenDoc.data() as VerificationToken;
      if (now > tokenData.expiresAt) {
        deletePromises.push(deleteDoc(tokenDoc.ref));
      }
    }
    
    await Promise.all(deletePromises);
    console.log(`Cleaned up ${deletePromises.length} expired tokens`);
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}