"use client";

import { useEffect } from "react";
import { normalizeLocale } from "@/lib/messages";
import { writeLocale } from "@/lib/locale-client";

type UserPreferencesResponse = {
  success?: boolean;
  user?: {
    preferences?: {
      language?: string;
      colors?: {
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
    } | null;
  };
};

function applyColors(colors?: {
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
} | null) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--bg-primary", colors?.backgroundPrimary ?? "#ffe3d5");
  root.style.setProperty("--bg-secondary", colors?.backgroundSecondary ?? "#00000000");
  root.style.setProperty("--text-primary", colors?.textPrimary ?? "#946a56");
  root.style.setProperty("--text-secondary", colors?.textSecondary ?? "#946a56");
  root.style.setProperty("--border-color", colors?.borderColor ?? "#946a56");
  root.style.setProperty("--input-background", colors?.inputBackground ?? "#00000000");
  root.style.setProperty("--header-background", colors?.headerBackground ?? "#946a56");
  root.style.setProperty("--header-text", colors?.headerText ?? "#ffffff");
  root.style.setProperty("--primary-button-background", colors?.primaryButtonBackground ?? "#946a56");
  root.style.setProperty("--primary-button-text", colors?.primaryButtonText ?? "#ffffff");
  root.style.setProperty("--secondary-button-background", colors?.secondaryButtonBackground ?? "#00000000");
  root.style.setProperty("--secondary-button-text", colors?.secondaryButtonText ?? "#946a56");
  root.style.setProperty("--language-switcher-background", colors?.languageSwitcherBackground ?? "#ffffff");
  root.style.setProperty("--language-switcher-text", colors?.languageSwitcherText ?? "#5c4033");
  root.style.setProperty("--language-switcher-border", colors?.languageSwitcherBorder ?? "#946a56");
}

export function UserPreferencesRuntime() {
  useEffect(() => {
    let isCancelled = false;

    async function loadPreferences() {
      try {
        const response = await fetch("/api/user", { cache: "no-store" });
        if (!response.ok) {
          applyColors(null);
          return;
        }

        const data = (await response.json()) as UserPreferencesResponse;
        if (!data.success) {
          applyColors(null);
          return;
        }

        if (isCancelled) {
          return;
        }

        const language = normalizeLocale(data.user?.preferences?.language);
        const colors = data.user?.preferences?.colors ?? null;
        applyColors(colors);
        writeLocale(language);
      } catch {
        applyColors(null);
      }
    }

    void loadPreferences();
    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
}
