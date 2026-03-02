import { prisma } from '@/lib/prisma';

export async function getClasses() {
    return prisma.class.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function getTopClasses(limit: number = 3) {
    return prisma.class.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' }, // For now, top classes are the newest
    });
}

export async function getClassDetails(id: string) {
    return prisma.class.findUnique({
        where: { id },
        include: {
            classTimelines: {
                orderBy: { order: 'asc' },
            },
            learningPoints: {
                orderBy: { order: 'asc' },
            },
            courses: {
                orderBy: { order: 'asc' },
            },
        },
    });
}

export async function getClassTimeline(classId: string) {
    return prisma.classTimeline.findMany({
        where: { classId },
        orderBy: { order: 'asc' },
    });
}

export async function getClassGroups(classId: string) {
    return prisma.group.findMany({
        where: { classId },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
}
