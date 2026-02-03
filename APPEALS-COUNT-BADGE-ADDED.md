# Appeals Count Badge - User Dashboard

## Feature Added

Added a red circular badge showing the appeals count on the "Appeals" tab in the user dashboard, matching the design pattern used in the admin dashboard.

## Changes Made

### File Modified: `src/app/dashboard/page.tsx`

1. **Added State for Appeals Count**

   ```typescript
   const [appealsCount, setAppealsCount] = useState<number>(0);
   ```

2. **Added Function to Load Appeals Count**

   ```typescript
   const loadAppealsCount = async () => {
     if (!user) return;
     try {
       const { getAppealsForUser } = await import('@/lib/appeals-service');
       const appeals = await getAppealsForUser(user.uid, 'user');
       setAppealsCount(appeals.length);
     } catch (err) {
       console.error('Error loading appeals count:', err);
     }
   };
   ```

3. **Updated useEffect to Load Count**
   - Now calls `loadAppealsCount()` when user is available
   - Runs alongside `loadUserPetitions()`

4. **Added Badge to Appeals Tab**
   ```tsx
   {
     canAccessAppeals(userHighestTier) && appealsCount > 0 && (
       <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
         {appealsCount}
       </span>
     );
   }
   ```

## Visual Design

- **Badge Style**: Red circular badge (bg-red-600)
- **Size**: 20px × 20px (w-5 h-5)
- **Text**: White, bold, extra small
- **Position**: Next to the "Appeals" tab text
- **Visibility**: Only shows when:
  - User has access to appeals feature
  - Appeals count is greater than 0

## User Experience

- Badge appears immediately when dashboard loads
- Shows total number of appeals (all statuses)
- Updates when new appeals are created
- Matches the visual pattern from admin dashboard
- Provides quick visual feedback about pending appeals

## Testing

1. Create an appeal → Badge shows "1"
2. Create multiple appeals → Badge shows correct count
3. No appeals → Badge doesn't show
4. Free tier users → Badge doesn't show (locked feature)

## Notes

- Count includes all appeal statuses (pending, in-progress, resolved, rejected)
- Badge only visible to users with access to appeals feature
- Silently handles errors to avoid breaking dashboard
