import { setAuthCookie } from "@/lib/auth";
import { getExternalAuthRoute } from "@/lib/external-api";
import { parseJsonBody, badRequest, okJson, serverError } from "@/lib/http";
import { loginSchema } from "@/lib/schemas";

export const runtime = "nodejs";
const defaultSessionSeconds = 8 * 60 * 60;
const keepLoggedInSessionSeconds = 30 * 24 * 60 * 60;

type LoginRequest = {
  identifier: string;
  password: string;
  keepLoggedIn?: boolean;
};

type ExternalLoginResponse = {
  success?: boolean;
  data?: {
    token?: string;
    user?: {
      username?: string;
    };
  };
  error?: unknown;
};

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
    if (Array.isArray(message)) {
      return message.join(", ");
    }
  }
  return "Credenciais inválidas";
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<LoginRequest>(request);
    if (!body) {
      return badRequest("Corpo da requisição inválido");
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Dados de login inválidos");
    }

    const loginIdentifier = parsed.data.identifier.trim();
    const credentialsPayload = loginIdentifier.includes("@")
      ? {
          email: loginIdentifier,
          password: parsed.data.password,
          keepLoggedIn: parsed.data.keepLoggedIn ?? false,
        }
      : {
          username: loginIdentifier,
          password: parsed.data.password,
          keepLoggedIn: parsed.data.keepLoggedIn ?? false,
        };

    const externalResponse = await fetch(getExternalAuthRoute("/api/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentialsPayload),
      cache: "no-store",
    });
    const externalData = (await externalResponse.json()) as ExternalLoginResponse;
    const externalToken = externalData?.data?.token;
    const externalUsername = externalData?.data?.user?.username;
    if (!externalResponse.ok || !externalData?.success || !externalToken) {
      return badRequest(getErrorMessage(externalData?.error));
    }

    const response = okJson({
      success: true,
      token: externalToken,
      user: {
        username: externalUsername || "",
      },
    });
    await setAuthCookie(
      response,
      externalToken,
      parsed.data.keepLoggedIn ? keepLoggedInSessionSeconds : defaultSessionSeconds,
    );
    return response;
  } catch {
    return serverError();
  }
}
