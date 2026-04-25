import { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth-config";
import { getExternalAuthRoute } from "@/lib/external-api";
import { badRequest, okJson, parseJsonBody, serverError, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

type ExpensePayload = {
  budgetId: string;
  name: string;
  amount: number;
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

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(authConfig.cookieName)?.value;
    if (!token) {
      return unauthorized();
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/expenses"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao listar despesas"));
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

    const body = await parseJsonBody<ExpensePayload>(request);
    if (!body || !body.budgetId?.trim() || !body.name?.trim() || typeof body.amount !== "number") {
      return badRequest("Dados da despesa inválidos");
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/expenses"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        budgetId: body.budgetId.trim(),
        name: body.name.trim(),
        amount: body.amount,
        description: typeof body.description === "string" ? body.description.trim() : "",
        color: typeof body.color === "string" ? body.color.trim() : undefined,
      }),
      cache: "no-store",
    });

    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(getErrorMessage(externalData?.error, "Falha ao criar despesa"));
    }

    return okJson({
      success: true,
      data: externalData?.data,
    }, 201);
  } catch {
    return serverError();
  }
}
