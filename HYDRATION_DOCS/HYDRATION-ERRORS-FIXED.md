# Hydration Errors Fixed

## Summary

Fixed all React hydration errors that were causing the app to crash during development. Hydration errors occur when the server-rendered HTML doesn't match what React expects on the client.

## Issues Fixed

### 1. PWA Components - localStorage Access

**Files:**

- `src/components/pwa/InstallPWAPrompt.tsx`
- `src/components/pwa/PushNotificationPrompt.tsx`

**Problem:** Components were accessing `localStorage` directly without checking if code was running on the client, causing server/client mismatch.

**Solution:**

- Added `mounted` state to track when component is mounted on client
- Wrapped all `localStorage` access with `typeof window !== 'undefined'` checks
- Prevented rendering until component is mounted: `if (!mounted || !showPrompt) return null`

### 2. Header Component - Auth State Rendering

**File:** `src/components/layout/Header.tsx`

**Problem:** Header was rendering different content based on auth state during SSR vs client, causing "Expected server HTML to contain a matching <header>" error.

**Solution:**

- Added `mounted` state to track client-side mounting
- Modified auth button rendering to show loading spinner until mounted: `!mounted || loading`
- Ensures consistent initial render between server and client

### 3. useSearchParams Hook - URL Parameter Access

**Files:**

- `src/app/petitions/page.tsx`
- `src/app/petitions/success/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`
- `src/app/auth/verify-email/page.tsx`

**Problem:** Accessing `useSearchParams()` during render causes hydration mismatches because URL params aren't available during SSR.

**Solution:**

- Initialize state with default values (not from searchParams)
- Use `useEffect` to read searchParams after mount
- Added `mounted` state to prevent actions until client-side hydration is complete

## Technical Details

### Why Hydration Errors Occur

1. **Server-Side Rendering (SSR):** Next.js renders HTML on the server with initial state
2. **Client Hydration:** React takes over on the client and expects to find matching HTML
3. **Mismatch:** If client-side code produces different HTML, React throws hydration errors

### Common Causes

- Accessing browser-only APIs (localStorage, window, document) during render
- Using dynamic data that differs between server and client (Date.now(), Math.random())
- Reading URL parameters with useSearchParams during render
- Conditional rendering based on client-only state

### The Fix Pattern

```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  // Read client-only data here
}, []);

if (!mounted) {
  return <LoadingState />; // or null
}

// Render with client data
```

## Testing

After these fixes:

- ✅ No hydration errors in console
- ✅ App loads without switching to client-only rendering
- ✅ PWA prompts work correctly
- ✅ Header auth state displays properly
- ✅ URL parameters are read correctly on all pages

## Impact

- Improved performance (proper SSR/hydration)
- Better SEO (server-rendered content)
- Cleaner console (no error spam)
- More stable app behavior
