# Data Models and Firestore Setup

This document describes the data models, validation schemas, and Firestore configuration for the 3arida Petition Platform.

## Overview

The platform uses Firebase Firestore as the primary database with TypeScript interfaces for type safety and Zod schemas for runtime validation.

## Core Data Models

### User Model

Represents platform users with role-based access control.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  role: 'user' | 'moderator' | 'admin';
  creatorPageId?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}
```

**Key Features:**

- Role-based permissions (user, moderator, admin)
- Email and phone verification tracking
- Automatic creator page linking
- Soft delete with `isActive` flag

### Petition Model

Core entity representing petition campaigns.

```typescript
interface Petition {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  targetSignatures: number;
  currentSignatures: number;
  status: 'draft' | 'pending' | 'approved' | 'paused' | 'deleted';
  creatorId: string;
  creatorPageId?: string;
  mediaUrls: string[];
  qrCodeUrl?: string;
  hasQrCode: boolean;
  pricingTier: 'free' | 'basic' | 'premium';
  amountPaid: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  // ... additional fields
}
```

**Key Features:**

- Multi-status workflow (draft → pending → approved)
- Tiered pricing system
- Media attachment support
- QR code integration
- Geographic targeting
- Moderation tracking

### Signature Model

Represents individual petition signatures with verification.

```typescript
interface Signature {
  id: string;
  petitionId: string;
  signerName: string;
  signerPhone: string;
  signerLocation?: Location;
  verificationMethod: 'phone_otp';
  verifiedAt: Date;
  ipAddress: string;
  userAgent?: string;
  isAnonymous: boolean;
  comment?: string;
  createdAt: Date;
}
```

**Key Features:**

- Phone OTP verification required
- IP tracking for fraud prevention
- Optional anonymity
- Geographic data collection
- Immutable once created

### Creator Page Model

Public profile pages for petition creators.

```typescript
interface CreatorPage {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  contactEmail?: string;
  socialLinks?: SocialLinks;
  petitionCount: number;
  totalSignatures: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}
```

**Key Features:**

- Automatic statistics calculation
- Social media integration
- Verification system
- Public profile display

## Validation Schemas

All data models have corresponding Zod validation schemas for runtime type checking:

### User Validation

```typescript
const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s\u0600-\u06FF]+$/,
      'Name can only contain letters and spaces'
    ),
  email: z
    .string()
    .regex(emailRegex, 'Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  // ... additional validations
});
```

### Petition Validation

```typescript
const petitionSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  // ... additional validations
});
```

### Key Validation Features

- **Multilingual Support**: Arabic and Latin character support
- **Security**: XSS prevention and input sanitization
- **Business Rules**: Moroccan phone number validation
- **File Validation**: Type and size restrictions
- **Rate Limiting**: Built-in validation for API limits

## Firestore Security Rules

The platform implements comprehensive security rules for role-based access control:

### User Access Patterns

```javascript
// Users can read/write their own data
allow read, write: if request.auth.uid == userId;

// Moderators can read all user data
allow read: if isModerator();

// Only admins can update user roles
allow update: if isAdmin() &&
  request.resource.data.diff(resource.data).affectedKeys().hasOnly(['role', 'isActive']);
```

### Petition Access Patterns

```javascript
// Public read for approved petitions
allow read: if resource.data.status == 'approved' && resource.data.isPublic == true;

// Creators can update their own petitions (limited fields)
allow update: if resource.data.creatorId == request.auth.uid &&
  resource.data.status in ['draft', 'pending'];

// Moderators can update petition status
allow update: if isModerator() &&
  request.resource.data.diff(resource.data).affectedKeys()
    .hasOnly(['status', 'approvedAt', 'approvedBy']);
```

### Signature Security

```javascript
// Only verified phone users can create signatures
allow create: if isPhoneVerified() &&
  request.resource.data.signerPhone == request.auth.token.phone_number;

// Signatures are immutable once created
allow update, delete: if false;
```

## Database Indexes

Optimized indexes for common query patterns:

### Petition Queries

```json
{
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "isPublic", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

### Category-based Filtering

```json
{
  "fields": [
    { "fieldPath": "category", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "currentSignatures", "order": "DESCENDING" }
  ]
}
```

### Geographic Queries

```json
{
  "fields": [
    { "fieldPath": "location.country", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "currentSignatures", "order": "DESCENDING" }
  ]
}
```

## Firestore Service Layer

The platform provides a comprehensive service layer for database operations:

### Generic CRUD Operations

```typescript
class FirestoreService {
  static async create<T>(
    collectionName: string,
    data: Omit<T, 'id'>
  ): Promise<string>;
  static async getById<T>(
    collectionName: string,
    id: string
  ): Promise<T | null>;
  static async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void>;
  static async delete(collectionName: string, id: string): Promise<void>;
  static async getPaginated<T>(
    collectionName: string,
    params: PaginationParams
  ): Promise<PaginatedResponse<T>>;
}
```

### Specialized Services

```typescript
class UserService extends FirestoreService {
  static async createUser(
    userData: Omit<User, 'id' | 'createdAt'>
  ): Promise<string>;
  static async getUserByEmail(email: string): Promise<User | null>;
  static async updateUser(id: string, userData: Partial<User>): Promise<void>;
}

class PetitionService extends FirestoreService {
  static async createPetition(
    petitionData: Omit<Petition, 'id' | 'createdAt'>
  ): Promise<string>;
  static async getPetitionsByCreator(creatorId: string): Promise<Petition[]>;
  static async getPublicPetitions(
    filters?: PetitionFilters
  ): Promise<Petition[]>;
  static async incrementSignatureCount(petitionId: string): Promise<void>;
}
```

## Data Validation Utilities

### Runtime Validation

```typescript
const validateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  // Returns { success: true, data: T } or { success: false, errors: ValidationError[] }
}

const validateApiData = async <T>(schema: z.ZodSchema<T>, data: unknown): Promise<ApiResponse<T>>
```

### Content Sanitization

```typescript
const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>{}]/g, '')
    .replace(/\s+/g, ' ');
};

const sanitizeHtml = (html: string): string => {
  // Remove dangerous HTML elements and attributes
};
```

### Phone Number Utilities

```typescript
const formatPhoneNumber = (phone: string): string => {
  // Normalize to E.164 format
};

const validateMoroccanPhone = (phone: string): boolean => {
  // Validate Moroccan phone number format
};
```

## Testing

Comprehensive test suite for all validation schemas:

```typescript
describe('Validation Schemas', () => {
  describe('userSchema', () => {
    it('should validate a valid user object', () => {
      const validUser = {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        phone: '+212612345678',
        role: 'user' as const,
        isActive: true,
      };
      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });
  });
});
```

## Configuration

### Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Platform Configuration
MAX_PETITION_LENGTH=5000
MAX_MEDIA_FILES=5
MAX_FILE_SIZE=10485760
```

### Default Platform Settings

```typescript
const defaultConfig = {
  pricingTiers: {
    free: { maxSignatures: 100, price: 0 },
    basic: { maxSignatures: 1000, price: 50 },
    premium: { maxSignatures: 10000, price: 200 }
  },
  qrCodePrice: 10,
  categories: ['Environment', 'Social Justice', 'Politics', ...],
  maxPetitionLength: 5000,
  maxTitleLength: 200,
  maxMediaFiles: 5,
  supportedFileTypes: ['image/jpeg', 'image/png', 'video/mp4']
};
```

## Best Practices

### Data Modeling

1. **Denormalization**: Store computed values (signature counts, statistics) for performance
2. **Immutability**: Critical records (signatures, payments) are immutable once created
3. **Soft Deletes**: Use `isActive` flags instead of hard deletes for audit trails
4. **Timestamps**: Always include `createdAt` and `updatedAt` fields

### Security

1. **Role-based Access**: Implement granular permissions at the database level
2. **Input Validation**: Validate all data at both client and server levels
3. **Rate Limiting**: Prevent abuse with built-in rate limiting
4. **Audit Trails**: Log all administrative actions

### Performance

1. **Indexing**: Create composite indexes for common query patterns
2. **Pagination**: Use cursor-based pagination for large datasets
3. **Caching**: Cache frequently accessed data (categories, statistics)
4. **Batch Operations**: Use Firestore batch writes for related updates

## Migration and Deployment

### Database Initialization

```typescript
const initializeFirestore = async () => {
  // Create default configuration
  // Set up initial indexes
  // Configure security rules
};
```

### Data Migration

```typescript
// Scripts for migrating data between schema versions
// Backup and restore procedures
// Index management utilities
```

This data model foundation provides a robust, scalable, and secure base for the 3arida Petition Platform, with comprehensive validation, security rules, and service layers.
