# Firebase Setup Guide for 3arida Petition Platform

This guide will help you set up Firebase for the 3arida Petition Platform.

## Prerequisites

1. A Google account
2. Access to the [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `3arida-petition-platform` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Enable this provider
   - **Google**: Enable and configure with your OAuth credentials
   - **Phone**: Enable for OTP verification (required for petition signing)

## Step 3: Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users (e.g., europe-west for Morocco)

## Step 4: Set up Firebase Storage

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as your Firestore database

## Step 5: Get Configuration Keys

### Client-side Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select the web icon (</>)
4. Register your app with name: `3arida-petition-platform`
5. Copy the configuration object and update your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Server-side Configuration (Service Account)

1. Go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following values and add to your `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

**Important**: Keep the private key secure and never commit it to version control.

## Step 6: Configure Security Rules

### Firestore Security Rules

Go to Firestore Database > Rules and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator']);
    }

    // Petitions collection - public read, authenticated write
    match /petitions/{petitionId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.token.email_verified == true;
      allow update: if request.auth != null &&
        (resource.data.creatorId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator']);
      allow delete: if request.auth != null &&
        (resource.data.creatorId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Signatures collection - authenticated users can create, creators can read
    match /signatures/{signatureId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.token.phone_number != null;
    }

    // Creator pages collection - public read, owner write
    match /creatorPages/{pageId} {
      allow read: if true;
      allow write: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Moderators collection - admin only
    match /moderators/{moderatorId} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage Security Rules

Go to Storage > Rules and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Petition media uploads
    match /petitions/{petitionId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email_verified == true &&
        resource.size < 10 * 1024 * 1024; // 10MB limit
    }

    // User profile images
    match /users/{userId}/profile/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.uid == userId &&
        resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Try to sign up with email/password
3. Check if the user document is created in Firestore
4. Test Google authentication
5. Verify that authentication state persists on page refresh

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/unauthorized-domain)"**

   - Go to Authentication > Settings > Authorized domains
   - Add `localhost` for development

2. **"Permission denied" errors in Firestore**

   - Check that security rules are properly configured
   - Ensure user is authenticated and email is verified

3. **Private key formatting issues**

   - Make sure the private key includes `\n` characters
   - Wrap the entire key in double quotes in the .env file

4. **Phone authentication not working**
   - Ensure reCAPTCHA is properly configured
   - Check that phone provider is enabled in Authentication settings

## Next Steps

After completing this setup:

1. Configure Stripe for payments (Task 5)
2. Set up QR code generation (Task 6)
3. Implement petition management (Task 4)
4. Create the moderation system (Task 8)

## Security Considerations

- Never expose Firebase Admin SDK credentials in client-side code
- Use environment variables for all sensitive configuration
- Regularly review and update security rules
- Enable Firebase App Check for production (recommended)
- Set up monitoring and alerts for suspicious activity
