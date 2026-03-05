import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getAssignmentsBySessionId, getAssignmentById } from '../assignmentController';
import { AssignmentType } from '@prisma/client';

mock.module('@/lib/prisma', () => ({
    prisma: {
        assignment: {
            findMany: mock(),
            findUnique: mock(),
        },
    },
}));

import { prisma } from '@/lib/prisma';

describe('assignmentController', () => {
    beforeEach(() => {
        mock.restore();
    });

    test('getAssignmentsBySessionId should fetch assignments for a specific session', async () => {
        const mockAssignments = [
            { id: 1, sessionId: 10, title: 'Assignment 1' },
        ];
        (prisma.assignment.findMany as any).mockResolvedValue(mockAssignments);

        const result = await getAssignmentsBySessionId(10);

        expect(prisma.assignment.findMany).toHaveBeenCalledWith({
            where: { sessionId: 10, deletedAt: null },
            orderBy: { createdAt: 'asc' },
        });
        expect(result).toEqual(mockAssignments);
    });

    test('getAssignmentsBySessionId should filter by type if provided', async () => {
        const mockAssignments = [
            { id: 2, sessionId: 10, type: AssignmentType.EXERCISE },
        ];
        (prisma.assignment.findMany as any).mockResolvedValue(mockAssignments);

        const result = await getAssignmentsBySessionId(10, AssignmentType.EXERCISE);

        expect(prisma.assignment.findMany).toHaveBeenCalledWith({
            where: { sessionId: 10, type: AssignmentType.EXERCISE, deletedAt: null },
            orderBy: { createdAt: 'asc' },
        });
        expect(result).toEqual(mockAssignments);
    });

    test('getAssignmentById should fetch a specific assignment including items', async () => {
        const mockAssignment = { id: 1, type: 'EXERCISE' };
        (prisma.assignment.findUnique as any).mockResolvedValue(mockAssignment);

        const result = await getAssignmentById(1);

        expect(prisma.assignment.findUnique).toHaveBeenCalledWith({
            where: { id: 1, deletedAt: null },
            include: {
                assignmentItems: { where: { deletedAt: null } },
            },
        });
        expect(result).toEqual(mockAssignment);
    });
});
