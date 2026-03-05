import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getAssignmentsBySessionId, getAssignmentById, getAssignments, getPlacementTestByClassId, getAssignmentBySessionAndType } from '../assignmentController';
import { AssignmentType } from '@prisma/client';

mock.module('@/lib/prisma', () => ({
    prisma: {
        assignment: {
            findMany: mock(),
            findUnique: mock(),
            findFirst: mock(),
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
        expect(result).toEqual(mockAssignments as any);
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
        expect(result).toEqual(mockAssignments as any);
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
        expect(result).toEqual(mockAssignment as any);
    });

    test('getAssignments should fetch all assignments with inclusions and correct order', async () => {
        const mockAssignments = [
            { id: 1, title: 'A1', class: { title: 'C1' }, course: { title: 'Cr1' } },
        ];
        (prisma.assignment.findMany as any).mockResolvedValue(mockAssignments);

        const result = await getAssignments();

        expect(prisma.assignment.findMany).toHaveBeenCalledWith({
            where: { deletedAt: null },
            include: {
                class: { select: { title: true } },
                course: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        expect(result).toEqual(mockAssignments as any);
    });

    test('getPlacementTestByClassId should fetch placement test for a specific class', async () => {
        const mockAssignment = { id: 1, type: 'PLACEMENT', classId: 10 };
        (prisma.assignment.findFirst as any).mockResolvedValue(mockAssignment);

        const result = await getPlacementTestByClassId(10);

        expect(prisma.assignment.findFirst).toHaveBeenCalledWith({
            where: {
                classId: 10,
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
        expect(result).toEqual(mockAssignment as any);
    });

    test('getAssignmentBySessionAndType should fetch specific assignment type for a session', async () => {
        const mockAssignment = { id: 1, type: 'PRETEST', sessionId: 20 };
        (prisma.assignment.findFirst as any).mockResolvedValue(mockAssignment);

        const result = await getAssignmentBySessionAndType(20, 'PRETEST' as any);

        expect(prisma.assignment.findFirst).toHaveBeenCalledWith({
            where: {
                sessionId: 20,
                type: 'PRETEST' as any,
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
        expect(result).toEqual(mockAssignment as any);
    });
});
