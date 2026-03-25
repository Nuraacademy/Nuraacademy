import { getAssignmentBySessionAndType } from "@/controllers/assignmentController";
import { NotFoundState } from "@/components/ui/status/not_found_state";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/rbac";

export default async function PreTestPage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const assignment = await getAssignmentBySessionAndType(parseInt(moduleId), 'PRETEST');

    if (assignment) {
        redirect(`/assignment/${assignment.id}`);
    }

    const canManage = await hasPermission("Assignment", "CREATE_UPDATE_ASSIGNMENT");

    return (
        <main className="min-h-screen bg-[#FDFDF7] flex items-center justify-center">
            <NotFoundState
                title="Pre-Test Not Available"
                message="The pre-test for this session is not available at the moment. Please check back later."
                buttonLabel={canManage ? "Create Pre-test" : "Back to Overview"}
                href={canManage ? `/assignment/add?classId=${classId}&courseId=${courseId}&sessionId=${moduleId}&type=PRETEST` : undefined}
            />
        </main>
    );
}
