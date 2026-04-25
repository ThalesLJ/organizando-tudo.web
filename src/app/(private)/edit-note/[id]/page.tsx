import { redirect } from "next/navigation";
import { NoteEditor } from "@/components/note-editor";
import { requireAuthenticatedUser } from "@/lib/require-auth";

type EditNotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNoteByIdPage({ params }: EditNotePageProps) {
  await requireAuthenticatedUser();
  const { id } = await params;
  if (!id) {
    redirect("/notes");
  }

  return <NoteEditor mode="edit" noteId={id} />;
}
