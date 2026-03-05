import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getSessionsByCourseId, getSessionById } from '../sessionController';

// Mock the prisma module
mock.module('@/lib/prisma', () => ({
    prisma: {
        session: {
            findMany: mock(),
            findUnique: mock(),
        },
    },
}));

import { prisma } from '@/lib/prisma';

describe('sessionController', () => {
    beforeEach(() => {
        mock.restore();
    });

    test('getSessionsByCourseId should fetch sessions for a specific course', async () => {
        const mockSessions = [
            { id: 1, courseId: 10, title: 'Session 1' },
        ];
        (prisma.session.findMany as any).mockResolvedValue(mockSessions);

        const result = await getSessionsByCourseId(10);

        expect(prisma.session.findMany).toHaveBeenCalledWith({
            where: { courseId: 10, deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: {
                assignments: { where: { deletedAt: null } },
            },
        });
        expect(result).toEqual(mockSessions as any);
    });

    test('getSessionById should fetch a specific session by ID including course and assignments', async () => {
        const mockSession = { id: 1, title: 'Session 1' };
        (prisma.session.findUnique as any).mockResolvedValue(mockSession);

        const result = await getSessionById(1);

        expect(prisma.session.findUnique).toHaveBeenCalledWith({
            where: { id: 1, deletedAt: null },
            include: {
                course: {
                    include: { class: true },
                },
                assignments: { where: { deletedAt: null } },
            },
        });
        expect(result).toEqual(mockSession as any);
    });
});
