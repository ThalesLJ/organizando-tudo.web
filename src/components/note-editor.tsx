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
        class: "min-h-[230px] rounded-b-lg border border-[var(--border-color)] bg-[var(--input-background)] p-4 text-sm text-[var(--text-primary)] outline-none",
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
    return <p className="ui-muted text-sm">{messages.viewer.loading}</p>;
  }

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold tracking-[-0.02em]">{mode === "edit" ? "Editar nota" : "Criar nota"}</h1>
      {error ? <p className="ui-error">{error}</p> : null}

      <div className="space-y-4">
        <label className="text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="ui-input w-full"
          required
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Content</label>
        <div className="flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 border-[var(--border-color)] bg-[var(--input-background)] p-3 text-xs">
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">B</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">I</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">U</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">• List</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">1. List</button>
          <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">P</button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">L</button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">C</button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()} className="rounded-lg border border-[var(--border-color)] px-3 py-2 transition hover:opacity-80">R</button>
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
          className="ui-button-primary disabled:opacity-60"
        >
          {isSaving ? messages.settings.loading : messages.editor.save}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            disabled={isSaving || title.trim().length === 0}
            onClick={() => void handleSubmit(true)}
            className="ui-button-primary disabled:opacity-60"
          >
            {isSaving ? messages.settings.loading : messages.editor.saveAndClose}
          </button>
        ) : null}
        <Link href="/notes" className="ui-button-secondary text-center">
          {messages.editor.cancel}
        </Link>
      </div>
    </section>
  );
}
