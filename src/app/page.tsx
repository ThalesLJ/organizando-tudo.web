import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";

export default async function Home() {
  const user = await getAuthenticatedUserFromCookies();
  if (user) {
    redirect("/notes");
  }
  redirect("/login");
}
