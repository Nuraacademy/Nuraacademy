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

export async function startSessionAction(classId: string, courseId: string, sessionId: string) {
    try {
        const session = await prisma.session.findUnique({
            where: { id: parseInt(sessionId) },
            select: { content: true }
        });

        const content: any = session?.content;
        if (!content?.zoom?.url) {
            return { success: false, error: "No Zoom link found for this session" };
        }

        // Here you could log the start event if needed
        return { success: true, url: content.zoom.url };
    } catch (error: any) {
        console.error("Failed to start session:", error);
        return { success: false, error: error.message || "Failed to start session" };
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
    referenceData: any[],
    type: string
) {
    try {
        await requirePermission('Session', 'UPDATE_SESSION');
        const id = parseInt(moduleId);

        // Fetch current session to check recording changes
        const currentSession = await prisma.session.findUnique({
            where: { id },
            select: { content: true }
        });

        const currentContent: any = currentSession?.content;
        const currentRecording = currentContent?.recording;
        const nextRecording = contentData?.recording;

        if (!currentRecording && nextRecording) {
            await requirePermission('Recording', 'ADD_RECORDING');
        } else if (currentRecording && nextRecording && (currentRecording.url !== nextRecording.url || currentRecording.title !== nextRecording.title)) {
            await requirePermission('Recording', 'UPDATE_RECORDING');
        } else if (currentRecording && !nextRecording) {
            await requirePermission('Recording', 'DELETE_RECORDING');
        }

        // Update the session in the database
        await prisma.session.update({
            where: { id },
            data: {
                title: title,
                isSynchronous: isSynchronous,
                schedule: schedule,
                content: contentData,
                reference: referenceData,
                type: type as any
            }
        });

        // Revalidate the session page to show the updated data
        const sessionPath = `/classes/${classId}/course/${courseId}/session/${moduleId}`;
        revalidatePath(sessionPath);

        return { success: true };
    } catch (error: any) {
        console.error("Failed to update session:", error);
        return { success: false, error: error.message || "Failed to update session" };
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
        reference: any[];
        type: string;
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
                type: data.type as any
            }
        });

        revalidatePath(`/classes/${classId}/course/${courseId}/overview`);

        return { success: true, sessionId: newSession.id };
    } catch (error) {
        console.error("Failed to create session:", error);
        return { success: false, error: "Failed to create session" };
    }
}

export async function updatePresence(
    sessionId: number,
    classId: string,
    courseId: string,
    updates: { enrollmentId: number; status: string; score: number }[]
) {
    try {
        await requirePermission('Presence', 'CREATE_UPDATE_PRESENCE_SES');

        // Execute updates in a transaction
        await prisma.$transaction(
            updates.map(update => prisma.sES.upsert({
                where: {
                    enrollmentId_sessionId: {
                        enrollmentId: update.enrollmentId,
                        sessionId: sessionId
                    }
                },
                update: {
                    status: update.status,
                    score: update.score,
                    updatedAt: new Date()
                },
                create: {
                    enrollmentId: update.enrollmentId,
                    sessionId: sessionId,
                    status: update.status,
                    score: update.score
                }
            }))
        );

        revalidatePath(`/classes/${classId}/course/${courseId}/session/${sessionId}/presence`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update presence:", error);
        return { success: false, error: "Failed to update presence" };
    }
}
