"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { FeedbackType } from "@/components/ui/card/feedback_card";

export interface FeedbackItem {
    id: string;
    title: string;
    type: FeedbackType;
    className: string;
    content: string;
    createdAt: Date;
    href: string;
}

export async function getFeedbacks() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const feedbacks: FeedbackItem[] = [];

        console.log("Fetching feedbacks for user:", userId);

        // 0. Fetch User Role
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });
        const isLearner = user?.role?.name === 'Learner';

        console.log("Fetching feedbacks for user:", userId, "isLearner:", isLearner);

        if (isLearner) {
            // --- LEARNER VIEW: Feedbacks received ---
            
            // 1. Fetch Reflection Feedback (Trainer's response to your reflection)
            const trainerFeedbacks = await prisma.feedback.findMany({
                where: {
                    reflection: {
                        userId: userId,
                        deletedAt: null
                    },
                    deletedAt: null
                },
                include: {
                    reflection: {
                        include: {
                            course: true,
                            session: true,
                            enrollment: {
                                include: {
                                    class: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            trainerFeedbacks.forEach(f => {
                if (f.reflection) {
                    feedbacks.push({
                        id: `trainer-${f.id}`,
                        title: `${f.reflection.course?.title || f.reflection.session?.title || "Course"} Reflection Feedback`,
                        type: 'Reflection',
                        className: f.reflection.enrollment.class.title,
                        content: f.content,
                        createdAt: f.createdAt,
                        href: `/classes/${f.reflection.enrollment.classId}/course/${f.reflection.courseId}/reflection`
                    });
                }
            });

            // 2. Fetch Assignment Feedback
            const assignmentResults = await prisma.assignmentResult.findMany({
                where: {
                    enrollment: {
                        userId: userId,
                        deletedAt: null
                    },
                    assignment: {
                        type: { in: ['PROJECT', 'ASSIGNMENT'] }
                    },
                    feedback: { not: null },
                    deletedAt: null
                },
                include: {
                    assignment: {
                        include: {
                            class: true
                        }
                    },
                    enrollment: {
                        include: {
                            class: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            assignmentResults.forEach(ar => {
                feedbacks.push({
                    id: `assignment-${ar.id}`,
                    title: `${ar.assignment.title || "Assignment"} Feedback`,
                    type: 'Assignment',
                    className: ar.enrollment.class.title,
                    content: ar.feedback || "",
                    createdAt: ar.createdAt,
                    href: `/assignment/${ar.assignmentId}`
                });
            });

            // 3. Fetch Class/Peer Feedback (Learner Analytics)
            const analytics = await prisma.learnerAnalytics.findMany({
                where: {
                    enrollment: {
                        userId: userId,
                        deletedAt: null
                    }
                },
                include: {
                    enrollment: {
                        include: {
                            class: true
                        }
                    }
                }
            });

            analytics.forEach(a => {
                const feedbackFields = [
                    { name: 'Peer Feedback', content: a.cooperationFeedback },
                    { name: 'Class Feedback', content: a.communicationFeedback }
                ];

                feedbackFields.forEach(ff => {
                    if (ff.content) {
                        feedbacks.push({
                            id: `analytics-${a.id}-${ff.name.replace(/\s+/g, '-').toLowerCase()}`,
                            title: `${a.enrollment.class.title} ${ff.name}`,
                            type: ff.name.includes('Peer') ? 'Peer' : 'Class',
                            className: a.enrollment.class.title,
                            content: ff.content,
                            createdAt: a.updatedAt,
                            href: `/classes/${a.enrollment.classId}/analytics`
                        });
                    }
                });
            });

            // 4. Fetch Peer Feedback from PeerFeedback model
            const peerFeedbacks = await prisma.peerFeedback.findMany({
                where: {
                    evaluatee: {
                        userId: userId,
                        deletedAt: null
                    }
                },
                include: {
                    evaluator: {
                        include: {
                            user: { select: { name: true, username: true } }
                        }
                    },
                    class: true
                }
            });

            peerFeedbacks.forEach(pf => {
                feedbacks.push({
                    id: `peer-${pf.id}`,
                    title: `Peer Feedback from ${pf.evaluator.user.name || pf.evaluator.user.username}`,
                    type: 'Peer',
                    className: pf.class.title,
                    content: `Cooperation: ${pf.cooperation}, Attendance: ${pf.attendance}, Task Completion: ${pf.taskCompletion}, Initiatives: ${pf.initiatives}, Communication: ${pf.communication}`,
                    createdAt: pf.updatedAt,
                    href: `/classes/${pf.classId}/analytics`
                });
            });

            // 5. Fetch Class Feedback (Learner's own submission)
            const classFeedbacks = await prisma.classFeedback.findMany({
                where: {
                    userId: userId,
                    deletedAt: null
                },
                include: {
                    class: true
                },
                orderBy: { createdAt: 'desc' }
            });

            classFeedbacks.forEach(cf => {
                feedbacks.push({
                    id: `class-fb-own-${cf.id}`,
                    title: `${cf.class.title} Feedback (Submitted)`,
                    type: 'Class',
                    className: cf.class.title,
                    content: cf.content,
                    createdAt: cf.createdAt,
                    href: `/class/feedback/${cf.classId}`
                });
            });

        } else {
            // --- INSTRUCTOR/ADMIN VIEW: Reflections needing feedback & Assignments ---
            
            // 1. Fetch Student Reflections (already existing)
            const reflections = await prisma.reflection.findMany({
                where: {
                    deletedAt: null,
                    user: {
                        role: { name: 'Learner' }
                    }
                },
                include: {
                    user: true,
                    course: true,
                    session: true,
                    enrollment: {
                        include: {
                            class: true
                        }
                    },
                    feedback: true
                },
                orderBy: { createdAt: 'desc' },
                take: 50
            });

            reflections.forEach(r => {
                feedbacks.push({
                    id: `student-ref-${r.id}`,
                    title: `${r.course?.title || r.session?.title || "Reflection"}`,
                    type: 'Reflection',
                    className: r.enrollment.class.title,
                    content: r.content,
                    createdAt: r.createdAt,
                    href: r.courseId 
                        ? `/feedback/reflection/course/${r.courseId}` 
                        : `/feedback/reflection/session/${r.sessionId}`
                });
            });

            // 2. Fetch Assignments for this instructor/admin
            // We'll fetch assignments matching classes the user might be involved in, 
            // or just all active assignments if they are high-level.
            // For now, let's fetch assignments that have results (submissions).
            const assignments = await prisma.assignment.findMany({
                where: {
                    type: { in: ['PROJECT', 'ASSIGNMENT'] },
                    deletedAt: null,
                },
                include: {
                    class: true,
                    course: true,
                    _count: {
                        select: { assignmentResults: { where: { finishedAt: { not: null } } } }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 50
            });

            assignments.forEach(a => {
                feedbacks.push({
                    id: `instructor-assignment-${a.id}`,
                    title: `${a.title || "Assignment"}`,
                    type: 'Assignment',
                    className: a.class?.title || a.course?.title || "Multiple Classes",
                    content: a._count.assignmentResults > 0 
                        ? `${a._count.assignmentResults} submission(s) needing review.`
                        : "No submissions yet.",
                    createdAt: a.createdAt,
                    href: `/assignment/${a.id}/results`
                });
            });

            // 3. Fetch Class Feedbacks (Submitted by students)
            const classFeedbacks = await prisma.classFeedback.findMany({
                where: {
                    deletedAt: null
                },
                include: {
                    user: true,
                    class: true
                },
                orderBy: { createdAt: 'desc' },
                take: 50
            });

            classFeedbacks.forEach(cf => {
                feedbacks.push({
                    id: `staff-class-fb-${cf.id}`,
                    title: `${cf.class.title} Feedback`,
                    type: 'Class',
                    className: cf.class.title,
                    content: cf.content,
                    createdAt: cf.createdAt,
                    href: `/feedback/class/${cf.classId}`
                });
            });
        }

        console.log("Total consolidated feedbacks:", feedbacks.length);

        // 4. Sort all feedbacks by date
        feedbacks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return { success: true, data: feedbacks };
    } catch (error: any) {
        console.error("Get Feedbacks Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getFeedbackHubData() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

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
                                user: {
                                    select: { id: true, name: true, username: true, role: { select: { name: true } } }
                                },
                                sessions: {
                                    where: { deletedAt: null },
                                    include: {
                                        user: {
                                            select: { id: true, name: true, username: true, role: { select: { name: true } } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const feedbackHub = enrollments.map(enrollment => {
            const trainersMap = new Map();
            enrollment.class.courses.forEach(course => {
                if (course.user) {
                    trainersMap.set(course.user.id, {
                        ...course.user,
                        roleName: course.user.role?.name || "Instructor"
                    });
                }
                course.sessions.forEach(session => {
                    if (session.user) {
                        trainersMap.set(session.user.id, {
                            ...session.user,
                            roleName: session.user.role?.name || "Instructor"
                        });
                    }
                });
            });

            return {
                classId: enrollment.classId,
                classTitle: enrollment.class.title,
                trainers: Array.from(trainersMap.values())
            };
        });

        return { success: true, data: feedbackHub };
    } catch (error: any) {
        console.error("Get Feedback Hub Data Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getAssignmentLearners(assignmentId: number) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const { getAssignmentResultsByAssignmentId } = await import("@/controllers/assignmentController");
        const results = await getAssignmentResultsByAssignmentId(assignmentId);

        return { success: true, data: results };
    } catch (error: any) {
        console.error("Get Assignment Learners Error:", error);
        return { success: false, error: error.message };
    }
}
