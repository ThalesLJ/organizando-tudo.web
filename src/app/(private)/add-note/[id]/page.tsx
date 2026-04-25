import { NoteEditor } from "@/components/note-editor";
import { requireAuthenticatedUser } from "@/lib/require-auth";

type AddNotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AddNoteByIdPage({ params }: AddNotePageProps) {
  await requireAuthenticatedUser();
  await params;
  return <NoteEditor mode="create" />;
}
