"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
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
    return (
      <main className="min-h-screen w-full bg-[var(--bg-primary)] px-4 py-6 text-[var(--text-primary)]">
        <p className="ui-muted text-sm">{messages.viewer.loading}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-[var(--bg-primary)] px-4 py-6 text-[var(--text-primary)]">
        <p className="ui-error">{error}</p>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="min-h-screen w-full bg-[var(--bg-primary)] px-4 py-6 text-[var(--text-primary)]">
        <p className="ui-muted text-sm">{messages.viewer.notFound}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[var(--bg-primary)] px-4 py-6 text-[var(--text-primary)]">
      <Link
        href="/login"
        aria-label="Voltar"
        className="fixed left-4 top-4 z-50 text-2xl text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
      >
        <FaChevronLeft />
      </Link>
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-4 text-sm font-medium">
          {note.title}
        </h1>
        <div className="note-public-content rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] p-4 text-sm leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: note.content || "<p>Sem conteúdo</p>" }} />
        </div>
      </div>
    </main>
  );
}
