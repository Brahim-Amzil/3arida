# Quick Development Setup

## 1. Install Dependencies

```bash
cd 3arida-app
npm install
```

## 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Quick Test

Run the test runner to verify everything is set up:

```bash
node test-runner.js
```

## 4. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## 5. Test Key Features

1. **Home Page**: Visit http://localhost:3000
2. **Registration**: Go to /auth/register
3. **Login**: Go to /auth/login
4. **Petitions**: Go to /petitions
5. **Create Petition**: Go to /petitions/create (requires login)
6. **Admin Dashboard**: Go to /admin (requires admin role)

## 6. Firebase Emulators (Optional)

For local testing without connecting to production Firebase:

```bash
npm install -g firebase-tools
firebase login
firebase emulators:start --only auth,firestore,storage
```

Then update your `.env.local` to use emulator endpoints.
