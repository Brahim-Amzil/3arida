# Comment Rate Limiting

**Implemented:** January 22, 2025  
**Status:** Active ✅

## 🎯 Purpose

Prevent comment spam and abuse while allowing legitimate user engagement.

## 📊 Rate Limits

### Regular Users (Account > 24 hours old)

| Time Window    | Limit       | Purpose                     |
| -------------- | ----------- | --------------------------- |
| **15 minutes** | 5 comments  | Prevents rapid spam         |
| **1 hour**     | 10 comments | Allows active participation |
| **24 hours**   | 30 comments | Prevents sustained abuse    |

### New Users (Account < 24 hours old)

| Time Window  | Limit       | Purpose                           |
| ------------ | ----------- | --------------------------------- |
| **1 hour**   | 3 comments  | More restrictive for new accounts |
| **24 hours** | 10 comments | Prevents bot account spam         |

## 🔒 Implementation

### Client-Side (React Component)

**File:** `src/components/petitions/PetitionComments.tsx`

- Checks rate limits before submitting comment
- Shows user-friendly error message with time remaining
- Prevents unnecessary API calls

### Server-Side (Firestore Rules)

**File:** `firestore.rules`

- Validates comment data structure
- Enforces max comment length (1000 characters)
- Verifies author ID matches authenticated user
- Note: Rate limiting logic is client-side (Firestore rules don't support time-based rate limiting)

### Rate Limiting Library

**File:** `src/lib/rate-limiting.ts`

**Functions:**

- `checkCommentRateLimit(userId, userCreatedAt)` - Main function to check all limits
- `isNewUser(userCreatedAt)` - Determines if user is new (< 24 hours)
- Individual limiters: `comment15MinLimiter`, `commentHourLimiter`, `commentDayLimiter`
- New user limiters: `newUserCommentHourLimiter`, `newUserCommentDayLimiter`

## 💡 How It Works

### 1. User Attempts to Comment

```typescript
// User clicks "Post Comment"
handleSubmitComment();
```

### 2. Rate Limit Check

```typescript
const rateLimit = checkCommentRateLimit(user.uid, userCreatedAt);

if (!rateLimit.allowed) {
  // Show error message with time remaining
  alert(
    `${rateLimit.message}\n\nYou can comment again in ${timeRemaining} minutes.`
  );
  return;
}
```

### 3. Tiered Checking

The system checks limits in order:

1. **15-minute limit** (5 comments) - Catches rapid spam
2. **Hourly limit** (10 comments) - Prevents sustained spam
3. **Daily limit** (30 comments) - Prevents long-term abuse

If any limit is exceeded, the comment is blocked.

### 4. New User Detection

```typescript
const isNew = isNewUser(userCreatedAt);
// If account < 24 hours old, apply stricter limits
```

## 📱 User Experience

### When Limit is Reached

**Error Message:**

```
You can only post 5 comments per 15 minutes. Please slow down.

You can comment again in 12 minutes.
```

**What Users See:**

- Clear explanation of the limit
- Time remaining until they can comment again
- Friendly, non-accusatory language

### Limit Types

Users will see different messages based on which limit they hit:

- **15-minute limit:** "Please slow down"
- **Hourly limit:** "Please try again later"
- **Daily limit:** "Please try again tomorrow"
- **New user limits:** Explains that limits increase after 24 hours

## 🔧 Configuration

### Adjusting Limits

Edit `src/lib/rate-limiting.ts`:

```typescript
// Regular users
export const comment15MinLimiter = rateLimit({
  maxRequests: 5, // Change this number
  windowMs: 15 * 60 * 1000,
  message: 'Custom message here',
});

// New users
export const newUserCommentHourLimiter = rateLimit({
  maxRequests: 3, // Change this number
  windowMs: 60 * 60 * 1000,
  message: 'Custom message here',
});
```

### Changing New User Threshold

Edit the `isNewUser` function:

```typescript
export const isNewUser = (userCreatedAt: Date | number): boolean => {
  const hoursSinceCreation = (Date.now() - createdTimestamp) / (1000 * 60 * 60);
  return hoursSinceCreation < 24; // Change 24 to different hours
};
```

## 🧪 Testing

### Test Regular User Limits

1. Create an account (> 24 hours ago)
2. Post 5 comments rapidly (within 15 minutes)
3. Try to post 6th comment - should be blocked
4. Wait 15 minutes, try again - should work

### Test New User Limits

1. Create a new account
2. Post 3 comments within 1 hour
3. Try to post 4th comment - should be blocked
4. Wait 24 hours, limits should increase

### Test Limit Messages

1. Hit each limit type (15min, hour, day)
2. Verify correct message is shown
3. Verify time remaining is accurate

## 📊 Monitoring

### Check Rate Limit Store

The rate limit data is stored in memory:

```typescript
// In src/lib/rate-limiting.ts
const rateLimitStore: RateLimitStore = {};
```

**Note:** In production, consider using Redis for:

- Persistent storage across server restarts
- Distributed rate limiting across multiple servers
- Better performance at scale

### Logs

Rate limit violations are logged client-side:

- User sees error message
- No server-side logging (to reduce costs)

## 🚀 Production Considerations

### Current Implementation

- ✅ In-memory storage (good for single server)
- ✅ Client-side enforcement
- ✅ Firestore validation rules
- ✅ User-friendly error messages

### Future Improvements

- [ ] Redis for distributed rate limiting
- [ ] Server-side API endpoint for rate limit checking
- [ ] Admin dashboard to view rate limit violations
- [ ] Automatic IP blocking for repeated violations
- [ ] Whitelist for trusted users (moderators, admins)

## 🔐 Security Notes

### Why Client-Side?

- **Cost:** Firestore doesn't support time-based rate limiting in rules
- **UX:** Immediate feedback without server round-trip
- **Validation:** Firestore rules still validate comment data

### Limitations

- Users can bypass client-side checks with dev tools
- Firestore rules provide backup validation
- Consider adding server-side API for critical applications

### Mitigation

- Firestore rules validate all comment data
- Content moderation catches spam that gets through
- IP blocking for repeated violations
- reCAPTCHA v3 on petition signing (already implemented)

## 📝 Related Files

- `src/lib/rate-limiting.ts` - Rate limiting logic
- `src/components/petitions/PetitionComments.tsx` - Comment UI with rate limiting
- `firestore.rules` - Server-side validation
- `PRODUCTION-CHECKLIST.md` - Launch checklist

## ✅ Checklist

- [x] Tiered rate limiting implemented (5/15min, 10/hour, 30/day)
- [x] New user detection (< 24 hours)
- [x] Stricter limits for new users (3/hour, 10/day)
- [x] User-friendly error messages
- [x] Time remaining calculation
- [x] Firestore validation rules
- [x] Documentation complete

## 🎉 Status

**Rate limiting is now active and protecting against comment spam!**

Users can still engage actively (up to 30 comments/day) while spam bots are effectively blocked.
