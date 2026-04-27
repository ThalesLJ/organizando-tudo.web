import { RegisterForm } from "@/components/register-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { cookies } from "next/headers";
import { getMessages } from "@/lib/messages";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  const m = getMessages(locale);

  return (
    <AuthPageShell title={m.auth.register.pageTitle} showSocialLinks>
      <section className="w-full">
        <RegisterForm copy={m.auth.register} />
      </section>
    </AuthPageShell>
  );
}
