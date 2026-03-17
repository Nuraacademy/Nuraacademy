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
    const { id, enrollmentId: rawEnrollmentId } = await params;
    const assignmentId = parseInt(id);
    
    // Check if it's a numeric ID or a string name
    const isNumeric = /^\d+$/.test(rawEnrollmentId);
    const eid = isNumeric ? parseInt(rawEnrollmentId) : rawEnrollmentId;

    await requirePermission('Assignment', 'GRADE_ASSIGNMENT');

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) return notFound();

    let enrollment: any = null;
    let learnerName = "Unknown";
    let groupMembers: { id: number, name: string }[] = [];

    if (typeof eid === 'number') {
        const initialEnrollment = await getEnrollmentById(eid);
        enrollment = initialEnrollment;
        learnerName = enrollment?.user.name || enrollment?.user.username || "Unknown";
    }

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

            // Find all members of this group in this class
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
         // Fallback for individual if not found via group logic
         enrollment = await getEnrollmentById(eid);
    }

    if (!enrollment && typeof eid !== 'string') return notFound();

    const gradingData = await getGradingData(assignmentId, typeof eid === 'string' ? decodeURIComponent(eid) : eid);

    if (!gradingData) return notFound();

    return (
        <GradingClient
            assignmentId={assignmentId}
            enrollmentId={eid}
            learnerName={learnerName}
            groupMembers={groupMembers}
            initialData={gradingData}
            title={`Grading: ${assignment.title}`}
            subtitle={assignment.class?.title || assignment.course?.title || "Assignment"}
            breadcrumbItems={[
                { label: "Home", href: "/" },
                { label: "Assignments", href: "/assignment" },
                { label: assignment.title || "Assignment", href: `/assignment/${id}` },
                { label: "Results", href: `/assignment/${id}/results` },
                { label: learnerName, href: "#" },
            ]}
            backUrl={`/assignment/${id}/results`}
            submitAction={submitGradingAction.bind(null, assignmentId)}
        />
    );
}
