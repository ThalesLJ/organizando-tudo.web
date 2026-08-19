---
description: "Task list for Privacy Policy and Brazilian Portuguese Policy Pages implementation"
---

# Tasks: Privacy Policy and Brazilian Portuguese Policy Pages

**Input**: Design documents from `specs/007-privacy-policy-page/`

**Prerequisites**: [plan.md](file:///c:/Users/thale/Documentos/Thales/GitHub/organizandotudo/organizando-tudo.web/specs/007-privacy-policy-page/plan.md), [spec.md](file:///c:/Users/thale/Documentos/Thales/GitHub/organizandotudo/organizando-tudo.web/specs/007-privacy-policy-page/spec.md), [research.md](file:///c:/Users/thale/Documentos/Thales/GitHub/organizandotudo/organizando-tudo.web/specs/007-privacy-policy-page/research.md), [data-model.md](file:///c:/Users/thale/Documentos/Thales/GitHub/organizandotudo/organizando-tudo.web/specs/007-privacy-policy-page/data-model.md), [requirements.md](file:///c:/Users/thale/Documentos/Thales/GitHub/organizandotudo/organizando-tudo.web/specs/007-privacy-policy-page/requirements.md)

**Validation**: Manual verification steps for public routes, status 200 HTTP responses, language switching, selectable text, and visual responsiveness. Automated tests are not used per the project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize target file structure for privacy policy pages in `src/app/policy/`, `src/app/politica/`, `src/lib/`, and `src/components/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data structures and presentation primitives that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Implement legal policy data structures, section definitions, and bilingual content catalogs in `src/lib/policy-content.ts`
- [x] T003 [P] Create reusable `PrivacyPolicyContent` component in `src/components/privacy-policy-content.tsx` adhering to the design system with selectable text

**Checkpoint**: Foundation ready - user story implementation can now proceed

---

## Phase 3: User Story 1 - View English Privacy Policy for Store Compliance & User Transparency (Priority: P1) 🎯 MVP

**Goal**: Provide a dedicated, publicly accessible English Privacy Policy at `/policy` conforming to Microsoft Store Policy 10.5.1, LGPD, and GDPR.

**Independent Verification**: Accessing `/policy` directly returns HTTP 200 without login and displays the complete English privacy policy with open-source disclosure and user-provided data only boundaries.

### Validation for User Story 1

- [x] T004 [P] [US1] Define manual verification steps for unauthenticated and authenticated access to `/policy`

### Implementation for User Story 1

- [x] T005 [US1] Implement English privacy policy page route in `src/app/policy/page.tsx` rendering `PrivacyPolicyContent` with English locale data
- [x] T006 [US1] Verify open-source GitHub repository disclosure and user-provided data only boundaries in `/policy`
- [x] T007 [US1] Verify Delius Tech publisher identity, contact details, security definitions, and user data rights in `/policy`

**Checkpoint**: At this point, User Story 1 is fully functional and delivers the core MVP for Microsoft Store certification.

---

## Phase 4: User Story 2 - View Brazilian Portuguese Privacy Policy (Priority: P1)

**Goal**: Provide a dedicated, publicly accessible Brazilian Portuguese Privacy Policy at `/politica` (clone of `/policy` translated to PT-BR).

**Independent Verification**: Accessing `/politica` directly returns HTTP 200 without login and displays the Brazilian Portuguese privacy policy matching all terms and guarantees.

### Validation for User Story 2

- [x] T008 [P] [US2] Define manual verification steps for unauthenticated and authenticated access to `/politica`

### Implementation for User Story 2

- [x] T009 [US2] Implement Brazilian Portuguese privacy policy page route in `src/app/politica/page.tsx` rendering `PrivacyPolicyContent` with PT-BR locale data
- [x] T010 [US2] Validate that `/politica` contains accurate PT-BR terms and guarantees matching `/policy`

**Checkpoint**: At this point, User Stories 1 AND 2 are both independently functional and verifiable.

---

## Phase 5: User Story 3 - Language Switching and Navigation (Priority: P2)

**Goal**: Enable bidirectional language toggle between `/policy` and `/politica` and seamless back-navigation to the main application.

**Independent Verification**: Clicking Portuguese link on `/policy` routes to `/politica`; clicking English link on `/politica` routes to `/policy`; clicking back/home navigates to login/dashboard.

### Validation for User Story 3

- [x] T011 [P] [US3] Define manual verification steps for cross-navigation and language toggling

### Implementation for User Story 3

- [x] T012 [US3] Implement direct locale switcher links between `/policy` and `/politica` in `src/components/privacy-policy-content.tsx`
- [x] T013 [US3] Implement back/home button and brand link in `src/components/privacy-policy-content.tsx`

**Checkpoint**: Cross-navigation between English and Brazilian Portuguese policy pages and back to application is complete.

---

## Phase 6: User Story 4 - Consistent Theming and Selectable Text (Priority: P2)

**Goal**: Ensure policy pages integrate with theme CSS variables, allow text copying/selection, and render responsively on mobile and desktop.

**Independent Verification**: Text on `/policy` and `/politica` can be selected and copied with cursor, adapting smoothly to mobile and desktop viewports.

### Validation for User Story 4

- [x] T014 [P] [US4] Define manual verification steps for text selection and responsive viewport rendering

### Implementation for User Story 4

- [x] T015 [US4] Ensure explicit text selection classes (`user-select: text`) on legal content sections in `src/components/privacy-policy-content.tsx`
- [x] T016 [US4] Ensure responsive layout, card styling (`ui-card`, `ui-panel`), typography, and print-friendly styles

**Checkpoint**: Visual styling, selectable text, and responsive layout are fully verified across devices.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, lint checks, and specification completion

- [x] T017 Run ESLint validation with `npm run lint` to guarantee zero errors
- [x] T018 Execute complete manual verification checklist across `/policy` and `/politica`
- [x] T019 Update specification status to `Done` in `specs/007-privacy-policy-page/spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - starts immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - US1 (English `/policy`) and US2 (Portuguese `/politica`) can proceed in parallel or sequentially.
  - US3 (Navigation & Language Switching) and US4 (Theming & Selectable Text) refine the presentation.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Reuses `PrivacyPolicyContent` and `policy-content.ts`.
- **User Story 3 (P2)**: Integrates language links between `/policy` and `/politica`.
- **User Story 4 (P2)**: Polishes styling and selection behavior across both policy pages.

### Parallel Opportunities

- Foundational tasks T002 and T003 can run in parallel.
- Validation tasks T004, T008, T011, and T014 can run in parallel.
- User Story 1 (`src/app/policy/page.tsx`) and User Story 2 (`src/app/politica/page.tsx`) can be implemented in parallel once foundational tasks are complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (`/policy`)
4. **STOP and VALIDATE**: Verify `/policy` returns 200 and passes Microsoft Store requirements
5. Ready for store submission review

### Incremental Delivery

1. Setup + Foundational ready
2. Add `/policy` (US1) → Verify independently (MVP!)
3. Add `/politica` (US2) → Verify independently
4. Add Language Switching & Navigation (US3) → Verify independently
5. Polish theming, selection, and responsive layout (US4) → Verify independently
6. Run lint, complete checklist, and mark spec as `Done` (Phase 7)
