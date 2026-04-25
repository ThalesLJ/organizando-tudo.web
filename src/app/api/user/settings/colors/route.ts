import { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalAuthRoute } from "@/lib/external-api";
import { badRequest, okJson, parseJsonBody, serverError, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

type UpdateColorsPayload = {
  backgroundPrimary?: string;
  backgroundSecondary?: string;
  textPrimary?: string;
  textSecondary?: string;
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

    const body = await parseJsonBody<UpdateColorsPayload>(request);
    if (!body) {
      return badRequest("Dados de cor inválidos");
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/users/settings/colors"), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao salvar cores"));
    }

    return okJson({
      success: true,
      data: externalData?.data,
    });
  } catch {
    return serverError();
  }
}
