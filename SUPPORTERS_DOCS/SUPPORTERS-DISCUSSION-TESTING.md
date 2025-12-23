# Supporters Discussion - Testing Guide

## Pre-Testing Setup

### 1. Start Development Server

```bash
cd 3arida-app
npm run dev
```

### 2. Prepare Test Data

- Have at least one approved petition in the database
- Have a test user account ready
- Optionally: Have some existing comments and signatures

### 3. Test Accounts Needed

- Regular user account (for commenting/signing)
- Anonymous testing (logged out)
- Optional: Admin account (for moderation testing)

## Test Cases

### Test Suite 1: Basic Functionality

#### TC1.1: View Supporters Tab

**Steps:**

1. Navigate to any petition detail page
2. Click on "Supporters" tab
3. Verify tab is highlighted in green
4. Verify content loads

**Expected Result:**

- Tab switches successfully
- Content displays without errors
- Loading spinner appears briefly if data is loading
- Default view is "All" showing mixed content

#### TC1.2: Switch Between Views

**Steps:**

1. On Supporters tab, click "All" button
2. Click "Comments" button
3. Click "All Signatures" button
4. Return to "All" button

**Expected Result:**

- Each button highlights when active (green background)
- Content changes appropriately for each view
- No errors in console
- Smooth transitions between views

#### TC1.3: Empty State Display

**Steps:**

1. Navigate to a petition with no comments or signatures
2. Click "Supporters" tab

**Expected Result:**

- Empty state message displays
- Icon shows (speech bubble)
- Message: "No activity yet"
- Subtext: "Be the first to support this petition."

### Test Suite 2: Comment Functionality

#### TC2.1: Add Comment (Logged In)

**Steps:**

1. Log in as a test user
2. Navigate to petition Supporters tab
3. Click "Add Comment" button
4. Type a test comment
5. Click "Post Comment"

**Expected Result:**

- Comment form appears
- Text area is functional
- "Post Comment" button is enabled when text is entered
- Comment appears at top of list immediately
- Form closes automatically
- No page reload

#### TC2.2: Add Anonymous Comment

**Steps:**

1. Log in as a test user
2. Click "Add Comment"
3. Type a comment
4. Check "Comment anonymously" checkbox
5. Click "Post Comment"

**Expected Result:**

- Comment posts successfully
- Author name shows as "Anonymous"
- Gray "Anonymous" badge appears
- Avatar shows "?" instead of initial

#### TC2.3: Cancel Comment

**Steps:**

1. Click "Add Comment"
2. Type some text
3. Click "Cancel" button

**Expected Result:**

- Form closes
- Text is cleared
- No comment is posted
- Returns to normal view

#### TC2.4: Comment Validation

**Steps:**

1. Click "Add Comment"
2. Leave text area empty
3. Try to click "Post Comment"

**Expected Result:**

- Button is disabled when empty
- Cannot submit empty comment
- Form validation prevents submission

#### TC2.5: Like a Comment

**Steps:**

1. View a comment in the list
2. Click the heart icon
3. Click the heart icon again

**Expected Result:**

- First click: Heart fills with red, count increments
- Second click: Heart empties, count decrements
- Changes persist after page reload
- Optimistic update (immediate visual feedback)

#### TC2.6: Like Comment (Not Logged In)

**Steps:**

1. Log out
2. Try to click heart icon on a comment

**Expected Result:**

- Alert appears: "Please sign in to like comments"
- Like count doesn't change
- User is not redirected

### Test Suite 3: Signature Display

#### TC3.1: View All Signatures

**Steps:**

1. Click "All Signatures" filter
2. Scroll through the list

**Expected Result:**

- All signatures display
- Shows name, location (if available)
- Shows signature date
- Signature comments display if present
- Clean, card-based layout

#### TC3.2: Signature Pagination

**Steps:**

1. On a petition with >20 signatures
2. Click "All Signatures"
3. Scroll to bottom
4. Click "Load More" button

**Expected Result:**

- Button shows "Loading..." with spinner
- Next 20 signatures load
- Append to existing list (no replacement)
- Button disappears when all loaded

#### TC3.3: Signature with Comment

**Steps:**

1. View "All Signatures" or "All" view
2. Find a signature with a comment

**Expected Result:**

- Signature displays with name and location
- Comment shows in italic text with quotes
- Properly formatted and readable

### Test Suite 4: Mixed View (All)

#### TC4.1: Chronological Order

**Steps:**

1. Select "All" view
2. Verify order of items

**Expected Result:**

- Items sorted by most recent first
- Comments and signatures with comments intermixed
- Timestamps show relative time (e.g., "2 hours ago")
- Consistent chronological flow

#### TC4.2: Visual Distinction

**Steps:**

1. View "All" feed
2. Identify comments vs signatures

**Expected Result:**

- Comments: Green avatar, Blue "Comment" badge
- Signatures: Purple avatar, Green "Signed" badge with checkmark
- Clear visual difference between types
- Easy to scan and understand

#### TC4.3: Signature Without Comment

**Steps:**

1. View "All" feed
2. Look for signatures without comments

**Expected Result:**

- Signatures without comments do NOT appear in "All" view
- Only signatures WITH comments show in "All" view
- This is intentional behavior

### Test Suite 5: Sorting and Filtering

#### TC5.1: Sort by Latest

**Steps:**

1. Switch to "Comments" view
2. Click "Latest" sort button
3. Verify order

**Expected Result:**

- Button highlights in green
- Comments sorted newest first
- Order updates immediately

#### TC5.2: Sort by Most Liked

**Steps:**

1. In "Comments" view
2. Click "Most Liked" sort button
3. Verify order

**Expected Result:**

- Button highlights in green
- Comments sorted by like count (highest first)
- Comments with 0 likes at bottom
- Order updates immediately

#### TC5.3: Sort Persistence

**Steps:**

1. Sort by "Most Liked"
2. Switch to "All" view
3. Switch back to "Comments" view

**Expected Result:**

- Sort preference is maintained
- Still shows "Most Liked" as active
- Order remains consistent

### Test Suite 6: Authentication States

#### TC6.1: Logged Out View

**Steps:**

1. Log out
2. Navigate to Supporters tab

**Expected Result:**

- Can view all comments and signatures
- "Add Comment" button not visible
- Login prompt shows: "Join the Discussion"
- "Sign In to Comment" button displays
- Cannot like comments

#### TC6.2: Login Redirect

**Steps:**

1. While logged out, click "Sign In to Comment"
2. Complete login
3. Verify redirect

**Expected Result:**

- Redirects to login page
- After login, returns to petition page
- Can now add comments
- "Add Comment" button visible

### Test Suite 7: Responsive Design

#### TC7.1: Mobile View (< 768px)

**Steps:**

1. Resize browser to mobile width
2. Navigate through all views

**Expected Result:**

- Layout stacks vertically
- Filter buttons remain accessible
- Text is readable
- Touch targets are adequate (min 44px)
- No horizontal scrolling

#### TC7.2: Tablet View (768px - 1024px)

**Steps:**

1. Resize to tablet width
2. Test all interactions

**Expected Result:**

- Layout adapts appropriately
- Comfortable spacing
- All features accessible
- Good use of available space

#### TC7.3: Desktop View (> 1024px)

**Steps:**

1. View on desktop resolution
2. Test all features

**Expected Result:**

- Full-width layout
- Optimal spacing
- All features easily accessible
- Professional appearance

### Test Suite 8: Performance

#### TC8.1: Initial Load Time

**Steps:**

1. Clear browser cache
2. Navigate to petition with many comments/signatures
3. Click Supporters tab
4. Measure load time

**Expected Result:**

- Initial load < 2 seconds
- Loading spinner shows during load
- No layout shift
- Smooth rendering

#### TC8.2: Pagination Performance

**Steps:**

1. Load 100+ signatures
2. Click "Load More" multiple times
3. Monitor performance

**Expected Result:**

- Each load takes < 1 second
- No lag or freezing
- Smooth scrolling
- Memory usage stable

#### TC8.3: Like Performance

**Steps:**

1. Like/unlike multiple comments rapidly
2. Monitor responsiveness

**Expected Result:**

- Immediate visual feedback
- No lag or delay
- Updates persist correctly
- No duplicate requests

### Test Suite 9: Error Handling

#### TC9.1: Network Error During Comment Post

**Steps:**

1. Open DevTools Network tab
2. Set to "Offline"
3. Try to post a comment

**Expected Result:**

- Error message displays
- Comment doesn't appear in list
- Form remains open with text
- User can retry after reconnecting

#### TC9.2: Network Error During Like

**Steps:**

1. Go offline
2. Try to like a comment

**Expected Result:**

- Error message or alert
- Like doesn't persist
- Visual state reverts
- No broken state

#### TC9.3: Invalid Data Handling

**Steps:**

1. Post comment with special characters
2. Post very long comment (>1000 chars)
3. Post comment with emojis

**Expected Result:**

- Special characters handled correctly
- Long comments display properly (with scrolling if needed)
- Emojis render correctly
- No XSS vulnerabilities

### Test Suite 10: Edge Cases

#### TC10.1: No Comments, Only Signatures

**Steps:**

1. View petition with signatures but no comments
2. Check "All" view
3. Check "Comments" view

**Expected Result:**

- "All" view shows signatures with comments only
- "Comments" view shows empty state
- "All Signatures" view shows all signatures

#### TC10.2: No Signatures, Only Comments

**Steps:**

1. View petition with comments but no signatures
2. Check all views

**Expected Result:**

- "All" view shows comments
- "Comments" view shows comments
- "All Signatures" view shows empty state

#### TC10.3: Exactly 20 Signatures

**Steps:**

1. View petition with exactly 20 signatures
2. Check if "Load More" appears

**Expected Result:**

- All 20 signatures display
- "Load More" button may appear (checks for more)
- Clicking it shows no more results
- Button disappears

#### TC10.4: Very Long Comment

**Steps:**

1. Post a comment with 500+ words
2. View in list

**Expected Result:**

- Comment displays fully
- Proper line wrapping
- Readable formatting
- No layout breaking

#### TC10.5: Special Characters in Names

**Steps:**

1. View signatures with names containing:
   - Accented characters (é, ñ, ü)
   - Arabic/RTL text
   - Emojis

**Expected Result:**

- All characters display correctly
- No encoding issues
- Proper text direction
- Avatar initials work correctly

## Browser Compatibility Testing

Test on the following browsers:

### Desktop

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Android Firefox

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals/forms
- [ ] Focus visible on all elements

### Screen Reader

- [ ] Test with NVDA (Windows)
- [ ] Test with VoiceOver (Mac/iOS)
- [ ] All content is announced
- [ ] Proper heading structure
- [ ] Form labels are clear

### Color Contrast

- [ ] All text meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Color is not the only indicator

## Automated Testing (Optional)

### Unit Tests

```bash
npm test -- PetitionSupporters
```

### E2E Tests

```bash
npm run test:e2e
```

## Bug Reporting Template

When you find a bug, report it with:

```
**Bug Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Environment:**
- Browser:
- OS:
- Screen size:
- User state: Logged in / Logged out

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Copy any errors from browser console]
```

## Sign-Off Checklist

Before marking testing complete:

- [ ] All test suites passed
- [ ] No critical bugs found
- [ ] Performance is acceptable
- [ ] Responsive design works on all sizes
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility verified
- [ ] Error handling works correctly
- [ ] Edge cases handled properly
- [ ] Documentation is accurate
- [ ] Ready for production deployment

## Notes for Testers

1. **Test with real data**: Use actual petition data when possible
2. **Test edge cases**: Don't just test the happy path
3. **Document everything**: Take screenshots of bugs
4. **Test incrementally**: Don't try to test everything at once
5. **Clear cache**: Between tests to ensure fresh state
6. **Use DevTools**: Monitor console for errors
7. **Test on real devices**: Not just browser emulation
8. **Report positives too**: Note what works well

## Quick Smoke Test (5 minutes)

For rapid verification after deployment:

1. [ ] Navigate to any petition
2. [ ] Click Supporters tab
3. [ ] Switch between all three views
4. [ ] Post a comment (if logged in)
5. [ ] Like a comment
6. [ ] Load more signatures
7. [ ] Check mobile view
8. [ ] Verify no console errors

If all pass, basic functionality is working.
