import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
    <div className="min-h-screen bg-[#ecd8cc]" style={style}>
      <header className="bg-[#8f6453] px-3 py-2 text-sm text-white">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-5 text-xs sm:text-sm">
            <span>{user.username}</span>
            <Link href="/notes" className="hover:underline">
              Notes
            </Link>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
          </div>
          <LogoutButton />
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-3 py-4">
        <div className="rounded-md border border-[#c4a293] bg-[#ecd8cc] p-3">{children}</div>
      </main>
    </div>
  );
}
