"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/lib/rbac"

export async function handleEnrollment(classId: number, formData: any) {
    const userId = await getSession();

    if (!userId) {
        throw new Error("You must be logged in to enroll in a class");
    }

    // RBAC check
    await requirePermission('Enrollment', 'LEARNER_ENROLLMENT');

    // Field validation for mandatory fields (UT-1.3.2)
    if (!formData.profession || !formData.yoe || !formData.workField || !formData.educationField || !formData.jobIndustry) {
        return { success: false, error: "Please fill in all mandatory fields" };
    }

    try {
        // Capacity check (UT-1.3.4)
        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: { _count: { select: { enrollments: true } } }
        });

        if (classData && classData.capacity !== null && classData._count.enrollments >= classData.capacity) {
            return { success: false, error: "Class Full" };
        }
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
