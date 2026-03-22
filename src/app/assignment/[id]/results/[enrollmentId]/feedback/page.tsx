import { getAssignmentById, getAssignmentResult } from "@/controllers/assignmentController";
import { getEnrollmentById } from "@/controllers/enrollmentController";
import FeedbackClient from "./FeedbackClient";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac";

export default async function AssignmentFeedbackPage({
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
        <FeedbackClient
            assignmentId={assignmentId}
            enrollmentId={eid}
            resultId={result.id}
            learnerName={enrollment.user.name || enrollment.user.username}
            assignmentTitle={assignment.title || "Assignment"}
            className={assignment.class?.title || "Class"}
            courseName={assignment.course?.title || ""}
            initialFeedback={(result as any).feedback || ""}
            breadcrumbItems={[
                { label: "Home", href: "/classes" },
                { label: "Assignments", href: "/assignment" },
                { label: assignment.title || "Assignment", href: `/assignment/${id}` },
                { label: "Results", href: `/assignment/${id}/results` },
                { label: `Feedback: ${enrollment.user.name || enrollment.user.username}`, href: "#" },
            ]}
        />
    );
}
