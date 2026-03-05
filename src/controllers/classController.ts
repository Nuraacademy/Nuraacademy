import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
        },
    });
}

/**
 * Get a specific class by its ID, including its related courses and timelines.
 */
export async function getClassById(id: number) {
    return await prisma.class.findUnique({
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
            },
        },
    });
}
