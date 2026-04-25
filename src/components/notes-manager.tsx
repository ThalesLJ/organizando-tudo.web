"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type NoteItem = {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

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

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function NotesManager() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "title-asc" | "title-desc">("date-desc");

  async function loadNotes(showLoader = true) {
    if (showLoader) {
      setIsLoading(true);
    }
    setError("");
    try {
      const response = await fetch("/api/notes", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(extractErrorMessage(data.error, "Falha ao carregar notas"));
      }
      setNotes(Array.isArray(data.data) ? data.data : []);
    } catch (loadError) {
      setError(extractErrorMessage(loadError, "Falha ao carregar notas"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialNotes() {
      try {
        const response = await fetch("/api/notes", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(extractErrorMessage(data.error, "Falha ao carregar notas"));
        }
        if (!isCancelled) {
          setNotes(Array.isArray(data.data) ? data.data : []);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(extractErrorMessage(loadError, "Falha ao carregar notas"));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialNotes();
    return () => {
      isCancelled = true;
    };
  }, []);

  async function handleDelete(noteId: string) {
    const confirmed = window.confirm("Deseja excluir esta nota?");
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(extractErrorMessage(data.error, "Falha ao excluir nota"));
      }

      await loadNotes(false);
    } catch (deleteError) {
      setError(extractErrorMessage(deleteError, "Falha ao excluir nota"));
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredNotes = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const result = notes.filter((note) => {
      if (visibilityFilter === "public" && !note.isPublic) {
        return false;
      }
      if (visibilityFilter === "private" && note.isPublic) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const plainContent = stripHtml(note.content).toLowerCase();
      return note.title.toLowerCase().includes(normalizedSearch) || plainContent.includes(normalizedSearch);
    });

    result.sort((left, right) => {
      if (sortBy === "date-desc") {
        return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime();
      }
      if (sortBy === "title-asc") {
        return left.title.localeCompare(right.title);
      }
      return right.title.localeCompare(left.title);
    });

    return result;
  }, [notes, search, sortBy, visibilityFilter]);

  function getPreviewContent(note: NoteItem): string {
    if (!note.isPublic) {
      return '<div class="text-center text-xs text-zinc-500">🔒 Conteúdo privado</div>';
    }

    const trimmedContent = note.content.trim();
    if (!trimmedContent) {
      return '<div class="text-center text-xs text-zinc-500">Sem conteúdo</div>';
    }
    return trimmedContent;
  }

  return (
    <section className="space-y-3">
      <div className="space-y-3 rounded-md border border-[#b88f7f] bg-[#ecd8cc] p-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notes..."
          className="w-full rounded border border-[#b88f7f] bg-[#f2e3da] px-3 py-2 text-sm text-[#5f4339] outline-none"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setVisibilityFilter("all")}
            className={`rounded border px-2 py-1 ${visibilityFilter === "all" ? "border-[#8f6453] bg-[#8f6453] text-white" : "border-[#b88f7f] bg-[#f2e3da] text-[#5f4339]"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setVisibilityFilter("public")}
            className={`rounded border px-2 py-1 ${visibilityFilter === "public" ? "border-[#8f6453] bg-[#8f6453] text-white" : "border-[#b88f7f] bg-[#f2e3da] text-[#5f4339]"}`}
          >
            Public
          </button>
          <button
            type="button"
            onClick={() => setVisibilityFilter("private")}
            className={`rounded border px-2 py-1 ${visibilityFilter === "private" ? "border-[#8f6453] bg-[#8f6453] text-white" : "border-[#b88f7f] bg-[#f2e3da] text-[#5f4339]"}`}
          >
            Private
          </button>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            className="rounded border border-[#b88f7f] bg-[#f2e3da] px-2 py-1 text-[#5f4339]"
          >
            <option value="date-desc">Sort by Date DESC</option>
            <option value="date-asc">Sort by Date ASC</option>
            <option value="title-asc">Sort by Title A-Z</option>
            <option value="title-desc">Sort by Title Z-A</option>
          </select>
        </div>
      </div>

      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-zinc-500">Carregando...</p> : null}
      {!isLoading && filteredNotes.length === 0 ? <p className="text-sm text-zinc-500">No notes found</p> : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredNotes.map((note) => (
          <article key={note.id} className="rounded-md border border-[#c9a89a] bg-[#f2e3da] p-2 text-[#5f4339]">
            <h3 className="border-b border-[#d9bfb2] pb-1 text-sm font-semibold">{note.title}</h3>
            <div
              className={`mt-2 h-28 overflow-hidden rounded border border-[#d9bfb2] bg-[#eedcd1] p-2 text-xs ${!note.isPublic ? "opacity-70" : ""}`}
              dangerouslySetInnerHTML={{ __html: getPreviewContent(note) }}
            />
            <div className="mt-2 flex items-center justify-between text-[11px] text-[#7a5a4d]">
              <span>{formatDate(note.updatedAt)}</span>
              <div className="flex gap-2">
                <Link href={`/view-note/${note.id}`} className="underline">
                  View
                </Link>
                <Link href={`/edit-note/${note.id}`} className="underline">
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => void handleDelete(note.id)}
                  className="underline disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Link
        href="/add-note/new"
        className="fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#8f6453] text-3xl leading-none text-white shadow-md"
      >
        +
      </Link>
    </section>
  );
}
