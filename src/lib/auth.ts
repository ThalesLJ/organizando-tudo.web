import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalUserApiUrl } from "@/lib/external-api";

type UserColors = {
  backgroundPrimary?: string;
  backgroundSecondary?: string;
  textPrimary?: string;
  textSecondary?: string;
  borderColor?: string;
  inputBackground?: string;
  headerBackground?: string;
  headerText?: string;
  primaryButtonBackground?: string;
  primaryButtonText?: string;
  secondaryButtonBackground?: string;
  secondaryButtonText?: string;
};

type ExternalUserApiResponse = {
  success?: boolean;
  data?: {
    username?: string;
    email?: string;
    preferences?: {
      language?: string;
      colors?: UserColors | null;
    };
  };
  user?: {
    username?: string;
    email?: string;
    preferences?: {
      language?: string;
      colors?: UserColors | null;
    };
  };
  username?: string;
  email?: string;
  preferences?: {
    language?: string;
    colors?: UserColors | null;
  };
};

function normalizeExternalUser(body: ExternalUserApiResponse) {
  const user = body?.data ?? body?.user ?? body;
  if (!user?.username) {
    return null;
  }

  return {
    username: String(user.username),
    email: user.email ? String(user.email) : "",
    preferences: {
      language: typeof user.preferences?.language === "string" ? user.preferences.language : "en",
      colors: user.preferences?.colors ?? null,
    },
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
