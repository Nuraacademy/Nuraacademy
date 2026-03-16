import { getGradingData, getAssignmentById } from "@/controllers/assignmentController";
import { getEnrollmentById } from "@/controllers/enrollmentController";
import GradingClient from "@/components/assignment/GradingClient";
import { submitGradingAction } from "@/app/actions/assignment";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac";

export default async function IndividualGradingPage({
    params
}: {
    params: Promise<{ id: string, enrollmentId: string }>
}) {
    const { id, enrollmentId } = await params;
    const assignmentId = parseInt(id);
    const eid = parseInt(enrollmentId);

    await requirePermission('Assignment', 'GRADE_ASSIGNMENT');

    const [assignment, enrollment] = await Promise.all([
        getAssignmentById(assignmentId),
        getEnrollmentById(eid)
    ]);

    if (!assignment || !enrollment) return notFound();

    const gradingData = await getGradingData(assignmentId, eid);

    if (!gradingData) return notFound();

    return (
        <GradingClient
            assignmentId={assignmentId}
            enrollmentId={eid}
            learnerName={enrollment.user.name || enrollment.user.username}
            initialData={gradingData}
            title={`Grading: ${assignment.title}`}
            subtitle={assignment.class?.title || assignment.course?.title || "Assignment"}
            breadcrumbItems={[
                { label: "Home", href: "/" },
                { label: "Assignments", href: "/assignment" },
                { label: assignment.title || "Assignment", href: `/assignment/${id}` },
                { label: "Results", href: `/assignment/${id}/results` },
                { label: enrollment.user.name || enrollment.user.username, href: "#" },
            ]}
            backUrl={`/assignment/${id}/results`}
            submitAction={submitGradingAction.bind(null, assignmentId)}
        />
    );
}
