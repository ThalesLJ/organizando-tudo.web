"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLocale } from "@/lib/messages";
import { readLocaleFromCookie, writeLocale } from "@/lib/locale-client";

export function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<AppLocale>(() => {
    if (typeof document === "undefined") {
      return "en";
    }
    return readLocaleFromCookie();
  });

  async function handleChange(nextLocale: AppLocale) {
    setLocale(nextLocale);
    writeLocale(nextLocale);

    try {
      await fetch("/api/user/settings/language", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: nextLocale }),
      });
    } catch {}
    router.refresh();
  }

  return (
    <div className="fixed right-4 top-4 z-50 rounded-md border border-zinc-300/50 bg-[var(--bg-secondary)] px-2 py-1 shadow-sm backdrop-blur">
      <select
        suppressHydrationWarning
        value={locale}
        onChange={(event) => void handleChange(event.target.value as AppLocale)}
        className="rounded border border-zinc-300/50 bg-[var(--bg-secondary)] px-2 py-1 text-xs text-[var(--text-primary)]"
      >
        <option value="en">EN</option>
        <option value="pt">PT</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}
