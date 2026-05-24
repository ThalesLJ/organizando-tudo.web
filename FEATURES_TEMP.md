# Temporary Feature Inventory

This temporary document lists the most relevant features already present in Organizando Tudo Web. It is intended to help prepare future Specification-Driven Development work, where each feature can later be converted into a dedicated specification, plan, and task set.

## 1. Application Entry and Route Direction

The root page works as an entry router instead of rendering a public landing page. When a user accesses `/`, the application checks whether an authenticated user can be resolved from cookies through the server-side authentication helper. If a valid session exists, the user is redirected to `/dashboard`. If no valid session exists, the user is redirected to `/login`.

This keeps the first interaction aligned with the current product model: unauthenticated users start at authentication, while authenticated users land directly in the private dashboard. The behavior also prevents duplicated landing logic and centralizes the initial session decision.

Relevant routes and modules:

- `/`
- `/login`
- `/dashboard`
- `src/app/page.tsx`
- `src/lib/auth.ts`

## 2. Authentication Pages

The project includes public authentication screens for login, registration, and password recovery. These pages share the same visual shell, theme variables, localized copy, and responsive layout.

Authentication pages are public, but the middleware redirects authenticated users away from them to `/dashboard`. This prevents signed-in users from accessing login, register, or recovery screens unnecessarily.

Relevant routes and modules:

- `/login`
- `/register`
- `/recover`
- `src/components/auth-page-shell.tsx`
- `src/components/login-form.tsx`
- `src/components/register-form.tsx`
- `src/components/recover-form.tsx`
- `src/middleware.ts`

## 3. Login with Email or Username

The login flow allows the user to authenticate with either an email address or a username using a single identifier field. The client sends `identifier`, `password`, and `keepLoggedIn` to `/api/auth/login`.

The internal API route validates the body with `loginSchema`. After validation, it decides whether the identifier represents an email or username by checking if it contains `@`. It then forwards the normalized payload to the external authentication endpoint.

When the external API returns a successful response with a token, the BFF stores the token in an HttpOnly cookie. The client never receives responsibility for storing or reading the token. After successful login, the client redirects to `/dashboard` and refreshes the app router state.

The `keepLoggedIn` checkbox controls session duration. The default session lasts 8 hours. When selected, the session lasts 30 days.

Relevant routes and modules:

- `/login`
- `/api/auth/login`
- `src/components/login-form.tsx`
- `src/app/api/auth/login/route.ts`
- `src/lib/schemas.ts`
- `src/lib/auth.ts`

## 4. Account Registration

The registration flow collects a username, email, and password. The client posts this data to `/api/auth/register`.

The BFF validates the request using `registerSchema`, requiring a username between 3 and 32 characters, a valid email, and a password between 8 and 100 characters. After validation, the internal route forwards the registration payload to the external API.

When registration succeeds, the user is redirected to `/login`. The current implementation does not automatically sign in the user after registration; it keeps registration and login as separate steps.

Relevant routes and modules:

- `/register`
- `/api/auth/register`
- `src/components/register-form.tsx`
- `src/app/api/auth/register/route.ts`
- `src/lib/schemas.ts`

## 5. Password Recovery

Password recovery is implemented as a two-step flow.

First, the user enters an email address. The client posts the email to `/api/auth/send-code`. The BFF validates the email with `sendCodeSchema` and forwards the request to the external API. If the request succeeds, the screen switches to the verification step and shows a success message.

Second, the user enters a 6-digit verification code, a new password, and password confirmation. The client checks that both password fields match before calling the API. It then posts `code` and `password` to `/api/auth/verify-code`. The BFF validates the code and password through `verifyCodeSchema` and forwards the request to the external API.

The UI communicates sending, resetting, success, and error states with localized messages.

Relevant routes and modules:

- `/recover`
- `/api/auth/send-code`
- `/api/auth/verify-code`
- `src/components/recover-form.tsx`
- `src/app/api/auth/send-code/route.ts`
- `src/app/api/auth/verify-code/route.ts`
- `src/lib/schemas.ts`

## 6. Session Management with HttpOnly Cookies

Authentication state is based on an `auth_token` cookie. The cookie is created by the BFF after successful login and cleared during logout.

Cookie options are centralized in `src/lib/auth.ts`. Cookies are HttpOnly, use `sameSite: "lax"`, are scoped to `/`, and become secure when `NODE_ENV` is `production`. Because the token is HttpOnly, client-side components cannot read it directly.

To resolve the current user, the server reads the token from cookies and calls the external user endpoint with an Authorization Bearer header. The external user response is normalized into a local user shape containing `username`, `email`, and preferences.

Relevant modules:

- `src/lib/auth.ts`
- `src/lib/auth-config.ts`
- `src/lib/require-auth.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/user/route.ts`

## 7. Logout

The private navigation includes a logout button rendered as a text action. When clicked, it posts to `/api/auth/logout`.

The BFF attempts to notify the external API logout endpoint when an authentication token exists, then clears the local auth cookie regardless of the external response. This ensures the local browser session ends even if the external logout request fails.

After logout, the client redirects to `/login` and refreshes the router state.

Relevant routes and modules:

- `/api/auth/logout`
- `src/components/logout-button.tsx`
- `src/app/api/auth/logout/route.ts`
- `src/lib/auth.ts`

## 8. Public and Private Route Protection

The middleware separates public authentication routes from private application routes.

Public routes include `/login`, `/register`, and `/recover`. When a token already exists, access to these routes redirects to `/dashboard`.

Private routes include `/dashboard`, `/financial`, `/notes`, `/add-note`, `/edit-note`, and `/settings`. When no token exists, access to these routes redirects to `/login`.

The private layout also calls `requireAuthenticatedUser()`, which performs a server-side user check and redirects to `/login` if the session cannot be resolved. This provides an additional server-side protection layer beyond middleware token presence.

Relevant modules:

- `src/middleware.ts`
- `src/app/(private)/layout.tsx`
- `src/lib/require-auth.ts`
- `src/lib/auth.ts`

## 9. Private Application Layout and Navigation

Private pages share a common layout with a themed shell, header navigation, user badge, and logout action. The navigation links are localized and include Dashboard, Financial, Notes, and Settings.

The private layout loads the authenticated user on the server. If the user has saved color preferences, the layout injects those colors as CSS variables directly into the private shell. This allows the page to render with the user's preferred theme as early as possible.

The layout uses a max-width container, a panel wrapper, and responsive header behavior. Some pages mark themselves as floating pages so global CSS can remove the outer panel background and let cards float directly on the themed page.

Relevant routes and modules:

- `/dashboard`
- `/financial`
- `/notes`
- `/settings`
- `src/app/(private)/layout.tsx`
- `src/components/logout-button.tsx`
- `src/app/globals.css`

## 10. Financial Dashboard

The dashboard displays a financial summary based on budgets and expenses.

When the dashboard loads, it fetches budgets and expenses in parallel through internal BFF routes. It calculates total budget, total spent, and total remaining on the client using memoized derived state.

The dashboard also builds a budget overview. For each budget, it calculates how much has been spent, how much remains, and the percentage used. Expenses are enriched with their associated budget for display by category.

The page uses loading and error states. While data is being fetched, it renders the shared `AppLoading` component. If loading fails, it shows a themed error message.

Relevant routes and modules:

- `/dashboard`
- `/api/budgets`
- `/api/expenses`
- `src/components/dashboard-financial.tsx`

## 11. Budget Management

The financial management page allows users to create, update, list, and delete budgets.

Each budget includes a name, amount, icon, and color. The form supports both creation and editing. When the user edits an existing budget, the component stores the current budget ID, fills the form with existing values, and changes the submission endpoint from `POST /api/budgets` to `PUT /api/budgets/:id`.

Deleting a budget requires browser confirmation. After create, update, or delete operations, the component reloads budgets and expenses so the UI reflects the latest data.

The BFF requires an authentication token for all budget routes. It forwards requests to the external API with the token as a Bearer header and returns normalized JSON responses.

Relevant routes and modules:

- `/financial`
- `/api/budgets`
- `/api/budgets/:id`
- `src/components/financial-manager.tsx`
- `src/app/api/budgets/route.ts`
- `src/app/api/budgets/[id]/route.ts`

## 12. Expense Management

The financial management page also allows users to create, update, list, and delete expenses.

Each expense includes a budget association, name, amount, optional description, and color. The expense form depends on existing budgets because each expense must be linked to a budget. When budgets are loaded, the component initializes the expense form with the first available budget if no budget has been selected.

Like budgets, expenses support create and edit modes. Editing stores the expense ID and changes the submission endpoint from `POST /api/expenses` to `PUT /api/expenses/:id`. Deleting requires browser confirmation and then reloads financial data.

The BFF protects all expense operations with the auth cookie and forwards requests to the external API using the Bearer token.

Relevant routes and modules:

- `/financial`
- `/api/expenses`
- `/api/expenses/:id`
- `src/components/financial-manager.tsx`
- `src/app/api/expenses/route.ts`
- `src/app/api/expenses/[id]/route.ts`

## 13. Notes List

The notes page displays the user's notes with search, visibility filtering, sorting, preview rendering, visibility toggling, delete actions, and navigation to view/edit screens.

On load, the component fetches notes from `/api/notes` with `cache: "no-store"`. The BFF requires authentication and forwards the token to the external API.

The notes list supports:

- Search by title or stripped HTML content.
- Visibility filters for all, public, and private notes.
- Sorting by updated date descending, updated date ascending, title A-Z, and title Z-A.
- Public/private status indicators with lock icons.
- Delete action with confirmation.
- Visibility toggle by sending a partial `PUT /api/notes/:id` request with the new `isPublic` value.

Private note previews do not expose content. They render a private placeholder. Public note previews render HTML content and remain selectable.

Relevant routes and modules:

- `/notes`
- `/api/notes`
- `/api/notes/:id`
- `src/components/notes-manager.tsx`
- `src/app/api/notes/route.ts`
- `src/app/api/notes/[id]/route.ts`

## 14. Rich Text Note Creation and Editing

The note editor uses TipTap as a client-only rich text editor. It supports bold, italic, underline, bullet list, ordered list, paragraph mode, and text alignment controls.

The same component handles create and edit modes. In create mode, it starts with empty title and content. In edit mode, it loads the note by ID, stores the original title/content, and populates the editor.

Saving is enabled only when:

- The editor is available.
- A non-empty title exists.
- The title or normalized content changed.
- No save is currently in progress.

For new notes, the component posts to `/api/notes`. For existing notes, it sends a `PUT` request to `/api/notes/:id`. Edit mode also provides a "Save and Close" behavior that saves and redirects back to `/notes`.

The editor includes an `isPublic` checkbox so the note can be marked public or private during creation/editing.

Relevant routes and modules:

- `/add-note`
- `/add-note/:id`
- `/edit-note`
- `/edit-note/:id`
- `/api/notes`
- `/api/notes/:id`
- `src/components/note-editor.tsx`

## 15. Public Note Viewing

Public notes can be viewed through `/view-note/:id` without the private application navbar.

The viewer calls the internal `/api/notes/:id` route. The BFF first tries to fetch the note from the external public note endpoint. If that succeeds, it returns the public note. If the public endpoint does not return a successful result, the BFF falls back to the authenticated note endpoint only when an auth token is available.

This allows the same internal route to support both public sharing and authenticated private fallback while keeping external API access inside the BFF.

The public viewer renders the note title and HTML content in a themed read-only container. It also includes a floating back icon that links to `/notes`.

Relevant routes and modules:

- `/view-note/:id`
- `/api/notes/:id`
- `src/components/note-viewer.tsx`
- `src/app/view-note/[id]/page.tsx`
- `src/app/api/notes/[id]/route.ts`

## 16. User Language Preferences

The application supports English, Portuguese, and Spanish. The active locale is stored in a `locale` cookie and normalized to English when an unsupported value is found.

The language switcher is fixed in the top-right corner and is available across pages. When the user selects a language, the application:

1. Updates local component state.
2. Writes the locale cookie.
3. Updates the `lang` attribute on the HTML document.
4. Dispatches a locale change event so components using locale messages can update.
5. Attempts to persist the preference through `/api/user/settings/language`.
6. Refreshes the router state.

For unauthenticated users, the backend persistence attempt can fail silently while the cookie still updates the local UI.

Relevant modules:

- `src/components/language-switcher.tsx`
- `src/lib/locale-client.ts`
- `src/lib/messages.ts`
- `src/app/api/user/settings/language/route.ts`

## 17. Centralized Translation Catalog

The translation catalog is implemented in `src/lib/messages.ts`. It defines a shared message shape for `en`, `pt`, and `es` and exposes helpers to normalize the locale and retrieve messages.

Feature components consume localized text through `useLocaleMessages()` or by resolving messages server-side with `getMessages()`. This keeps most visible text centralized and allows navigation, authentication, financial, notes, settings, editor, and viewer copy to change with the selected language.

Relevant modules:

- `src/lib/messages.ts`
- `src/lib/locale-client.ts`
- `src/app/layout.tsx`
- `src/app/(private)/layout.tsx`

## 18. User Color Preferences and Theme Customization

The settings page allows the user to customize interface colors. The configurable color fields include backgrounds, text colors, border color, input background, header background/text, primary and secondary button colors, and language switcher colors.

On settings load, the component fetches `/api/user`, reads the user's preferences, applies default values for missing fields, updates local form state, and applies the colors to CSS variables.

When colors are saved, the client sends a `PATCH` request to `/api/user/settings/colors`. If successful, the new colors are applied immediately and the router refreshes so server-rendered areas can receive the updated theme.

The settings screen also includes:

- A default color reset flow.
- A dark mode preset flow.
- Success and error messages.
- A responsive grid for color inputs.

Relevant routes and modules:

- `/settings`
- `/api/user`
- `/api/user/settings/colors`
- `src/components/settings-panel.tsx`
- `src/components/user-preferences-runtime.tsx`
- `src/app/globals.css`

## 19. Runtime Preference Loading

The root layout includes `UserPreferencesRuntime`, a client-side component responsible for loading user preferences when the application starts.

It fetches `/api/user` with no-store semantics. If the user is available, it normalizes the preferred language, applies saved colors, and writes the locale. If the user is unavailable or the request fails, it applies default colors.

This runtime layer ensures that user preferences are applied globally even when navigating across public and private pages.

Relevant modules:

- `src/app/layout.tsx`
- `src/components/user-preferences-runtime.tsx`
- `src/lib/locale-client.ts`

## 20. Shared UI System

The application uses a shared visual system built on Tailwind CSS and CSS variables. Global variables define the default peach/brown theme and are reused by panels, cards, inputs, buttons, feedback messages, headers, and the language switcher.

The shared classes include:

- `ui-shell`
- `ui-panel`
- `ui-card`
- `ui-input`
- `ui-button-primary`
- `ui-button-secondary`
- `ui-muted`
- `ui-error`
- `ui-success`

The global stylesheet also customizes browser autofill behavior so transparent and themed inputs keep the intended visual appearance after autofill.

Some pages use marker classes such as `notes-floating-page`, `private-floating-page`, `settings-page`, and `app-loading-overlay` to change the private layout panel behavior without duplicating layout code.

Relevant modules:

- `src/app/globals.css`
- `src/app/(private)/layout.tsx`
- Shared component files under `src/components/`

## 21. Shared Loading Experience

The application uses a shared `AppLoading` component for full-page async loading states.

In private pages, the loading overlay is designed to sit inside the private content panel rather than covering the persistent header. Public standalone views can wrap the loading state in a full-page container when no private navigation is present.

This keeps loading feedback consistent across dashboard, financial, notes, settings, and public note viewing flows.

Relevant modules:

- `src/components/app-loading.tsx`
- `src/app/globals.css`
- `src/components/dashboard-financial.tsx`
- `src/components/financial-manager.tsx`
- `src/components/notes-manager.tsx`
- `src/components/note-viewer.tsx`
- `src/components/settings-panel.tsx`

## 22. Backend for Frontend API Layer

The internal API layer is a core feature of the project. It acts as the only communication path between the browser and the external API.

The BFF layer handles:

- Parsing JSON request bodies.
- Validating request payloads.
- Reading the auth cookie.
- Returning unauthorized responses when a protected route has no token.
- Forwarding authenticated requests with `Authorization: Bearer <token>`.
- Normalizing success and error JSON responses.
- Keeping external API URLs on the server side.

The BFF routes cover authentication, user profile, user settings, notes, budgets, expenses, and health checks.

Relevant modules:

- `src/app/api/**/route.ts`
- `src/lib/http.ts`
- `src/lib/external-api.ts`
- `src/lib/auth.ts`
- `src/lib/schemas.ts`

## 23. External API URL Resolution

The external API URL is configured through `EXTERNAL_USER_API_URL`.

The helper accepts either:

- A full user endpoint URL.
- A base external API URL.

When a base URL is provided, the helper resolves it to `/api/users/me`. Other external routes are built from the same origin using `getExternalAuthRoute()`.

If `EXTERNAL_USER_API_URL` is missing, the helper throws an error. This keeps required server-side configuration explicit.

Relevant modules:

- `.env.example`
- `src/lib/external-api.ts`
- `src/app/api/user/route.ts`
- Internal BFF API routes

## 24. Health Check Endpoint

The project includes a public health endpoint at `/api/health`.

It returns a JSON payload with:

- `status: "ok"`
- `service: "web"`
- `timestamp` with the current server time

This endpoint is used by deployment validation to confirm that the web application is responding after deployment.

Relevant routes and modules:

- `/api/health`
- `src/app/api/health/route.ts`
- `docs/deploy-web.md`

## 25. Deployment Automation

The project includes deployment documentation and a GitHub Actions workflow for a single active web version managed by PM2 on a self-hosted runner.

The deployment flow is documented as:

1. A push to `master` triggers deployment.
2. The runner syncs the project into a `current` deployment directory.
3. The environment file is copied into the deploy directory.
4. Dependencies are installed.
5. The production build runs.
6. The previous PM2 process is replaced.
7. The new process starts on the port from `.env`.
8. A public health check validates the deployment.

This is not an application feature exposed to users, but it is an operational feature relevant to the project lifecycle.

Relevant files:

- `.github/workflows/deploy.yml`
- `docs/deploy-web.md`
- `src/app/api/health/route.ts`

## 26. Social Links on Authentication Pages

The authentication shell can display social links for LinkedIn and GitHub. These links are rendered with React Icons and appear below selected authentication forms.

This supports the public-facing profile aspect of the project while keeping the authentication form layout consistent.

Relevant module:

- `src/components/auth-page-shell.tsx`

## 27. Notes Privacy Behavior

Notes have an `isPublic` flag that controls how they appear and how they can be accessed.

Private notes:

- Are visible in the owner's notes list.
- Show a protected placeholder in list previews.
- Require authentication for direct access.
- Can be toggled to public by the owner.

Public notes:

- Show content previews in the notes list.
- Can be viewed through `/view-note/:id`.
- Are attempted through the external public note endpoint before authenticated fallback.
- Keep public content selectable in the UI.

This behavior is important because it affects both user privacy and sharing.

Relevant modules:

- `src/components/notes-manager.tsx`
- `src/components/note-viewer.tsx`
- `src/app/api/notes/[id]/route.ts`
- `src/app/globals.css`

## 28. Error Handling and User Feedback

Most interactive components follow a consistent pattern for feedback:

1. Set loading/saving state before the request.
2. Clear previous errors.
3. Call an internal API route.
4. Parse the JSON response.
5. Show a localized fallback error if the response fails.
6. Reset loading/saving state in a `finally` block when applicable.

The BFF also centralizes common JSON helpers such as `okJson`, `badRequest`, `unauthorized`, `serverError`, and `parseJsonBody`.

Relevant modules:

- `src/lib/http.ts`
- `src/components/login-form.tsx`
- `src/components/register-form.tsx`
- `src/components/recover-form.tsx`
- `src/components/financial-manager.tsx`
- `src/components/notes-manager.tsx`
- `src/components/note-editor.tsx`
- `src/components/settings-panel.tsx`

## 29. Metadata Base URL

The root layout configures Next.js metadata with a base URL.

The application reads `NEXT_PUBLIC_SITE_URL` when available and removes a trailing slash. If the variable is not available, it falls back to `http://localhost:3000`. The resulting value is passed to `metadataBase`.

This keeps generated metadata URLs predictable in local and deployed environments.

Relevant module:

- `src/app/layout.tsx`
