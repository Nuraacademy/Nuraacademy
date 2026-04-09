"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";

export async function getClassFeedback(classId: number, enrollmentId: number) {
    try {
        await requirePermission('Feedback', 'CREATE_EDIT_CLASS_FEEDBACK'); // Updated from reflection
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const feedback = await prisma.classFeedback.findUnique({
            where: {
                userId_classId: {
                    userId,
                    classId
                }
            }
        });
        return { success: true, data: feedback };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveClassFeedback(data: {
    classId: number;
    enrollmentId: number;
    courseStructure?: number;
    courseStructureFeedback?: string;
    materialQuality?: number;
    materialQualityFeedback?: string;
    practicalRelevance?: number;
    practicalRelevanceFeedback?: string;
    learningEnvironment?: number;
    learningEnvironmentFeedback?: string;
    technicalSupport?: number;
    technicalSupportFeedback?: string;
    content?: string;
}) {
    try {
        await requirePermission('Feedback', 'CREATE_EDIT_CLASS_FEEDBACK');
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const existing = await prisma.classFeedback.findUnique({
            where: {
                userId_classId: {
                    userId,
                    classId: data.classId
                }
            }
        });
        const isEdited = !!existing;

        const feedback = await prisma.classFeedback.upsert({
            where: {
                userId_classId: {
                    userId,
                    classId: data.classId
                }
            },
            update: {
                courseStructure: data.courseStructure,
                courseStructureFeedback: data.courseStructureFeedback,
                materialQuality: data.materialQuality,
                materialQualityFeedback: data.materialQualityFeedback,
                practicalRelevance: data.practicalRelevance,
                practicalRelevanceFeedback: data.practicalRelevanceFeedback,
                learningEnvironment: data.learningEnvironment,
                learningEnvironmentFeedback: data.learningEnvironmentFeedback,
                technicalSupport: data.technicalSupport,
                technicalSupportFeedback: data.technicalSupportFeedback,
                content: data.content,
                enrollmentId: data.enrollmentId,
                isEdited: isEdited
            },
            create: {
                userId: userId,
                classId: data.classId,
                enrollmentId: data.enrollmentId,
                courseStructure: data.courseStructure,
                courseStructureFeedback: data.courseStructureFeedback,
                materialQuality: data.materialQuality,
                materialQualityFeedback: data.materialQualityFeedback,
                practicalRelevance: data.practicalRelevance,
                practicalRelevanceFeedback: data.practicalRelevanceFeedback,
                learningEnvironment: data.learningEnvironment,
                learningEnvironmentFeedback: data.learningEnvironmentFeedback,
                technicalSupport: data.technicalSupport,
                technicalSupportFeedback: data.technicalSupportFeedback,
                content: data.content,
                isEdited: false
            }
        });

        revalidatePath(`/classes/${data.classId}/feedback`);
        revalidatePath(`/assignment`);

        return { success: true, data: feedback };
    } catch (error: any) {
        console.error("Save Class Feedback Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getAllClassFeedbacks(classId: number) {
    try {
        await requirePermission('Feedback', 'CREATE_EDIT_CLASS_FEEDBACK'); // Updated to use class feedback privilege
        const feedbacks = await prisma.classFeedback.findMany({
            where: {
                classId,
                deletedAt: null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return { success: true, data: feedbacks };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
