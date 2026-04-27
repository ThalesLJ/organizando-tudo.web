"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type RegisterFormCopy = {
  firstNameLabel: string;
  firstNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submit: string;
  submitting: string;
  hasAccount: string;
  signIn: string;
  errorDefault: string;
};

type RegisterFormProps = {
  copy: RegisterFormCopy;
};

export function RegisterForm({ copy }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setError(data.error || copy.errorDefault);
      setLoading(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <label htmlFor="username" className="text-xs font-medium text-[var(--text-primary)]">
          {copy.firstNameLabel}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder={copy.firstNamePlaceholder}
          className="ui-input h-14 w-full"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="email" className="text-xs font-medium text-[var(--text-primary)]">
          {copy.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={copy.emailPlaceholder}
          className="ui-input h-14 w-full"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="password" className="text-xs font-medium text-[var(--text-primary)]">
          {copy.passwordLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder={copy.passwordPlaceholder}
          className="ui-input h-14 w-full"
        />
      </div>
      {error ? <p className="select-none text-xs text-[var(--text-primary)]">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="ui-button-primary h-12 w-full"
      >
        {loading ? copy.submitting : copy.submit}
      </button>
      <p className="select-none pt-1 text-center text-xs leading-none text-[var(--text-secondary)]">
        {copy.hasAccount}{" "}
        <Link href="/login" className="font-semibold text-[var(--text-primary)] transition hover:opacity-80">
          {copy.signIn}
        </Link>
      </p>
    </form>
  );
}
