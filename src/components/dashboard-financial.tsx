"use client";

import { useEffect, useMemo, useState } from "react";
import { AppLoading } from "@/components/app-loading";
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
    return <AppLoading label={messages.financial.loading} />;
  }

  if (error) {
    return (
      <section className="private-floating-page">
        <p className="ui-error">{error}</p>
      </section>
    );
  }

  return (
    <section className="private-floating-page mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-3">
        <h1 className="text-center text-2xl font-bold tracking-[-0.02em]">{messages.financial.summaryTitle}</h1>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className="ui-card p-5 text-center">
            <strong className="text-2xl">{summary.totalBudget.toFixed(0)}</strong>
            <p className="ui-muted text-xs">{messages.financial.totalBudget}</p>
          </article>
          <article className="ui-card p-5 text-center">
            <strong className="text-2xl">{summary.totalSpent.toFixed(0)}</strong>
            <p className="ui-muted text-xs">{messages.financial.totalSpent}</p>
          </article>
          <article className="ui-card p-5 text-center">
            <strong className="text-2xl">{summary.totalRemaining.toFixed(0)}</strong>
            <p className="ui-muted text-xs">{messages.financial.totalRemaining}</p>
          </article>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-center text-lg font-semibold">{messages.financial.budgetOverview}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {budgetOverview.map((budget) => (
            <article key={budget.id} className="ui-card p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budget.color }} />
                <h3 className="text-sm font-semibold">{budget.name}</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{budget.amount.toFixed(0)}</p>
              <p className="ui-muted text-xs">{messages.financial.totalBudget}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="ui-muted">{messages.financial.totalSpent}</span>
                <span>{budget.spent.toFixed(0)} / {budget.amount.toFixed(0)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="ui-muted">{messages.financial.totalRemaining}</span>
                <span>{budget.remaining.toFixed(0)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-center text-lg font-semibold">{messages.financial.expensesByCategory}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {expensesWithCategory.map((expense) => (
            <article key={expense.id} className="ui-card p-4">
              <h3 className="text-sm font-semibold">{expense.name}</h3>
              <p className="ui-muted text-xs">{expense.budget?.name ?? "-"}</p>
              <p className="ui-muted mt-1 text-xs">{expense.description || messages.financial.noDescription}</p>
              <p className="mt-3 text-2xl font-bold">{expense.amount.toFixed(0)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
