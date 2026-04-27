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
        <label htmlFor="username" className="text-xs font-medium text-white">
          {copy.firstNameLabel}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder={copy.firstNamePlaceholder}
          className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/45"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="email" className="text-xs font-medium text-white">
          {copy.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={copy.emailPlaceholder}
          className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/45"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="password" className="text-xs font-medium text-white">
          {copy.passwordLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder={copy.passwordPlaceholder}
          className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/45"
        />
      </div>
      {error ? <p className="text-xs text-white">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-lg border border-white bg-white px-4 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-60"
      >
        {loading ? copy.submitting : copy.submit}
      </button>
      <p className="pt-1 text-center text-xs leading-none text-white/60">
        {copy.hasAccount}{" "}
        <Link href="/login" className="font-semibold text-white/85 transition hover:text-white">
          {copy.signIn}
        </Link>
      </p>
    </form>
  );
}
