import { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalAuthRoute } from "@/lib/external-api";
import { badRequest, okJson, serverError, unauthorized, parseJsonBody } from "@/lib/http";

export const runtime = "nodejs";

type UpdateNotePayload = {
  title?: string;
  content?: string;
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

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get(authConfig.cookieName)?.value;

    const publicResponse = await fetch(getExternalAuthRoute(`/api/notes/public/${id}`), {
      method: "GET",
      cache: "no-store",
    });
    const publicData = await publicResponse.json();
    if (publicResponse.ok && publicData?.success) {
      return okJson({
        success: true,
        data: publicData?.data,
      });
    }

    if (!token) {
      return unauthorized("Nota privada exige sessão ativa");
    }

    const externalResponse = await fetch(getExternalAuthRoute(`/api/notes/${id}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao obter nota"));
    }

    return okJson({
      success: true,
      data: externalData?.data,
    });
  } catch {
    return serverError();
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const body = await parseJsonBody<UpdateNotePayload>(request);
    if (!body) {
      return badRequest("Dados da nota inválidos");
    }

    const payload: UpdateNotePayload = {};
    if (typeof body.title === "string") {
      payload.title = body.title.trim();
    }
    if (typeof body.content === "string") {
      payload.content = body.content.trim();
    }
    if (typeof body.isPublic === "boolean") {
      payload.isPublic = body.isPublic;
    }

    if (Object.keys(payload).length === 0) {
      return badRequest("Nenhum campo para atualizar");
    }

    const { id } = await context.params;
    const externalResponse = await fetch(getExternalAuthRoute(`/api/notes/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao atualizar nota"));
    }

    return okJson({
      success: true,
      data: externalData?.data,
    });
  } catch {
    return serverError();
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const { id } = await context.params;
    const externalResponse = await fetch(getExternalAuthRoute(`/api/notes/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao excluir nota"));
    }

    return okJson({
      success: true,
    });
  } catch {
    return serverError();
  }
}
