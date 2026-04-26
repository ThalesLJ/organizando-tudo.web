# Custom Colors Specification

This document defines how users can customize UI colors.

---

## 1) User Model

Add a "colors" object inside user document:

```json
"colors": {
  "backgroundPrimary": "#000000",
  "backgroundSecondary": "#111111",
  "textPrimary": "#ffffff",
  "textSecondary": "#cccccc"
}
```

If colors is null:
- Use system default theme

---

## 2) Settings Page Behavior

User must be able to:

- Change:
  - primary background color
  - secondary background color
  - primary text color
  - secondary text color

---

## 3) Applying Colors

- Colors must be applied globally
- Prefer using CSS variables

Example:

```css
:root {
  --bg-primary: #000;
  --bg-secondary: #111;
  --text-primary: #fff;
  --text-secondary: #ccc;
}
```

---

## 4) Runtime Behavior

- On app load:
  - Fetch user settings
  - Apply colors dynamically
- Runtime loader: `UserPreferencesRuntime` (frontend)
- Variables are applied to `:root` and consumed by layouts/components
- Global controls like language switcher, logout button, back arrow and floating add button must also consume theme variables

---

## 5) Persistence

- Changes must be saved in database
- UI must update immediately after change
- BFF route for color updates: `PATCH /api/user/settings/colors`
- Settings page applies updates immediately without requiring new login
- Settings page must provide a "reset colors" action to restore system defaults
- Reset action must also persist default values in database

---

## 6) Fallback

If any color is missing:
- Use default system color