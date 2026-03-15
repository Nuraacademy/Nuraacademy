"use server"

import { createCourse, updateCourse } from "@/controllers/courseController";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/rbac";

export async function upsertCourse(classId: number, courseId: number | null, data: any) {
    try {
        const { taskItems, deadline, submissionType, startDate, passingGrade, ...courseFields } = data;
        const isProject = data.type === 'FINAL_PROJECT';

        let result;
        if (courseId) {
            await requirePermission('Course', 'UPDATE_COURSE');
            result = await updateCourse(courseId, courseFields);
        } else {
            await requirePermission('Course', 'CREATE_COURSE');
            const payload = {
                ...courseFields,
                class: { connect: { id: classId } }
            };
            result = await createCourse(payload);
            courseId = result.id;
        }

        // Handle Project-specific Assignment
        if (isProject && deadline) {
            const { createAssignment, updateAssignment } = await import("@/controllers/assignmentController");
            const assignmentPayload = {
                type: 'PROJECT' as any,
                submissionType: submissionType || 'INDIVIDUAL',
                startDate: startDate || new Date(),
                endDate: deadline,
                passingGrade: passingGrade || 0,
                description: courseFields.description,
                instruction: courseFields.learningObjectives, // Using learning objectives as instructions for now
                course: { connect: { id: courseId } },
                class: { connect: { id: classId } }
            };

            const itemsPayload = taskItems || [];

            // Check if assignment already exists for this course
            const { prisma } = await import("@/lib/prisma");
            const existingAssignment = await prisma.assignment.findFirst({
                where: { courseId, type: 'PROJECT', deletedAt: null }
            });

            if (existingAssignment) {
                await updateAssignment(existingAssignment.id, assignmentPayload, itemsPayload);
            } else {
                await createAssignment(assignmentPayload, itemsPayload);
            }
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
