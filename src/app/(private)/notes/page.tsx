import { requireAuthenticatedUser } from "@/lib/require-auth";
import { NotesManager } from "@/components/notes-manager";

export default async function NotesPage() {
  await requireAuthenticatedUser();
  return <NotesManager />;
}
