# Vercel Environment Variables Setup

## Problem

Vercel build is failing with: `FirebaseAppError: Service account object must contain a string "project_id" property`

This means Firebase Admin SDK environment variables are missing from Vercel.

## Required Environment Variables

Add these three variables to Vercel:

### 1. FIREBASE_PROJECT_ID

```
arida-c5faf
```

### 2. FIREBASE_CLIENT_EMAIL

```
firebase-adminsdk-fbsvc@arida-c5faf.iam.gserviceaccount.com
```

### 3. FIREBASE_PRIVATE_KEY

```
-----BEGIN PRIVATE KEY-----
MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCIoiVFsoDJ1Yy7
kRUp6IfjZwB9OqiTYBSGXXcSPiyNmCa+gSW2NfxfJas5xiv/C/wMqnqDNdQygBBN
vHhRc/q1+tKpSNu8uP1XI0eFRiHe4zcnL+8Q88f2KsuyJAkYQef9NnCejPO3avK+
tSG+1/2piA0YYuXVKoiOEJNSyw0iwPfT8zuedbBzIV4THCjqf4WhYP1HGPfuUmSi
AHs3LwGF0BAqNV384KjA0QucvBsuqYcGSZevX61wJrQIlNXCqMnswi8xzVVaiFMM
kamSxC/9mdZWkspHgwGRsuCUg4XId5y/FhwIAOaEi5/77e0fKOl5UWdMbDhl9kuP
2Eyp08ILAgMBAAECgf9LBh630rGv/p+2XllFBm4BLYBz823AZCk5RhAxus6zJgkp
BJ3GjlDvPT/VAj4C9WEl65CO3KMe4q57CaVN+fuaHT6ygH+sJUjBi7O1dg8r7mKK
+j40+q/nxpf4PYHJwtCJlf5Jnj8r5gTf+U7q8vVI1oqg3b6/hy0Bc8kZCb3zWva+
Uatuo20aQo1utOPtEPxMewB85zz2slW4ozMmdX0jEI24i4zcFaIEntTlwrLQcEHq
FMZqlclakNUE9Lh6lrHvKpjsDOTwhSkzOZ3dKc9+RE+g2BDhOg4esemwXqOXtkMT
2/myaPDbR97m8fkRsDZEsH3bGx1si833jtloKcECgYEAvtcR18QpprV3jjYkXPRL
XYL66PPfuQLRjlwW5tIymDBHDHpXn1iH3/i2g/2n7Q+/ohIleI4Zm72pfJCV1MG5
mJHl2/l5s6piAJFTE0pM1HTQyGWdNq0qicaXkl4j6qcrd11eN9pwQxfkNIEUDERG
x3Endqrkw47JyeuJteBKBssCgYEAt0j640ECSZOoPgHsoJPITbLKs3PU+9d+uTCU
aTrfbX4Zo4YtIZkcktbG32nAa38Hd7tJtQkhhwXXVw8BZJCGsUwqtBVUb+AgfMCP
9nxsxbGG0AYndkbCx4txqEH6p+peVv/YUyK4pEIEo6JviTlyj6Ha/88Bn0T/oORM
WU7micECgYBakrhlLzSVaorTc97OPyOFviRXa2dC55ONfSdhZWGd2UvfIDF17w6N
vfzhqAGLAW5x/SrLjKWaxOkrtXNnBoqPXq85N64LF1Jr8oz7GshcDRUKBzAWQxlt
SlOlpAhn1e9LN4T//SxKq4wjXx+kssLk5U9VgsYQCjS7II67QzffAQKBgQCQNzVq
ASn6mNuFxt/Yzc+LC4ahQyAv9TT6JHZygmdxcQpdd+MlD6PDCoo7GqvUKYTHui9Z
6lBePMNe9iijZ3EEKqljP3FMAi+t2ZqtWOQBfhlUr7L3RuBWQKtyuE+xNiF7FR6y
85wTavrZgqN+dxxkVffK1qgxGQqHH3vPvdx6QQKBgBl6+7T47E2bN6sbj98rCkLp
U0Zx8sxpqUZL7bUIONGi8d7XX51jwAifDM+pV2bd8PvVV3lYf4bXSH4wVp3hdR0B
eyAsiZSAjVYLIpeHj3cVvKb21uSF+v8bUFHvd3VKNMGDUC0eawTtQds+YtZb8XPl
L3zFvrCE0gMlW3feHlTJ
-----END PRIVATE KEY-----
```

**IMPORTANT**: When adding the private key to Vercel:

- Copy the ENTIRE key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the line breaks (the `\n` characters will be handled by the code)
- Vercel will automatically escape it properly

## Steps to Add Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (3arida-app)
3. Go to **Settings** → **Environment Variables**
4. Add each of the three variables above:
   - Click "Add New"
   - Enter variable name (e.g., `FIREBASE_PROJECT_ID`)
   - Paste the value
   - Select environment: **Production** (and optionally Preview/Development)
   - Click "Save"
5. Repeat for all three variables
6. After adding all variables, trigger a new deployment:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

## Verification

After redeployment, the build should succeed. The Firebase Admin SDK will be able to initialize properly with these credentials.

## What These Variables Do

- `FIREBASE_PROJECT_ID`: Identifies your Firebase project
- `FIREBASE_CLIENT_EMAIL`: Service account email for server-side Firebase operations
- `FIREBASE_PRIVATE_KEY`: Private key for authenticating the service account

These are used in `src/lib/firebase-admin.ts` to initialize Firebase Admin SDK for server-side operations like sending emails, managing users, etc.
