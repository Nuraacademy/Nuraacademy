"use server"

import { submitAssignment, createAssignment as createAssignmentController, submitManualScores } from "@/controllers/assignmentController"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { requirePermission } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

export async function submitTest(formData: FormData) {
    const assignmentId = parseInt(formData.get("assignmentId") as string)
    const enrollmentId = parseInt(formData.get("enrollmentId") as string)
    const classId = formData.get("classId") as string
    const startedAt = new Date(formData.get("startedAt") as string)
    const finishedAt = new Date()

    await requirePermission('Assignment', 'START_ASSIGNMENT_LEARNER')

    const objectiveAnswers: Record<number, string> = {}
    const essayAnswers: Record<number, string> = {}
    // We expect essayFiles and projectFiles to store URLs
    const essayFiles: Record<number, string> = {}
    const projectAnswers: Record<number, string> = {}
    const projectFiles: Record<number, string> = {}

    // Parse entries
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("objective_")) {
            const id = parseInt(key.replace("objective_", ""))
            objectiveAnswers[id] = value as string
        } else if (key.startsWith("essay_text_")) {
            const id = parseInt(key.replace("essay_text_", ""))
            essayAnswers[id] = value as string
        } else if (key.startsWith("project_text_")) {
            const id = parseInt(key.replace("project_text_", ""))
            projectAnswers[id] = value as string
        }
    }

    // Handle Files (simulated upload)
    const uploadDir = join(process.cwd(), "public", "uploads")

    // Ensure the upload directory exists
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        console.error("Failed to create upload directory:", e)
    }

    // Essay Files
    for (const [key, value] of formData.entries()) {
        const isFile = value && typeof value !== 'string';
        if (key.startsWith("essay_file_") && isFile && (value as any).size > 0) {
            const id = parseInt(key.replace("essay_file_", ""))
            const file = value as unknown as { name: string, arrayBuffer: () => Promise<ArrayBuffer> }
            const filename = `${Date.now()}_${file.name}`
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const path = join(uploadDir, filename)
            await writeFile(path, buffer)
            essayFiles[id] = `/uploads/${filename}`
        } else if (key.startsWith("project_file_") && isFile && (value as any).size > 0) {
            const id = parseInt(key.replace("project_file_", ""))
            const file = value as unknown as { name: string, arrayBuffer: () => Promise<ArrayBuffer> }
            const filename = `${Date.now()}_${file.name}`
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const path = join(uploadDir, filename)
            await writeFile(path, buffer)
            projectFiles[id] = `/uploads/${filename}`
        }
    }

    try {
        const result = await submitAssignment(assignmentId, enrollmentId, {
            objectiveAnswers,
            essayAnswers,
            essayFiles,
            projectAnswers,
            projectFiles,
            startedAt,
            finishedAt
        })

        revalidatePath(`/classes/${classId}/test`)
        revalidatePath(`/assignment`)

        return { success: true, resultId: result.id, totalScore: result.totalScore }
    } catch (error) {
        console.error("Submission error:", error)
        return { success: false, error: "Failed to submit assignment" }
    }
}

import { getCurrentUserId } from "@/lib/auth"

export async function addAssignment(payload: any, itemsPayload: any[], thresholdsPayload?: { courseId: number, threshold: number }[]) {
    try {
        await requirePermission('Assignment', 'CREATE_UPDATE_ASSIGNMENT')
        const userId = await getCurrentUserId()
        const result = await createAssignmentController({ ...payload, createdBy: userId }, itemsPayload, thresholdsPayload);

        // Revalidate based on what's created (course or class path)
        if (payload.classId) {
            revalidatePath(`/classes/${payload.classId}/overview`)
        } else if (payload.courseId) {
            revalidatePath(`/courses/${payload.courseId}`)
        }
        revalidatePath(`/assignment`)

        return { success: true, assignmentId: result.id }
    } catch (error) {
        console.error("Error creating assignment:", error)
        return { success: false, error: "Failed to create assignment" }
    }
}

import { updateAssignment, deleteAssignment } from "@/controllers/assignmentController"

export async function editAssignment(assignmentId: number, payload: any, itemsPayload: any[], thresholdsPayload?: { courseId: number, threshold: number }[]) {
    try {
        await requirePermission('Assignment', 'CREATE_UPDATE_ASSIGNMENT')
        const userId = await getCurrentUserId()
        const result = await updateAssignment(assignmentId, { ...payload, createdBy: userId }, itemsPayload, thresholdsPayload);

        if (payload.classId) {
            revalidatePath(`/classes/${payload.classId}/overview`)
            revalidatePath(`/classes/${payload.classId}/test`)
        } else if (payload.courseId) {
            revalidatePath(`/courses/${payload.courseId}`)
        }
        revalidatePath(`/assignment`)

        return { success: true, assignmentId: result.id }
    } catch (error) {
        console.error("Error updating assignment:", error)
        return { success: false, error: "Failed to update assignment" }
    }
}

export async function removeAssignment(assignmentId: number, classId?: number, courseId?: number) {
    try {
        await requirePermission('Assignment', 'DELETE_ASSIGNMENT')
        await deleteAssignment(assignmentId);

        if (classId) {
            revalidatePath(`/classes/${classId}/overview`);
            revalidatePath(`/classes/${classId}/test`);
        }
        if (courseId) {
            revalidatePath(`/courses/${courseId}`);
        }
        revalidatePath(`/assignment`);

        return { success: true };
    } catch (error) {
        console.error("Error deleting assignment:", error);
        return { success: false, error: "Failed to delete assignment" };
    }
}

export async function submitGradingAction(assignmentId: number, resultId: number, scores: Record<number, number>) {
    try {
        await requirePermission('Assignment', 'GRADE_ASSIGNMENT')
        await submitManualScores(resultId, scores);
        
        revalidatePath(`/assignment/${assignmentId}/results`);
        // Also revalidate generic paths if needed
        revalidatePath(`/assignment`);
        
        return { success: true };
    } catch (error: any) {
        console.error("Grading error:", error);
        return { success: false, error: error.message };
    }
}

export async function saveAssignmentFeedback(resultId: number, feedback: string, assignmentId: number, feedbackFiles?: any) {
    try {
        await requirePermission('Feedback', 'CREATE_EDIT_ASSIGNMENT_FEEDBACK');

        await prisma.assignmentResult.update({
            where: { id: resultId },
            data: { 
                feedback,
                feedbackFiles: (feedbackFiles as any) || undefined
            } as any
        });

        revalidatePath(`/assignment/${assignmentId}/results`);
        // New feedback routes
        revalidatePath(`/feedback/assignment/${assignmentId}`);
        revalidatePath(`/feedback/assignment/${assignmentId}/learner/${resultId}`); // Need to decide on route pattern
        
        return { success: true };
    } catch (error: any) {
        console.error("Save feedback error:", error);
        return { success: false, error: error.message };
    }
}
