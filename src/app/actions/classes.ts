"use server"

import { getClassById, getAllClasses } from "@/controllers/classController"
import { getSession } from "./auth"
import { prisma } from "@/lib/prisma"

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
                classes: topClasses.map(c => ({ ...c, isEnrolled: false }))
            };
        }

        // Check enrollment for each class
        const enrolledClassIds = await prisma.enrollment.findMany({
            where: {
                userId,
                classId: { in: topClasses.map(c => c.id) }
            },
            select: { classId: true }
        }).then(res => res.map(r => r.classId));

        const classesWithStatus = topClasses.map(c => ({
            ...c,
            isEnrolled: enrolledClassIds.includes(c.id)
        }));

        return { success: true, classes: classesWithStatus };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch top classes" };
    }
}
