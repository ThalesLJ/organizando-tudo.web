"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLocale } from "@/lib/messages";
import { useLocaleMessages, writeLocale } from "@/lib/locale-client";

type UserPreferences = {
  language: AppLocale;
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

const DEFAULT_COLORS: ColorsPayload = {
  backgroundPrimary: "#f8fafc",
  backgroundSecondary: "#ffffff",
  textPrimary: "#18181b",
  textSecondary: "#52525b",
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
  const router = useRouter();
  const { messages } = useLocaleMessages();
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingColors, setIsSavingColors] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<AppLocale>("en");
  const [colors, setColors] = useState<ColorsPayload>(DEFAULT_COLORS);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/user", { cache: "no-store" });
        const data = (await response.json()) as UserResponse;
        if (!response.ok || !data.success) {
          throw new Error(messages.settings.loadError);
        }

        const prefs = data.user.preferences;
        if (prefs?.language && ["en", "pt", "es"].includes(prefs.language)) {
          setLanguage(prefs.language);
        }

        const loadedColors = {
          backgroundPrimary: prefs?.colors?.backgroundPrimary ?? DEFAULT_COLORS.backgroundPrimary,
          backgroundSecondary: prefs?.colors?.backgroundSecondary ?? DEFAULT_COLORS.backgroundSecondary,
          textPrimary: prefs?.colors?.textPrimary ?? DEFAULT_COLORS.textPrimary,
          textSecondary: prefs?.colors?.textSecondary ?? DEFAULT_COLORS.textSecondary,
        };

        setColors(loadedColors);
        applyColors(loadedColors);
      } catch (loadError) {
        setError(getErrorMessage(loadError, messages.settings.loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [messages.settings.loadError]);

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
        throw new Error(getErrorMessage(data.error, messages.settings.saveColorsError));
      }

      applyColors(colors);
      setMessage(messages.settings.colorsSaved);
    } catch (saveError) {
      setError(getErrorMessage(saveError, messages.settings.saveColorsError));
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
        throw new Error(getErrorMessage(data.error, messages.settings.saveLanguageError));
      }

      writeLocale(language);
      setMessage(messages.settings.languageSaved);
      router.refresh();
    } catch (saveError) {
      setError(getErrorMessage(saveError, messages.settings.saveLanguageError));
    } finally {
      setIsSavingLanguage(false);
    }
  }

  async function handleResetColors() {
    setIsSavingColors(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/user/settings/colors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_COLORS),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, messages.settings.saveColorsError));
      }

      setColors(DEFAULT_COLORS);
      applyColors(DEFAULT_COLORS);
      setMessage(messages.settings.colorsReset);
    } catch (resetError) {
      setError(getErrorMessage(resetError, messages.settings.saveColorsError));
    } finally {
      setIsSavingColors(false);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">{messages.settings.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{messages.settings.subtitle}</p>
      </div>

      {isLoading ? <p className="text-sm text-[var(--text-secondary)]">{messages.settings.loading}</p> : null}
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <form onSubmit={handleSaveLanguage} className="space-y-3 rounded-md border border-zinc-200 p-4">
        <h2 className="text-lg font-medium">{messages.settings.languageTitle}</h2>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as AppLocale)}
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
            className="rounded-md border border-zinc-300/50 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] disabled:opacity-60"
          >
            {isSavingLanguage ? messages.settings.loading : messages.settings.saveLanguage}
          </button>
        </div>
      </form>

      <form onSubmit={handleSaveColors} className="space-y-3 rounded-md border border-zinc-200 p-4">
        <h2 className="text-lg font-medium">{messages.settings.colorsTitle}</h2>

        <label className="flex items-center justify-between gap-3 text-sm">
          {messages.settings.backgroundPrimary}
          <input
            type="color"
            value={colors.backgroundPrimary}
            onChange={(event) => setColors((current) => ({ ...current, backgroundPrimary: event.target.value }))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          {messages.settings.backgroundSecondary}
          <input
            type="color"
            value={colors.backgroundSecondary}
            onChange={(event) => setColors((current) => ({ ...current, backgroundSecondary: event.target.value }))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          {messages.settings.textPrimary}
          <input
            type="color"
            value={colors.textPrimary}
            onChange={(event) => setColors((current) => ({ ...current, textPrimary: event.target.value }))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 text-sm">
          {messages.settings.textSecondary}
          <input
            type="color"
            value={colors.textSecondary}
            onChange={(event) => setColors((current) => ({ ...current, textSecondary: event.target.value }))}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isSavingColors}
            className="rounded-md border border-zinc-300/50 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] disabled:opacity-60"
          >
            {isSavingColors ? messages.settings.loading : messages.settings.saveColors}
          </button>
          <button
            type="button"
            onClick={() => void handleResetColors()}
            disabled={isSavingColors}
            className="rounded-md border border-zinc-300/50 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] disabled:opacity-60"
          >
            {messages.settings.resetColors}
          </button>
        </div>
      </form>
    </section>
  );
}
