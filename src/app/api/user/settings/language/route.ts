import { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalAuthRoute } from "@/lib/external-api";
import { badRequest, okJson, parseJsonBody, serverError, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

type UpdateLanguagePayload = {
  language: "en" | "pt" | "es";
};

function getErrorMessage(error: unknown, fallback: string): string {
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
  return fallback;
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const body = await parseJsonBody<UpdateLanguagePayload>(request);
    if (!body || !["en", "pt", "es"].includes(body.language)) {
      return badRequest("Idioma inválido");
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/users/settings/language"), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ language: body.language }),
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao salvar idioma"));
    }

    const response = okJson({
      success: true,
      data: externalData?.data,
    });

    response.cookies.set("locale", body.language, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  } catch {
    return serverError();
  }
}
