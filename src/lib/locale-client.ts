"use client";

import { useEffect, useState } from "react";
import { AppLocale, getMessages, normalizeLocale } from "@/lib/messages";

const LOCALE_EVENT = "app-locale-change";

export function readLocaleFromCookie(): AppLocale {
  if (typeof document === "undefined") {
    return "en";
  }
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  const locale = decodeURIComponent(match?.[1] ?? "en");
  return normalizeLocale(locale);
}

export function writeLocale(nextLocale: AppLocale) {
  document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = nextLocale;
  window.dispatchEvent(new CustomEvent(LOCALE_EVENT, { detail: nextLocale }));
}

export function useLocaleMessages() {
  const [locale, setLocale] = useState<AppLocale>(() => readLocaleFromCookie());

  useEffect(() => {
    function handleLocaleChange(event: Event) {
      const customEvent = event as CustomEvent<AppLocale>;
      setLocale(normalizeLocale(customEvent.detail));
    }

    window.addEventListener(LOCALE_EVENT, handleLocaleChange);
    return () => {
      window.removeEventListener(LOCALE_EVENT, handleLocaleChange);
    };
  }, []);

  return {
    locale,
    messages: getMessages(locale),
  };
}
