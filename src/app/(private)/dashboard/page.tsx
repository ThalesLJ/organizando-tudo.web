import { DashboardFinancial } from "@/components/dashboard-financial";
import { requireAuthenticatedUser } from "@/lib/require-auth";

export default async function DashboardPage() {
  await requireAuthenticatedUser();
  return <DashboardFinancial />;
}
