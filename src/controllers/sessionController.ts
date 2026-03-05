import { prisma } from '@/lib/prisma';

/**
 * Get all sessions associated with a specific course.
 */
export async function getSessionsByCourseId(courseId: number) {
    return await prisma.session.findMany({
        where: {
            courseId,
            deletedAt: null,
        },
        orderBy: {
            createdAt: 'asc', // order logically
        },
        include: {
            assignments: {
                where: { deletedAt: null },
            },
        },
    });
}

/**
 * Get a specific session by its ID, including references and assignments.
 */
export async function getSessionById(id: number) {
    return await prisma.session.findUnique({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            assignments: {
                where: { deletedAt: null },
            },
            // You can include relations if needed here.
        },
    });
}
