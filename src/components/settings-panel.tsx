"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppLoading } from "@/components/app-loading";
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
    borderColor?: string;
    inputBackground?: string;
    headerBackground?: string;
    headerText?: string;
    primaryButtonBackground?: string;
    primaryButtonText?: string;
    secondaryButtonBackground?: string;
    secondaryButtonText?: string;
    languageSwitcherBackground?: string;
    languageSwitcherText?: string;
    languageSwitcherBorder?: string;
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
  borderColor: string;
  inputBackground: string;
  headerBackground: string;
  headerText: string;
  primaryButtonBackground: string;
  primaryButtonText: string;
  secondaryButtonBackground: string;
  secondaryButtonText: string;
  languageSwitcherBackground: string;
  languageSwitcherText: string;
  languageSwitcherBorder: string;
};

const DEFAULT_COLORS: ColorsPayload = {
  backgroundPrimary: "#ffe3d5",
  backgroundSecondary: "#00000000",
  textPrimary: "#946a56",
  textSecondary: "#946a56",
  borderColor: "#946a56",
  inputBackground: "#00000000",
  headerBackground: "#946a56",
  headerText: "#ffffff",
  primaryButtonBackground: "#946a56",
  primaryButtonText: "#ffffff",
  secondaryButtonBackground: "#00000000",
  secondaryButtonText: "#946a56",
  languageSwitcherBackground: "#ffffff",
  languageSwitcherText: "#5c4033",
  languageSwitcherBorder: "#946a56",
};

const DARK_MODE_COLORS: ColorsPayload = {
  backgroundPrimary: "#252018",
  backgroundSecondary: "#00000000",
  textPrimary: "#ebe2d9",
  textSecondary: "#c4b8ab",
  borderColor: "#8a7668",
  inputBackground: "#362f28",
  headerBackground: "#4d4036",
  headerText: "#faf6f2",
  primaryButtonBackground: "#c9a990",
  primaryButtonText: "#231c17",
  secondaryButtonBackground: "#00000000",
  secondaryButtonText: "#ebe2d9",
  languageSwitcherBackground: "#362f28",
  languageSwitcherText: "#ebe2d9",
  languageSwitcherBorder: "#8a7668",
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
  if (colors.borderColor) {
    root.style.setProperty("--border-color", colors.borderColor);
  }
  if (colors.inputBackground) {
    root.style.setProperty("--input-background", colors.inputBackground);
  }
  if (colors.headerBackground) {
    root.style.setProperty("--header-background", colors.headerBackground);
  }
  if (colors.headerText) {
    root.style.setProperty("--header-text", colors.headerText);
  }
  if (colors.primaryButtonBackground) {
    root.style.setProperty("--primary-button-background", colors.primaryButtonBackground);
  }
  if (colors.primaryButtonText) {
    root.style.setProperty("--primary-button-text", colors.primaryButtonText);
  }
  if (colors.secondaryButtonBackground) {
    root.style.setProperty("--secondary-button-background", colors.secondaryButtonBackground);
  }
  if (colors.secondaryButtonText) {
    root.style.setProperty("--secondary-button-text", colors.secondaryButtonText);
  }
  if (colors.languageSwitcherBackground) {
    root.style.setProperty("--language-switcher-background", colors.languageSwitcherBackground);
  }
  if (colors.languageSwitcherText) {
    root.style.setProperty("--language-switcher-text", colors.languageSwitcherText);
  }
  if (colors.languageSwitcherBorder) {
    root.style.setProperty("--language-switcher-border", colors.languageSwitcherBorder);
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
          borderColor: prefs?.colors?.borderColor ?? DEFAULT_COLORS.borderColor,
          inputBackground: prefs?.colors?.inputBackground ?? DEFAULT_COLORS.inputBackground,
          headerBackground: prefs?.colors?.headerBackground ?? DEFAULT_COLORS.headerBackground,
          headerText: prefs?.colors?.headerText ?? DEFAULT_COLORS.headerText,
          primaryButtonBackground: prefs?.colors?.primaryButtonBackground ?? DEFAULT_COLORS.primaryButtonBackground,
          primaryButtonText: prefs?.colors?.primaryButtonText ?? DEFAULT_COLORS.primaryButtonText,
          secondaryButtonBackground: prefs?.colors?.secondaryButtonBackground ?? DEFAULT_COLORS.secondaryButtonBackground,
          secondaryButtonText: prefs?.colors?.secondaryButtonText ?? DEFAULT_COLORS.secondaryButtonText,
          languageSwitcherBackground:
            prefs?.colors?.languageSwitcherBackground ?? DEFAULT_COLORS.languageSwitcherBackground,
          languageSwitcherText: prefs?.colors?.languageSwitcherText ?? DEFAULT_COLORS.languageSwitcherText,
          languageSwitcherBorder: prefs?.colors?.languageSwitcherBorder ?? DEFAULT_COLORS.languageSwitcherBorder,
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

  async function handleDarkModeColors() {
    setIsSavingColors(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/user/settings/colors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DARK_MODE_COLORS),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data.error, messages.settings.saveColorsError));
      }

      setColors(DARK_MODE_COLORS);
      applyColors(DARK_MODE_COLORS);
      setMessage(messages.settings.darkModeApplied);
      router.refresh();
    } catch (darkError) {
      setError(getErrorMessage(darkError, messages.settings.saveColorsError));
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

  if (isLoading) {
    return <AppLoading label={messages.settings.loading} />;
  }

  const colorFields: Array<{ key: keyof ColorsPayload; label: string }> = [
    { key: "backgroundPrimary", label: messages.settings.backgroundPrimary },
    { key: "backgroundSecondary", label: messages.settings.backgroundSecondary },
    { key: "textPrimary", label: messages.settings.textPrimary },
    { key: "textSecondary", label: messages.settings.textSecondary },
    { key: "borderColor", label: messages.settings.borderColor },
    { key: "inputBackground", label: messages.settings.inputBackground },
    { key: "headerBackground", label: messages.settings.headerBackground },
    { key: "headerText", label: messages.settings.headerText },
    { key: "primaryButtonBackground", label: messages.settings.primaryButtonBackground },
    { key: "primaryButtonText", label: messages.settings.primaryButtonText },
    { key: "secondaryButtonBackground", label: messages.settings.secondaryButtonBackground },
    { key: "secondaryButtonText", label: messages.settings.secondaryButtonText },
    { key: "languageSwitcherBackground", label: messages.settings.languageSwitcherBackground },
    { key: "languageSwitcherText", label: messages.settings.languageSwitcherText },
    { key: "languageSwitcherBorder", label: messages.settings.languageSwitcherBorder },
  ];

  return (
    <section className="settings-page space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">{messages.settings.title}</h1>
        <p className="ui-muted select-none text-sm">{messages.settings.subtitle}</p>
      </div>

      {error ? <p className="ui-error">{error}</p> : null}
      {message ? <p className="ui-success">{message}</p> : null}

      <div className="ui-card space-y-8 p-5 sm:p-6">
        <form onSubmit={handleSaveLanguage} className="space-y-4">
          <h2 className="text-lg font-medium">{messages.settings.languageTitle}</h2>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as AppLocale)}
            className="ui-input max-w-md"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
          </select>
          <div>
            <button
              type="submit"
              disabled={isSavingLanguage}
              className="ui-button-primary"
            >
              {isSavingLanguage ? messages.settings.loading : messages.settings.saveLanguage}
            </button>
          </div>
        </form>

        <form onSubmit={handleSaveColors} className="space-y-4 border-t border-[var(--border-color)] pt-8">
          <h2 className="text-lg font-medium">{messages.settings.colorsTitle}</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colorFields.map((field) => (
              <label
                key={field.key}
                className="flex min-w-0 items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 pr-2 leading-snug">{field.label}</span>
                <input
                  type="color"
                  value={colors[field.key]}
                  onChange={(event) => setColors((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="h-10 w-20 shrink-0 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] p-1"
                />
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSavingColors}
              className="ui-button-primary"
            >
              {isSavingColors ? messages.settings.loading : messages.settings.saveColors}
            </button>
            <button
              type="button"
              onClick={() => void handleResetColors()}
              disabled={isSavingColors}
              className="ui-button-secondary"
            >
              {messages.settings.resetColors}
            </button>
            <button
              type="button"
              onClick={() => void handleDarkModeColors()}
              disabled={isSavingColors}
              className="ui-button-secondary"
            >
              {messages.settings.darkMode}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
