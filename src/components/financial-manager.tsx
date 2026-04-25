"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocaleMessages } from "@/lib/locale-client";

type BudgetItem = {
  id: string;
  name: string;
  amount: number;
  icon: string;
  color: string;
};

type ExpenseItem = {
  id: string;
  budgetId: string;
  name: string;
  amount: number;
  description?: string;
  color?: string;
};

type BudgetForm = {
  name: string;
  amount: string;
  icon: string;
  color: string;
};

type ExpenseForm = {
  budgetId: string;
  name: string;
  amount: string;
  description: string;
  color: string;
};

const budgetDefault: BudgetForm = {
  name: "",
  amount: "",
  icon: "family",
  color: "#8b5cf6",
};

const expenseDefault: ExpenseForm = {
  budgetId: "",
  name: "",
  amount: "",
  description: "",
  color: "#8b5cf6",
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
    if (Array.isArray(message)) {
      return message.join(", ");
    }
  }
  return fallback;
}

export function FinancialManager() {
  const { messages } = useLocaleMessages();
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [budgetForm, setBudgetForm] = useState<BudgetForm>(budgetDefault);
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(expenseDefault);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [budgetsResponse, expensesResponse] = await Promise.all([
        fetch("/api/budgets", { cache: "no-store" }),
        fetch("/api/expenses", { cache: "no-store" }),
      ]);

      const budgetsData = await budgetsResponse.json();
      const expensesData = await expensesResponse.json();

      if (!budgetsResponse.ok || !budgetsData.success || !expensesResponse.ok || !expensesData.success) {
        throw new Error(messages.financial.loadError);
      }

      const loadedBudgets = Array.isArray(budgetsData.data) ? budgetsData.data : [];
      setBudgets(loadedBudgets);
      setExpenses(Array.isArray(expensesData.data) ? expensesData.data : []);
      setExpenseForm((current) => ({
        ...current,
        budgetId: current.budgetId || loadedBudgets[0]?.id || "",
      }));
    } catch (loadError) {
      setError(getErrorMessage(loadError, messages.financial.loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadInitial() {
      try {
        const [budgetsResponse, expensesResponse] = await Promise.all([
          fetch("/api/budgets", { cache: "no-store" }),
          fetch("/api/expenses", { cache: "no-store" }),
        ]);

        const budgetsData = await budgetsResponse.json();
        const expensesData = await expensesResponse.json();

        if (!budgetsResponse.ok || !budgetsData.success || !expensesResponse.ok || !expensesData.success) {
          throw new Error(messages.financial.loadError);
        }

        if (!isCancelled) {
          const loadedBudgets = Array.isArray(budgetsData.data) ? budgetsData.data : [];
          setBudgets(loadedBudgets);
          setExpenses(Array.isArray(expensesData.data) ? expensesData.data : []);
          setExpenseForm((current) => ({
            ...current,
            budgetId: current.budgetId || loadedBudgets[0]?.id || "",
          }));
          setLoading(false);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(getErrorMessage(loadError, messages.financial.loadError));
          setLoading(false);
        }
      }
    }

    void loadInitial();
    return () => {
      isCancelled = true;
    };
  }, [messages.financial.loadError]);

  const budgetMap = useMemo(() => new Map(budgets.map((item) => [item.id, item])), [budgets]);

  async function handleSubmitBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: budgetForm.name.trim(),
        amount: Number(budgetForm.amount),
        icon: budgetForm.icon.trim(),
        color: budgetForm.color,
      };
      const endpoint = editingBudgetId ? `/api/budgets/${editingBudgetId}` : "/api/budgets";
      const method = editingBudgetId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, messages.financial.budgetSaveError));
      }
      setBudgetForm(budgetDefault);
      setEditingBudgetId(null);
      await loadAll();
    } catch (saveError) {
      setError(getErrorMessage(saveError, messages.financial.budgetSaveError));
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        budgetId: expenseForm.budgetId,
        name: expenseForm.name.trim(),
        amount: Number(expenseForm.amount),
        description: expenseForm.description.trim(),
        color: expenseForm.color,
      };
      const endpoint = editingExpenseId ? `/api/expenses/${editingExpenseId}` : "/api/expenses";
      const method = editingExpenseId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, messages.financial.expenseSaveError));
      }
      setExpenseForm((current) => ({ ...expenseDefault, budgetId: current.budgetId || budgets[0]?.id || "" }));
      setEditingExpenseId(null);
      await loadAll();
    } catch (saveError) {
      setError(getErrorMessage(saveError, messages.financial.expenseSaveError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBudget(id: string) {
    if (!window.confirm(messages.financial.confirmDeleteBudget)) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, messages.financial.budgetDeleteError));
      }
      await loadAll();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, messages.financial.budgetDeleteError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!window.confirm(messages.financial.confirmDeleteExpense)) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, messages.financial.expenseDeleteError));
      }
      await loadAll();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, messages.financial.expenseDeleteError));
    } finally {
      setSaving(false);
    }
  }

  function startEditBudget(item: BudgetItem) {
    setEditingBudgetId(item.id);
    setBudgetForm({
      name: item.name,
      amount: String(item.amount),
      icon: item.icon,
      color: item.color,
    });
  }

  function startEditExpense(item: ExpenseItem) {
    setEditingExpenseId(item.id);
    setExpenseForm({
      budgetId: item.budgetId,
      name: item.name,
      amount: String(item.amount),
      description: item.description ?? "",
      color: item.color ?? "#8b5cf6",
    });
  }

  if (loading) {
    return <p className="text-sm text-[var(--text-secondary)]">{messages.financial.loading}</p>;
  }

  return (
    <section className="space-y-4">
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <form onSubmit={handleSubmitBudget} className="space-y-3 rounded-md border border-zinc-300/40 bg-[var(--bg-secondary)] p-4">
        <h2 className="text-lg font-semibold">{messages.financial.createBudgetSection}</h2>
        <input
          value={budgetForm.name}
          onChange={(event) => setBudgetForm((current) => ({ ...current, name: event.target.value }))}
          placeholder={messages.financial.name}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={budgetForm.amount}
          onChange={(event) => setBudgetForm((current) => ({ ...current, amount: event.target.value }))}
          placeholder={messages.financial.amount}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
          required
        />
        <input
          value={budgetForm.icon}
          onChange={(event) => setBudgetForm((current) => ({ ...current, icon: event.target.value }))}
          placeholder={messages.financial.icon}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
          required
        />
        <input
          type="color"
          value={budgetForm.color}
          onChange={(event) => setBudgetForm((current) => ({ ...current, color: event.target.value }))}
          className="h-10 w-20 rounded border border-zinc-300/50 bg-[var(--bg-primary)]"
        />
        <div className="flex gap-2">
          <button disabled={saving} className="rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm">
            {editingBudgetId ? messages.financial.updateBudget : messages.financial.addBudget}
          </button>
          {editingBudgetId ? (
            <button
              type="button"
              onClick={() => {
                setEditingBudgetId(null);
                setBudgetForm(budgetDefault);
              }}
              className="rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
            >
              {messages.financial.cancelEdit}
            </button>
          ) : null}
        </div>
      </form>

      <section className="space-y-2 rounded-md border border-zinc-300/40 bg-[var(--bg-secondary)] p-4">
        <h3 className="text-base font-semibold">{messages.financial.listBudgetSection}</h3>
        {budgets.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">{messages.financial.emptyBudgets}</p> : null}
        {budgets.map((item) => (
          <article key={item.id} className="rounded border border-zinc-300/40 bg-[var(--bg-primary)] p-3 text-sm">
            <p className="font-semibold">{item.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{item.amount.toFixed(2)}</p>
            <div className="mt-2 flex gap-2 text-xs">
              <button type="button" onClick={() => startEditBudget(item)} className="underline">
                {messages.financial.edit}
              </button>
              <button type="button" onClick={() => void handleDeleteBudget(item.id)} className="underline">
                {messages.financial.delete}
              </button>
            </div>
          </article>
        ))}
      </section>

      <form onSubmit={handleSubmitExpense} className="space-y-3 rounded-md border border-zinc-300/40 bg-[var(--bg-secondary)] p-4">
        <h2 className="text-lg font-semibold">{messages.financial.createExpenseSection}</h2>
        <select
          value={expenseForm.budgetId}
          onChange={(event) => setExpenseForm((current) => ({ ...current, budgetId: event.target.value }))}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
          required
        >
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
        <input
          value={expenseForm.name}
          onChange={(event) => setExpenseForm((current) => ({ ...current, name: event.target.value }))}
          placeholder={messages.financial.name}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={expenseForm.amount}
          onChange={(event) => setExpenseForm((current) => ({ ...current, amount: event.target.value }))}
          placeholder={messages.financial.amount}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
          required
        />
        <input
          value={expenseForm.description}
          onChange={(event) => setExpenseForm((current) => ({ ...current, description: event.target.value }))}
          placeholder={messages.financial.description}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
        />
        <input
          type="color"
          value={expenseForm.color}
          onChange={(event) => setExpenseForm((current) => ({ ...current, color: event.target.value }))}
          className="h-10 w-20 rounded border border-zinc-300/50 bg-[var(--bg-primary)]"
        />
        <div className="flex gap-2">
          <button disabled={saving} className="rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm">
            {editingExpenseId ? messages.financial.updateExpense : messages.financial.addExpense}
          </button>
          {editingExpenseId ? (
            <button
              type="button"
              onClick={() => {
                setEditingExpenseId(null);
                setExpenseForm((current) => ({ ...expenseDefault, budgetId: current.budgetId || budgets[0]?.id || "" }));
              }}
              className="rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm"
            >
              {messages.financial.cancelEdit}
            </button>
          ) : null}
        </div>
      </form>

      <section className="space-y-2 rounded-md border border-zinc-300/40 bg-[var(--bg-secondary)] p-4">
        <h3 className="text-base font-semibold">{messages.financial.listExpenseSection}</h3>
        {expenses.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">{messages.financial.emptyExpenses}</p> : null}
        {expenses.map((item) => (
          <article key={item.id} className="rounded border border-zinc-300/40 bg-[var(--bg-primary)] p-3 text-sm">
            <p className="font-semibold">{item.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{budgetMap.get(item.budgetId)?.name ?? "-"}</p>
            <p className="text-xs text-[var(--text-secondary)]">{item.amount.toFixed(2)}</p>
            <div className="mt-2 flex gap-2 text-xs">
              <button type="button" onClick={() => startEditExpense(item)} className="underline">
                {messages.financial.edit}
              </button>
              <button type="button" onClick={() => void handleDeleteExpense(item.id)} className="underline">
                {messages.financial.delete}
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}
