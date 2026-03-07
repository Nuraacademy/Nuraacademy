import { prisma } from '@/lib/prisma';

/**
 * Check if a user is enrolled in a given class.
 */
export async function getEnrollment(userId: number, classId: number) {
    return await prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId,
                classId,
            },
        },
        include: {
            user: {
                select: { name: true },
            },
            class: {
                select: { title: true, isDraft: true },
            },
        },
    });
}

/**
 * Get progress data for a specific enrollment (e.g., course mappings, ses scores).
 */
export async function getEnrollmentProgress(enrollmentId: number) {
    return await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId,
            deletedAt: null,
        },
        include: {
            courseMappings: {
                where: { deletedAt: null },
            },
            ses: {
                where: { deletedAt: null },
            },
            assignmentResults: {
                where: { deletedAt: null },
            },
        },
    });
}
