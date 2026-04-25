import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAuthenticatedUser();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <header className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-col">
          <span className="text-sm text-zinc-500">Usuário autenticado</span>
          <strong className="text-zinc-900">{user.username}</strong>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/notes" className="text-sm text-zinc-700 hover:text-zinc-950">
            Notas
          </Link>
          <Link href="/add-note" className="text-sm text-zinc-700 hover:text-zinc-950">
            Nova nota
          </Link>
          <Link href="/edit-note" className="text-sm text-zinc-700 hover:text-zinc-950">
            Editar nota
          </Link>
          <Link href="/settings" className="text-sm text-zinc-700 hover:text-zinc-950">
            Configurações
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main className="rounded-lg border border-zinc-200 bg-white p-6">{children}</main>
    </div>
  );
}
