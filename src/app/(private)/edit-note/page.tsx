import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function EditNotePage() {
  await requireAuthenticatedUser();
  redirect("/notes");
}
