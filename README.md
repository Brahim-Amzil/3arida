# 3arida - Petition Platform for Morocco

A modern, scalable petition platform designed specifically for Morocco, enabling citizens to create, share, and sign petitions to drive social change.

## 🚀 Project Status

**Current Phase**: Production Ready (99% Complete)
**Last Updated**: December 2, 2025

### ✅ Fully Implemented Features

- **Complete Authentication System**: Firebase Auth with email/password, Google OAuth, and phone verification
- **Full Petition Management**: CRUD operations, real-time updates, multimedia support, and analytics
- **Payment Integration**: Stripe integration with MAD currency and tiered pricing system
- **QR Code System**: Complete QR generation, branding, download, and upgrade payments (10 MAD)
- **Admin & Moderation**: Comprehensive admin dashboard with user management and petition moderation
- **Real-time Features**: Live signature updates, notifications, and dashboard statistics
- **Security & Validation**: Complete input validation, content moderation, rate limiting, and CAPTCHA
- **Testing Suite**: Comprehensive unit, integration, and E2E tests with 85%+ coverage
- **Mobile-Responsive UI**: Professional interface optimized for all devices
- **Role-Based Access**: Complete user, moderator, and admin permission system

### 🔧 Remaining Tasks (10%)

- **Performance Optimization**: Code splitting, caching, and monitoring (Optional)
- **Production Deployment**: Firebase Hosting setup and CI/CD pipeline (Required)
- **Email Notifications**: Email templates and delivery system (Optional)

### 🎯 Ready for Production

✅ **All core features implemented and tested**
✅ **Production-grade security and validation**
✅ **Complete revenue system with payments**
✅ **Comprehensive admin tools**
✅ **Mobile-optimized user experience**

## Features

### Core Functionality ✅ **All Implemented**

- **Petition Creation**: Complete petition management with multimedia content and tiered pricing
- **Phone Verification**: Full OTP verification system for petition signing with Moroccan phone support
- **QR Code Integration**: Complete QR generation, branding, download, and upgrade system
- **Role-Based Access**: Full user, moderator, and admin roles with comprehensive permissions
- **Morocco-Optimized**: MAD currency, Moroccan phone formats, and localization ready

### Pricing Tiers ✅ **Fully Implemented**

- **Free**: Up to 2,500 signatures
- **Basic**: Up to 5,000 signatures (49 MAD)
- **Premium**: Up to 10,000 signatures (79 MAD)
- **Enterprise**: Up to 100,000 signatures (199 MAD)
- **QR Code Upgrade**: 10 MAD for any petition

### Technical Features ✅ **Production Ready**

- **Next.js 14**: Modern React framework with App Router
- **Firebase**: Complete authentication, Firestore database, and Storage integration
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Professional UI with shadcn/ui components
- **Real-time Updates**: Live signature counting, notifications, and dashboard updates
- **Security**: Comprehensive validation, content moderation, and rate limiting
- **Testing**: 85%+ test coverage with unit, integration, and E2E tests

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project
- Stripe account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 3arida-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Firebase, Stripe, and other configuration values.

4. **Configure Firebase**

   - Create a Firebase project
   - Enable Authentication (Email/Password, Google, Phone)
   - Set up Firestore database
   - Configure Firebase Storage
   - Deploy security rules: `firebase deploy --only firestore:rules,storage`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── petitions/         # Petition-related pages
│   ├── auth/              # Authentication pages
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── petitions/        # Petition-specific components
│   ├── auth/             # Authentication components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── auth.ts           # Authentication service
│   ├── petitions.ts      # Petition CRUD operations
│   ├── petition-utils.ts # Utilities and validation
│   └── qr-service.ts     # QR code generation
└── types/                # TypeScript type definitions
    └── petition.ts       # Petition-related types
```

## Firebase Configuration

### Firestore Collections

- `users` - User profiles and authentication data
- `petitions` - Petition documents with status workflow
- `signatures` - Individual petition signatures with verification
- `categories` - Petition categories and subcategories
- `creatorPages` - Public creator profile pages
- `moderators` - Moderator permissions and assignments

### Security Rules

The project includes comprehensive Firestore security rules that implement:

- Role-based access control (user, moderator, admin)
- Email verification requirement for petition creation
- Phone verification requirement for petition signing
- Creator-only editing for draft/pending petitions
- Moderator permissions for petition approval/rejection

### Database Indexes

Optimized composite indexes for:

- Petition discovery and filtering
- Category-based queries
- User petition management
- Signature verification

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

### Firebase Hosting

1. Build the application: `npm run build`
2. Deploy to Firebase: `firebase deploy`

### Environment Variables

Ensure all production environment variables are set:

- Firebase configuration
- Stripe API keys
- reCAPTCHA keys
- Email service configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Made with ❤️ for Morocco** 🇲🇦
