# Feature Specification: Financial Domain

**Feature Branch**: `003-financial-domain`

**Created**: 2026-06-12

**Status**: Done

**Input**: Retroactive specification for the Financial domain based on the Domain Map in `FEATURES_TEMP.md` and the current project implementation.

## User Scenarios & Verification *(mandatory)*

### User Story 1 - Track financial summary on the dashboard (Priority: P1)

As an authenticated user, I want to see a financial summary with total budget, total spent, total remaining, budget overview, and expenses by category so I can quickly understand my financial situation.

**Why this priority**: The dashboard is the first private screen and provides the most important Financial domain reading.

**Independent Verification**: Accessing `/dashboard` with a valid session must load budgets and expenses in parallel, calculate totals, and display derived financial cards.

**Acceptance Scenarios**:

1. **Given** a user with budgets and expenses, **When** they access `/dashboard`, **Then** they see total budget, total spent, and total remaining.
2. **Given** expenses associated with budgets, **When** the dashboard loads, **Then** each budget shows spent and remaining while percentage used remains calculated as internal derived data.
3. **Given** a financial data loading error, **When** the dashboard fails, **Then** the application shows localized feedback.

---

### User Story 2 - Manage budgets (Priority: P1)

As an authenticated user, I want to create, edit, list, and delete budgets so I can organize financial limits or categories with name, amount, icon, and color.

**Why this priority**: Budgets structure financial categorization and are dependencies for expenses.

**Independent Verification**: Accessing `/financial` must allow creating, editing, listing, and deleting budgets through protected internal routes.

**Acceptance Scenarios**:

1. **Given** a completed budget form, **When** the user saves, **Then** a new budget is created through `/api/budgets`.
2. **Given** an existing budget, **When** the user chooses edit, changes data, and saves, **Then** the budget is updated through `/api/budgets/:id`.
3. **Given** an existing budget, **When** the user confirms deletion, **Then** the budget is removed and financial data reloads.

---

### User Story 3 - Manage expenses (Priority: P1)

As an authenticated user, I want to create, edit, list, and delete expenses associated with budgets so I can record spending and keep financial totals updated.

**Why this priority**: Expenses feed spent and remaining calculations on the dashboard and financial page.

**Independent Verification**: The `/financial` screen must load budgets before allowing expense association and must reload budgets and expenses after mutations.

**Acceptance Scenarios**:

1. **Given** loaded budgets, **When** the user creates an expense with budget, name, and amount, **Then** the expense is created through `/api/expenses`.
2. **Given** an existing expense, **When** the user edits and saves it, **Then** the expense is updated through `/api/expenses/:id`.
3. **Given** an existing expense, **When** the user confirms deletion, **Then** the expense is removed and financial data reloads.

---

### User Story 4 - Keep derived financial aggregations current (Priority: P2)

As an authenticated user, I want totals and groupings to be recalculated after changes so I can trust the interface reflects current data.

**Why this priority**: The domain value depends on consistency between budgets, expenses, and derived data.

**Independent Verification**: After creating, editing, or deleting a budget or expense, the screen must reload collections and recalculate displayed derived data.

**Acceptance Scenarios**:

1. **Given** a new expense, **When** it is saved, **Then** total spent and total remaining reflect the new amount after reload.
2. **Given** an edited budget, **When** it is saved, **Then** the list and aggregations use the updated amount.
3. **Given** an expense associated with a budget, **When** the screen renders expenses by category, **Then** the category shows the corresponding budget name.

### Edge Cases

- Without budgets, the budgets list shows an empty state.
- Without expenses, the expenses list shows an empty state.
- The expense form selects the first loaded budget when none is selected.
- Without loaded budgets, the expense select is empty and the form remains dependent on required selection.
- Budget or expense deletion requires browser confirmation.
- Initial loading uses parallel requests for budgets and expenses.
- Numeric values are converted from inputs before submission.
- Save and delete errors show localized feedback.
- Expenses whose budget is not loaded display `-` as category.
- Remaining values can become negative when expenses exceed the budget amount.
- The dashboard displays values without decimal places; the CRUD screen displays values with two decimal places.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch budgets and expenses through internal BFF routes.
- **FR-002**: System MUST require authenticated session for all budget and expense operations.
- **FR-003**: System MUST load budgets and expenses in parallel where both collections are needed.
- **FR-004**: System MUST calculate total budget from the sum of budget amounts.
- **FR-005**: System MUST calculate total spent from the sum of expense amounts.
- **FR-006**: System MUST calculate total remaining as total budget minus total spent.
- **FR-007**: System MUST calculate spent, remaining, and percentage used for each budget.
- **FR-008**: System MUST associate expenses with budgets by `budgetId`.
- **FR-009**: System MUST allow budget creation, update, listing, and deletion.
- **FR-010**: System MUST allow expense creation, update, listing, and deletion.
- **FR-011**: System MUST reload financial collections after successful create, update, or delete operations.
- **FR-012**: System MUST require browser confirmation before deleting budgets or expenses.
- **FR-013**: System MUST keep financial UI copy localized through the centralized message catalog.
- **FR-014**: System MUST display missing budget associations with `-` in expense category output.

### Key Entities *(include if feature involves data)*

- **Budget**: Financial category with `id`, `name`, `amount`, `icon`, and `color`.
- **Expense**: Spending record associated with a budget through `id`, `budgetId`, `name`, `amount`, `description`, and `color`.
- **FinancialSummary**: Derived aggregate with total budget, total spent, and total remaining.
- **BudgetOverview**: Derived budget view with spent, remaining, and percentage used.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dashboard shows the three main totals whenever budgets and expenses load successfully.
- **SC-002**: 100% of budget and expense operations go through protected internal routes.
- **SC-003**: After every successful mutation, the financial screen reloads data before showing final state.
- **SC-004**: Expenses always show the associated category when the corresponding budget is loaded.
- **SC-005**: Loading, saving, and deletion errors show a visible message to the user.

## Assumptions

- The external API is the source of truth for budgets and expenses.
- Financial aggregations are calculated in the UI from loaded collections.
- Every expense should belong to a budget.
- Retroactive validation is performed manually, without creating automated tests.
