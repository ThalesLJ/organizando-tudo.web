import { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalAuthRoute } from "@/lib/external-api";
import { badRequest, okJson, parseJsonBody, serverError, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

type UpdateBudgetPayload = {
  name?: string;
  amount?: number;
  icon?: string;
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
    const externalResponse = await fetch(getExternalAuthRoute(`/api/budgets/${id}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao obter budget"));
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

    const body = await parseJsonBody<UpdateBudgetPayload>(request);
    if (!body) {
      return badRequest("Dados do budget inválidos");
    }

    const payload: UpdateBudgetPayload = {};
    if (typeof body.name === "string") {
      payload.name = body.name.trim();
    }
    if (typeof body.amount === "number") {
      payload.amount = body.amount;
    }
    if (typeof body.icon === "string") {
      payload.icon = body.icon.trim();
    }
    if (typeof body.color === "string") {
      payload.color = body.color.trim();
    }

    if (Object.keys(payload).length === 0) {
      return badRequest("Nenhum campo para atualizar");
    }

    const { id } = await context.params;
    const externalResponse = await fetch(getExternalAuthRoute(`/api/budgets/${id}`), {
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
      return badRequest(getErrorMessage(externalData?.error, "Falha ao atualizar budget"));
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
    const externalResponse = await fetch(getExternalAuthRoute(`/api/budgets/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao excluir budget"));
    }

    return okJson({ success: true });
  } catch {
    return serverError();
  }
}
