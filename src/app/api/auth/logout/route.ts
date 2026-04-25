import { cookies } from "next/headers";
import { authConfig } from "@/lib/auth-config";
import { clearAuthCookie } from "@/lib/auth";
import { getExternalAuthRoute } from "@/lib/external-api";
import { okJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.cookieName)?.value;

  if (token) {
    try {
      await fetch(getExternalAuthRoute("/api/auth/logout"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
    } catch {}
  }

  const response = okJson({ success: true });
  await clearAuthCookie(response);
  return response;
}
