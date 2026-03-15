import { hasPermission } from "@/lib/rbac";
import AssignmentList from "./assignment_list";
import { getAssignments } from "@/controllers/assignmentController";

export default async function AssignmentPage() {
    const assignments = await getAssignments();
    const canAddAssignment = await hasPermission('Assignment', 'CREATE_UPDATE_ASSIGNMENT');

    return <AssignmentList initialAssignments={assignments} canAddAssignment={canAddAssignment} />;
}
