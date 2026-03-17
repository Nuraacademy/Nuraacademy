import { getAssignmentById, getAssignmentResult } from "@/controllers/assignmentController";
import { getEnrollmentById } from "@/controllers/enrollmentController";
import AssignmentFeedbackEditor from "@/app/feedback/components/AssignmentFeedbackEditor";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac";

export default async function AssignmentFeedbackEditorPage({
    params
}: {
    params: Promise<{ id: string, enrollmentId: string }>
}) {
    const { id, enrollmentId } = await params;
    const assignmentId = parseInt(id);
    const eid = parseInt(enrollmentId);

    // Permission check
    await requirePermission('Feedback', 'CREATE_EDIT_ASSIGNMENT_FEEDBACK');

    const [assignment, enrollment, result] = await Promise.all([
        getAssignmentById(assignmentId),
        getEnrollmentById(eid),
        getAssignmentResult(assignmentId, eid)
    ]);

    if (!assignment || !enrollment || !result) return notFound();

    return (
        <AssignmentFeedbackEditor
            assignmentId={assignmentId}
            enrollmentId={eid}
            resultId={result.id}
            learnerName={enrollment.user.name || enrollment.user.username}
            assignmentTitle={assignment.title || "Assignment"}
            className={assignment.class?.title || "Class"}
            courseName={assignment.course?.title || ""}
            initialFeedback={result.feedback || ""}
            initialFiles={((result as any).feedbackFiles as any) || []}
        />
    );
}
