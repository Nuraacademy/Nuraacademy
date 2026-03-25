"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { requirePermission } from "@/lib/rbac"

export async function getPeerFeedback(evaluatorId: number, evaluateeId: number, classId: number) {
    await requirePermission('Feedback', 'VIEW_DETAIL_PEER_FEEDBACK');
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const feedback = await prisma.peerFeedback.findUnique({
            where: {
                evaluatorId_evaluateeId_classId: {
                    evaluatorId,
                    evaluateeId,
                    classId
                }
            }
        });

        return { success: true, data: feedback };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function savePeerFeedback(data: {
    evaluatorId: number;
    evaluateeId: number;
    classId: number;
    cooperation?: number;
    cooperationFeedback?: string;
    attendance?: number;
    attendanceFeedback?: string;
    taskCompletion?: number;
    taskCompletionFeedback?: string;
    initiatives?: number;
    initiativesFeedback?: string;
    communication?: number;
    communicationFeedback?: string;
}) {
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Verify the evaluator belongs to the user
    const evaluatorEnrollment = await prisma.enrollment.findUnique({
        where: { id: data.evaluatorId },
        select: { userId: true }
    });

    if (!evaluatorEnrollment || evaluatorEnrollment.userId !== userId) {
        return { success: false, error: "Forbidden: You can only submit feedback as yourself." };
    }

    const { evaluatorId, evaluateeId, classId } = data;

    try {
        // Check if it already exists to determine if it's an "edit"
        const existing = await prisma.peerFeedback.findUnique({
            where: {
                evaluatorId_evaluateeId_classId: {
                    evaluatorId,
                    evaluateeId,
                    classId
                }
            }
        });

        const isEdited = !!existing;

        const result = await prisma.peerFeedback.upsert({
            where: {
                evaluatorId_evaluateeId_classId: {
                    evaluatorId,
                    evaluateeId,
                    classId
                }
            },
            update: {
                cooperation: data.cooperation,
                cooperationFeedback: data.cooperationFeedback,
                attendance: data.attendance,
                attendanceFeedback: data.attendanceFeedback,
                taskCompletion: data.taskCompletion,
                taskCompletionFeedback: data.taskCompletionFeedback,
                initiatives: data.initiatives,
                initiativesFeedback: data.initiativesFeedback,
                communication: data.communication,
                communicationFeedback: data.communicationFeedback,
                isEdited: isEdited
            },
            create: {
                evaluatorId,
                evaluateeId,
                classId,
                cooperation: data.cooperation,
                cooperationFeedback: data.cooperationFeedback,
                attendance: data.attendance,
                attendanceFeedback: data.attendanceFeedback,
                taskCompletion: data.taskCompletion,
                taskCompletionFeedback: data.taskCompletionFeedback,
                initiatives: data.initiatives,
                initiativesFeedback: data.initiativesFeedback,
                communication: data.communication,
                communicationFeedback: data.communicationFeedback,
                isEdited: false
            }
        });

        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function clearPeerFeedback(evaluatorId: number, evaluateeId: number, classId: number) {
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Verify the evaluator belongs to the user
    const evaluatorEnrollment = await prisma.enrollment.findUnique({
        where: { id: evaluatorId },
        select: { userId: true }
    });

    if (!evaluatorEnrollment || evaluatorEnrollment.userId !== userId) {
        return { success: false, error: "Forbidden" };
    }

    try {
        const result = await prisma.peerFeedback.update({
            where: {
                evaluatorId_evaluateeId_classId: {
                    evaluatorId,
                    evaluateeId,
                    classId
                }
            },
            data: {
                cooperation: 0,
                cooperationFeedback: "",
                attendance: 0,
                attendanceFeedback: "",
                taskCompletion: 0,
                taskCompletionFeedback: "",
                initiatives: 0,
                initiativesFeedback: "",
                communication: 0,
                communicationFeedback: "",
                isEdited: true
            }
        });

        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getReceivedPeerFeedbacks(enrollmentId: number) {
    await requirePermission('Feedback', 'VIEW_SEARCH_PEER_FEEDBACK');
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const feedbacks = await prisma.peerFeedback.findMany({
            where: {
                evaluateeId: enrollmentId
            },
            include: {
                evaluator: {
                    include: {
                        user: {
                            select: { name: true, username: true }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return { success: true, data: feedbacks };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
