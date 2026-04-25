"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function RecoverForm() {
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
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
      setError(data.error || "Falha ao enviar código");
      setSending(false);
      return;
    }

    setMessage("Se o e-mail existir, o código foi enviado.");
    setSending(false);
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifying(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      code: String(formData.get("code") || ""),
      password: String(formData.get("password") || ""),
    };

    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      setError(data.error || "Falha ao redefinir senha");
      setVerifying(false);
      return;
    }

    setMessage("Senha redefinida com sucesso.");
    setVerifying(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSendCode} className="space-y-3 rounded-md border border-zinc-200 p-4">
        <h2 className="font-medium text-zinc-900">1) Solicitar código</h2>
        <input
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-60"
        >
          {sending ? "Enviando..." : "Enviar código"}
        </button>
      </form>

      <form onSubmit={handleVerifyCode} className="space-y-3 rounded-md border border-zinc-200 p-4">
        <h2 className="font-medium text-zinc-900">2) Validar código e redefinir senha</h2>
        <input
          name="code"
          type="text"
          required
          minLength={6}
          maxLength={6}
          placeholder="123456"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Nova senha"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={verifying}
          className="rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-60"
        >
          {verifying ? "Validando..." : "Redefinir senha"}
        </button>
      </form>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="text-sm">
        <Link href="/login" className="text-zinc-700 hover:text-zinc-900">
          Voltar para login
        </Link>
      </div>
    </div>
  );
}
