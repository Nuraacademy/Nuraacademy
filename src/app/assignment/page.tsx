import { hasPermission, requirePermission } from "@/lib/rbac";
import AssignmentList from "./assignment_list";
import { getAssignments } from "@/controllers/assignmentController";
import { getCurrentUserId } from "@/lib/auth";

export default async function AssignmentPage() {
    await requirePermission('Assignment', 'SEARCH_VIEW_ASSIGNMENT');
    
    const userId = await getCurrentUserId();
    const isAdmin = await hasPermission('Assignment', 'CREATE_UPDATE_ASSIGNMENT');
    const canDeleteAssignment = await hasPermission('Assignment', 'DELETE_ASSIGNMENT');
    const canGrade = await hasPermission('Assignment', 'GRADE_ASSIGNMENT');
    
    // For students (non-admins), fetch only unfinished assignments
    const assignments = await getAssignments(!isAdmin && userId ? userId : undefined);
    
    const canAddAssignment = isAdmin;

    return <AssignmentList initialAssignments={assignments} canAddAssignment={canAddAssignment} canDeleteAssignment={canDeleteAssignment} canGrade={canGrade} />;
}
