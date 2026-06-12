# Research: Financial Domain

## Objective

Record the decisions already resolved by the current Financial domain implementation, including dashboard, budgets, expenses, and derived aggregations.

## Resolved Decisions

### Financial data origin

**Decision**: Budgets and expenses are external collections accessed exclusively through internal BFF routes.

**Implemented basis**: `src/app/api/budgets/route.ts`, `src/app/api/budgets/[id]/route.ts`, `src/app/api/expenses/route.ts`, and `src/app/api/expenses/[id]/route.ts`.

**Rationale**: The BFF protects the session, forwards the Bearer token server-side, and normalizes responses for the UI.

### Parallel loading

**Decision**: Screens that need budgets and expenses load both collections in parallel.

**Implemented basis**: `Promise.all` in `src/components/dashboard-financial.tsx` and `src/components/financial-manager.tsx`.

**Rationale**: The collections are independent and can be fetched without an unnecessary waterfall.

### Frontend aggregations

**Decision**: Financial summary and category views are derived in the UI.

**Implemented basis**: `useMemo` in `dashboard-financial` and `financial-manager`.

**Rationale**: The implementation avoids additional summary endpoints and keeps the interface responsive after mutations.

### Budgets

**Decision**: Budget contains name, amount, icon, and color.

**Implemented basis**: `BudgetItem` and `BudgetForm` in `src/components/financial-manager.tsx`.

**Rationale**: The structure supports visual display and financial categorization.

### Expenses

**Decision**: Expense must be associated with a budget.

**Implemented basis**: `ExpenseItem` and `ExpenseForm` in `src/components/financial-manager.tsx`; the form selects the first loaded budget when there is no current selection.

**Rationale**: Association by `budgetId` enables spending grouping and category totals.

### Reload after mutations

**Decision**: The screen reloads budgets and expenses after create, edit, or delete.

**Implemented basis**: `loadAll()` is called after successful operations in `financial-manager`.

**Rationale**: Derived state remains consistent with the external source.

## Closed Ambiguities

- Configurable currency is not implemented in the web layer.
- Currency conversion is not implemented.
- No dedicated financial summary BFF endpoint is implemented.
- Pagination is not implemented for budgets or expenses.
- No automated test suite is configured for this domain.
