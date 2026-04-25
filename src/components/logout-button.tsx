"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
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
      className="rounded border border-[#b88f7f] bg-[#8f6453] px-2 py-1 text-xs text-white disabled:opacity-60"
      title="Sair"
    >
      {loading ? "..." : "⎋"}
    </button>
  );
}
