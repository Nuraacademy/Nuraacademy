"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function getSidebarData() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        // 1. Fetch Enrolled Classes and their Courses/Sessions
        const enrollments = await prisma.enrollment.findMany({
            where: { 
                userId,
                deletedAt: null,
                status: 'ACTIVE'
            },
            include: {
                class: {
                    include: {
                        courses: {
                            where: { deletedAt: null },
                            include: {
                                sessions: {
                                    where: { deletedAt: null },
                                    orderBy: { id: 'asc' }
                                }
                            }
                        }
                    }
                }
            }
        });

        const myClasses = enrollments.map(en => ({
            id: en.classId.toString(),
            title: en.class.title,
            courses: en.class.courses.map(course => ({
                id: course.id.toString(),
                title: course.title,
                sessions: course.sessions.map(session => ({
                    id: session.id.toString(),
                    title: session.title
                }))
            }))
        }));

        // 2. Fetch User Role for dynamic links
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });
        const isLearner = user?.role?.name === 'Learner';

        // 3. Fetch Upcoming Assignments for these classes
        const classIds = enrollments.map(en => en.classId);
        const assignments = await prisma.assignment.findMany({
            where: {
                classId: { in: classIds },
                deletedAt: null,
                endDate: { gte: new Date() } // Only upcoming/active ones
            },
            orderBy: {
                endDate: 'asc'
            },
            take: 5 // Limit to avoid clutter
        });

        // Add import at the top of the file would be better, but we'll use a direct helper or assume it's available
        // Since we are in a server action, let's pre-calculate the href using the same logic as the component
        // But for non-learners, override it.
        const { getAssignmentEndpoint, mapPrismaAssignmentType } = await import("@/utils/assignment");

        const formattedAssignments = assignments.map(a => {
            const typeLabel = mapPrismaAssignmentType(a.type);
            const defaultHref = getAssignmentEndpoint(
                a.classId?.toString() || "", 
                a.courseId?.toString() || "", 
                a.sessionId?.toString() || "", 
                typeLabel
            );

            return {
                id: a.id.toString(),
                name: a.title || "Untitled Assignment",
                type: a.type,
                href: isLearner ? defaultHref : `/assignment/${a.id}/results`
            };
        });

        // 4. Generate Course-level Reflection/Feedback links (based on CourseReflectionLink logic)
        // Use a Set to keep unique courses if user has multiple enrollments (unlikely but safe)
        const feedbackLinks: any[] = [];
        const processedCourseIds = new Set<number>();

        enrollments.forEach(en => {
            en.class.courses.forEach(course => {
                if (!processedCourseIds.has(course.id)) {
                    processedCourseIds.add(course.id);
                    
                    // Logic from CourseReflectionLink
                    // Instructor (non-learner with permissions) -> List
                    // Learner/Others -> Personal Page
                    const isInstructor = !isLearner; 
                    
                    feedbackLinks.push({
                        id: `course-ref-${course.id}`,
                        name: isInstructor ? `${course.title} Feedback` : `${course.title} Reflection`,
                        type: isInstructor ? 'feedback' : 'reflection',
                        href: isInstructor 
                            ? `/feedback/reflection/course/${course.id}`
                            : `/classes/${en.classId}/course/${course.id}/reflection`
                    });
                }
            });
        });

        return { 
            success: true, 
            data: {
                myClasses: myClasses.slice(0, 5),
                assignments: formattedAssignments,
                feedbacks: feedbackLinks.slice(0, 5)
            }
        };
    } catch (error: any) {
        console.error("Get Sidebar Data Error:", error);
        return { success: false, error: error.message };
    }
}
