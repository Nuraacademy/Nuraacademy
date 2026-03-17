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
            // --- LEARNER VIEW: Show all feedback-relevant items from enrollments ---
            // Use separate queries instead of one large nested include to avoid Prisma P2022 join issues

            // 1. Assignments — fetch all assignment results for this learner
            const assignmentResults = await prisma.assignmentResult.findMany({
                where: {
                    enrollment: { userId, deletedAt: null },
                    assignment: {
                        type: { in: ['PROJECT', 'ASSIGNMENT'] },
                        deletedAt: null,
                    },
                    deletedAt: null,
                },
                include: {
                    assignment: true,
                    enrollment: {
                        include: { class: true },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });

            assignmentResults.forEach(ar => {
                feedbacks.push({
                    id: `assignment-${ar.id}`,
                    title: `${ar.assignment.title || 'Assignment'}`,
                    type: 'Assignment',
                    className: ar.enrollment.class.title,
                    content: ar.feedback
                        ? ar.feedback
                        : ar.finishedAt
                            ? 'Submitted — awaiting feedback'
                            : 'Not submitted yet',
                    createdAt: ar.updatedAt || ar.createdAt,
                    href: `/assignment/${ar.assignmentId}`,
                });
            });

            // 2. Reflections — fetch all written reflections for this learner
            const reflections = await prisma.reflection.findMany({
                where: { userId, deletedAt: null },
                include: {
                    course: { select: { title: true } },
                    session: { select: { title: true } },
                    enrollment: { include: { class: true } },
                    feedback: { select: { content: true } },
                },
                orderBy: { createdAt: 'desc' },
            });

            reflections.forEach(r => {
                feedbacks.push({
                    id: `reflection-${r.id}`,
                    title: `${r.course?.title || r.session?.title || 'Reflection'}`,
                    type: 'Reflection',
                    className: r.enrollment.class.title,
                    content: r.feedback
                        ? r.feedback.content
                        : 'Reflection submitted — awaiting trainer feedback',
                    createdAt: r.createdAt,
                    href: r.courseId
                        ? `/classes/${r.enrollment.classId}/course/${r.courseId}/reflection`
                        : `/classes/${r.enrollment.classId}/course/session/${r.sessionId}/reflection`,
                });
            });

            // 3. Learner Analytics (Peer / Class feedback from trainer)
            const analyticsItems = await prisma.learnerAnalytics.findMany({
                where: {
                    enrollment: { userId, deletedAt: null },
                },
                include: {
                    enrollment: { include: { class: true } },
                },
            });

            analyticsItems.forEach(a => {
                const fields = [
                    { name: 'Peer Feedback', content: a.cooperationFeedback },
                    { name: 'Class Feedback', content: a.communicationFeedback },
                ];
                fields.forEach(ff => {
                    if (ff.content) {
                        feedbacks.push({
                            id: `analytics-${a.id}-${ff.name.replace(/\s+/g, '-').toLowerCase()}`,
                            title: `${a.enrollment.class.title} ${ff.name}`,
                            type: ff.name.includes('Peer') ? 'Peer' : 'Class',
                            className: a.enrollment.class.title,
                            content: ff.content,
                            createdAt: a.updatedAt,
                            href: `/analytics/class/${a.enrollment.classId}`,
                        });
                    }
                });
            });

            // 4. Received Peer Feedback from PeerFeedback model
            const peerFeedbacks = await prisma.peerFeedback.findMany({
                where: {
                    evaluatee: { userId, deletedAt: null },
                },
                include: {
                    evaluator: {
                        include: {
                            user: { select: { name: true, username: true } },
                        },
                    },
                    class: true,
                },
                orderBy: { updatedAt: 'desc' },
            });

            peerFeedbacks.forEach(pf => {
                feedbacks.push({
                    id: `peer-${pf.id}`,
                    title: `Peer Feedback from ${pf.evaluator.user.name || pf.evaluator.user.username}`,
                    type: 'Peer',
                    className: pf.class.title,
                    content: `Cooperation: ${pf.cooperation ?? '-'}, Attendance: ${pf.attendance ?? '-'}, Task Completion: ${pf.taskCompletion ?? '-'}, Initiatives: ${pf.initiatives ?? '-'}, Communication: ${pf.communication ?? '-'}`,
                    createdAt: pf.updatedAt,
                    href: `/analytics/class/${pf.classId}`,
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

            // 3. Fetch Peer Feedbacks submitted by learners (instructor overview)
            const peerFeedbacks = await prisma.peerFeedback.findMany({
                include: {
                    evaluator: {
                        include: {
                            user: { select: { name: true, username: true } }
                        }
                    },
                    evaluatee: {
                        include: {
                            user: { select: { name: true, username: true } }
                        }
                    },
                    class: true
                },
                orderBy: { updatedAt: 'desc' },
                take: 50
            });

            peerFeedbacks.forEach(pf => {
                const evaluatorName = pf.evaluator.user.name || pf.evaluator.user.username;
                const evaluateeName = pf.evaluatee.user.name || pf.evaluatee.user.username;
                feedbacks.push({
                    id: `instructor-peer-${pf.id}`,
                    title: `Peer Feedback: ${evaluatorName} → ${evaluateeName}`,
                    type: 'Peer',
                    className: pf.class.title,
                    content: `Cooperation: ${pf.cooperation ?? '-'}, Attendance: ${pf.attendance ?? '-'}, Task Completion: ${pf.taskCompletion ?? '-'}, Initiatives: ${pf.initiatives ?? '-'}, Communication: ${pf.communication ?? '-'}`,
                    createdAt: pf.updatedAt,
                    href: `/analytics/class/${pf.classId}`
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
