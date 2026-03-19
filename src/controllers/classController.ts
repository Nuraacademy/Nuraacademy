import { prisma } from '@/lib/prisma';

/**
 * Get all available classes.
 */
export async function getAllClasses() {
    return await prisma.class.findMany({
        where: {
            deletedAt: null,
            isDraft: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            timelines: {
                where: { deletedAt: null },
            },
            courses: {
                where: { deletedAt: null },
            },
        },
    });
}

/**
 * Get a specific class by its ID, including its related courses and timelines.
 */
export async function getClassById(id: number) {
    if (!id || isNaN(id)) return null;
    return await prisma.class.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            timelines: {
                where: { deletedAt: null },
                orderBy: { date: 'asc' },
            },
            courses: {
                where: { deletedAt: null },
                orderBy: { createdAt: 'asc' },
                include: {
                    user: {
                        select: { id: true, name: true, username: true, role: { select: { name: true } } }
                    },
                    sessions: {
                        where: { deletedAt: null },
                        include: {
                            user: {
                                select: { id: true, name: true, username: true, role: { select: { name: true } } }
                            }
                        }
                    }
                }
            },
        },
    });
}
export async function createClass(data: {
    title: string;
    imgUrl?: string;
    hours?: number;
    modules?: number;
    methods?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    previewVideoUrl?: string;
    keywords?: string[];
    curriculaIds?: number[];
    isDraft?: boolean;
    createdBy?: number;
}) {
    const { curriculaIds, ...rest } = data;
    return await prisma.class.create({
        data: {
            ...rest,
            curricula: curriculaIds ? {
                connect: curriculaIds.map(id => ({ id }))
            } : undefined
        },
    });
}

/**
 * Update an existing class.
 */
export async function updateClass(id: number, data: {
    title?: string;
    imgUrl?: string;
    hours?: number;
    modules?: number;
    methods?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    previewVideoUrl?: string;
    keywords?: string[];
    curriculaIds?: number[];
    isDraft?: boolean;
}) {
    const { curriculaIds, ...rest } = data;
    return await prisma.class.update({
        where: { id },
        data: {
            ...rest,
            curricula: curriculaIds ? {
                set: curriculaIds.map(id => ({ id }))
            } : undefined
        },
    });
}

/**
 * Soft delete a class.
 */
export async function deleteClass(id: number) {
    return await prisma.class.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });
}
