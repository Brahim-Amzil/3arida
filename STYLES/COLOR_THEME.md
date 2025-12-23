# 3arida Color Theme Documentation

## Overview

This document outlines all colors used in the 3arida petition platform, their purposes, and where they are applied.

---

## Primary Brand Colors

### Green (Primary)

**HSL:** `142 76% 36%` | **HEX:** `#16a34a` (approx)  
**Usage:**

- Primary buttons (Sign Petition, Submit, Create)
- Active status badges
- Success messages
- Links and CTAs
- Progress bars (high progress >60%)
- Header navigation active states

**Where:**

- `bg-green-600` / `hover:bg-green-700`
- `text-green-600` / `text-green-700`
- Petition cards "Sign Petition" button
- Header navigation
- Success notifications

---

## Status Colors

### Approved/Active - Green

**Tailwind:** `bg-green-500` | **HEX:** `#22c55e`  
**Usage:**

- Approved petition badges
- Active status indicators
- Success states

### Pending - Yellow

**Tailwind:** `bg-yellow-500` | **HEX:** `#eab308`  
**Usage:**

- Pending petition badges
- Warning states
- Progress bars (medium progress 30-60%)

### Rejected - Red

**Tailwind:** `bg-red-500` | **HEX:** `#ef4444`  
**Usage:**

- Rejected petition badges
- Error messages
- Destructive actions
- Delete buttons

### Paused - Orange

**Tailwind:** `bg-orange-500` | **HEX:** `#f97316`  
**Usage:**

- Paused petition badges
- Warning notifications

### Archived - Blue

**Tailwind:** `bg-blue-500` / `bg-blue-600` | **HEX:** `#3b82f6` / `#2563eb`  
**Usage:**

- Archived petition badges
- Information messages
- Progress bars (high progress)
- Links

### Deleted - Gray

**Tailwind:** `bg-gray-500` | **HEX:** `#6b7280`  
**Usage:**

- Deleted petition badges
- Disabled states
- Progress bars (low progress <30%)

---

## Neutral Colors

### Gray Scale

**Background:**

- `bg-gray-50` - Page backgrounds (#f9fafb)
- `bg-gray-100` - Card hover states, placeholders (#f3f4f6)
- `bg-gray-200` - Progress bar backgrounds, borders (#e5e7eb)

**Text:**

- `text-gray-900` - Primary text, headings (#111827)
- `text-gray-800` - Secondary headings (#1f2937)
- `text-gray-700` - Body text (#374151)
- `text-gray-600` - Secondary text, metadata (#4b5563)
- `text-gray-500` - Tertiary text, placeholders (#6b7280)
- `text-gray-400` - Disabled text, icons (#9ca3af)

**Borders:**

- `border-gray-300` - Input borders, card borders (#d1d5db)
- `border-gray-200` - Dividers, subtle borders (#e5e7eb)

---

## White & Black

### White

**Tailwind:** `bg-white` | **HEX:** `#ffffff`  
**Usage:**

- Card backgrounds
- Modal backgrounds
- Button text on colored backgrounds
- Input backgrounds

### Black

**Tailwind:** `bg-black` / `text-black` | **HEX:** `#000000`  
**Usage:**

- Overlay backgrounds (`bg-black/50` for modals)
- High contrast text (rare)

---

## Special Colors

### Morocco Flag Colors

**Red:** `#C1272D` (`.morocco-red`)  
**Green:** `#006233` (`.morocco-green`)  
**Usage:**

- Accent elements
- Cultural references
- Special badges

### Purple (List Variant Title)

**HEX:** `#4d1694`  
**Usage:**

- Petition card titles in list variant
- Special emphasis

---

## Dark Mode Colors

### Background

- `--background: 222.2 84% 4.9%` - Dark background (#0a0f1e approx)
- `--card: 222.2 84% 4.9%` - Dark card background

### Foreground

- `--foreground: 210 40% 98%` - Light text on dark (#f8fafc approx)

### Borders & Inputs

- `--border: 217.2 32.6% 17.5%` - Dark mode borders
- `--input: 217.2 32.6% 17.5%` - Dark mode inputs

---

## Component-Specific Colors

### Buttons

#### Primary Button

```css
bg-green-600 hover:bg-green-700 text-white
```

#### Secondary Button

```css
bg-gray-200 hover:bg-gray-300 text-gray-900
dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
```

#### Outline Button

```css
border border-gray-300 hover:bg-gray-50 text-gray-700
dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300
```

#### Destructive Button

```css
bg-red-600 hover:bg-red-700 text-white
```

---

### Progress Bars

**Low Progress (<30%):**

```css
bg-gray-500
```

**Medium Progress (30-60%):**

```css
bg-yellow-600
```

**High Progress (>60%):**

```css
bg-blue-600
```

**Featured Variant:**

```css
bg-gradient-to-r from-green-500 to-green-600
```

---

### Status Badges

**Approved:**

```css
bg-green-500 text-white
```

**Pending:**

```css
bg-yellow-500 text-white
```

**Rejected:**

```css
bg-red-500 text-white
```

**Paused:**

```css
bg-orange-500 text-white
```

**Archived:**

```css
bg-blue-500 text-white
```

**Deleted:**

```css
bg-gray-500 text-white
```

---

### Cards

**Background:**

```css
bg-white shadow-md hover:shadow-lg
```

**Border:**

```css
border border-gray-200
```

**Featured Card:**

```css
border-2 border-green-200
```

---

### Forms & Inputs

**Input:**

```css
border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent
```

**Input Background:**

```css
bg-white
```

**Placeholder:**

```css
text-gray-400
```

---

### Notifications

**Success:**

```css
bg-green-50 border-green-200 text-green-800
```

**Error:**

```css
bg-red-50 border-red-200 text-red-600
```

**Warning:**

```css
bg-yellow-50 border-yellow-400 text-yellow-800
```

**Info:**

```css
bg-blue-50 border-blue-400 text-blue-800
```

---

### Cookie Consent Banner

**Background:**

```css
bg-white dark:bg-gray-800
```

**Backdrop:**

```css
bg-black/50
```

**Accept Button:**

```css
bg-primary-600 hover:bg-primary-700 text-white
```

**Necessary Only Button:**

```css
bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
```

---

## Accessibility

### Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text:** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio

### Focus States

All interactive elements have visible focus indicators:

```css
focus:ring-2 focus:ring-green-500 focus:outline-none
```

---

## Usage Guidelines

### Do's ✅

- Use green for primary actions and success states
- Use gray scale for neutral content
- Use status colors consistently across the app
- Maintain sufficient contrast for accessibility
- Use hover states for interactive elements

### Don'ts ❌

- Don't use red for non-destructive actions
- Don't mix status colors (e.g., green for errors)
- Don't use low-contrast color combinations
- Don't override brand colors without reason
- Don't use too many colors in one component

---

## Configuration Files

### Tailwind Config

**Location:** `tailwind.config.js`

- Defines color system using CSS variables
- Extends default Tailwind colors
- Configures dark mode

### Global CSS

**Location:** `src/app/globals.css`

- Defines CSS color variables
- Sets up light/dark mode colors
- Custom Morocco flag colors

---

## Future Considerations

### Potential Additions

- Secondary brand color (if needed)
- Gradient variations
- Seasonal theme colors
- Accessibility high-contrast mode

### Maintenance

- Review color contrast regularly
- Update documentation when adding new colors
- Test colors in both light and dark modes
- Ensure consistency across all components

---

**Last Updated:** December 1, 2024  
**Version:** 1.0
