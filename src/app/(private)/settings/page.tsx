import { requireAuthenticatedUser } from "@/lib/require-auth";
import { SettingsPanel } from "@/components/settings-panel";

export default async function SettingsPage() {
  await requireAuthenticatedUser();

  return <SettingsPanel />;
}
