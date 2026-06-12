# Data Model: Financial Domain

## Entities

### Budget

Represents a user financial category or limit.

**Fields**:

- `id`: Unique budget identifier.
- `name`: Name displayed in the interface.
- `amount`: Planned amount.
- `icon`: Textual visual identifier.
- `color`: Color used in budget display.

**Relationships**:

- Has zero or more `Expense`.
- Participates in `FinancialSummary` and `BudgetOverview`.

### Expense

Represents spending associated with a budget.

**Fields**:

- `id`: Unique expense identifier.
- `budgetId`: Associated budget identifier.
- `name`: Expense name.
- `amount`: Spent amount.
- `description`: Optional description.
- `color`: Optional color.

**Relationships**:

- Belongs to a `Budget` through `budgetId`.
- Feeds `FinancialSummary`, `BudgetOverview`, and expenses by category.

### FinancialSummary

Represents derived totals displayed on the dashboard.

**Fields**:

- `totalBudget`: Sum of `amount` from all budgets.
- `totalSpent`: Sum of `amount` from all expenses.
- `totalRemaining`: Difference between `totalBudget` and `totalSpent`.

### BudgetOverview

Represents the derived reading for each budget.

**Fields**:

- `budget`: Base budget data.
- `spent`: Sum of associated expenses.
- `remaining`: Remaining budget amount.
- `percentageUsed`: Percentage spent relative to budget amount.

### FinancialFormState

Represents local form state on the financial screen.

**Fields**:

- `budgetForm`: Editable budget data.
- `expenseForm`: Editable expense data.
- `editingBudgetId`: Budget being edited.
- `editingExpenseId`: Expense being edited.
- `loading`: Initial loading.
- `saving`: Save or deletion in progress.
- `error`: Visible error message.

## State Transitions

- Dashboard loads budgets and expenses in parallel.
- Dashboard calculates `FinancialSummary`, `BudgetOverview`, and expenses with category.
- Financial screen loads budgets and expenses in parallel.
- Budget creation uses `POST /api/budgets`.
- Budget editing uses `PUT /api/budgets/:id`.
- Budget deletion uses `DELETE /api/budgets/:id` after confirmation.
- Expense creation uses `POST /api/expenses`.
- Expense editing uses `PUT /api/expenses/:id`.
- Expense deletion uses `DELETE /api/expenses/:id` after confirmation.
- Successful mutations reload budgets and expenses.
