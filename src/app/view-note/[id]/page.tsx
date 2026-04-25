import { redirect } from "next/navigation";
import { NoteViewer } from "@/components/note-viewer";

type ViewNotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewNotePage({ params }: ViewNotePageProps) {
  const { id } = await params;
  if (!id) {
    redirect("/login");
  }

  return <NoteViewer noteId={id} />;
}
