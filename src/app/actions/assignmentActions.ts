"use server"

import { getCoursesByClassId } from "@/controllers/courseController";
import { getSessionsByCourseId } from "@/controllers/sessionController";
import {
    getPlacementTestByClassId,
    findExistingAssignment
} from "@/controllers/assignmentController";
import { AssignmentType } from "@prisma/client";

export async function fetchCoursesByClassIdAction(classId: number) {
    try {
        const courses = await getCoursesByClassId(classId);
        return { success: true, courses };
    } catch (error: any) {
        console.error("fetchCoursesByClassIdAction Error:", error);
        return { success: false, error: error.message || "Failed to fetch courses" };
    }
}

export async function fetchSessionsByCourseIdAction(courseId: number) {
    try {
        const sessions = await getSessionsByCourseId(courseId);
        return { success: true, sessions };
    } catch (error: any) {
        console.error("fetchSessionsByCourseIdAction Error:", error);
        return { success: false, error: error.message || "Failed to fetch sessions" };
    }
}

export async function fetchPlacementTestByClassIdAction(classId: number) {
    try {
        const test = await getPlacementTestByClassId(classId);
        return { success: true, test };
    } catch (error: any) {
        console.error("fetchPlacementTestByClassIdAction Error:", error);
        return { success: false, error: error.message || "Failed to fetch placement test" };
    }
}

export async function fetchExistingAssignmentAction(params: {
    classId: number,
    courseId?: number | null,
    sessionId?: number | null,
    type: AssignmentType
}) {
    try {
        const test = await findExistingAssignment(params);
        return { success: true, test };
    } catch (error: any) {
        console.error("fetchExistingAssignmentAction Error:", error);
        return { success: false, error: error.message || "Failed to fetch existing assignment" };
    }
}
