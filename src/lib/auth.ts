import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalUserApiUrl } from "@/lib/external-api";

type ExternalUserApiResponse = {
  success?: boolean;
  data?: {
    username?: string;
    email?: string;
  };
  user?: {
    username?: string;
    email?: string;
  };
  username?: string;
  email?: string;
};

function normalizeExternalUser(body: ExternalUserApiResponse) {
  const user = body?.data ?? body?.user ?? body;
  if (!user?.username) {
    return null;
  }

  return {
    username: String(user.username),
    email: user.email ? String(user.email) : "",
  };
}

function getAuthCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(typeof maxAge === "number" ? { maxAge } : {}),
  };
}

export async function setAuthCookie(response: NextResponse, token: string, maxAge?: number) {
  response.cookies.set(authConfig.cookieName, token, getAuthCookieOptions(maxAge));
}

export async function clearAuthCookie(response: NextResponse) {
  response.cookies.set(authConfig.cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthenticatedUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.cookieName)?.value;
  if (!token) {
    return null;
  }
  try {
    const externalUserApiUrl = getExternalUserApiUrl();
    const response = await fetch(externalUserApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const body = (await response.json()) as ExternalUserApiResponse;
    return normalizeExternalUser(body);
  } catch {
    return null;
  }
}
