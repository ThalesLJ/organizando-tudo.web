# Research: Privacy Policy and Brazilian Portuguese Policy Pages

## Objective

Research and record decisions regarding Microsoft Store Policy 10.5.1 compliance, data disclosure requirements, routing architecture for `/policy` and `/politica`, internationalization, styling integration, and public accessibility.

## Resolved Decisions

### Microsoft Store Policy 10.5.1 Compliance

**Decision**: The `/policy` page will serve as the official English Privacy Policy for Microsoft Partner Center certification of "Organizando Tudo" (Product ID: `9N7M3398TRMD`, Publisher: Delius Tech).

**Rationale**: The previous certification report indicated:
> "10.5.1 Personal Information - Privacy Policy: The privacy policy link did not resolve to a functional webpage. Provided URL: https://organizandotudo.thaleslj.com/policy."
Creating a functional, static, responsive, and complete English policy at `/policy` directly satisfies Microsoft Store validation rules and guarantees 200 OK availability without authentication.

### Open-Source System and Data Collection Scope

**Decision**: Clearly state that Organizando Tudo is an open-source project and only processes data explicitly entered and provided by the user.

**Rationale**:
- Organizando Tudo does not use third-party analytics trackers, background telemetry, advertising identifiers, or device hardware sensors.
- Collected data strictly comprises:
  - Account data: First name, email, username, hashed password.
  - User records: Notes (title, content), financial budgets, and expenses (name, amount, category, description).
  - Preferences: Interface theme colors, preferred language.
- Full transparency is reinforced by providing the open-source repository link (`https://github.com/ThalesLJ/organizando-tudo.web`).

### Route Architecture: `/policy` and `/politica`

**Decision**: Implement `/policy` for English and `/politica` for Brazilian Portuguese as dedicated public Next.js App Router pages under `src/app/policy/page.tsx` and `src/app/politica/page.tsx`.

**Rationale**:
- `/policy` directly satisfies the exact URL submitted to Microsoft Partner Center (`https://organizandotudo.thaleslj.com/policy`).
- `/politica` provides a clean, native Brazilian Portuguese route adhering to Brazilian legal standards (LGPD) and local user expectations.
- Dedicated Next.js static/server-rendered page routes ensure immediate indexability, fast initial server response (TTFB), and zero client waterfall overhead.

### Middleware and Public Accessibility

**Decision**: Ensure middleware permits unrestricted access to `/policy` and `/politica` for both unauthenticated visitors and logged-in users.

**Rationale**:
- `src/middleware.ts` only restricts routes listed in `privateRoutes` and redirects auth pages listed in `publicRoutes`.
- `/policy` and `/politica` will remain public, neutral routes so visitors, store review bots, and authenticated users can view the legal text without redirect loops.

### Component Design & Selectable Content

**Decision**: Create a shared reusable policy component (`PrivacyPolicyViewer` / `PolicyPageShell`) that renders header branding, language switcher toggle between EN and PT-BR, back-to-home navigation, and cleanly formatted legal sections. Ensure text is selectable (`user-select: text`).

**Rationale**:
- Global CSS applies `user-select: none` to several UI elements; policy text must be explicitly selectable (`user-select: text`) so users, auditors, and reviewers can copy clauses.
- Reusing standard design tokens (`--bg-primary`, `--text-primary`, `--border-color`, `ui-card`, `ui-shell`) preserves the cohesive aesthetic of Organizando Tudo.

## Closed Ambiguities

- **Is a dynamic database or CMS needed for policy text?** No. Embedding structured static content inside the application ensures 100% uptime, fast delivery, and version-controlled policy updates.
- **Does the app collect telemetry, cookies, or location data?** No. Only essential session cookies (`HttpOnly` auth token) and UI preference cookies (`locale`) are stored.
- **How will users switch between `/policy` and `/politica`?** The policy layout will provide direct links to toggle between English (`/policy`) and Portuguese (`/politica`), in addition to the global language switcher component.
- **Are automated tests required?** No. Validation follows the project's manual verification standard in accordance with the constitution.
