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
    <div className="fixed right-4 top-4 z-50 rounded-lg border border-white/10 bg-white/5 shadow-2xl shadow-black/50 backdrop-blur">
      <select
        suppressHydrationWarning
        value={locale}
        onChange={(event) => void handleChange(event.target.value as AppLocale)}
        className="h-9 rounded-lg border border-white/10 bg-black px-3 text-xs font-medium text-white outline-none focus:border-white/45"
      >
        <option value="en">EN</option>
        <option value="pt">PT</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}
