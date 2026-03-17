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
                            href: `/analytics/class/${a.enrollment.classId}`
                        });
                    }
                });
            });

        } else {
            // --- INSTRUCTOR/ADMIN VIEW: Reflections needing feedback ---
            
            // 1. Fetch Student Reflections
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
