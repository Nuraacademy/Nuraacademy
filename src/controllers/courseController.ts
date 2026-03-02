import { prisma } from '@/lib/prisma';

export async function getCoursesByClass(classId: string) {
    return prisma.course.findMany({
        where: { classId },
        orderBy: { order: 'asc' },
    });
}

export async function getCourseDetails(id: string) {
    return prisma.course.findUnique({
        where: { id },
        include: {
            learningObjectives: { orderBy: { order: 'asc' } },
            entrySkills: { orderBy: { order: 'asc' } },
            tools: true,
            sessions: { orderBy: { order: 'asc' } },
        },
    });
}

export async function getSessionDetails(id: string) {
    return prisma.session.findUnique({
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
