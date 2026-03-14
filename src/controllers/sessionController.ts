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
 * Get presence data for a session, including enrolled students and their scores.
 */
export async function getSessionPresence(sessionId: number) {
    if (!sessionId || isNaN(sessionId)) return [];
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        select: { courseId: true }
    });

    if (!session) return [];

    return await prisma.enrollment.findMany({
        where: {
            class: {
                courses: {
                    some: { id: session.courseId }
                }
            },
            user: {
                role: {
                    name: "Learner"
                }
            },
            deletedAt: null
        },
        include: {
            user: true,
            ses: {
                where: { sessionId, deletedAt: null }
            }
        }
    });
}

/**
 * Get a specific session by its ID, including references and assignments.
 */
export async function getSessionById(id: number) {
    if (!id || isNaN(id)) return null;
    return await prisma.session.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            course: {
                include: { class: true },
            },
            assignments: {
                where: { deletedAt: null },
            },
        },
    });
}
