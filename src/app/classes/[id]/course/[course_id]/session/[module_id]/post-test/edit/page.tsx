import { getAssignmentBySessionAndType } from "@/controllers/assignmentController";
import { getSessionById } from "@/controllers/sessionController";
import { CreateSessionTestClient } from "../../components/CreateSessionTestClient";
import { notFound } from "next/navigation";
import { hasPermission } from "@/lib/rbac";

export default async function EditPostTestPage({
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

    const session = await getSessionById(parseInt(moduleId));
    if (!session) return notFound();

    const assignment = await getAssignmentBySessionAndType(parseInt(moduleId), 'POSTTEST');

    return (
        <CreateSessionTestClient
            classId={parseInt(classId)}
            courseId={parseInt(courseId)}
            sessionId={parseInt(moduleId)}
            sessionTitle={session.title}
            type="POSTTEST"
            existingTest={assignment}
        />
    );
}
