import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUserFromCookies();
  if (!user) {
    redirect("/login");
  }
  return user;
}
