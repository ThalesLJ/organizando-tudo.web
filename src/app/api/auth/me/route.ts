import { getAuthenticatedUserFromCookies } from "@/lib/auth";
import { okJson, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  const user = await getAuthenticatedUserFromCookies();
  if (!user) {
    return unauthorized();
  }

  return okJson({
    success: true,
    user: {
      username: user.username,
      email: user.email,
    },
  });
}
