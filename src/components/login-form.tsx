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
        <label htmlFor="identifier" className="text-xs font-medium text-white">
          {copy.identifierLabel}
        </label>
        <input
          suppressHydrationWarning
          id="identifier"
          name="identifier"
          type="text"
          required
          placeholder={copy.identifierPlaceholder}
          className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/45"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="password" className="text-xs font-medium text-white">
          {copy.passwordLabel}
        </label>
        <input
          suppressHydrationWarning
          id="password"
          name="password"
          type="password"
          required
          placeholder={copy.passwordPlaceholder}
          className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/45"
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-white/70">
        <input
          type="checkbox"
          name="keepLoggedIn"
          className="h-4 w-4 rounded border border-white/30 bg-transparent accent-white"
        />
        {copy.keepSignedIn}
      </label>
      {error ? <p className="text-xs text-white">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-lg border border-white bg-white px-4 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-60"
      >
        {loading ? copy.submitting : copy.submit}
      </button>
      <div className="pt-1 text-center text-xs leading-none">
        <Link href="/recover" className="text-white/70 transition hover:text-white">
          {copy.forgotPassword}
        </Link>
      </div>
      <p className="text-center text-xs leading-none text-white/60">
        {copy.noAccount}{" "}
        <Link href="/register" className="font-semibold text-white/85 transition hover:text-white">
          {copy.createAccount}
        </Link>
      </p>
    </form>
  );
}
