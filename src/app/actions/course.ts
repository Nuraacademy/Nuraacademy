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
