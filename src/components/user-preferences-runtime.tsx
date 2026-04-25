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
      } | null;
    } | null;
  };
};

function applyColors(colors?: {
  backgroundPrimary?: string;
  backgroundSecondary?: string;
  textPrimary?: string;
  textSecondary?: string;
} | null) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--bg-primary", colors?.backgroundPrimary ?? "#f8fafc");
  root.style.setProperty("--bg-secondary", colors?.backgroundSecondary ?? "#ffffff");
  root.style.setProperty("--text-primary", colors?.textPrimary ?? "#18181b");
  root.style.setProperty("--text-secondary", colors?.textSecondary ?? "#52525b");
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
