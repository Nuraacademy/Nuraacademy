import { getGradingData, getAssignmentById } from "@/controllers/assignmentController";
import { getEnrollmentById } from "@/controllers/enrollmentController";
import ResultDetailView from "../../../components/ResultDetailView";
import { notFound } from "next/navigation";
import { getSession } from "@/app/actions/auth";

export default async function ResultDetailPage({
    params
}: {
    params: Promise<{ id: string, enrollmentId: string }>
}) {
    const { id, enrollmentId: rawEnrollmentId } = await params;
    const assignmentId = parseInt(id);
    const currentUserId = await getSession();

    // Check if it's a numeric ID or a string name
    const isNumeric = /^\d+$/.test(rawEnrollmentId);
    const eid = isNumeric ? parseInt(rawEnrollmentId) : rawEnrollmentId;

    const assignment = await getAssignmentById(assignmentId, false);
    if (!assignment) return notFound();

    let enrollment: any = null;
    let learnerName = "Unknown";
    let groupMembers: { id: number, name: string }[] = [];

    if (typeof eid === 'number') {
        enrollment = await getEnrollmentById(eid);
        if (enrollment) {
            learnerName = enrollment.user.name || enrollment.user.username || "Unknown";
        }
    }

    // Handle Group logic if needed (similar to IndividualGradingPage)
    if (assignment.submissionType === 'GROUP') {
        const { prisma } = await import("@/lib/prisma");

        // Resolve group context
        const group = await prisma.group.findFirst({
            where: {
                name: typeof eid === 'string' ? decodeURIComponent(eid) : undefined,
                id: typeof eid === 'number' ? eid : undefined,
                enrollmentId: typeof eid === 'number' ? eid : undefined,
                enrollment: { classId: assignment.classId }
            },
            include: { enrollment: { include: { user: true } } }
        });

        if (group) {
            learnerName = group.name || "Unnamed Group";
            enrollment = group.enrollment;

            const members = await prisma.group.findMany({
                where: {
                    name: group.name,
                    deletedAt: null,
                    enrollment: { classId: assignment.classId }
                },
                include: {
                    enrollment: {
                        include: { user: { select: { id: true, name: true, username: true } } }
                    }
                }
            });
            groupMembers = members.map(m => ({
                id: m.enrollment.id,
                name: m.enrollment.user.name || m.enrollment.user.username
            }));
        }
    }

    if (!enrollment && typeof eid === 'number') {
        enrollment = await getEnrollmentById(eid);
    }

    if (!enrollment && typeof eid !== 'string') return notFound();

    // Ensure permissions or ownership (learners can only see their own results)
    // For now, we allow reading if enrolled, but ideally we check currentUserId
    // if (!canViewAll && enrollment?.userId !== currentUserId) return unauthorized();

    const gradingData = await getGradingData(assignmentId, typeof eid === 'string' ? decodeURIComponent(eid) : eid);

    if (!gradingData) return notFound();

    return (
        <ResultDetailView
            assignmentId={assignmentId}
            enrollmentId={eid}
            learnerName={learnerName}
            groupMembers={groupMembers}
            initialData={gradingData as any}
            title={`${assignment.title}: Details`}
            subtitle={assignment.class?.title || assignment.course?.title || "Assignment Result"}
            breadcrumbItems={[
                { label: "Home", href: "/classes" },
                { label: assignment.class?.title || "Class", href: `/classes/${assignment.classId}/overview` },
                { label: assignment.title || "Assignment", href: `/assignment/${id}` },
                { label: "Result Detail", href: "#" },
            ]}
            backUrl={`/classes/${assignment.classId}/overview`}
        />
    );
}
