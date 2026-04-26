# Multi-language (i18n) Specification

This document defines how the application must support multiple languages.

---

## 1) Current Implementation

The frontend uses a centralized translation catalog in code, with one dictionary per language (`en`, `pt`, `es`).

Texts are resolved from the active locale and updated in runtime when locale changes.

---

## 2) Language Messages Structure

Create one dictionary per language with the same keys.

Example:

`en`  
`pt`  
`es`

Example content:

```json
{
  "login": {
    "title": "Login",
    "button": "Sign in"
  }
}
```

All files must follow the same structure.

---

## 3) Language Detection

- Default language: English (en)
- Language can be stored in:
  - cookie
  - or user preferences (optional future improvement)
- Persisted cookie key: `locale`

---

## 4) Language Switcher

- A language selector must be available on ALL pages
- Position: top-right corner of the screen

Behavior:

- User selects a language
- System updates locale immediately
- Persist selection (cookie)
- For authenticated users, persist in backend via `PATCH /api/user/settings/language`
- Navbar labels including logout text must be translated by locale

---

## 5) Rules

- All UI text must come from translation files
- Do not hardcode strings
- Maintain consistency across languages
- Financial module canonical labels:
  - PT: `Resumo`, `Finanças`, `Orçamento`, `Gasto`
  - ES: `Resumen`, `Finanzas`, `Presupuesto`, `Gasto`

---

## 6) Fallback Behavior

- If translation key is missing:
  - fallback to default language (en)