import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function EditNotePage() {
  await requireAuthenticatedUser();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-zinc-900">Editar nota</h1>
      <p className="text-zinc-600">Rota privada pronta para edição de notas.</p>
    </section>
  );
}
