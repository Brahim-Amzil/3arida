# Color Theme Guidelines for 3arida

A clean, modern, trustworthy color theme for your platform. This theme improves hierarchy, contrast, and usability while keeping the UI visually appealing and accessible.

---

## 🎨 Primary Palette

### **Primary Color**
- **Emerald Green**: `#10B981`
  - Used for: buttons (primary), active labels, progress bars, highlights.
  - Conveys trust, action, and positivity.

### **Primary Dark**
- `#059669`
  - Hover states for primary buttons.

### **Primary Light**
- `#D1FAE5`
  - Light backgrounds, badges, subtle accents.

---

## 🖤 Neutral Palette (for Structure)

### **Rich Black**
- `#111827`
  - For titles & strong headings.

### **Neutral Gray 1**
- `#6B7280`
  - For body text & card descriptions.

### **Neutral Gray 2**
- `#9CA3AF`
  - For metadata such as views, shares, small labels.

### **Neutral Gray 3 (Light)**
- `#F3F4F6`
  - Card backgrounds, sections, soft separators.

### **White**
- `#FFFFFF`
  - Surfaces, containers.

---

## 🔵 Secondary Accent Colors

### **Blue Accent (Optional)**
- `#3B82F6`
  - For links, subtle UI accents, or notifications.

### **Yellow Accent (Optional)**
- `#F59E0B`
  - For stats (views / shares icons), warnings.

---

## 🏷 Status Colors

### **Active**
- Green badge background: `#10B981`
- Green badge text: `#FFFFFF`

### **Inactive / Closed**
- Gray badge: `#9CA3AF`
- Text: `#FFFFFF`

### **Danger / Delete**
- Red badge: `#EF4444`
- Red hover: `#DC2626`

---

## 📊 Progress Bar Colors

- Background: `#E5E7EB`
- Fill: `#10B981`
- Text: `#111827`

Use subtle rounding (`rounded-full`) for modern aesthetics.

---

## 🧩 Card Colors

### **Card Background**
- White: `#FFFFFF`

### **Card Border**
- `#E5E7EB`

### **Hover Shadow**
- `shadow-lg` with soft opacity: `shadow-black/5`

### **Category Label Colors**
- Culture → `#3B82F6`
- Environment → `#10B981`
- Education → `#F59E0B`
- Default → `#6B7280`

Text for category labels remains white.

---

## 🔘 Button Colors

### **Primary Button**
- Background: `#10B981`
- Hover: `#059669`
- Text: `#FFFFFF`

### **Secondary Button**
- Background: `#F3F4F6`
- Hover: `#E5E7EB`
- Text: `#111827`

### **Ghost Button**
- Background: transparent
- Text: `#6B7280`
- Hover: `#F3F4F6`

---

## 🔍 Input Fields

- Border: `#D1D5DB`
- Focus Border: `#10B981`
- Background: `#FFFFFF`
- Placeholder: `#9CA3AF`

---

## 🌤 Background Areas

- Main background: `#F9FAFB`
- Section separators: `#F3F4F6`

---

## 🔠 Typography Colors

- Title / Headings: `#111827`
- Body text: `#4B5563`
- Muted text: `#6B7280`
- Micro text: `#9CA3AF`

---

## 🧭 Navbar Colors

- Background: `#FFFFFF`
- Border bottom: `#E5E7EB`
- Icons: `#6B7280`
- Active link: `#10B981`
- Hover link: `#059669`

---

## 🧱 Shadows

### Soft Universal Shadow
- `shadow-sm shadow-black/5`

### Hover Shadow
- `shadow-md shadow-black/10`

---

## 📌 Tailwind Plugin Suggestions

To enhance consistency:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#D1FAE5",
        },
        neutral: {
          dark: "#111827",
          mid: "#6B7280",
          light: "#9CA3AF",
          surface: "#F3F4F6",
        },
      }
    }
  }
}
```

---

## 🎯 Final Notes
- This palette is accessible and high-contrast.
- Works perfectly with Tailwind and React.
- Creates a modern, clean, civic‑tech look.

If you'd like, I can also generate **ready‑to‑copy React components**, such as cards and buttons, using this exact theme.

