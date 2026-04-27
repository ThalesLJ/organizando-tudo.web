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
          <div className="select-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-xs leading-snug text-[var(--text-secondary)]">
            {copy.sendCodeInfo}
          </div>
          <button
            type="submit"
            disabled={sending}
            className="ui-button-primary h-12 w-full"
          >
            {sending ? copy.sending : copy.sendCode}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-5">
          <div className="space-y-4">
            <label htmlFor="code" className="text-xs font-medium text-[var(--text-primary)]">
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
              className="ui-input h-14 w-full text-center tracking-[0.2em]"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="password" className="text-xs font-medium text-[var(--text-primary)]">
              {copy.newPasswordLabel}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder={copy.newPasswordPlaceholder}
              className="ui-input h-14 w-full"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-[var(--text-primary)]">
              {copy.confirmPasswordLabel}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder={copy.confirmPasswordPlaceholder}
              className="ui-input h-14 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={verifying}
            className="ui-button-primary h-12 w-full"
          >
            {verifying ? copy.resetting : copy.resetPassword}
          </button>
        </form>
      )}

      {message ? <p className="select-none text-xs text-[var(--text-primary)]">{message}</p> : null}
      {error ? <p className="select-none text-xs text-[var(--text-primary)]">{error}</p> : null}
      <p className="select-none text-center text-xs leading-none text-[var(--text-secondary)]">
        {copy.rememberPassword}{" "}
        <Link href="/login" className="font-semibold text-[var(--text-primary)] transition hover:opacity-80">
          {copy.signIn}
        </Link>
      </p>
    </div>
  );
}
