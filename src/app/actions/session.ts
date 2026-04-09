"use server";

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/rbac";

import { uploadToSupabase, UploadResult } from "@/lib/storage";

export async function uploadSessionFile(formData: FormData): Promise<UploadResult> {
    try {
        await requirePermission('File', 'UPLOAD_FILE');

        const file = formData.get("file") as File
        if (!file) {
            return { 
                success: false, 
                error: "No file provided",
                url: null,
                path: null,
                name: null,
                size: null
            }
        }

        const result = await uploadToSupabase(file, 'sessions');
        return result;
    } catch (error: any) {
        console.error("Failed to upload file:", error);
        return { 
            success: false, 
            error: error.message || "Failed to upload file",
            url: null,
            path: null,
            name: null,
            size: null
        };
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
    referenceData: any[]
) {
    try {
        await requirePermission('Course', 'UPDATE_SESSION');
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
                reference: referenceData
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
        await requirePermission('Course', 'DELETE_SESSION');
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
        await requirePermission('Course', 'CREATE_SESSION');
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

export async function updatePresence(
    sessionId: number,
    classId: string,
    courseId: string,
    updates: { enrollmentId: number; status: string; score: number }[]
) {
    try {
        await requirePermission('Course', 'CREATE_UPDATE_PRESENCE_SES');

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

export async function updateSessionStatusAction(
    classId: string,
    courseId: string,
    sessionId: string,
    status: 'LIVE' | 'DONE'
) {
    try {
        await requirePermission('Course', 'START_SESSION');
        const id = parseInt(sessionId);

        const currentSession = await prisma.session.findUnique({
            where: { id },
            select: { content: true }
        });

        if (!currentSession) {
            return { success: false, error: "Session not found" };
        }

        const content: any = currentSession.content || {};
        if (!content.zoom) {
            content.zoom = {};
        }
        content.zoom.status = status;

        await prisma.session.update({
            where: { id },
            data: { content }
        });

        const sessionPath = `/classes/${classId}/course/${courseId}/session/${sessionId}`;
        revalidatePath(sessionPath);

        return { success: true };
    } catch (error: any) {
        console.error("Failed to update session status:", error);
        return { success: false, error: error.message || "Failed to update session status" };
    }
}
