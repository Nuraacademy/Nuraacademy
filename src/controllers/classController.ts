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
    // We use a flexible include object to bypass stale IDE lint errors regarding the 'trainer' field
    const includeOptions: any = {
        timelines: {
            where: { deletedAt: null },
            orderBy: { date: 'asc' },
        },
        trainers: {
            select: { id: true, name: true, username: true, role: { select: { name: true } } }
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
        curricula: {
            where: { deletedAt: null }
        },
    };

    const classData = (await prisma.class.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: includeOptions,
    })) as any;

    if (!classData) return null;

    return classData;
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
    trainerIds?: number[];
}) {
    const { curriculaIds, trainerIds, ...rest } = data;
    return await prisma.class.create({
        data: {
            ...rest,
            curricula: curriculaIds ? {
                connect: curriculaIds.map(id => ({ id }))
            } : undefined,
            trainers: trainerIds ? {
                connect: trainerIds.map(id => ({ id }))
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
    trainerIds?: number[];
}) {
    const { curriculaIds, trainerIds, ...rest } = data;
    return await prisma.class.update({
        where: { id },
        data: {
            ...rest,
            curricula: curriculaIds ? {
                set: curriculaIds.map(id => ({ id }))
            } : undefined,
            trainers: trainerIds ? {
                set: trainerIds.map(id => ({ id }))
            } : undefined
        },
    });
}

/**
 * Soft delete a class and its related courses, sessions, and assignments.
 */
export async function deleteClass(id: number) {
    const now = new Date();

    return await prisma.$transaction(async (tx) => {
        // 1. Soft delete all assignments related to this class
        await tx.assignment.updateMany({
            where: { 
                classId: id, 
                deletedAt: null 
            },
            data: { deletedAt: now },
        });

        // 2. Soft delete all sessions related to courses in this class
        await tx.session.updateMany({
            where: { 
                course: { classId: id },
                deletedAt: null 
            },
            data: { deletedAt: now },
        });

        // 3. Soft delete all courses related to this class
        await tx.course.updateMany({
            where: { 
                classId: id, 
                deletedAt: null 
            },
            data: { deletedAt: now },
        });

        // 4. Finally soft delete the class itself
        return await tx.class.update({
            where: { id },
            data: { deletedAt: now },
        });
    });
}
