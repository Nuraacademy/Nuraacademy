import { prisma } from '@/lib/prisma';
import { AssignmentType, Prisma } from '@prisma/client';

export async function getAssignmentsBySessionId(sessionId: number, type?: AssignmentType) {
    return await prisma.assignment.findMany({
        where: {
            sessionId,
            ...(type && { type }),
            deletedAt: null,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
}

export async function getAssignments() {
    return await prisma.assignment.findMany({
        where: {
            deletedAt: null,
        },
        include: {
            class: {
                select: {
                    title: true,
                },
            },
            course: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function getAssignmentById(id: number) {
    return await prisma.assignment.findUnique({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            assignmentItems: {
                where: { deletedAt: null },
            },
        },
    });
}


export async function getPlacementTestByClassId(classId: number) {
    return await prisma.assignment.findFirst({
        where: {
            classId,
            type: 'PLACEMENT',
            deletedAt: null,
        },
        include: {
            class: true,
            assignmentItems: {
                where: { deletedAt: null },
            },
        },
    });
}

export async function getAssignmentBySessionAndType(sessionId: number, type: AssignmentType) {
    return await prisma.assignment.findFirst({
        where: {
            sessionId,
            type,
            deletedAt: null,
        },
        include: {
            session: {
                include: {
                    course: {
                        include: {
                            class: true
                        }
                    }
                }
            },
            assignmentItems: {
                where: { deletedAt: null },
            },
        },
    });
}

export async function submitAssignment(assignmentId: number, enrollmentId: number, data: {
    objectiveAnswers: Record<number, string>,
    essayAnswers: Record<number, string>,
    essayFiles: Record<number, string>,
    projectAnswers: Record<number, string>,
    projectFiles: Record<number, string>,
    startedAt: Date,
    finishedAt: Date
}) {
    return await prisma.$transaction(async (tx) => {
        // 1. Create the overall AssignmentResult
        const result = await tx.assignmentResult.create({
            data: {
                assignmentId,
                enrollmentId,
                startedAt: data.startedAt,
                finishedAt: data.finishedAt,
                status: 'NOT_PASS', // Default or calculate based on objective answers if possible
            },
        });

        // 2. Prepare all item results
        const items: Prisma.AssignmentItemResultCreateManyInput[] = [];

        // Objective Answers
        for (const [id, answer] of Object.entries(data.objectiveAnswers)) {
            items.push({
                assignmentResultId: result.id,
                assignmentItemId: parseInt(id),
                answer: answer,
            });
        }

        // Essay Answers & Files
        const essayItemIds = new Set([
            ...Object.keys(data.essayAnswers).map(Number),
            ...Object.keys(data.essayFiles).map(Number)
        ]);
        for (const id of essayItemIds) {
            items.push({
                assignmentResultId: result.id,
                assignmentItemId: id,
                answer: data.essayAnswers[id] || null,
                answerFiles: data.essayFiles[id] ? [data.essayFiles[id]] : Prisma.DbNull,
            });
        }

        // Project Answers & Files
        const projectItemIds = new Set([
            ...Object.keys(data.projectAnswers).map(Number),
            ...Object.keys(data.projectFiles).map(Number)
        ]);
        for (const id of projectItemIds) {
            items.push({
                assignmentResultId: result.id,
                assignmentItemId: id,
                answer: data.projectAnswers[id] || null,
                answerFiles: data.projectFiles[id] ? [data.projectFiles[id]] : Prisma.DbNull,
            });
        }

        // 3. Create all AssignmentItemResult records
        if (items.length > 0) {
            await tx.assignmentItemResult.createMany({
                data: items,
            });
        }

        return result;
    });
}
