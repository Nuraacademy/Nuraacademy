"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/lib/rbac"

export async function getTrainerFeedback(evaluatorId: number, trainerId: number, classId: number) {
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const feedback = await prisma.trainerFeedback.findUnique({
            where: {
                evaluatorId_trainerId_classId: {
                    evaluatorId,
                    trainerId,
                    classId
                }
            }
        });

        return { success: true, data: feedback };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveTrainerFeedback(data: {
    evaluatorId: number;
    trainerId: number;
    classId: number;
    mastery?: number;
    masteryFeedback?: string;
    communication?: number;
    communicationFeedback?: string;
    engagement?: number;
    engagementFeedback?: string;
    responsiveness?: number;
    responsivenessFeedback?: string;
    motivation?: number;
    motivationFeedback?: string;
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

    const { evaluatorId, trainerId, classId } = data;

    try {
        // Check if it already exists to determine if it's an "edit"
        const existing = await prisma.trainerFeedback.findUnique({
            where: {
                evaluatorId_trainerId_classId: {
                    evaluatorId,
                    trainerId,
                    classId
                }
            }
        });

        const isEdited = !!existing;

        const result = await prisma.trainerFeedback.upsert({
            where: {
                evaluatorId_trainerId_classId: {
                    evaluatorId,
                    trainerId,
                    classId
                }
            },
            update: {
                mastery: data.mastery,
                masteryFeedback: data.masteryFeedback,
                communication: data.communication,
                communicationFeedback: data.communicationFeedback,
                engagement: data.engagement,
                engagementFeedback: data.engagementFeedback,
                responsiveness: data.responsiveness,
                responsivenessFeedback: data.responsivenessFeedback,
                motivation: data.motivation,
                motivationFeedback: data.motivationFeedback,
                isEdited: isEdited
            },
            create: {
                evaluatorId,
                trainerId,
                classId,
                mastery: data.mastery,
                masteryFeedback: data.masteryFeedback,
                communication: data.communication,
                communicationFeedback: data.communicationFeedback,
                engagement: data.engagement,
                engagementFeedback: data.engagementFeedback,
                responsiveness: data.responsiveness,
                responsivenessFeedback: data.responsivenessFeedback,
                motivation: data.motivation,
                motivationFeedback: data.motivationFeedback,
                isEdited: false
            }
        });

        revalidatePath(`/feedback/trainer/${trainerId}`);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function clearTrainerFeedback(evaluatorId: number, trainerId: number, classId: number) {
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
        const result = await prisma.trainerFeedback.update({
            where: {
                evaluatorId_trainerId_classId: {
                    evaluatorId,
                    trainerId,
                    classId
                }
            },
            data: {
                mastery: 0,
                masteryFeedback: "",
                communication: 0,
                communicationFeedback: "",
                engagement: 0,
                engagementFeedback: "",
                responsiveness: 0,
                responsivenessFeedback: "",
                motivation: 0,
                motivationFeedback: "",
                isEdited: true
            }
        });

        revalidatePath(`/feedback/trainer/${trainerId}`);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
