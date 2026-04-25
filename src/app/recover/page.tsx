import { RecoverForm } from "@/components/recover-form";

export default function RecoverPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-lg border border-zinc-200 bg-white p-6">
        <h1 className="mb-4 text-2xl font-semibold text-zinc-900">Recuperar senha</h1>
        <RecoverForm />
      </section>
    </main>
  );
}
