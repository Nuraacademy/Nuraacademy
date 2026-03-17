"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";

export async function getReflection(data: { sessionId?: number; courseId?: number; enrollmentId: number }) {
    try {
        await requirePermission('Feedback', 'VIEW_DETAIL_REFLECTION');
        const reflection = await prisma.reflection.findFirst({
            where: {
                sessionId: data.sessionId || null,
                courseId: data.courseId || null,
                enrollmentId: data.enrollmentId,
                deletedAt: null
            },
            include: {
                feedback: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
        return { success: true, data: reflection };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveReflection(data: {
    sessionId?: number;
    courseId?: number;
    enrollmentId: number;
    content: string;
}) {
    try {
        await requirePermission('Feedback', 'CREATE_EDIT_REFLECTION');
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const where = data.sessionId 
            ? { userId_sessionId: { userId, sessionId: data.sessionId } }
            : { userId_courseId: { userId, courseId: data.courseId! } };

        // Check if feedback exists before updating
        const existing = await prisma.reflection.findUnique({
            where: where as any,
            include: { feedback: true }
        });
        
        if (existing && existing.feedback) {
            return { success: false, error: "Cannot edit reflection once feedback has been provided." };
        }

        const reflection = await prisma.reflection.upsert({
            where: where as any,
            update: {
                content: data.content,
                enrollmentId: data.enrollmentId
            },
            create: {
                userId: userId,
                sessionId: data.sessionId || null,
                courseId: data.courseId || null,
                enrollmentId: data.enrollmentId,
                content: data.content
            }
        });

        if (data.sessionId) {
            revalidatePath(`/classes/[id]/course/[course_id]/session/${data.sessionId}`, 'page');
            revalidatePath(`/feedback/reflection/session/${data.sessionId}`, 'page');
        } else {
            revalidatePath(`/classes/[id]/course/[course_id]/overview`, 'page');
            revalidatePath(`/feedback/reflection/course/${data.courseId}`, 'page');
        }
        
        return { success: true, data: reflection };
    } catch (error: any) {
        console.error("Save Reflection Error:", error);
        return { success: false, error: error.message };
    }
}

export async function saveReflectionFeedback(reflectionId: number, content: string) {
    try {
        await requirePermission('Feedback', 'CREATE_EDIT_ASSIGNMENT_FEEDBACK'); // Using existing feedback privilege
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const feedback = await prisma.feedback.upsert({
            where: { reflectionId },
            update: {
                content: content,
                userId: userId,
            },
            create: {
                reflectionId: reflectionId,
                content: content,
                userId: userId,
            },
            include: {
                reflection: true
            }
        });

        const reflection = feedback.reflection;
        if (reflection && reflection.sessionId) {
            revalidatePath(`/classes/[id]/course/[course_id]/session/${reflection.sessionId}/reflection`, 'page');
            revalidatePath(`/feedback/reflection/session/${reflection.sessionId}`, 'page');
        } else if (reflection && reflection.courseId) {
            revalidatePath(`/classes/[id]/course/[course_id]/reflection`, 'page');
            revalidatePath(`/feedback/reflection/course/${reflection.courseId}`, 'page');
        }

        return { success: true, data: feedback };
    } catch (error: any) {
        console.error("Save Reflection Feedback Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteReflection(id: number, sessionId?: number, courseId?: number) {
    try {
        await requirePermission('Feedback', 'DELETE_REFLECTION');
        
        // Check if feedback exists before deleting
        const existing = await prisma.reflection.findUnique({
            where: { id },
            include: { feedback: true }
        });

        if (existing && existing.feedback) {
            return { success: false, error: "Cannot delete reflection once feedback has been provided." };
        }

        await prisma.reflection.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        
        if (sessionId) {
            revalidatePath(`/classes/[id]/course/[course_id]/session/${sessionId}`, 'page');
        }
        if (courseId) {
            revalidatePath(`/classes/[id]/course/[course_id]/overview`, 'page');
        }
        
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteReflectionFeedback(reflectionId: number) {
    try {
        await requirePermission('Feedback', 'DELETE_ASSIGNMENT_FEEDBACK');
        const feedback = await prisma.feedback.delete({
            where: { reflectionId },
            include: { reflection: true }
        });

        const reflection = feedback.reflection;
        if (reflection && reflection.sessionId) {
            revalidatePath(`/classes/[id]/course/[course_id]/session/${reflection.sessionId}/reflection`, 'page');
            revalidatePath(`/feedback/reflection/session/${reflection.sessionId}`, 'page');
        } else if (reflection && reflection.courseId) {
            revalidatePath(`/classes/[id]/course/[course_id]/reflection`, 'page');
            revalidatePath(`/feedback/reflection/course/${reflection.courseId}`, 'page');
        }

        return { success: true };
    } catch (error: any) {
        console.error("Delete Reflection Feedback Error:", error);
        return { success: false, error: error.message };
    }
}
