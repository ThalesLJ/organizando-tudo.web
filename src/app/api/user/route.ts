import { authConfig } from "@/lib/auth-config";
import { getExternalUserApiUrl } from "@/lib/external-api";
import { okJson, unauthorized, serverError } from "@/lib/http";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const externalResponse = await fetch(getExternalUserApiUrl(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!externalResponse.ok) {
      return unauthorized();
    }

    const externalData = await externalResponse.json();
    const externalUser = externalData?.data ?? externalData?.user ?? externalData;
    if (!externalUser?.username) {
      return unauthorized();
    }

    return okJson({
      success: true,
      user: {
        username: String(externalUser.username),
        email: externalUser.email ? String(externalUser.email) : "",
        preferences: externalUser.preferences ?? null,
      },
    });
  } catch {
    return serverError();
  }
}
