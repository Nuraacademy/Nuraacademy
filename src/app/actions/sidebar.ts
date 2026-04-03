"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function getSidebarData() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        // 1. Fetch User Role
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });
        const roleName = user?.role?.name || "";
        const isLearner = roleName === 'Learner';
        const isStaff = ['Trainer', 'Instructor', 'Instructur', 'Learning Designer'].includes(roleName);
        const isAdmin = roleName === 'Admin';

        // 2. Fetch Classes (Assigned for Staff, Enrolled for Learners)
        let myClassesRaw = [];
        let enrolledClassIds: number[] = [];

        if (isAdmin) {
            // Admins see all classes (or a recent subset)
            myClassesRaw = await prisma.class.findMany({
                where: { deletedAt: null },
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
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            });
        } else if (isStaff) {
            // Staff see their assigned classes
            const classFilter = {
                OR: [
                    { trainerId: userId },
                    { createdBy: userId },
                    { courses: { some: { createdBy: userId } } },
                    { courses: { some: { sessions: { some: { createdBy: userId } } } } }
                ]
            };

            myClassesRaw = await prisma.class.findMany({
                where: { deletedAt: null, ...classFilter },
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
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            });
        } else {
            // Learners see their enrolled classes
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    userId,
                    deletedAt: null,
                    status: 'ACTIVE',
                    class: { deletedAt: null }
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
            myClassesRaw = enrollments.map(en => en.class);
            enrolledClassIds = enrollments.map(en => en.classId);
        }

        const myClasses = myClassesRaw.map(cls => ({
            id: cls.id.toString(),
            title: cls.title,
            courses: cls.courses.map(course => ({
                id: course.id.toString(),
                title: course.title,
                sessions: course.sessions.map(session => ({
                    id: session.id.toString(),
                    title: session.title
                }))
            }))
        }));

        // 3. Fetch Assignments for this user
        let assignments = [];
        
        if (isLearner) {
            assignments = await prisma.assignment.findMany({
                where: {
                    classId: { in: enrolledClassIds },
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
                orderBy: { endDate: 'asc' }, 
                take: 6
            });
        } else {
            // Admin/Staff see all relevant ungraded assignments (simplified for sidebar)
            const classFilter = isAdmin ? {} : (isStaff ? {
                OR: [
                    { trainerId: userId },
                    { createdBy: userId },
                    { courses: { some: { createdBy: userId } } },
                    { courses: { some: { sessions: { some: { createdBy: userId } } } } }
                ]
            } : { id: -1 });

            assignments = await prisma.assignment.findMany({
                where: { 
                    deletedAt: null,
                    class: classFilter,
                    OR: [
                        { startDate: null },
                        { startDate: { lte: new Date() } }
                    ]
                },
                orderBy: { createdAt: 'desc' }, 
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

        // 4. Fetch Actual Feedback Items
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

        const feedbackLinks = allFeedbacks.slice(0, 6).map(f => ({
            id: f.id.toString(),
            name: f.title,
            type: f.type.toLowerCase(), 
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
