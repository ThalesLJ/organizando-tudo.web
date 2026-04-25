import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function AddNotePage() {
  await requireAuthenticatedUser();
  redirect("/add-note/new");
}
