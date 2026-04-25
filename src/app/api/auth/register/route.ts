import { getExternalAuthRoute } from "@/lib/external-api";
import { parseJsonBody, badRequest, okJson, serverError } from "@/lib/http";
import { registerSchema } from "@/lib/schemas";

export const runtime = "nodejs";

type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<RegisterRequest>(request);
    if (!body) {
      return badRequest("Corpo da requisição inválido");
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Dados de cadastro inválidos");
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(externalData?.error || "Dados de cadastro inválidos");
    }

    return okJson({ success: true }, 201);
  } catch {
    return serverError();
  }
}
