"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocaleMessages } from "@/lib/locale-client";

type NoteItem = {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDate(value: string, locale: string): string {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const year = date.getFullYear();
    const month = padDatePart(date.getMonth() + 1);
    const day = padDatePart(date.getDate());
    const hours24 = padDatePart(date.getHours());
    const minutes = padDatePart(date.getMinutes());
    const seconds = padDatePart(date.getSeconds());

    if (locale === "pt") {
      return `${day}/${month}/${year} ${hours24}:${minutes}:${seconds}`;
    }

    const period = date.getHours() >= 12 ? "PM" : "AM";
    const hours12Value = date.getHours() % 12 || 12;
    const hours12 = padDatePart(hours12Value);
    return `${year}/${month}/${day} ${hours12}:${minutes}:${seconds} ${period}`;
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
  const { locale, messages } = useLocaleMessages();
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
        throw new Error(extractErrorMessage(data.error, messages.notes.loadError));
      }
      setNotes(Array.isArray(data.data) ? data.data : []);
    } catch (loadError) {
      setError(extractErrorMessage(loadError, messages.notes.loadError));
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
          throw new Error(extractErrorMessage(data.error, messages.notes.loadError));
        }
        if (!isCancelled) {
          setNotes(Array.isArray(data.data) ? data.data : []);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(extractErrorMessage(loadError, messages.notes.loadError));
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
  }, [messages.notes.loadError]);

  async function handleDelete(noteId: string) {
    const confirmed = window.confirm(messages.notes.deleteConfirm);
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
        throw new Error(extractErrorMessage(data.error, messages.notes.deleteError));
      }

      await loadNotes(false);
    } catch (deleteError) {
      setError(extractErrorMessage(deleteError, messages.notes.deleteError));
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
      return `<div class="note-private-content text-center text-xs text-[var(--text-secondary)]">🔒 ${messages.notes.privateContent}</div>`;
    }

    const trimmedContent = note.content.trim();
    if (!trimmedContent) {
      return `<div class="note-private-content text-center text-xs text-[var(--text-secondary)]">${messages.notes.noContent}</div>`;
    }
    return trimmedContent;
  }

  return (
    <section className="notes-floating-page -mx-2 space-y-5 sm:-mx-8">
      <div className="ui-card space-y-4 p-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={messages.notes.searchPlaceholder}
          className="ui-input w-full"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setVisibilityFilter("all")}
              className={`rounded-lg border px-3 py-2 transition ${visibilityFilter === "all" ? "border-[var(--primary-button-background)] bg-[var(--primary-button-background)] text-[var(--primary-button-text)]" : "border-[var(--border-color)] bg-[var(--secondary-button-background)] text-[var(--secondary-button-text)] hover:opacity-80"}`}
            >
              {messages.notes.all}
            </button>
            <button
              type="button"
              onClick={() => setVisibilityFilter("public")}
              className={`rounded-lg border px-3 py-2 transition ${visibilityFilter === "public" ? "border-[var(--primary-button-background)] bg-[var(--primary-button-background)] text-[var(--primary-button-text)]" : "border-[var(--border-color)] bg-[var(--secondary-button-background)] text-[var(--secondary-button-text)] hover:opacity-80"}`}
            >
              {messages.notes.public}
            </button>
            <button
              type="button"
              onClick={() => setVisibilityFilter("private")}
              className={`rounded-lg border px-3 py-2 transition ${visibilityFilter === "private" ? "border-[var(--primary-button-background)] bg-[var(--primary-button-background)] text-[var(--primary-button-text)]" : "border-[var(--border-color)] bg-[var(--secondary-button-background)] text-[var(--secondary-button-text)] hover:opacity-80"}`}
            >
              {messages.notes.private}
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            className="ui-input px-3 py-2"
          >
            <option value="date-desc">{messages.notes.sortDateDesc}</option>
            <option value="date-asc">{messages.notes.sortDateAsc}</option>
            <option value="title-asc">{messages.notes.sortTitleAsc}</option>
            <option value="title-desc">{messages.notes.sortTitleDesc}</option>
          </select>
        </div>
      </div>

      {error ? <p className="ui-error">{error}</p> : null}
      {isLoading ? <p className="ui-muted text-sm">{messages.notes.loading}</p> : null}
      {!isLoading && filteredNotes.length === 0 ? <p className="ui-muted text-sm">{messages.notes.empty}</p> : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredNotes.map((note) => (
          <article key={note.id} className="ui-card p-4">
            <h3 className="border-b border-[var(--border-color)] pb-2 text-[15px] font-semibold">{note.title}</h3>
            <div
              className={`mt-3 h-[142px] rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] p-3 text-[13px] ${note.isPublic ? "note-public-content note-scrollbar overflow-y-auto overflow-x-hidden" : "note-private-content flex items-center justify-center overflow-hidden opacity-70"}`}
              dangerouslySetInnerHTML={{ __html: getPreviewContent(note) }}
            />
            <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>{formatDate(note.updatedAt, locale)}</span>
              <div className="flex gap-2">
                <Link href={`/view-note/${note.id}`} className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
                  {messages.notes.view}
                </Link>
                <Link href={`/edit-note/${note.id}`} className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
                  {messages.notes.edit}
                </Link>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => void handleDelete(note.id)}
                  className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:opacity-60"
                >
                  {messages.notes.delete}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Link
        href="/add-note/new"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--primary-button-background)] bg-[var(--primary-button-background)] text-3xl leading-none text-[var(--primary-button-text)] shadow-2xl transition hover:opacity-90"
      >
        +
      </Link>
    </section>
  );
}
