"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/lib/rbac"
import { sendMail } from "@/lib/mailer"

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

    // CV Validation (UT-1.3.3)
    if (!formData.cvUrl) {
        return { success: false, error: "CV is required for enrollment" };
    }

    try {
        // Capacity check (UT-1.3.4)
        // Fetch complete class data including timelines for the email
        const classWithTimelines = await prisma.class.findUnique({
            where: { id: classId },
            include: { 
                timelines: {
                    where: { deletedAt: null },
                    orderBy: { date: 'asc' }
                },
                _count: { select: { enrollments: true } }
            }
        });

        if (classWithTimelines && classWithTimelines.capacity !== null && classWithTimelines._count.enrollments >= classWithTimelines.capacity) {
            return { success: false, error: "Class Full" };
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true }
        });

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
                cvUrl: formData.cvUrl,
                status: "ACTIVE",
            }
        });

        // Send Enrollment Success Email
        if (user?.email) {
            const timelineHtml = classWithTimelines?.timelines.map(t => 
                `<li><strong>${t.date.toLocaleDateString()}:</strong> ${t.activity}</li>`
            ).join('') || '<li>No timeline activities scheduled yet.</li>';

            const learningPeriod = (classWithTimelines?.startDate && classWithTimelines?.endDate) 
                ? `<li><strong>Learning Period:</strong> ${classWithTimelines.startDate.toLocaleDateString()} to ${classWithTimelines.endDate.toLocaleDateString()}</li>`
                : '';

            await sendMail({
                to: user.email,
                subject: `Selamat! Pendaftaran Berhasil: ${classWithTimelines?.title}`,
                html: `
                    <h1>Selamat, ${user.name || 'Peserta'}!</h1>
                    <p>Anda telah berhasil melakukan pendaftaran (enroll) untuk kelas <strong>${classWithTimelines?.title}</strong>.</p>
                    <p>Berikut adalah timeline kegiatan yang perlu Anda perhatikan:</p>
                    <ul>
                        ${timelineHtml}
                        ${learningPeriod}
                    </ul>
                    <p>Mohon pastikan Anda tidak melewatkan tahapan-tahapan di atas. Selamat belajar!</p>
                `
            });
        }

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
