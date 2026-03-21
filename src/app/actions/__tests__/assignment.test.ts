import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { submitTest } from '../assignment';
import { prisma } from '@/lib/prisma';

mock.module('@/controllers/assignmentController', () => ({
    submitAssignment: mock().mockResolvedValue({ id: 1 }),
}));

mock.module('@/lib/rbac', () => ({
    requirePermission: mock().mockResolvedValue(true),
}));

mock.module('@/lib/prisma', () => ({
    prisma: {
        assignment: {
            findUnique: mock(),
        },
    },
}));

mock.module('next/cache', () => ({
    revalidatePath: mock(),
}));

describe('submitTest Action', () => {
    beforeEach(() => {
        mock.restore();
    });

    test('should reject late submission based on endDate', async () => {
        const formData = new FormData();
        formData.append('assignmentId', '1');
        formData.append('enrollmentId', '1');
        formData.append('classId', '1');
        formData.append('startedAt', new Date().toISOString());

        const pastDate = new Date(Date.now() - 120000); // 2 minutes ago
        (prisma.assignment.findUnique as any).mockResolvedValue({
            endDate: pastDate,
        });

        const result = await submitTest(formData);
        expect(result).toEqual({ success: false, error: "Test window closed" });
    });

    test('should reject late submission based on duration if endDate is missing', async () => {
        const formData = new FormData();
        formData.append('assignmentId', '1');
        formData.append('enrollmentId', '1');
        formData.append('classId', '1');
        formData.append('startedAt', new Date().toISOString());

        const startTime = new Date(Date.now() - 3600000); // 1 hour ago
        (prisma.assignment.findUnique as any).mockResolvedValue({
            startDate: startTime,
            duration: 30, // 30 minutes duration, so it's late
            endDate: null,
        });

        const result = await submitTest(formData);
        expect(result).toEqual({ success: false, error: "Test window closed" });
    });

    test('should accept submission within grace period', async () => {
        const formData = new FormData();
        formData.append('assignmentId', '1');
        formData.append('enrollmentId', '1');
        formData.append('classId', '1');
        formData.append('startedAt', new Date().toISOString());
        formData.append('objective_1', 'A');

        const veryRecentPast = new Date(Date.now() - 30000); // 30 seconds ago
        (prisma.assignment.findUnique as any).mockResolvedValue({
            endDate: veryRecentPast, // Plus 1 min grace = 30s left
        });

        const result = await submitTest(formData);
        // It will proceed to submitAssignment, which is mocked to resolve.
        expect(result.success).toBe(true);
    });
});
