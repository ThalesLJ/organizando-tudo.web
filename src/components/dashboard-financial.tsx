"use client";

import { useEffect, useMemo, useState } from "react";
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

export function DashboardFinancial() {
  const { messages } = useLocaleMessages();
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function load() {
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

        if (!isCancelled) {
          setBudgets(Array.isArray(budgetsData.data) ? budgetsData.data : []);
          setExpenses(Array.isArray(expensesData.data) ? expensesData.data : []);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(getErrorMessage(loadError, messages.financial.loadError));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      isCancelled = true;
    };
  }, [messages.financial.loadError]);

  const summary = useMemo(() => {
    const totalBudget = budgets.reduce((sum, item) => sum + item.amount, 0);
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalRemaining = totalBudget - totalSpent;
    return { totalBudget, totalSpent, totalRemaining };
  }, [budgets, expenses]);

  const budgetMap = useMemo(() => {
    return new Map(budgets.map((budget) => [budget.id, budget]));
  }, [budgets]);

  const budgetOverview = useMemo(() => {
    return budgets.map((budget) => {
      const spent = expenses.filter((expense) => expense.budgetId === budget.id).reduce((sum, item) => sum + item.amount, 0);
      const remaining = budget.amount - spent;
      const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      return { ...budget, spent, remaining, percentageUsed };
    });
  }, [budgets, expenses]);

  const expensesWithCategory = useMemo(() => {
    return expenses.map((expense) => ({
      ...expense,
      budget: budgetMap.get(expense.budgetId) ?? null,
    }));
  }, [budgetMap, expenses]);

  if (loading) {
    return <p className="text-sm text-[var(--text-secondary)]">{messages.financial.loading}</p>;
  }

  if (error) {
    return <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-3">
        <h1 className="text-center text-sm font-semibold">{messages.financial.summaryTitle}</h1>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className="rounded border border-zinc-300/40 bg-[var(--bg-secondary)] p-4 text-center">
            <strong className="text-2xl">{summary.totalBudget.toFixed(0)}</strong>
            <p className="text-xs text-[var(--text-secondary)]">{messages.financial.totalBudget}</p>
          </article>
          <article className="rounded border border-zinc-300/40 bg-[var(--bg-secondary)] p-4 text-center">
            <strong className="text-2xl">{summary.totalSpent.toFixed(0)}</strong>
            <p className="text-xs text-[var(--text-secondary)]">{messages.financial.totalSpent}</p>
          </article>
          <article className="rounded border border-zinc-300/40 bg-[var(--bg-secondary)] p-4 text-center">
            <strong className="text-2xl">{summary.totalRemaining.toFixed(0)}</strong>
            <p className="text-xs text-[var(--text-secondary)]">{messages.financial.totalRemaining}</p>
          </article>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-center text-sm font-semibold">{messages.financial.budgetOverview}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {budgetOverview.map((budget) => (
            <article key={budget.id} className="rounded border border-zinc-300/40 bg-[var(--bg-secondary)] p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budget.color }} />
                <h3 className="text-sm font-semibold">{budget.name}</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{budget.amount.toFixed(0)}</p>
              <p className="text-xs text-[var(--text-secondary)]">{messages.financial.totalBudget}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">{messages.financial.totalSpent}</span>
                <span>{budget.spent.toFixed(0)} / {budget.amount.toFixed(0)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">{messages.financial.totalRemaining}</span>
                <span>{budget.remaining.toFixed(0)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-center text-sm font-semibold">{messages.financial.expensesByCategory}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {expensesWithCategory.map((expense) => (
            <article key={expense.id} className="rounded border border-zinc-300/40 bg-[var(--bg-secondary)] p-3">
              <h3 className="text-sm font-semibold">{expense.name}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{expense.budget?.name ?? "-"}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">{expense.description || messages.financial.noDescription}</p>
              <p className="mt-3 text-2xl font-bold">{expense.amount.toFixed(0)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
