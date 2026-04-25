"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocaleMessages } from "@/lib/locale-client";

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
  const { messages } = useLocaleMessages();
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
          throw new Error(extractErrorMessage(data.error, messages.viewer.loadError));
        }
        setNote(data.data as NoteResponse);
      } catch (loadError) {
        setError(extractErrorMessage(loadError, messages.viewer.loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadNote();
  }, [noteId, messages.viewer.loadError]);

  if (isLoading) {
    return <p className="text-sm text-[var(--text-secondary)]">{messages.viewer.loading}</p>;
  }

  if (error) {
    return <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  }

  if (!note) {
    return <p className="text-sm text-[var(--text-secondary)]">{messages.viewer.notFound}</p>;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6">
      <Link
        href="/login"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center border border-zinc-300/50 bg-[var(--bg-secondary)] text-xl text-[var(--text-primary)]"
      >
        ←
      </Link>
      <div className="rounded border border-zinc-300/40 bg-[var(--bg-secondary)] p-4 text-[var(--text-primary)]">
        <h1 className="mb-3 rounded border border-zinc-300/50 bg-[var(--bg-primary)] px-3 py-2 text-sm font-medium">
          {note.title}
        </h1>
        <div className="rounded border border-zinc-300/50 bg-[var(--bg-primary)] p-3 text-sm leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: note.content || "<p>Sem conteúdo</p>" }} />
        </div>
      </div>
    </main>
  );
}
