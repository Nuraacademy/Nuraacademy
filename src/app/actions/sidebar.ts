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
                status: 'ACTIVE',
                class: {
                    deletedAt: null
                }
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

        // 3. Fetch Assignments for this user (same logic as /assignment page)
        const isAdmin = user?.role?.name === 'Admin' || user?.role?.name === 'Instructor' || user?.role?.name === 'Superadmin';
        
        let assignments = [];
        const classIds = enrollments.map(en => en.classId);
        
        if (!isAdmin && isLearner) {
            assignments = await prisma.assignment.findMany({
                where: {
                    classId: { in: classIds },
                    deletedAt: null,
                    OR: [
                        { startDate: null },
                        { startDate: { lte: new Date() } }
                    ],
                    NOT: {
                        assignmentResults: {
                            some: {
                                enrollment: { userId: userId },
                                finishedAt: { not: null }
                            }
                        }
                    }
                },
                orderBy: { endDate: 'asc' }, // nearest due date order
                take: 6
            });
        } else {
            assignments = await prisma.assignment.findMany({
                where: { 
                    deletedAt: null,
                    OR: [
                        { startDate: null },
                        { startDate: { lte: new Date() } }
                    ]
                },
                orderBy: { endDate: 'asc' }, // nearest due date order
                take: 6
            });
        }

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
                href: isLearner 
                    ? (typeLabel === "Placement" ? defaultHref : `/assignment/${a.id}`)
                    : `/assignment/${a.id}/results`
            };
        });

        // 4. Fetch Actual Feedback Items (same as /feedback page)
        const { getFeedbacks, getFeedbackHubData } = await import("@/app/actions/feedback");
        let allFeedbacks: any[] = [];
        
        if (isLearner) {
            const hubRes = await getFeedbackHubData();
            if (hubRes.success && hubRes.data) {
                allFeedbacks = hubRes.data.received || [];
            }
        } else {
            const res = await getFeedbacks();
            if (res.success && res.data) {
                allFeedbacks = res.data;
            }
        }

        // The feedbacks returned are already sorted by createdAt desc. We just take top 6.
        const feedbackLinks = allFeedbacks.slice(0, 6).map(f => ({
            id: f.id.toString(),
            name: f.title,
            type: f.type.toLowerCase(), // 'reflection', 'assignment', 'peer', 'class'
            href: f.href
        }));

        return {
            success: true,
            data: {
                myClasses: myClasses.slice(0, 5),
                assignments: formattedAssignments.slice(0, 6),
                feedbacks: feedbackLinks,
                isLearner
            }
        };
    } catch (error: any) {
        console.error("Get Sidebar Data Error:", error);
        return { success: false, error: error.message };
    }
}
