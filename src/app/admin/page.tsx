import { getFullSession } from "@/app/actions/auth";
import { getDashboardData } from "@/app/actions/dashboard";
import AdminDashboard from "@/components/admin/Dashboard";
import TrainerDashboard from "@/components/admin/TrainerDashboard";
import LearningDesignerDashboard from "@/components/admin/LearningDesignerDashboard";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getFullSession();
  const allowedRole = ["Trainer", "Instructor", "Learning Designer", "Admin"];

  if (!allowedRole.includes(session.role)) {
    redirect("/");
  }

  const response = await getDashboardData();
  
  if (!response.success || !response.data) {
    return <div>Failed to load dashboard</div>;
  }

  const role = response.data.user.role;

  if (role === "Trainer" || role === "Instructor") {
    return <TrainerDashboard data={response.data} />;
  }

  if (role === "Learning Designer") {
    return <LearningDesignerDashboard data={response.data} />;
  }
  
  if (role === "Admin") {
    return <AdminDashboard data={response.data} />;
  }
}
