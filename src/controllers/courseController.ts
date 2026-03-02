import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

const CACHE_TTL = 3600;

export async function getCoursesByClass(classId: string) {
    return prisma.course.findMany({
        where: { classId },
        orderBy: { order: 'asc' },
    });
}

export async function getCourseDetails(id: string) {
    const cacheKey = `course:details:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached, (key, value) =>
            (key === 'createdAt' || key === 'updatedAt' || key === 'startDate' || key === 'endDate' || key === 'scheduledAt')
                ? new Date(value) : value
        );
    }

    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            learningObjectives: { orderBy: { order: 'asc' } },
            entrySkills: { orderBy: { order: 'asc' } },
            tools: true,
            sessions: { orderBy: { order: 'asc' } },
        },
    });

    if (course) {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(course));
    }
    return course;
}

export async function getSessionDetails(id: string) {
    const cacheKey = `session:details:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached, (key, value) =>
            (key === 'createdAt' || key === 'updatedAt' || key === 'startDate' || key === 'endDate' || key === 'scheduledAt' || key === 'date')
                ? new Date(value) : value
        );
    }

    const session = await prisma.session.findUnique({
        where: { id },
        include: {
            referenceMaterials: true,
            video: true,
            zoomSession: true,
            preSessions: { include: { questions: { orderBy: { order: 'asc' } } } },
            postSessions: { include: { questions: { orderBy: { order: 'asc' } } } },
            exercises: true,
            presences: true,
            course: {
                include: {
                    class: true
                }
            }
        },
    });

    if (session) {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(session));
    }
    return session;
}

export async function markPresence(sessionId: string, userId: string) {
    return prisma.presence.upsert({
        where: {
            sessionId_userId: {
                sessionId,
                userId,
            },
        },
        update: {
            present: true,
        },
        create: {
            sessionId,
            userId,
            present: true,
        },
    });
}
export async function getExerciseDetails(id: string) {
    return prisma.exercise.findUnique({
        where: { id },
        include: {
            session: {
                include: {
                    course: {
                        include: {
                            class: true
                        }
                    }
                }
            }
        }
    });
}
