# Comment Delete Feature - UI Guide (Inline Confirmation)

## What Users See

### 1. Own Comment (Before Deletion)

```
┌─────────────────────────────────────────────────────────┐
│ 👤 John Doe                              2 hours ago    │
│                                                          │
│ This is my comment supporting this petition!            │
│                                                          │
│ ❤️ 5    💬 Reply    🗑️ Delete                           │
└─────────────────────────────────────────────────────────┘
```

### 2. Inline Confirmation Box (After Clicking Delete)

```
┌─────────────────────────────────────────────────────────┐
│ 👤 John Doe                              2 hours ago    │
│                                                          │
│ This is my comment supporting this petition!            │
│                                                          │
│ ❤️ 5    💬 Reply    🗑️ Delete                           │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⚠️  Are you sure you want to delete this comment?  │ │
│ │     Replies will still be visible.                 │ │
│ │                                                     │ │
│ │     [ Delete ]    [ Cancel ]                       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3. After Deletion

```
┌─────────────────────────────────────────────────────────┐
│ 👤 John Doe                              2 hours ago    │
│                                                          │
│ [Comment deleted]                                       │
│                                                          │
│ 💬 Show 3 replies                                       │
└─────────────────────────────────────────────────────────┘
```

### 4. Reply with Delete Button

```
┌─────────────────────────────────────────────────────────┐
│   ↳ 👤 John Doe                          30 min ago     │
│                                                          │
│     Thanks for your support!                            │
│                                                          │
│     ❤️ 2    🗑️ Delete                                   │
└─────────────────────────────────────────────────────────┘
```

### 5. Reply Delete Confirmation (Inline)

```
┌─────────────────────────────────────────────────────────┐
│   ↳ 👤 John Doe                          30 min ago     │
│                                                          │
│     Thanks for your support!                            │
│                                                          │
│     ❤️ 2    🗑️ Delete                                   │
│                                                          │
│     ┌───────────────────────────────────────────────┐   │
│     │ ⚠️  Delete this reply?                       │   │
│     │                                               │   │
│     │     [ Delete ]    [ Cancel ]                 │   │
│     └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6. Deleted Reply

```
┌─────────────────────────────────────────────────────────┐
│   ↳ 👤 John Doe                          30 min ago     │
│                                                          │
│     [Reply deleted]                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Inline Confirmation Design

### Visual Style

- **Background**: Light red (`bg-red-50`)
- **Border**: Red border (`border-red-200`)
- **Padding**: Comfortable spacing (`p-3` for comments, `p-2` for replies)
- **Rounded**: Smooth corners (`rounded-lg`)
- **Position**: Appears directly below the comment/reply

### Button Colors

- **Delete Button**: Red background (`bg-red-600`), white text
- **Cancel Button**: Gray background (`bg-gray-200`), dark text
- **Hover States**: Darker shades on hover

### Advantages Over Browser Alert

✅ **Better UX**: Stays in context, no jarring popup
✅ **Modern Design**: Matches app aesthetic
✅ **Mobile Friendly**: Works better on touch devices
✅ **Accessible**: Keyboard navigation supported
✅ **Customizable**: Can add icons, animations, etc.
✅ **Non-Blocking**: User can still see the comment content

## Interaction Flow

### Step-by-Step User Journey

1. **User posts comment**

   - Comment appears with Like, Reply, Delete buttons

2. **User clicks Delete**

   - Inline confirmation box slides in below the comment
   - Red background with warning message
   - Delete and Cancel buttons shown
   - Original comment still visible above

3. **User confirms deletion**

   - Loading state (brief)
   - Confirmation box disappears
   - Comment content replaced with "[Comment deleted]"
   - Like and Reply buttons disappear
   - Delete button disappears

4. **User cancels deletion**

   - Confirmation box disappears
   - Comment remains unchanged
   - All buttons still functional
   - No data sent to server

5. **Replies remain visible**

   - Reply count still shows
   - "Show replies" button still works
   - Replies display normally under deleted comment

6. **Other users see**
   - "[Comment deleted]" placeholder
   - No interaction buttons
   - Replies still visible and interactive

## Mobile View

### Compact Confirmation

```
┌──────────────────────────────┐
│ 👤 John Doe    2h ago        │
│                              │
│ This is my comment!          │
│                              │
│ ❤️ 5  💬 Reply  🗑️ Delete    │
│                              │
│ ┌──────────────────────────┐ │
│ │ Delete this comment?     │ │
│ │ Replies stay visible.    │ │
│ │                          │ │
│ │ [Delete]  [Cancel]       │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

## Color Scheme

### Confirmation Box

- **Background**: `bg-red-50` (very light red)
- **Border**: `border-red-200` (light red)
- **Text**: `text-gray-700` (dark gray for readability)
- **Delete Button**: `bg-red-600` hover `bg-red-700`
- **Cancel Button**: `bg-gray-200` hover `bg-gray-300`

### Visual Hierarchy

1. **Warning Icon**: ⚠️ (optional, can add)
2. **Message**: Regular weight, clear language
3. **Buttons**: Prominent, easy to tap
4. **Spacing**: Comfortable padding between elements

## Accessibility

### Screen Reader Support

- Confirmation box properly labeled
- Delete button announced as "Delete comment" or "Delete reply"
- Cancel button announced as "Cancel deletion"
- Focus management when box appears

### Keyboard Navigation

- **Tab**: Navigate between Delete and Cancel buttons
- **Enter/Space**: Activate focused button
- **Esc**: Cancel deletion (close confirmation box)
- **Focus trap**: Keep focus within confirmation box

### Touch Targets

- Buttons minimum 44x44px for easy tapping
- Adequate spacing between buttons
- Clear visual feedback on press

## Edge Cases

### What Happens When...

**User clicks Delete on another comment while confirmation is open?**

- Previous confirmation closes
- New confirmation opens for the clicked comment
- Only one confirmation visible at a time

**User clicks outside the confirmation box?**

- Confirmation stays open (intentional)
- User must explicitly click Cancel or Delete
- Prevents accidental dismissal

**Network error during deletion?**

- Error message shown (alert for now)
- Confirmation box remains open
- User can try again

**User refreshes page with confirmation open?**

- Confirmation disappears (state not persisted)
- Comment remains unchanged
- No deletion occurs

## Implementation Details

### State Management

```typescript
const [deletingComment, setDeletingComment] = useState<string | null>(null);
```

### Opening Confirmation

```typescript
onClick={() => setDeletingComment(comment.id)}
```

### Closing Confirmation

```typescript
onClick={() => setDeletingComment(null)}
```

### Conditional Rendering

```typescript
{
  deletingComment === comment.id && (
    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
      {/* Confirmation content */}
    </div>
  );
}
```

## Testing Checklist

- [ ] Confirmation appears on delete click
- [ ] Only one confirmation visible at a time
- [ ] Cancel button closes confirmation
- [ ] Delete button performs deletion
- [ ] Confirmation closes after deletion
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Mobile touch targets adequate
- [ ] Works for both comments and replies
- [ ] Visual design matches mockups

## Comparison: Browser Alert vs Inline Confirmation

| Feature           | Browser Alert      | Inline Confirmation |
| ----------------- | ------------------ | ------------------- |
| **UX**            | Jarring, blocks UI | Smooth, in context  |
| **Design**        | System default     | Custom, branded     |
| **Mobile**        | Poor touch UX      | Optimized for touch |
| **Accessibility** | Limited            | Full control        |
| **Customization** | None               | Complete            |
| **Context**       | Loses context      | Maintains context   |
| **Modern**        | Outdated           | Contemporary        |

## Best Practices

### For Users

- Read the confirmation message
- Understand replies will remain
- Click carefully (no undo)
- Use Cancel if unsure

### For Developers

- Keep confirmation message clear
- Use appropriate colors (red for danger)
- Ensure adequate button spacing
- Test on mobile devices
- Implement keyboard support
- Add loading states
- Handle errors gracefully

## Future Enhancements

### Potential Additions

1. **Animation**: Slide in/fade in effect
2. **Icon**: Warning icon for visual emphasis
3. **Undo**: Brief undo option after deletion
4. **Reason**: Optional reason for deletion
5. **Confirmation Sound**: Subtle audio feedback
6. **Haptic Feedback**: Vibration on mobile
