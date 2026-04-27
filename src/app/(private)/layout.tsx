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
        ["--bg-primary" as string]: colors.backgroundPrimary ?? "#ffe3d5",
        ["--bg-secondary" as string]: colors.backgroundSecondary ?? "#00000000",
        ["--text-primary" as string]: colors.textPrimary ?? "#946a56",
        ["--text-secondary" as string]: colors.textSecondary ?? "#946a56",
        ["--border-color" as string]: colors.borderColor ?? "#946a56",
        ["--input-background" as string]: colors.inputBackground ?? "#00000000",
        ["--header-background" as string]: colors.headerBackground ?? "#946a56",
        ["--header-text" as string]: colors.headerText ?? "#ffffff",
        ["--primary-button-background" as string]: colors.primaryButtonBackground ?? "#946a56",
        ["--primary-button-text" as string]: colors.primaryButtonText ?? "#ffffff",
        ["--secondary-button-background" as string]: colors.secondaryButtonBackground ?? "#00000000",
        ["--secondary-button-text" as string]: colors.secondaryButtonText ?? "#946a56",
      }
    : undefined;

  return (
    <div className="ui-shell flex min-h-screen flex-col" style={style}>
      <header className="shrink-0 border-b border-[var(--header-background)] bg-[var(--header-background)] px-4 py-4 text-sm text-[var(--header-text)]">
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <span className="select-none rounded-lg border border-[var(--header-text)] bg-transparent px-3 py-2 font-medium">{user.username}</span>
            <Link href="/dashboard" className="text-[var(--header-text)] transition hover:opacity-80">
              {m.nav.dashboard}
            </Link>
            <Link href="/financial" className="text-[var(--header-text)] transition hover:opacity-80">
              {m.nav.financial}
            </Link>
            <Link href="/notes" className="text-[var(--header-text)] transition hover:opacity-80">
              {m.nav.notes}
            </Link>
            <Link href="/settings" className="text-[var(--header-text)] transition hover:opacity-80">
              {m.nav.settings}
            </Link>
          </div>
          <LogoutButton label={m.nav.logout} />
        </nav>
      </header>
      <main className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-6">
        <div className="ui-panel relative flex min-h-0 flex-1 flex-col p-5 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
