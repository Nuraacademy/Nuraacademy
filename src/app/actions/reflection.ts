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
        } else {
            revalidatePath(`/classes/[id]/course/[course_id]/overview`, 'page');
        }
        
        return { success: true, data: reflection };
    } catch (error: any) {
        console.error("Save Reflection Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteReflection(id: number, sessionId: number) {
    try {
        await requirePermission('Feedback', 'DELETE_REFLECTION');
        await prisma.reflection.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        revalidatePath(`/classes/[id]/course/[course_id]/session/${sessionId}`, 'page');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
