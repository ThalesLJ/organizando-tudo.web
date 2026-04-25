import { NextResponse } from "next/server";

export function okJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string) {
  return okJson({ success: false, error: message }, 400);
}

export function unauthorized(message = "Não autorizado") {
  return okJson({ success: false, error: message }, 401);
}

export function serverError() {
  return okJson({ success: false, error: "Erro interno do servidor" }, 500);
}

export async function parseJsonBody<T>(request: Request) {
  try {
    const body = (await request.json()) as T;
    return body;
  } catch {
    return null;
  }
}
