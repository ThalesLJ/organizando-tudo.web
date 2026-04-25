import { FinancialManager } from "@/components/financial-manager";
import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function FinancialPage() {
  await requireAuthenticatedUser();
  return <FinancialManager />;
}
