import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-zinc-900">Configurações</h1>
      <p className="text-zinc-600">Conta autenticada: {user.email}</p>
    </section>
  );
}
