import { getFullSession } from "@/app/actions/auth";
import { getDashboardData } from "@/app/actions/dashboard";
import AdminDashboard from "@/components/admin/Dashboard";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getFullSession();

  if (session?.role == "Learner") {
    redirect("/");
  }

  const response = await getDashboardData();
  
  return <AdminDashboard data={response.data} />;

}
