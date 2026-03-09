"use server"

import { getClassById, getAllClasses } from "@/controllers/classController"
import { getSession } from "./auth"
import { prisma } from "@/lib/prisma"
import { saveClassTimelines } from "@/controllers/timelineController"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/lib/rbac"

export async function getClassDetails(id: number) {
    try {
        const classData = await getClassById(id)
        if (!classData) {
            return { success: false, error: "Class not found" }
        }
        return { success: true, class: classData }
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch class details" }
    }
}

export async function getHomeClasses() {
    try {
        const userId = await getSession();
        const classes = await getAllClasses();

        // Just take the first 3 for "Top Classes"
        const topClasses = classes.slice(0, 3);

        if (!userId) {
            return {
                success: true,
                classes: topClasses.map((c: any) => ({ ...c, isEnrolled: false }))
            };
        }

        // Check enrollment for each class
        const enrolledClassIds = await prisma.enrollment.findMany({
            where: {
                userId,
                classId: { in: topClasses.map((c: any) => c.id) }
            },
            select: { classId: true }
        }).then((res: any) => res.map((r: any) => r.classId));

        const classesWithStatus = topClasses.map((c: any) => ({
            ...c,
            isEnrolled: enrolledClassIds.includes(c.id)
        }));

        return { success: true, classes: classesWithStatus };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch top classes" };
    }
}

export async function updateClassSchedule(classId: number, timelineData: { activity: string, date: Date }[]) {
    try {
        await requirePermission('Class', 'UPDATE_SCHEDULE_CLASS');
        await saveClassTimelines(classId, timelineData);
        revalidatePath(`/classes/${classId}/overview`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update class schedule:", error);
        return { success: false, error: error.message || "Failed to update class schedule" };
    }
}
