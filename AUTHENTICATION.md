# Authentication System Documentation

## Overview

The 3arida Petition Platform uses Firebase Authentication as its primary authentication system, replacing the default Auth.js from the BoxyHQ starter kit. The system supports multiple authentication methods and implements role-based access control with specific requirements for petition creation and signing.

## Authentication Methods

### 1. Google OAuth Authentication

- **Purpose**: Quick sign-up/sign-in for users
- **Implementation**: `AuthService.signInWithGoogle()`
- **Requirements**: None (automatic email verification through Google)

### 2. Email/Password Authentication

- **Purpose**: Traditional authentication method
- **Implementation**: `AuthService.createAccountWithEmail()` and `AuthService.signInWithEmail()`
- **Requirements**: Email verification required before petition creation

### 3. Phone Number OTP Verification

- **Purpose**: Required for petition signing to ensure authenticity
- **Implementation**: `AuthService.verifyPhoneForSigning()` and `AuthService.verifyOTPForSigning()`
- **Requirements**: Phone verification required before signing petitions

## User Roles and Permissions

### User Roles

1. **User** (default): Can create and sign petitions
2. **Moderator**: Can moderate petitions based on assigned permissions
3. **Admin**: Full access to all platform features

### Moderator Permissions

- `approve`: Can approve pending petitions
- `pause`: Can pause active petitions
- `delete`: Can delete petitions
- `statsAccess`: Can view petition statistics and analytics

## Authentication Requirements by Feature

### Petition Creation

- **Required**: Authentication + Email Verification
- **Middleware**: `requirePetitionCreationAuth`
- **Rationale**: Ensures creators have verified contact information

### Petition Signing

- **Required**: Authentication + Phone Verification
- **Middleware**: `requirePetitionSigningAuth`
- **Rationale**: Prevents duplicate signatures and ensures authenticity

### Moderation Actions

- **Required**: Authentication + Moderator Role + Specific Permission
- **Middleware**: `requireModeratorPermission(permission)`
- **Rationale**: Ensures only authorized moderators can perform specific actions

### Admin Actions

- **Required**: Authentication + Admin Role
- **Middleware**: `requireAdminAuth`
- **Rationale**: Restricts sensitive operations to administrators

## API Usage Examples

### Protected Route Implementation

```typescript
// pages/api/petitions/create.ts
import { requirePetitionCreationAuth } from '../../../lib/firebase/middleware';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apply middleware
  await new Promise<void>((resolve, reject) => {
    requirePetitionCreationAuth(req, res, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  // Your petition creation logic here
}
```

### Frontend Route Protection

```tsx
// pages/create-petition.tsx
import { RequireEmailVerification } from '../components/auth';

export default function CreatePetitionPage() {
  return (
    <RequireEmailVerification>
      {/* Your petition creation form */}
    </RequireEmailVerification>
  );
}
```

### Role-Based Component Access

```tsx
import { useRoleAccess } from '../hooks/useRoleAccess';

function ModerationPanel() {
  const { hasPermission } = useRoleAccess();

  return (
    <div>
      {hasPermission('approve') && <button>Approve Petition</button>}
      {hasPermission('delete') && <button>Delete Petition</button>}
    </div>
  );
}
```

## Phone Verification for Petition Signing

### Implementation

```tsx
import { PhoneVerification } from '../components/auth';

function SignPetitionModal({ petitionId }) {
  const handleVerificationSuccess = (phoneNumber: string) => {
    // Proceed with petition signing
    signPetition(petitionId, phoneNumber);
  };

  return (
    <PhoneVerification
      onVerificationSuccess={handleVerificationSuccess}
      onVerificationError={(error) => console.error(error)}
      buttonText="Sign Petition"
    />
  );
}
```

## Middleware Functions

### Core Middleware

- `verifyFirebaseToken`: Validates Firebase ID token and fetches user data
- `requireRole(role)`: Ensures user has minimum required role
- `requireEmailVerification`: Ensures user's email is verified
- `requirePhoneVerification`: Ensures user's phone is verified

### Composite Middleware

- `requirePetitionCreationAuth`: Auth + Email verification
- `requirePetitionSigningAuth`: Auth + Phone verification
- `requireModeratorAuth`: Auth + Moderator role
- `requireAdminAuth`: Auth + Admin role
- `requireModeratorPermission(permission)`: Auth + Specific moderator permission

## Security Features

### Token Verification

- All API routes verify Firebase ID tokens
- User data is fetched from Firestore for each request
- Automatic user document creation for new users

### Role-Based Access Control

- Hierarchical role system (admin > moderator > user)
- Granular permissions for moderators
- Permission checks at both API and component levels

### Phone Verification Security

- reCAPTCHA integration for phone verification
- Moroccan phone number formatting (+212)
- Temporary authentication for verification only

## Environment Variables

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"

# reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

## Testing

### Unit Tests

- AuthService methods testing
- Middleware function testing
- Role-based access control testing

### Integration Tests

- Firebase authentication flow testing
- Phone verification process testing
- API route protection testing

### Running Tests

```bash
npm test -- --testPathPatterns="auth|middleware"
```

## Error Handling

### Common Error Scenarios

1. **Invalid or expired tokens**: Returns 401 Unauthorized
2. **Insufficient permissions**: Returns 403 Forbidden
3. **Missing verification**: Returns 403 with specific error message
4. **Phone verification failures**: Handled gracefully with user feedback

### Error Response Format

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE" // Optional
}
```

## Best Practices

1. **Always use middleware**: Never skip authentication checks on protected routes
2. **Verify requirements**: Ensure users meet verification requirements before allowing actions
3. **Handle errors gracefully**: Provide clear feedback for authentication failures
4. **Use role-based components**: Conditionally render UI based on user permissions
5. **Test thoroughly**: Verify all authentication flows and edge cases

## Migration from Auth.js

The system has been designed to replace Auth.js while maintaining compatibility with the existing BoxyHQ starter kit structure. Key changes include:

1. Firebase Auth replaces NextAuth.js
2. Custom middleware replaces Auth.js middleware
3. Firebase Firestore replaces database sessions
4. Custom role management replaces Auth.js roles

## Future Enhancements

1. **Multi-factor Authentication**: Add optional 2FA for enhanced security
2. **Social Login Expansion**: Add Facebook, Twitter, and other providers
3. **Advanced Rate Limiting**: Implement sophisticated rate limiting for phone verification
4. **Audit Logging**: Track all authentication and authorization events
5. **Session Management**: Advanced session control and device management
