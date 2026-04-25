import { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalAuthRoute } from "@/lib/external-api";
import { badRequest, okJson, serverError, unauthorized, parseJsonBody } from "@/lib/http";

export const runtime = "nodejs";

type NotePayload = {
  title: string;
  content: string;
  isPublic?: boolean;
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

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/notes"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao listar notas"));
    }

    return okJson({
      success: true,
      data: externalData?.data ?? [],
    });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const body = await parseJsonBody<NotePayload>(request);
    if (!body || !body.title?.trim() || !body.content?.trim()) {
      return badRequest("Dados da nota inválidos");
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/notes"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: body.title.trim(),
        content: body.content.trim(),
        isPublic: Boolean(body.isPublic),
      }),
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao criar nota"));
    }

    return okJson({
      success: true,
      data: externalData?.data,
    }, 201);
  } catch {
    return serverError();
  }
}
