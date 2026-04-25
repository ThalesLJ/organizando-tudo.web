"use client";

import { useState } from "react";

type LocaleOption = "en" | "pt" | "es";

function readLocaleFromCookie(): LocaleOption {
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  const locale = decodeURIComponent(match?.[1] ?? "en");
  if (locale === "pt" || locale === "es") {
    return locale;
  }
  return "en";
}

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<LocaleOption>(() => {
    if (typeof document === "undefined") {
      return "en";
    }
    return readLocaleFromCookie();
  });

  async function handleChange(nextLocale: LocaleOption) {
    setLocale(nextLocale);
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;

    try {
      await fetch("/api/user/settings/language", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: nextLocale }),
      });
    } catch {}
  }

  return (
    <div className="fixed right-4 top-4 z-50 rounded-md border border-zinc-300 bg-white/90 px-2 py-1 shadow-sm backdrop-blur">
      <select
        suppressHydrationWarning
        value={locale}
        onChange={(event) => void handleChange(event.target.value as LocaleOption)}
        className="rounded border border-zinc-300 px-2 py-1 text-xs"
      >
        <option value="en">EN</option>
        <option value="pt">PT</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}
