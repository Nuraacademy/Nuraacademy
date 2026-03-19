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
                endDate: { gte: new Date() }
            },
            orderBy: {
                endDate: 'asc'
            },
            take: 5 // Limit to avoid clutter
        });

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

        // Fetch user's class feedback status
        const classFeedbacks = await prisma.classFeedback.findMany({
            where: { userId, deletedAt: null },
            select: { classId: true }
        });
        const submittedClassIds = new Set(classFeedbacks.map(f => f.classId));

        enrollments.forEach(en => {
            // Add Class Feedback link
            const hasSubmitted = submittedClassIds.has(en.classId);
            
            // For learners, only show if NOT submitted. For staff, always show (to view list).
            if (!isLearner || !hasSubmitted) {
                feedbackLinks.push({
                    id: `class-fb-${en.classId}`,
                    name: isLearner ? `${en.class.title} Feedback` : `${en.class.title} Feedback`,
                    type: 'feedback',
                    href: isLearner 
                        ? `/class/feedback/${en.classId}`
                        : `/feedback/class/${en.classId}`
                });
            }

            en.class.courses.forEach(course => {
                if (!processedCourseIds.has(course.id)) {
                    processedCourseIds.add(course.id);
                    
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

        // 5. Add "My feedback" for Learners
        if (isLearner) {
            feedbackLinks.unshift({
                id: 'my-feedback',
                name: 'My feedback',
                type: 'feedback',
                href: '/feedback'
            });
        }

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
