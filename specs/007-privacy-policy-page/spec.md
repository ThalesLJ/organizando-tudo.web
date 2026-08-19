# Feature Specification: Privacy Policy and Brazilian Portuguese Policy Pages

**Feature Branch**: `007-privacy-policy-page`

**Created**: 2026-08-18

**Status**: Done

**Input**: User description: "Crie uma nova spec para criar uma nova página /policy no sistema. Essa página deve ser em inglês e deve constar todas as informações mais adequadas e necessárias em relação a politica do sistema. O sistema é open-source e só armazena dados enviados pelo usuário. É importante que essa página /policy seja aprovada pelo partner.microsoft e me permita subir o app na microsoft store. Quando finalizar, crie uma nova página /politica , que deve ser um clone da /policy mas em portugues do Brasil"

## User Scenarios & Verification *(mandatory)*

### User Story 1 - View English Privacy Policy for Store Compliance & User Transparency (Priority: P1)

As a Microsoft Store certification reviewer, developer, or visitor, I want to access `https://organizandotudo.thaleslj.com/policy` without needing an active login session, so that I can review a comprehensive, clear, and compliant English privacy policy that satisfies Microsoft Partner Center Policy 10.5.1 (Personal Information - Privacy Policy).

**Why this priority**: Directly unblocks Microsoft Store certification for "Organizando Tudo" (Product ID: `9N7M3398TRMD`, Publisher: Delius Tech) and provides full transparency on user data handling.

**Independent Verification**: Navigating to `/policy` in any browser (unauthenticated or authenticated) displays a functional, beautifully styled, and comprehensive English privacy policy covering data collection, open-source nature, data storage, user rights, and publisher contact info.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor or Microsoft certification bot/reviewer, **When** they navigate to `/policy`, **Then** the page loads successfully with HTTP 200 without redirecting to `/login`.
2. **Given** an authenticated user, **When** they navigate to `/policy`, **Then** the page loads without redirecting to `/dashboard`.
3. **Given** a user viewing `/policy`, **When** inspecting the contents, **Then** all mandatory sections under Microsoft Store Policy 10.5.1, LGPD, and GDPR are clearly presented (data types collected, purpose, storage, security, user rights, open-source transparency, publisher contact details).

---

### User Story 2 - View Brazilian Portuguese Privacy Policy (Priority: P1)

As a Brazilian Portuguese speaking user or visitor, I want to access `/politica` to read an accurate, natural, and comprehensive Portuguese translation of the system's privacy policy.

**Why this priority**: Organizando Tudo is targeted at Brazilian Portuguese users alongside international users; providing a dedicated `/politica` page ensures full local accessibility and regulatory compliance (LGPD).

**Independent Verification**: Navigating to `/politica` displays the complete privacy policy in Brazilian Portuguese with identical structure, guarantees, and contact details as `/policy`.

**Acceptance Scenarios**:

1. **Given** a visitor, **When** they navigate to `/politica`, **Then** the page loads successfully with the full privacy policy rendered in Brazilian Portuguese.
2. **Given** a visitor reading `/politica`, **When** reviewing the terms, **Then** the content matches the definitions, data handling rules, and user rights described in `/policy`.

---

### User Story 3 - Language Switching and Navigation (Priority: P2)

As a visitor reading the privacy policy, I want easy language switching between English (`/policy`) and Brazilian Portuguese (`/politica`), as well as a clean navigation link back to the main application / login, so that I can comfortably browse and return to the product.

**Why this priority**: Streamlines user experience for international and Brazilian users, making it easy to toggle language variants and return to the main product screens.

**Independent Verification**: The policy page header contains direct language switcher links (EN / PT-BR) that route between `/policy` and `/politica`, alongside a back/home link leading to the main application.

**Acceptance Scenarios**:

1. **Given** a user on `/policy`, **When** they click on the Portuguese (PT-BR) link or switch language, **Then** they are routed to `/politica`.
2. **Given** a user on `/politica`, **When** they click on the English (EN) link or switch language, **Then** they are routed to `/policy`.
3. **Given** a user on either policy page, **When** they click the application brand or back link, **Then** they are directed to the login or dashboard page.

---

### User Story 4 - Consistent Theming and Selectable Text (Priority: P2)

As a user or reviewer reading the legal text, I want the policy pages to follow the application's visual design system (CSS variables, clean typography, responsive layout) and allow selecting/copying text for archival or translation purposes.

**Why this priority**: Ensures legal pages look professional and integral to Organizando Tudo while ensuring accessibility and usability.

**Independent Verification**: Legal text allows selection (`user-select: text`), adheres to `var(--bg-primary)`, `var(--text-primary)`, `var(--border-color)`, and adapts smoothly to desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** a user on `/policy` or `/politica`, **When** they highlight text with the cursor, **Then** the text is selectable and copyable.
2. **Given** a user on a mobile device, **When** viewing the policy page, **Then** the content is responsive with appropriate margins, readable typography, and readable headings.

---

### Edge Cases

- Direct deep links to `/policy` and `/politica` MUST NOT trigger authentication redirects from middleware.
- Authenticated users clicking a privacy policy link in the footer or settings MUST NOT be booted out of their session.
- Text selection on `/policy` and `/politica` MUST remain enabled even if global styles restrict header/button selection.
- The policy must clearly state that "Organizando Tudo" is an open-source project hosted publicly on GitHub, and that server storage handles only user-entered information (account credentials, notes, budgets, expenses, and preferences).
- Publisher identity must clearly reflect "Delius Tech" and developer contact channels to align with Microsoft Store submission details.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a dedicated, publicly accessible route at `/policy` displaying the full privacy policy in English.
- **FR-002**: System MUST provide a dedicated, publicly accessible route at `/politica` displaying the full privacy policy in Brazilian Portuguese.
- **FR-003**: Both `/policy` and `/politica` routes MUST NOT require user authentication or session tokens.
- **FR-004**: System middleware MUST NOT redirect unauthenticated users away from `/policy` or `/politica`, nor redirect authenticated users away from these pages.
- **FR-005**: The privacy policy MUST explicitly detail that Organizando Tudo is an open-source system and only stores data explicitly submitted by the user.
- **FR-006**: The policy MUST enumerate the exact categories of collected user data:
  - Account Credentials: Name, email address, username, password (hashed).
  - User-Generated Content: Personal notes (titles, formatted content), financial entries (budgets, expenses, amounts, descriptions).
  - User Preferences: Theme colors and language choice (`locale`).
- **FR-007**: The policy MUST explicitly state that:
  - No data is sold, rented, or distributed to third parties or advertising networks.
  - No behavioral trackers, third-party analytics SDKs, or advertising cookies are utilized.
  - No access is requested or made to device hardware (cameras, microphones, contacts, files outside explicitly saved user items).
- **FR-008**: The policy MUST detail security and storage measures:
  - Secure data transmission via HTTPS/TLS.
  - Session protection using `HttpOnly`, `SameSite=Lax` cookies.
  - Industry-standard cryptographic hashing for passwords.
- **FR-009**: The policy MUST explain user data control and rights (GDPR / LGPD compliance):
  - User ability to edit and delete notes, budgets, and expenses directly within the app.
  - User right to request full account deletion and data export.
- **FR-010**: The policy MUST disclose publisher and support contact information:
  - Publisher: Delius Tech
  - Developer / Maintainer: Thales Lima (`ThalesLJ`)
  - Contact / Support email and GitHub repository link (`https://github.com/ThalesLJ/organizando-tudo.web`).
  - Effective / Last Updated date.
- **FR-011**: The policy pages MUST provide quick navigation to switch between English (`/policy`) and Portuguese (`/politica`) as well as a link back to the main app (`/login` or `/dashboard`).
- **FR-012**: The policy pages MUST adhere to the application design system (`ui-shell`, `ui-card`, theme CSS variables) and ensure content text is selectable (`user-select: text`).
- **FR-013**: System MUST hide the global floating `LanguageSwitcher` on `/policy` and `/politica` pages to prevent UI redundancy and visual overlap with the dedicated in-page cross-locale switcher.
- **FR-014**: System MUST NOT inject links to `/policy` or `/politica` into login, registration, recovery, or other existing application pages, maintaining those screens strictly as originally designed.

### Key Entities

- **PrivacyPolicyDocument**: Represents the structured legal document, containing metadata (title, effective date, publisher name, open source repo link) and an ordered list of policy sections.
- **PolicySection**: Represents a logical block of the privacy policy (e.g. Overview, Information We Collect, How We Use Information, Data Storage & Security, User Rights & Data Deletion, Open Source Transparency, Contact Information).
- **PolicyLocale**: Represents the language variant (`en` for `/policy`, `pt-BR` for `/politica`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Navigating to `https://organizandotudo.thaleslj.com/policy` returns HTTP 200 and renders the complete English Privacy Policy, satisfying Microsoft Store Policy 10.5.1.
- **SC-002**: Navigating to `https://organizandotudo.thaleslj.com/politica` returns HTTP 200 and renders the complete Brazilian Portuguese Privacy Policy.
- **SC-003**: 100% of policy content is readable, selectable, responsive across mobile and desktop screens, and aligned with current theme CSS variables.
- **SC-004**: Policy pages load in under 500ms on standard broadband/mobile networks without client-side waterfalls.

## Assumptions

- No external CMS or database is required for privacy policies; content can be maintained as structured static content components or localized message structures to guarantee immediate load performance and zero downtime.
- Microsoft Partner Center requires a publicly available URL (`https://organizandotudo.thaleslj.com/policy`) that resolves without authentication hurdles.
- Publisher name "Delius Tech" and developer reference "Thales Lima" match the registered Microsoft Store publisher account.
