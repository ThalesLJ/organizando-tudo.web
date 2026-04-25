import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-lg border border-zinc-200 bg-white p-6">
        <h1 className="mb-4 text-2xl font-semibold text-zinc-900">Criar conta</h1>
        <RegisterForm />
      </section>
    </main>
  );
}
