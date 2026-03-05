import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getEnrollment, getEnrollmentProgress } from '../enrollmentController';

// Mock the prisma module
mock.module('@/lib/prisma', () => ({
    prisma: {
        enrollment: {
            findUnique: mock(),
        },
    },
}));

import { prisma } from '@/lib/prisma';

describe('enrollmentController', () => {
    beforeEach(() => {
        mock.restore();
    });

    test('getEnrollment should fetch specific user-class enrollment', async () => {
        const mockEnrollment = { id: 1, userId: 10, classId: 20 };
        (prisma.enrollment.findUnique as any).mockResolvedValue(mockEnrollment);

        const result = await getEnrollment(10, 20);

        expect(prisma.enrollment.findUnique).toHaveBeenCalledWith({
            where: {
                userId_classId: { userId: 10, classId: 20 },
            },
            include: {
                class: { select: { title: true, isDraft: true } },
            },
        });
        expect(result).toEqual(mockEnrollment);
    });

    test('getEnrollmentProgress should fetch course mappings and results for an enrollment', async () => {
        const mockProgress = { id: 1, courseMappings: [], ses: [] };
        (prisma.enrollment.findUnique as any).mockResolvedValue(mockProgress);

        const result = await getEnrollmentProgress(1);

        expect(prisma.enrollment.findUnique).toHaveBeenCalledWith({
            where: { id: 1, deletedAt: null },
            include: {
                courseMappings: { where: { deletedAt: null } },
                ses: { where: { deletedAt: null } },
                assignmentResults: { where: { deletedAt: null } },
            },
        });
        expect(result).toEqual(mockProgress);
    });
});
