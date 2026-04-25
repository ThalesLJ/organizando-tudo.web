"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NoteResponse = {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  updatedAt: string;
};

type NoteViewerProps = {
  noteId: string;
};

function extractErrorMessage(error: unknown, fallback: string): string {
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

export function NoteViewer({ noteId }: NoteViewerProps) {
  const [note, setNote] = useState<NoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNote() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/notes/${noteId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(extractErrorMessage(data.error, "Falha ao carregar nota"));
        }
        setNote(data.data as NoteResponse);
      } catch (loadError) {
        setError(extractErrorMessage(loadError, "Falha ao carregar nota"));
      } finally {
        setIsLoading(false);
      }
    }

    void loadNote();
  }, [noteId]);

  if (isLoading) {
    return <p className="text-sm text-[#7a5a4d]">Carregando nota...</p>;
  }

  if (error) {
    return <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  }

  if (!note) {
    return <p className="text-sm text-[#7a5a4d]">Nota não encontrada.</p>;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6">
      <Link
        href="/login"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center bg-[#2e2e2e] text-xl text-white"
      >
        ←
      </Link>
      <div className="rounded border border-[#b88f7f] bg-[#ecd8cc] p-4 text-[#5f4339]">
        <h1 className="mb-3 rounded border border-[#c6a799] bg-[#f2e3da] px-3 py-2 text-sm font-medium">
          {note.title}
        </h1>
        <div className="rounded border border-[#c6a799] bg-[#f2e3da] p-3 text-sm leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: note.content || "<p>Sem conteúdo</p>" }} />
        </div>
      </div>
    </main>
  );
}
