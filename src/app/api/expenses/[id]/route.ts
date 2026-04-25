import { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalAuthRoute } from "@/lib/external-api";
import { badRequest, okJson, parseJsonBody, serverError, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

type UpdateExpensePayload = {
  budgetId?: string;
  name?: string;
  amount?: number;
  description?: string;
  color?: string;
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
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const { id } = await context.params;
    const externalResponse = await fetch(getExternalAuthRoute(`/api/expenses/${id}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao obter despesa"));
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

    const body = await parseJsonBody<UpdateExpensePayload>(request);
    if (!body) {
      return badRequest("Dados da despesa inválidos");
    }

    const payload: UpdateExpensePayload = {};
    if (typeof body.budgetId === "string") {
      payload.budgetId = body.budgetId.trim();
    }
    if (typeof body.name === "string") {
      payload.name = body.name.trim();
    }
    if (typeof body.amount === "number") {
      payload.amount = body.amount;
    }
    if (typeof body.description === "string") {
      payload.description = body.description.trim();
    }
    if (typeof body.color === "string") {
      payload.color = body.color.trim();
    }

    if (Object.keys(payload).length === 0) {
      return badRequest("Nenhum campo para atualizar");
    }

    const { id } = await context.params;
    const externalResponse = await fetch(getExternalAuthRoute(`/api/expenses/${id}`), {
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
      return badRequest(getErrorMessage(externalData?.error, "Falha ao atualizar despesa"));
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
    const externalResponse = await fetch(getExternalAuthRoute(`/api/expenses/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao excluir despesa"));
    }

    return okJson({ success: true });
  } catch {
    return serverError();
  }
}
