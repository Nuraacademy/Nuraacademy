"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"

export async function handleEnrollment(classId: number, formData: any) {
    const userId = await getSession();

    if (!userId) {
        throw new Error("You must be logged in to enroll in a class");
    }

    try {
        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                classId,
                profession: formData.profession,
                yoe: formData.yoe,
                workField: formData.workField,
                educationField: formData.educationField,
                jobIndustry: formData.jobIndustry,
                finalExpectations: formData.finalExpectations,
                objectives: formData.selectedObjectives,
                // cvUrl: formData.cvUrl, // Handle file upload separately or later
                status: "ACTIVE",
            }
        });

        // Revalidate the class overview and classes grid
        revalidatePath(`/classes/${classId}/overview`);
        revalidatePath("/classes");

        return { success: true, enrollmentId: enrollment.id };
    } catch (error: any) {
        console.error("Enrollment error:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "You are already enrolled in this class" };
        }
        return { success: false, error: error.message || "Failed to enroll in class" };
    }
}

export async function checkEnrollment(classId: number) {
    const userId = await getSession();
    if (!userId) return false;

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId,
                classId
            }
        }
    });

    return !!enrollment;
}
