"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type RecoverFormCopy = {
  emailLabel: string;
  emailPlaceholder: string;
  sendCodeInfo: string;
  sendCode: string;
  sending: string;
  verificationCodeLabel: string;
  verificationCodePlaceholder: string;
  newPasswordLabel: string;
  newPasswordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  resetPassword: string;
  resetting: string;
  rememberPassword: string;
  signIn: string;
  sendErrorDefault: string;
  resetErrorDefault: string;
  passwordMismatch: string;
  sendSuccess: string;
  resetSuccess: string;
};

type RecoverFormProps = {
  copy: RecoverFormCopy;
};

export function RecoverForm({ copy }: RecoverFormProps) {
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
    };

    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      setError(data.error || copy.sendErrorDefault);
      setSending(false);
      return;
    }

    setMessage(copy.sendSuccess);
    setCodeSent(true);
    setSending(false);
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifying(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    if (password !== confirmPassword) {
      setError(copy.passwordMismatch);
      setVerifying(false);
      return;
    }

    const payload = {
      code: String(formData.get("code") || ""),
      password,
    };

    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      setError(data.error || copy.resetErrorDefault);
      setVerifying(false);
      return;
    }

    setMessage(copy.resetSuccess);
    setVerifying(false);
  }

  return (
    <div className="space-y-5">
      {!codeSent ? (
        <form onSubmit={handleSendCode} className="space-y-5">
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
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs leading-snug text-white/70">
            {copy.sendCodeInfo}
          </div>
          <button
            type="submit"
            disabled={sending}
            className="h-12 w-full rounded-lg border border-white bg-white px-4 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {sending ? copy.sending : copy.sendCode}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-5">
          <div className="space-y-4">
            <label htmlFor="code" className="text-xs font-medium text-white">
              {copy.verificationCodeLabel}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              minLength={6}
              maxLength={6}
              placeholder={copy.verificationCodePlaceholder}
              className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-center text-sm tracking-[0.2em] text-white outline-none placeholder:text-white/30 focus:border-white/45"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="password" className="text-xs font-medium text-white">
              {copy.newPasswordLabel}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder={copy.newPasswordPlaceholder}
              className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/45"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-white">
              {copy.confirmPasswordLabel}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder={copy.confirmPasswordPlaceholder}
              className="h-14 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/45"
            />
          </div>
          <button
            type="submit"
            disabled={verifying}
            className="h-12 w-full rounded-lg border border-white bg-white px-4 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {verifying ? copy.resetting : copy.resetPassword}
          </button>
        </form>
      )}

      {message ? <p className="text-xs text-white">{message}</p> : null}
      {error ? <p className="text-xs text-white">{error}</p> : null}
      <p className="text-center text-xs leading-none text-white/60">
        {copy.rememberPassword}{" "}
        <Link href="/login" className="font-semibold text-white/85 transition hover:text-white">
          {copy.signIn}
        </Link>
      </p>
    </div>
  );
}
