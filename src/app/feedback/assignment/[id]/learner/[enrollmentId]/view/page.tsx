import { getAssignmentById, getAssignmentResult } from "@/controllers/assignmentController";
import { getEnrollmentById } from "@/controllers/enrollmentController";
import { getSession } from "@/app/actions/auth";
import AssignmentFeedbackView from "@/app/feedback/components/AssignmentFeedbackView";
import { notFound, redirect } from "next/navigation";

export default async function AssignmentFeedbackViewPage({
    params
}: {
    params: Promise<{ id: string, enrollmentId: string }>
}) {
    const { id, enrollmentId } = await params;
    const assignmentId = parseInt(id);
    const eid = parseInt(enrollmentId);

    const currentUserId = await getSession();
    if (!currentUserId) {
        redirect("/login");
    }

    const [assignment, enrollment, result] = await Promise.all([
        getAssignmentById(assignmentId, false),
        getEnrollmentById(eid),
        getAssignmentResult(assignmentId, eid, false)
    ]);

    if (!assignment || !enrollment || !result) return notFound();

    // Ensure only the specific learner or authorized staff can view
    // (In a real scenario, we'd check roles, but for now let's ensure basic ownership)
    if (enrollment.userId !== currentUserId) {
        // If not the owner, we should probably check if they are staff
        // For now, let's keep it simple or expand if RBAC is needed here
        // await requirePermission('Assignment', 'CHECK_ASSIGNMENT_RESULT'); 
        return notFound();
    }

    return (
        <AssignmentFeedbackView
            assignmentId={assignmentId}
            enrollmentId={eid}
            learnerName={enrollment.user.name || enrollment.user.username}
            assignmentTitle={assignment.title || "Assignment"}
            className={assignment.class?.title || "Class"}
            courseName={assignment.course?.title || ""}
            feedback={result.feedback || ""}
            files={((result as any).feedbackFiles as any) || []}
            problemUnderstanding={(result as any).problemUnderstanding || 0}
            problemUnderstandingFeedback={(result as any).problemUnderstandingFeedback || ''}
            technicalAbility={(result as any).technicalAbility || 0}
            technicalAbilityFeedback={(result as any).technicalAbilityFeedback || ''}
            solutionQuality={(result as any).solutionQuality || 0}
            solutionQualityFeedback={(result as any).solutionQualityFeedback || ''}
        />
    );
}
