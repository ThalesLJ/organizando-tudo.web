"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  label: string;
};

export function LogoutButton({ label }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-fit cursor-pointer border-0 bg-transparent p-0 text-left text-xs text-[var(--header-text)] transition hover:opacity-80 disabled:opacity-60 sm:text-sm"
      title={label}
    >
      {loading ? "..." : label}
    </button>
  );
}
