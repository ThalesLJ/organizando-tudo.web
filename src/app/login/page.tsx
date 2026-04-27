import { LoginForm } from "@/components/login-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { cookies } from "next/headers";
import { getMessages } from "@/lib/messages";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  const m = getMessages(locale);

  return (
    <AuthPageShell title={m.auth.brandTitle} showSocialLinks>
      <section className="w-full">
        <LoginForm copy={m.auth.login} />
      </section>
    </AuthPageShell>
  );
}
