"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";
import { useLocaleMessages } from "@/lib/locale-client";

type NoteResponse = {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
};

type NoteEditorProps = {
  mode: "create" | "edit";
  noteId?: string;
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

export function NoteEditor({ mode, noteId }: NoteEditorProps) {
  const { messages } = useLocaleMessages();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      Placeholder.configure({ placeholder: "Escreva o conteúdo da nota..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    immediatelyRender: false,
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[230px] rounded-b border border-zinc-300/50 bg-[var(--bg-primary)] p-3 text-sm text-[var(--text-primary)] outline-none",
      },
    },
  });

  useEffect(() => {
    if (mode !== "edit" || !noteId) {
      return;
    }

    async function loadNote() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/notes/${noteId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(extractErrorMessage(data.error, messages.viewer.loadError));
        }
        const note = data.data as NoteResponse;
        setTitle(note.title);
        setIsPublic(note.isPublic);
        editor?.commands.setContent(note.content || "");
      } catch (loadError) {
        setError(extractErrorMessage(loadError, messages.viewer.loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadNote();
  }, [editor, mode, noteId, messages.viewer.loadError]);

  async function handleSubmit(shouldClose: boolean) {
    if (!editor) {
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const payload = {
        title: title.trim(),
        content: editor.getHTML(),
        isPublic,
      };

      const endpoint = mode === "edit" && noteId ? `/api/notes/${noteId}` : "/api/notes";
      const method = mode === "edit" ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(extractErrorMessage(data.error, messages.editor.saveError));
      }

      if (shouldClose) {
        router.replace("/notes");
        router.refresh();
        return;
      }

      const savedNoteId = mode === "create" ? (data.data?.id as string | undefined) : noteId;
      if (savedNoteId) {
        router.replace(`/edit-note/${savedNoteId}`);
        router.refresh();
      }
    } catch (saveError) {
      setError(extractErrorMessage(saveError, messages.editor.saveError));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--text-secondary)]">{messages.viewer.loading}</p>;
  }

  return (
    <section className="space-y-3 rounded border border-zinc-300/40 bg-[var(--bg-primary)] p-4 text-[var(--text-primary)]">
      <h1 className="text-lg font-semibold">{mode === "edit" ? "Editar nota" : "Criar nota"}</h1>
      {error ? <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-1">
        <label className="text-sm">Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded border border-zinc-300/50 bg-[var(--bg-secondary)] px-3 py-2 text-sm outline-none"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Content</label>
        <div className="flex flex-wrap items-center gap-1 rounded-t border border-b-0 border-zinc-300/50 bg-[var(--bg-secondary)] p-2 text-xs">
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="rounded border border-zinc-300/50 px-2 py-1">B</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="rounded border border-zinc-300/50 px-2 py-1">I</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className="rounded border border-zinc-300/50 px-2 py-1">U</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="rounded border border-zinc-300/50 px-2 py-1">• List</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="rounded border border-zinc-300/50 px-2 py-1">1. List</button>
          <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()} className="rounded border border-zinc-300/50 px-2 py-1">P</button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()} className="rounded border border-zinc-300/50 px-2 py-1">L</button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()} className="rounded border border-zinc-300/50 px-2 py-1">C</button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()} className="rounded border border-zinc-300/50 px-2 py-1">R</button>
        </div>
        <EditorContent editor={editor} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />
        {messages.editor.publicNote}
      </label>

      <div className={`grid grid-cols-1 gap-2 ${mode === "edit" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        <button
          type="button"
          disabled={isSaving || title.trim().length === 0}
          onClick={() => void handleSubmit(false)}
          className="rounded border border-zinc-300/50 bg-[var(--bg-secondary)] px-3 py-2 text-xs disabled:opacity-60"
        >
          {isSaving ? messages.settings.loading : messages.editor.save}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            disabled={isSaving || title.trim().length === 0}
            onClick={() => void handleSubmit(true)}
            className="rounded border border-zinc-300/50 bg-[var(--bg-secondary)] px-3 py-2 text-xs disabled:opacity-60"
          >
            {isSaving ? messages.settings.loading : messages.editor.saveAndClose}
          </button>
        ) : null}
        <Link href="/notes" className="rounded border border-zinc-300/50 bg-[var(--bg-secondary)] px-3 py-2 text-center text-xs">
          {messages.editor.cancel}
        </Link>
      </div>
    </section>
  );
}
