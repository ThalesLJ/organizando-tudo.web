"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginFormCopy = {
  identifierLabel: string;
  identifierPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  keepSignedIn: string;
  submit: string;
  submitting: string;
  forgotPassword: string;
  noAccount: string;
  createAccount: string;
  errorDefault: string;
};

type LoginFormProps = {
  copy: LoginFormCopy;
};

export function LoginForm({ copy }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getErrorMessage(value: unknown): string {
    if (typeof value === "string") {
      return value;
    }
    if (value && typeof value === "object" && "message" in value) {
      const message = (value as { message?: unknown }).message;
      if (typeof message === "string") {
        return message;
      }
      if (Array.isArray(message)) {
        return message.join(", ");
      }
    }
    return copy.errorDefault;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      identifier: String(formData.get("identifier") || ""),
      password: String(formData.get("password") || ""),
      keepLoggedIn: formData.get("keepLoggedIn") === "on",
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setError(getErrorMessage(data.error));
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <label htmlFor="identifier" className="text-xs font-medium text-[var(--text-primary)]">
          {copy.identifierLabel}
        </label>
        <input
          suppressHydrationWarning
          id="identifier"
          name="identifier"
          type="text"
          required
          placeholder={copy.identifierPlaceholder}
          className="ui-input h-14 w-full"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="password" className="text-xs font-medium text-[var(--text-primary)]">
          {copy.passwordLabel}
        </label>
        <input
          suppressHydrationWarning
          id="password"
          name="password"
          type="password"
          required
          placeholder={copy.passwordPlaceholder}
          className="ui-input h-14 w-full"
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        <input
          type="checkbox"
          name="keepLoggedIn"
          className="h-4 w-4 rounded border border-[var(--border-color)] bg-transparent accent-[var(--primary-button-background)]"
        />
        {copy.keepSignedIn}
      </label>
      {error ? <p className="select-none text-xs text-[var(--text-primary)]">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="ui-button-primary h-12 w-full"
      >
        {loading ? copy.submitting : copy.submit}
      </button>
      <div className="select-none pt-1 text-center text-xs leading-none">
        <Link href="/recover" className="font-bold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
          {copy.forgotPassword}
        </Link>
      </div>
      <p className="select-none text-center text-xs leading-none text-[var(--text-secondary)]">
        {copy.noAccount}{" "}
        <Link href="/register" className="font-bold text-[var(--text-primary)] transition hover:opacity-80">
          {copy.createAccount}
        </Link>
      </p>
    </form>
  );
}
