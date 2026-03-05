import { prisma } from '@/lib/prisma';
import { AssignmentType } from '@prisma/client';

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

export async function submitAssignment(assignmentId: number, enrollmentId: number, data: any) {
    throw new Error('Not implemented');
}
