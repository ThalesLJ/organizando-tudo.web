# Custom Colors Specification

This document defines how users can customize UI colors.

---

## 1) User Model

Add a "colors" object inside user document:

```json
"colors": {
  "backgroundPrimary": "#ffe3d5",
  "backgroundSecondary": "#00000000",
  "textPrimary": "#946a56",
  "textSecondary": "#946a56",
  "borderColor": "#946a56",
  "inputBackground": "#00000000",
  "headerBackground": "#946a56",
  "headerText": "#ffffff",
  "primaryButtonBackground": "#946a56",
  "primaryButtonText": "#ffffff",
  "secondaryButtonBackground": "#00000000",
  "secondaryButtonText": "#946a56"
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
  - border and outline color
  - input background color
  - header background color
  - header text color
  - primary button background color
  - primary button text color
  - secondary button background color
  - secondary button text color

---

## 3) Applying Colors

- Colors must be applied globally
- Prefer using CSS variables

Example:

```css
:root {
  --bg-primary: #ffe3d5;
  --bg-secondary: #00000000;
  --text-primary: #946a56;
  --text-secondary: #946a56;
  --border-color: #946a56;
  --input-background: #00000000;
  --header-background: #946a56;
  --header-text: #fff;
  --primary-button-background: #946a56;
  --primary-button-text: #fff;
  --secondary-button-background: #00000000;
  --secondary-button-text: #946a56;
}
```

---

## 4) Runtime Behavior

- On app load:
  - Fetch user settings
  - Apply colors dynamically
- Runtime loader: `UserPreferencesRuntime` (frontend)
- Variables are applied to `:root` and consumed by layouts/components
- Default frontend controls follow the legacy peach and brown visual system
- Four color fields are not enough for full customization because header, borders, inputs and button text/background require independent labels

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