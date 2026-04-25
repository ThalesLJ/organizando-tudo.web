import { getExternalAuthRoute } from "@/lib/external-api";
import { parseJsonBody, badRequest, okJson, serverError } from "@/lib/http";
import { verifyCodeSchema } from "@/lib/schemas";

export const runtime = "nodejs";

type VerifyCodeRequest = {
  code: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<VerifyCodeRequest>(request);
    if (!body) {
      return badRequest("Corpo da requisição inválido");
    }

    const parsed = verifyCodeSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Código ou senha inválidos");
    }

    const externalResponse = await fetch(getExternalAuthRoute("/api/auth/verify-code"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
    const externalData = await externalResponse.json();
    if (!externalResponse.ok || !externalData?.success) {
      return badRequest(externalData?.error || "Código inválido ou expirado");
    }

    return okJson({ success: true });
  } catch {
    return serverError();
  }
}
