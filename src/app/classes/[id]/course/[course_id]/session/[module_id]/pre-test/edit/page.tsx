import { redirect } from "next/navigation";
import { getAssignmentBySessionAndType } from "@/controllers/assignmentController";
import { hasPermission } from "@/lib/rbac";

export default async function EditPreTestPage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    // Check permission
    const canManage = await hasPermission("Assignment", "CREATE_UPDATE_ASSIGNMENT");
    if (!canManage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Unauthorized</p>
            </div>
        );
    }

    const assignment = await getAssignmentBySessionAndType(parseInt(moduleId), 'PRETEST');

    if (assignment) {
        redirect(`/assignment/add?id=${assignment.id}`);
    } else {
        redirect(`/assignment/add?classId=${classId}&courseId=${courseId}&sessionId=${moduleId}&type=PRETEST`);
    }
}
