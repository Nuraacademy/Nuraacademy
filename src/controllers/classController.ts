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
        trainer: {
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

    // Extract additional trainers from keywords
    const keywordTrainerIds = classData.keywords
        .filter(k => k.startsWith('trainer:'))
        .map(k => parseInt(k.replace('trainer:', '')))
        .filter(id => !isNaN(id));

    // Ensure the primary trainerId is also in the list
    if (classData.trainerId && !keywordTrainerIds.includes(classData.trainerId)) {
        keywordTrainerIds.push(classData.trainerId);
    }

    let trainersList: any[] = [];
    if (keywordTrainerIds.length > 0) {
        trainersList = await prisma.user.findMany({
            where: { id: { in: keywordTrainerIds }, deletedAt: null },
            select: { id: true, name: true, username: true, role: { select: { name: true } } }
        });
    }

    return {
        ...classData,
        trainers: trainersList
    };
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
    trainerId?: number;
}) {
    const existingClass = await prisma.class.findFirst({
        where: {
            title: {
                equals: data.title,
                mode: 'insensitive'
            },
            deletedAt: null
        }
    });

    if (existingClass) {
        throw new Error("Class name already exists");
    }

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
    trainerId?: number;
}) {
    if (data.title) {
        const existingClass = await prisma.class.findFirst({
            where: {
                title: {
                    equals: data.title,
                    mode: 'insensitive'
                },
                id: { not: id },
                deletedAt: null
            }
        });

        if (existingClass) {
            throw new Error("Class name already exists");
        }
    }

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
