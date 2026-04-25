import Link from "next/link";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/logout-button";
import { requireAuthenticatedUser } from "@/lib/require-auth";
import { getMessages } from "@/lib/messages";

export default async function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  const m = getMessages(locale);
  const user = await requireAuthenticatedUser();
  const colors = user.preferences?.colors;
  const style = colors
    ? {
        ["--bg-primary" as string]: colors.backgroundPrimary ?? "#f8fafc",
        ["--bg-secondary" as string]: colors.backgroundSecondary ?? "#ffffff",
        ["--text-primary" as string]: colors.textPrimary ?? "#18181b",
        ["--text-secondary" as string]: colors.textSecondary ?? "#52525b",
      }
    : undefined;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]" style={style}>
      <header className="bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] border-b border-zinc-300/40">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-5 text-xs sm:text-sm">
            <span>{user.username}</span>
            <Link href="/dashboard" className="hover:underline">
              {m.nav.dashboard}
            </Link>
            <Link href="/financial" className="hover:underline">
              {m.nav.financial}
            </Link>
            <Link href="/notes" className="hover:underline">
              {m.nav.notes}
            </Link>
            <Link href="/settings" className="hover:underline">
              {m.nav.settings}
            </Link>
          </div>
          <LogoutButton label={m.nav.logout} />
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-3 py-4">
        <div className="rounded-md border border-zinc-300/40 bg-[var(--bg-secondary)] p-3 text-[var(--text-primary)]">{children}</div>
      </main>
    </div>
  );
}
