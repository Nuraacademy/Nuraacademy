import { hasPermission, requirePermission } from "@/lib/rbac";
import AssignmentList from "./assignment_list";
import { getAssignments } from "@/controllers/assignmentController";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AssignmentPage() {
    await requirePermission('Assignment', 'SEARCH_VIEW_ASSIGNMENT');
    
    const userId = await getCurrentUserId();
    const isAdmin = await hasPermission('Assignment', 'CREATE_UPDATE_ASSIGNMENT');
    const canDeleteAssignment = await hasPermission('Assignment', 'DELETE_ASSIGNMENT');
    const canGrade = await hasPermission('Assignment', 'GRADE_ASSIGNMENT');
    
    // For students (non-admins), fetch only unfinished assignments
    let assignments = await getAssignments(!isAdmin && userId ? userId : undefined);
    
    // Add synthetic Class Feedback assignments for learners
    if (!isAdmin && !canGrade && userId) {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId, deletedAt: null },
            include: { class: true }
        });

        const feedbacks = await prisma.classFeedback.findMany({
            where: { userId, deletedAt: null },
            select: { classId: true }
        });
        const submittedClassIds = new Set(feedbacks.map(f => f.classId));

        const feedbackAssignments = enrollments
            .filter(en => !submittedClassIds.has(en.classId))
            .map(en => ({
                id: -(en.classId * 1000), // Synthetic negative ID to avoid conflicts
                title: `${en.class.title} Feedback`,
                type: "PROJECT", // Use PROJECT type so it shows the icon/style but we'll override label
                syntheticType: "Class Feedback", 
                submissionType: "INDIVIDUAL",
                classId: en.classId,
                courseId: null,
                sessionId: null,
                class: { title: en.class.title },
                course: null
            }));

        assignments = [...(feedbackAssignments as any), ...assignments];
    } else if (userId) {
        // For staff/admins, show feedback cards for all active classes
        const classes = await prisma.class.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' }
        });

        const feedbackAssignments = classes.map(cls => ({
            id: -(cls.id * 1000),
            title: `${cls.title} Feedback (All)`,
            type: "PROJECT",
            syntheticType: "Class Feedback",
            submissionType: "INDIVIDUAL",
            classId: cls.id,
            courseId: null,
            sessionId: null,
            class: { title: cls.title },
            course: null
        }));

        assignments = [...(feedbackAssignments as any), ...assignments];
    }

    const canAddAssignment = isAdmin;

    return <AssignmentList initialAssignments={assignments} canAddAssignment={canAddAssignment} canDeleteAssignment={canDeleteAssignment} canGrade={canGrade} />;
}
