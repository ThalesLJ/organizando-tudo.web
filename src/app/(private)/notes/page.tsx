import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function NotesPage() {
  const user = await requireAuthenticatedUser();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-zinc-900">Notas</h1>
      <p className="text-zinc-600">
        Sessão ativa para <strong>{user.username}</strong>. Esta rota exige token válido e sessão válida no banco.
      </p>
    </section>
  );
}
