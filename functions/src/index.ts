import {onRequest} from "firebase-functions/v2/https";
import {logger} from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {Resend} from "resend";
import cors from "cors";

// Initialize CORS
const corsHandler = cors({origin: true});

// Define secret
const resendApiKey = defineSecret("RESEND_API_KEY");

// Email verification function
export const sendVerificationEmail = onRequest(
  {secrets: [resendApiKey]},
  (request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Only allow POST requests
      if (request.method !== "POST") {
        response.status(405).json({error: "Method not allowed"});
        return;
      }

      const {email, token} = request.body;

      // Validate required fields
      if (!email || !token) {
        response.status(400).json({
          error: "Missing required fields: email and token",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        response.status(400).json({error: "Invalid email format"});
        return;
      }

      // Get environment variables
      const fromEmail = "contact@3arida.ma";
      const fromName = "3arida Platform";
      const appUrl = "https://arida-c5faf.web.app";

      // Construct verification URL
      const verificationUrl = `${appUrl}/auth/verify-email-token?token=${encodeURIComponent(token)}`;

      // Generate email content
      const htmlContent = generateVerificationEmailHTML(verificationUrl, email);
      const textContent = generateVerificationEmailText(verificationUrl, email);

      // Initialize Resend with secret
       const resend = new Resend(resendApiKey.value());
       
       // Send email via Resend
       const result = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [email],
        subject: "Verify Your Email Address - 3arida Platform",
        html: htmlContent,
        text: textContent,
        tags: [
          {
            name: "category",
            value: "email_verification",
          },
        ],
      });

      logger.info("Verification email sent successfully", {
        email,
        messageId: result.data?.id,
      });

      response.status(200).json({
        success: true,
        message: "Verification email sent successfully",
        messageId: result.data?.id,
      });
    } catch (error) {
      logger.error("Error sending verification email", error);
      response.status(500).json({
        success: false,
        error: "Failed to send verification email",
      });
    }
   });
  }
);

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
