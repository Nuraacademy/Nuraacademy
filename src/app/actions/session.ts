"use server";

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/rbac";
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function uploadSessionFile(formData: FormData) {
    try {
        await requirePermission('File', 'UPLOAD_FILE');

        const file = formData.get("file") as File
        if (!file) {
            return { success: false, error: "No file provided" }
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadDir = join(process.cwd(), "public", "uploads")
        await mkdir(uploadDir, { recursive: true })

        const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        const path = join(uploadDir, filename)
        await writeFile(path, buffer)

        return { success: true, url: `/uploads/${filename}` }
    } catch (error) {
        console.error("Failed to upload file:", error);
        return { success: false, error: "Failed to upload file" };
    }
}

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
        await requirePermission('Session', 'UPDATE_SESSION');
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
        await requirePermission('Session', 'DELETE_SESSION');
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
        await requirePermission('Session', 'CREATE_SESSION');
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
