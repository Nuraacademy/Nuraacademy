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
/**
 * Create a new course.
 */
export async function createCourse(data: any) {
    return await prisma.course.create({ data });
}

/**
 * Update an existing course.
 */
export async function updateCourse(id: number, data: any) {
    return await prisma.course.update({
        where: { id },
        data,
    });
}

/**
 * Soft delete a course.
 */
export async function deleteCourse(id: number) {
    return await prisma.course.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
