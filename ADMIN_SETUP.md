# Admin Setup Guide

This guide explains how to set up the first admin user for the 3arida Petition Platform.

## Overview

The 3arida platform uses Firebase Authentication with role-based access control. By default, all new users are created with the 'user' role. To access admin features, you need to manually promote a user to the 'admin' role in the Firestore database.

## Prerequisites

- Firebase project set up and configured
- Firestore database initialized
- Application deployed and running
- Access to Firebase Console or Firebase Admin SDK

## Method 1: Using Firebase Console (Recommended)

### Step 1: Create a User Account

1. Go to your deployed application
2. Register a new account using email/password or Google OAuth
3. Complete email verification if using email/password registration
4. Note down the user's email address

### Step 2: Find the User Document

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Go to the `users` collection
5. Find the document with the email address of the user you want to promote
6. Note down the document ID (this is the user's UID)

### Step 3: Update User Role

1. Click on the user document to edit it
2. Find the `role` field (it should currently be set to `'user'`)
3. Change the value from `'user'` to `'admin'`
4. Update the `updatedAt` field to the current timestamp
5. Save the changes

### Step 4: Verify Admin Access

1. Have the user log out and log back in
2. Navigate to `/admin/dashboard`
3. Verify that the admin navigation appears in the sidebar
4. Confirm access to admin features

## Method 2: Using Firebase Admin SDK

If you have access to a server environment with Firebase Admin SDK:

```javascript
import { adminDb } from './lib/firebase/admin';

async function promoteUserToAdmin(userEmail) {
  try {
    // Find user by email
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('email', '==', userEmail).get();
    
    if (snapshot.empty) {
      console.log('User not found');
      return;
    }
    
    // Update the first matching user
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      role: 'admin',
      updatedAt: new Date()
    });
    
    console.log(`User ${userEmail} promoted to admin`);
  } catch (error) {
    console.error('Error promoting user:', error);
  }
}

// Usage
promoteUserToAdmin('admin@example.com');
```

## Method 3: Using API Endpoint (After First Admin)

Once you have at least one admin user, you can use the admin API to promote other users:

```bash
curl -X POST https://your-domain.com/api/admin/users/update-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{
    "userId": "USER_UID_TO_PROMOTE",
    "role": "admin"
  }'
```

## Admin Features

Once a user has admin role, they will have access to:

### Admin Dashboard (`/admin/dashboard`)
- Platform statistics overview
- Recent activity monitoring
- Quick action buttons

### User Management (`/admin/users`)
- View all users
- Search and filter users
- Update user roles (user, moderator, admin)
- Toggle user active status

### Moderator Management (`/admin/moderators`)
- View all moderators
- Assign moderator permissions
- Update moderator permissions
- Revoke moderator status

### Petition Moderation (`/admin/petitions`)
- View all petitions
- Filter by status (draft, pending, approved, paused, deleted)
- Search petitions
- Update petition status
- Delete petitions

## Security Considerations

1. **Limit Admin Users**: Only promote trusted users to admin role
2. **Regular Audits**: Periodically review admin user list
3. **Strong Authentication**: Ensure admin users use strong passwords and 2FA when available
4. **Monitor Activity**: Keep track of admin actions through audit logs

## Troubleshooting

### Admin Navigation Not Showing

1. Verify the user's role is set to 'admin' in Firestore
2. Clear browser cache and cookies
3. Log out and log back in
4. Check browser console for any JavaScript errors

### Access Denied to Admin Pages

1. Confirm the user document exists in Firestore
2. Verify the `role` field is exactly `'admin'` (case-sensitive)
3. Ensure the user is properly authenticated
4. Check that the `isActive` field is set to `true`

### API Endpoints Not Working

1. Verify Firebase Admin SDK is properly configured
2. Check environment variables are set correctly
3. Ensure Firestore security rules allow admin operations
4. Review server logs for authentication errors

## Environment Variables

Ensure these environment variables are properly set:

```env
# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
```

## Next Steps

After setting up your first admin user:

1. **Create Additional Admins**: Use the admin interface to promote other trusted users
2. **Set Up Moderators**: Assign moderator roles with specific permissions
3. **Configure Monitoring**: Set up logging and monitoring for admin activities
4. **Backup Strategy**: Ensure regular backups of your Firestore database

## Support

If you encounter issues during admin setup:

1. Check the application logs for error messages
2. Verify Firebase configuration and permissions
3. Review Firestore security rules
4. Consult the Firebase documentation for authentication and Firestore

For additional help, refer to the main project documentation or contact the development team.