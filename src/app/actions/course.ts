"use server"

import { createCourse, updateCourse } from "@/controllers/courseController";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/rbac";

export async function upsertCourse(classId: number, courseId: number | null, data: any) {
    try {
        if (courseId) {
            await requirePermission('Course', 'UPDATE_COURSE');
            await updateCourse(courseId, data);
        } else {
            await requirePermission('Course', 'CREATE_COURSE');
            const payload = {
                ...data,
                class: { connect: { id: classId } }
            };
            await createCourse(payload);
        }

        revalidatePath(`/classes/${classId}/overview`);
        return { success: true };
    } catch (error: any) {
        console.error("Upsert Course Error:", error);
        return { success: false, error: error.message || "Failed to save course" };
    }
}

export async function deleteCourseAction(classId: number, courseId: number) {
    try {
        await requirePermission('Course', 'DELETE_COURSE');
        const { deleteCourse } = await import("@/controllers/courseController");
        await deleteCourse(courseId);

        revalidatePath(`/classes/${classId}/overview`);
        return { success: true };
    } catch (error: any) {
        console.error("Delete Course Error:", error);
        return { success: false, error: error.message || "Failed to delete course" };
    }
}

export async function searchCoursesAction(query: string) {
    try {
        const { hasPermission } = await import("@/lib/rbac");
        const canSearch = await hasPermission('Course', 'VIEW_SEARCH_COURSE');
        if (!canSearch) {
            await requirePermission('Course', 'VIEW_SEARCH_COURSE');
        }

        const { searchCourses } = await import("@/controllers/courseController");
        const courses = await searchCourses(query);
        return { success: true, courses };
    } catch (error: any) {
        console.error("Search Course Error:", error);
        return { success: false, error: error.message || "Failed to search courses" };
    }
}
