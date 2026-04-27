import { RecoverForm } from "@/components/recover-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { cookies } from "next/headers";
import { getMessages } from "@/lib/messages";

export default async function RecoverPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  const m = getMessages(locale);

  return (
    <AuthPageShell title={m.auth.recover.pageTitle}>
      <section className="w-full">
        <RecoverForm copy={m.auth.recover} />
      </section>
    </AuthPageShell>
  );
}
