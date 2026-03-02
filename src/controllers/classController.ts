import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

const CACHE_TTL = 3600; // 1 hour

export async function getClasses() {
    const cacheKey = 'classes:all';
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached, (key, value) =>
            (key === 'createdAt' || key === 'scheduleStart' || key === 'scheduleEnd' || key === 'updatedAt')
                ? new Date(value) : value
        );
    }

    const classes = await prisma.class.findMany({
        orderBy: { createdAt: 'desc' },
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(classes));
    return classes;
}

export async function getTopClasses(limit: number = 3) {
    const cacheKey = `classes:top:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached, (key, value) =>
            (key === 'createdAt' || key === 'scheduleStart' || key === 'scheduleEnd' || key === 'updatedAt')
                ? new Date(value) : value
        );
    }

    const classes = await prisma.class.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(classes));
    return classes;
}

export async function getClassDetails(id: string) {
    const cacheKey = `class:details:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached, (key, value) =>
            (key === 'createdAt' || key === 'scheduleStart' || key === 'scheduleEnd' || key === 'date' || key === 'updatedAt' || key === 'startDate' || key === 'endDate')
                ? new Date(value) : value
        );
    }

    const classDetails = await prisma.class.findUnique({
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

    if (classDetails) {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(classDetails));
    }
    return classDetails;
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
