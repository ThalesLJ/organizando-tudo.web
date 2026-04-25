"use client";

import { FormEvent, useEffect, useState } from "react";

type UserPreferences = {
  language: "en" | "pt" | "es";
  colors: {
    backgroundPrimary?: string;
    backgroundSecondary?: string;
    textPrimary?: string;
    textSecondary?: string;
  } | null;
};

type UserResponse = {
  success: boolean;
  user: {
    username: string;
    email: string;
    preferences?: UserPreferences;
  };
};

type ColorsPayload = {
  backgroundPrimary: string;
  backgroundSecondary: string;
  textPrimary: string;
  textSecondary: string;
};

function applyColors(colors: Partial<ColorsPayload>) {
  const root = document.documentElement;
  if (colors.backgroundPrimary) {
    root.style.setProperty("--bg-primary", colors.backgroundPrimary);
  }
  if (colors.backgroundSecondary) {
    root.style.setProperty("--bg-secondary", colors.backgroundSecondary);
  }
  if (colors.textPrimary) {
    root.style.setProperty("--text-primary", colors.textPrimary);
  }
  if (colors.textSecondary) {
    root.style.setProperty("--text-secondary", colors.textSecondary);
  }
}

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

export function SettingsPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingColors, setIsSavingColors] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<"en" | "pt" | "es">("en");
  const [colors, setColors] = useState<ColorsPayload>({
    backgroundPrimary: "#f8fafc",
    backgroundSecondary: "#ffffff",
    textPrimary: "#18181b",
    textSecondary: "#52525b",
  });

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/user", { cache: "no-store" });
        const data = (await response.json()) as UserResponse;
        if (!response.ok || !data.success) {
          throw new Error("Falha ao carregar configurações");
        }

        const prefs = data.user.preferences;
        if (prefs?.language && ["en", "pt", "es"].includes(prefs.language)) {
          setLanguage(prefs.language);
        }

        const loadedColors = {
          backgroundPrimary: prefs?.colors?.backgroundPrimary ?? "#f8fafc",
          backgroundSecondary: prefs?.colors?.backgroundSecondary ?? "#ffffff",
          textPrimary: prefs?.colors?.textPrimary ?? "#18181b",
          textSecondary: prefs?.colors?.textSecondary ?? "#52525b",
        };

        setColors(loadedColors);
        applyColors(loadedColors);
      } catch (loadError) {
        setError(getErrorMessage(loadError, "Falha ao carregar configurações"));
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  async function handleSaveColors(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingColors(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/user/settings/colors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colors),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, "Falha ao salvar cores"));
      }

      applyColors(colors);
      setMessage("Cores atualizadas com sucesso.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Falha ao salvar cores"));
    } finally {
      setIsSavingColors(false);
    }
  }

  async function handleSaveLanguage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingLanguage(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/user/settings/language", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, "Falha ao salvar idioma"));
      }

      document.cookie = `locale=${language}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = language;
      setMessage("Idioma atualizado com sucesso.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Falha ao salvar idioma"));
    } finally {
      setIsSavingLanguage(false);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-zinc-500">Ajuste idioma e cores da interface.</p>
      </div>

      {isLoading ? <p className="text-sm text-zinc-500">Carregando...</p> : null}
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <form onSubmit={handleSaveLanguage} className="space-y-3 rounded-md border border-zinc-200 p-4">
        <h2 className="text-lg font-medium">Idioma</h2>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as "en" | "pt" | "es")}
          className="rounded-md border border-zinc-300 px-3 py-2"
        >
          <option value="en">English</option>
          <option value="pt">Português</option>
          <option value="es">Español</option>
        </select>
        <div>
          <button
            type="submit"
            disabled={isSavingLanguage}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSavingLanguage ? "Salvando..." : "Salvar idioma"}
          </button>
        </div>
      </form>

      <form onSubmit={handleSaveColors} className="space-y-3 rounded-md border border-zinc-200 p-4">
        <h2 className="text-lg font-medium">Cores</h2>

        <label className="flex items-center justify-between gap-3 text-sm">
          Fundo primário
          <input
            type="color"
            value={colors.backgroundPrimary}
            onChange={(event) => setColors((current) => ({ ...current, backgroundPrimary: event.target.value }))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          Fundo secundário
          <input
            type="color"
            value={colors.backgroundSecondary}
            onChange={(event) => setColors((current) => ({ ...current, backgroundSecondary: event.target.value }))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          Texto primário
          <input
            type="color"
            value={colors.textPrimary}
            onChange={(event) => setColors((current) => ({ ...current, textPrimary: event.target.value }))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          Texto secundário
          <input
            type="color"
            value={colors.textSecondary}
            onChange={(event) => setColors((current) => ({ ...current, textSecondary: event.target.value }))}
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={isSavingColors}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSavingColors ? "Salvando..." : "Salvar cores"}
          </button>
        </div>
      </form>
    </section>
  );
}
