import { prisma } from '@/lib/prisma';

/**
 * Get all available curricula with optional search and status filtering.
 */
export async function getAllCurricula(search?: string, status?: string) {
    return await prisma.curricula.findMany({
        where: {
            deletedAt: null,
            AND: [
                search ? {
                    title: { contains: search, mode: 'insensitive' }
                } : {},
                status ? {
                    status: status
                } : {}
            ]
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            classes: {
                where: { deletedAt: null },
                select: { id: true, title: true }
            }
        }
    });
}

/**
 * Get a specific curricula by its ID.
 */
export async function getCurriculaById(id: number) {
    if (!id || isNaN(id)) return null;
    return await prisma.curricula.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            classes: {
                where: { deletedAt: null },
                select: { id: true, title: true }
            }
        }
    });
}

/**
 * Create a new curricula.
 */
export async function createCurricula(data: {
    title: string;
    fileUrl?: string;
    status?: string;
    createdBy?: number;
    classIds?: number[];
}) {
    const { classIds, ...rest } = data;
    return await prisma.curricula.create({
        data: {
            ...rest,
            classes: classIds ? {
                connect: classIds.map(id => ({ id }))
            } : undefined
        },
    });
}

/**
 * Update an existing curricula.
 */
export async function updateCurricula(id: number, data: {
    title?: string;
    fileUrl?: string;
    status?: string;
    classIds?: number[];
}) {
    const { classIds, ...rest } = data;

    return await prisma.curricula.update({
        where: { id },
        data: {
            ...rest,
            classes: classIds ? {
                set: classIds.map(id => ({ id }))
            } : undefined
        },
    });
}

/**
 * Soft delete a curricula.
 */
export async function deleteCurricula(id: number) {
    return await prisma.curricula.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });
}
