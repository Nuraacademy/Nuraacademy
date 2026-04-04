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
 * Get progress data for a specific enrollment (e.g., course mappings, ses scores, assignment results).
 */
export async function getEnrollmentProgress(enrollmentId: number) {
    return await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId,
            deletedAt: null,
        },
        include: {
            user: {
                select: { id: true, name: true, username: true, email: true },
            },
            class: {
                select: { id: true, title: true },
            },
            courseMappings: {
                where: { deletedAt: null },
                include: {
                    course: { select: { title: true } }
                }
            },
            ses: {
                where: { deletedAt: null },
                include: {
                    session: { select: { title: true } }
                }
            },
            assignmentResults: {
                where: { deletedAt: null },
                include: {
                    assignment: { select: { title: true, type: true } }
                }
            },
        },
    });
}

/**
 * Get enrollment by ID with user details.
 */
export async function getEnrollmentById(id: number) {
    return await prisma.enrollment.findUnique({
        where: { id, deletedAt: null },
        include: {
            user: {
                select: { id: true, name: true, username: true },
            },
        },
    });
}
/**
 * Get all enrollments for a specific class with user details.
 */
export async function getEnrollmentsByClassId(classId: number) {
    return await prisma.enrollment.findMany({
        where: { classId, deletedAt: null },
        include: {
            user: {
                select: { id: true, name: true, username: true, email: true, whatsapp: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
