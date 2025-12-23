# Notification Alert Visual Examples

## 🎨 How the Alerts Look

### 1. Petition Approved (Green Theme)

```
┌────────────────────────────────────────────────────────────────┐
│  ✅   🎉 Petition Approved!                              ✕     │
│       Your petition has been approved by our moderation         │
│       team and is now live on the platform.                     │
│                                                                 │
│       11/13/2025, 2:30:45 PM                                   │
└────────────────────────────────────────────────────────────────┘
```

**Colors:** Light green background, green border, dark green text

---

### 2. Petition Rejected (Red Theme)

```
┌────────────────────────────────────────────────────────────────┐
│  ❌   ❌ Petition Rejected                                ✕     │
│       Your petition has been rejected by our moderation         │
│       team.                                                     │
│                                                                 │
│       ┌──────────────────────────────────────────────────┐    │
│       │ Admin's Reason:                                   │    │
│       │ "Contains misleading information and lacks        │    │
│       │  credible sources."                               │    │
│       └──────────────────────────────────────────────────┘    │
│                                                                 │
│       11/13/2025, 2:30:45 PM                                   │
└────────────────────────────────────────────────────────────────┘
```

**Colors:** Light red background, red border, dark red text

---

### 3. Petition Paused (Orange Theme)

```
┌────────────────────────────────────────────────────────────────┐
│  ⏸️   ⏸️ Petition Paused                                  ✕     │
│       Your petition has been temporarily paused by our          │
│       moderation team.                                          │
│                                                                 │
│       ┌──────────────────────────────────────────────────┐    │
│       │ Admin's Reason:                                   │    │
│       │ "Petition contains inappropriate language that    │    │
│       │  needs to be revised."                            │    │
│       └──────────────────────────────────────────────────┘    │
│                                                                 │
│       11/13/2025, 2:30:45 PM                                   │
└────────────────────────────────────────────────────────────────┘
```

**Colors:** Light orange background, orange border, dark orange text

---

### 4. Petition Deleted (Gray Theme)

```
┌────────────────────────────────────────────────────────────────┐
│  🗑️   🗑️ Petition Deleted                                ✕     │
│       Your petition has been removed from the platform.         │
│                                                                 │
│       ┌──────────────────────────────────────────────────┐    │
│       │ Admin's Reason:                                   │    │
│       │ "Violates community guidelines - contains hate    │    │
│       │  speech."                                         │    │
│       └──────────────────────────────────────────────────┘    │
│                                                                 │
│       11/13/2025, 2:30:45 PM                                   │
└────────────────────────────────────────────────────────────────┘
```

**Colors:** Light gray background, gray border, dark gray text

---

### 5. Deletion Request Approved (Red Theme)

```
┌────────────────────────────────────────────────────────────────┐
│  ✅   ✅ Deletion Request Approved                        ✕     │
│       Your deletion request has been approved. The petition     │
│       has been removed.                                         │
│                                                                 │
│       11/13/2025, 2:30:45 PM                                   │
└────────────────────────────────────────────────────────────────┘
```

**Colors:** Light red background, red border, dark red text

---

### 6. Deletion Request Denied (Yellow Theme)

```
┌────────────────────────────────────────────────────────────────┐
│  ❌   ❌ Deletion Request Denied                          ✕     │
│       Your deletion request has been denied by our              │
│       moderation team.                                          │
│                                                                 │
│       ┌──────────────────────────────────────────────────┐    │
│       │ Admin's Reason:                                   │    │
│       │ "Petition has significant community support and   │    │
│       │  addresses an important issue."                   │    │
│       └──────────────────────────────────────────────────┘    │
│                                                                 │
│       11/13/2025, 2:30:45 PM                                   │
└────────────────────────────────────────────────────────────────┘
```

**Colors:** Light yellow background, yellow border, dark yellow text

---

## 📱 Mobile View

On mobile devices, the alert adapts to smaller screens:

```
┌──────────────────────────────┐
│  ⏸️  ⏸️ Petition Paused  ✕   │
│                              │
│  Your petition has been      │
│  temporarily paused by our   │
│  moderation team.            │
│                              │
│  ┌────────────────────────┐ │
│  │ Admin's Reason:        │ │
│  │ "Contains inappropriate│ │
│  │  language."            │ │
│  └────────────────────────┘ │
│                              │
│  11/13/2025, 2:30 PM        │
└──────────────────────────────┘
```

---

## 🎯 Key Visual Elements

### Icon (Left Side)

- **Size:** 24x24px (w-6 h-6)
- **Background:** Circular, colored based on type
- **Padding:** 8px (p-2)
- **Examples:**
  - ✅ CheckCircle (green) - Approved
  - ❌ XCircle (red) - Rejected
  - ⏸️ Pause (orange) - Paused
  - 🗑️ Trash2 (gray) - Deleted

### Title

- **Font:** Bold, 18px (text-lg font-semibold)
- **Color:** Dark shade of theme color
- **Includes emoji** for quick recognition

### Message

- **Font:** Regular, 14px (text-sm)
- **Color:** Medium shade of theme color
- **Clear, concise explanation**

### Reason Box (If Provided)

- **Background:** White with 60% opacity
- **Border:** Subtle border matching theme
- **Padding:** 12px (p-3)
- **Label:** "Admin's Reason:" in small bold text
- **Content:** Italic text with admin's explanation

### Close Button (Top Right)

- **Icon:** X (20x20px)
- **Color:** Gray, hover to darker gray
- **Position:** Absolute top-right
- **Clickable area:** Generous for easy closing

### Timestamp

- **Font:** Small, 12px (text-xs)
- **Color:** Gray
- **Format:** Locale-specific date/time

---

## 🎨 Color Palette

### Green (Approved)

- Background: `bg-green-50`
- Border: `border-green-200`
- Icon BG: `bg-green-100`
- Icon: `text-green-600`
- Title: `text-green-800`
- Text: `text-green-900`

### Red (Rejected/Deleted)

- Background: `bg-red-50`
- Border: `border-red-200`
- Icon BG: `bg-red-100`
- Icon: `text-red-600`
- Title: `text-red-800`
- Text: `text-red-900`

### Orange (Paused)

- Background: `bg-orange-50`
- Border: `border-orange-200`
- Icon BG: `bg-orange-100`
- Icon: `text-orange-600`
- Title: `text-orange-800`
- Text: `text-orange-900`

### Yellow (Deletion Denied)

- Background: `bg-yellow-50`
- Border: `border-yellow-200`
- Icon BG: `bg-yellow-100`
- Icon: `text-yellow-600`
- Title: `text-yellow-800`
- Text: `text-yellow-900`

### Gray (Deleted)

- Background: `bg-gray-50`
- Border: `border-gray-300`
- Icon BG: `bg-gray-100`
- Icon: `text-gray-600`
- Title: `text-gray-800`
- Text: `text-gray-900`

---

## ✨ Animation

The alert appears with a smooth slide-in animation:

```css
animate-in slide-in-from-top duration-300
```

- **Direction:** Slides in from top
- **Duration:** 300ms
- **Easing:** Smooth ease-in-out
- **Effect:** Professional, polished appearance

---

## 📐 Spacing & Layout

```
Outer Container:
- Padding: 16px (p-4)
- Margin Bottom: 24px (mb-6)
- Border Radius: 8px (rounded-lg)
- Border Width: 2px (border-2)
- Shadow: Medium (shadow-md)

Inner Layout:
- Display: Flex
- Gap: 16px (gap-4)
- Align: Start

Icon Container:
- Flex: Shrink-0
- Padding: 8px (p-2)
- Border Radius: Full (rounded-full)

Content Container:
- Flex: 1
- Min Width: 0

Reason Box:
- Margin Top: 12px (mt-3)
- Padding: 12px (p-3)
- Border Radius: 6px (rounded-md)
```

---

## 🎯 Accessibility

### ARIA Attributes:

- `role="alert"` - Announces to screen readers
- `aria-label="Close notification"` - Close button label

### Keyboard Navigation:

- Tab to close button
- Enter/Space to close
- Escape key to dismiss (future enhancement)

### Color Contrast:

- All text meets WCAG AA standards
- Icons are clearly visible
- Borders provide clear boundaries

---

## 📱 Responsive Behavior

### Desktop (lg and up):

- Full width within container
- Icon and text side-by-side
- Generous padding and spacing

### Tablet (md):

- Slightly reduced padding
- Icon and text side-by-side
- Adjusted font sizes

### Mobile (sm and below):

- Compact padding
- Icon and text stacked if needed
- Smaller font sizes
- Touch-friendly close button

---

## 🎉 User Feedback

The alert provides multiple levels of feedback:

1. **Visual:** Prominent colored banner
2. **Textual:** Clear title and message
3. **Contextual:** Admin's reason (if provided)
4. **Temporal:** Timestamp for reference
5. **Interactive:** Close button for control

This multi-layered approach ensures users fully understand what happened and why.

---

**Status:** ✅ Complete  
**Ready for:** Production Use
