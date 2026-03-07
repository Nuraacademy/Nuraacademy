"use server";

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function updateSessionContent(
    moduleId: string,
    classId: string,
    courseId: string,
    title: string,
    isSynchronous: boolean,
    schedule: any,
    contentData: any,
    referenceData: any[]
) {
    try {
        const id = parseInt(moduleId);

        // Update the session in the database
        await prisma.session.update({
            where: { id },
            data: {
                title: title,
                isSynchronous: isSynchronous,
                schedule: schedule,
                content: contentData,
                reference: referenceData
            }
        });

        // Revalidate the session page to show the updated data
        const sessionPath = `/classes/${classId}/course/${courseId}/session/${moduleId}`;
        revalidatePath(sessionPath);

        return { success: true };
    } catch (error) {
        console.error("Failed to update session:", error);
        return { success: false, error: "Failed to update session" };
    }
}

export async function deleteSession(sessionId: number, classId: string) {
    try {
        await prisma.session.update({
            where: { id: sessionId },
            data: { deletedAt: new Date() }
        });

        // Revalidate the course overview page to reflect the deletion
        revalidatePath(`/classes/${classId}/overview`);

        return { success: true };
    } catch (error) {
        console.error("Failed to delete session:", error);
        return { success: false, error: "Failed to delete session" };
    }
}

export async function createSession(
    classId: string,
    courseId: number,
    data: {
        title: string;
        isSynchronous: boolean;
        schedule: any;
        content: any;
        reference: any[]
    }
) {
    try {
        const newSession = await prisma.session.create({
            data: {
                courseId: courseId,
                title: data.title,
                isSynchronous: data.isSynchronous,
                schedule: data.schedule,
                content: data.content,
                reference: data.reference,
            }
        });

        revalidatePath(`/classes/${classId}/course/${courseId}/overview`);

        return { success: true, sessionId: newSession.id };
    } catch (error) {
        console.error("Failed to create session:", error);
        return { success: false, error: "Failed to create session" };
    }
}
