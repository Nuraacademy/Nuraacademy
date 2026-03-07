import { prisma } from '@/lib/prisma';

/**
 * Get all courses associated with a specific class.
 */
export async function getCoursesByClassId(classId: number) {
    return await prisma.course.findMany({
        where: {
            classId,
            deletedAt: null,
        },
        orderBy: {
            createdAt: 'asc', // order logically by creation or order
        },
    });
}

/**
 * Get a specific course by its ID, including its related sessions.
 */
export async function getCourseById(id: number) {
    if (!id || isNaN(id)) return null;
    return await prisma.course.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            class: true,
            sessions: {
                where: { deletedAt: null },
                orderBy: { createdAt: 'asc' },
                include: {
                    assignments: { where: { deletedAt: null } },
                },
            },
        },
    });
}
