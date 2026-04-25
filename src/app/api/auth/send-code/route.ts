import { getExternalAuthRoute } from "@/lib/external-api";
import { parseJsonBody, badRequest, okJson, serverError } from "@/lib/http";
import { sendCodeSchema } from "@/lib/schemas";

export const runtime = "nodejs";

type SendCodeRequest = {
  email: string;
};

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<SendCodeRequest>(request);
    if (!body) {
      return badRequest("Corpo da requisição inválido");
    }

    const parsed = sendCodeSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("E-mail inválido");
    }

    await fetch(getExternalAuthRoute("/api/auth/send-code"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: parsed.data.email.trim().toLowerCase() }),
      cache: "no-store",
    });

    return okJson({ success: true });
  } catch {
    return serverError();
  }
}
