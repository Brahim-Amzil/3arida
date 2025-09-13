import { NextApiRequest, NextApiResponse } from 'next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { createVerificationToken, sendVerificationEmail } from '@/lib/email-verification';
import { validateRecaptcha } from '@/lib/recaptcha';
import { isValidEmail } from '@/lib/email-service';

interface JoinRequest {
  name: string;
  email: string;
  password: string;
  recaptchaToken?: string;
}

interface JoinResponse {
  success: boolean;
  message: string;
  userId?: string;
  confirmEmail?: boolean;
}

// Firebase user registration handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JoinResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { name, email, password, recaptchaToken }: JoinRequest = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Only validate reCAPTCHA if token is provided and reCAPTCHA is enabled
    if (recaptchaToken) {
      try {
        await validateRecaptcha(recaptchaToken);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA validation failed'
        });
      }
    }

    // Create Firebase user
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Firebase user creation error:', error);
      
      let errorMessage = 'Failed to create user account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const user = userCredential.user;

    // Create user document in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'user',
        isActive: true,
        emailVerified: false,
        verifiedEmail: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      // Note: User is already created in Firebase Auth, but document creation failed
      // This is not ideal, but we'll continue with email verification
    }

    // Create and send verification email
    let emailSent = false;
    try {
      const verificationToken = await createVerificationToken(user.uid, email);
      emailSent = await sendVerificationEmail(email, verificationToken);
      
      if (emailSent) {
        console.log('Verification email sent successfully to:', email);
      } else {
        console.error('Failed to send verification email to:', email);
      }
    } catch (error) {
      console.error('Error in email verification process:', error);
    }

    // Log successful registration
    console.log('User registered successfully:', {
      userId: user.uid,
      email,
      name,
      emailSent,
      timestamp: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: emailSent 
        ? 'Account created successfully! Please check your email for verification instructions.'
        : 'Account created successfully! Please verify your email address.',
      userId: user.uid,
      confirmEmail: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
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