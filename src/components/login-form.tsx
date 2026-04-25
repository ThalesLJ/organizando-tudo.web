"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
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
    return "Falha ao autenticar";
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

    router.replace("/notes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="identifier" className="text-sm text-zinc-700">
          E-mail ou usuário
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm text-zinc-700">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" name="keepLoggedIn" className="h-4 w-4" />
        Manter conectado
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <div className="flex justify-between text-sm">
        <Link href="/register" className="text-zinc-700 hover:text-zinc-900">
          Criar conta
        </Link>
        <Link href="/recover" className="text-zinc-700 hover:text-zinc-900">
          Recuperar senha
        </Link>
      </div>
    </form>
  );
}
