import { getDashboardData } from "@/app/actions/dashboard";
import AdminDashboard from "@/components/admin/Dashboard";
import TrainerDashboard from "@/components/admin/TrainerDashboard";
import LearningDesignerDashboard from "@/components/admin/LearningDesignerDashboard";
import { requirePermission, getPermissions } from "@/lib/rbac";

export default async function AdminPage() {
  await requirePermission('Class', 'SEARCH_VIEW_CLASS');

  const permissions = await getPermissions([
    { resource: 'Class', action: 'CREATE_UPDATE_CLASS' },
    { resource: 'Class', action: 'DELETE_CLASS' }
  ]);

  const response = await getDashboardData();

  if (!response.success || !response.data) {
    return <div>Failed to load dashboard</div>;
  }

  const role = response.data.user.role;

  if (role === "Trainer" || role === "Instructor" || role === "Instructur") {
    return <TrainerDashboard data={response.data} permissions={permissions} />;
  }

  if (role === "Learning Designer") {
    return <LearningDesignerDashboard data={response.data} permissions={permissions} />;
  }
  
  if (role === "Admin") {
    return <AdminDashboard data={response.data} permissions={permissions} />;
  }
}
