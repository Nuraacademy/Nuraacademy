import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getAllClasses, getClassById } from '../classController';

// Mock the prisma module
mock.module('@/lib/prisma', () => ({
    prisma: {
        class: {
            findMany: mock(),
            findUnique: mock(),
        },
    },
}));

import { prisma } from '@/lib/prisma';

describe('classController', () => {
    beforeEach(() => {
        mock.restore();
    });

    test('getAllClasses should fetch active classes ordered by creation date', async () => {
        const mockClasses = [
            { id: 1, title: 'Test Class 1', isDraft: false },
            { id: 2, title: 'Test Class 2', isDraft: false },
        ];
        (prisma.class.findMany as any).mockResolvedValue(mockClasses);

        const result = await getAllClasses();

        expect(prisma.class.findMany).toHaveBeenCalledWith({
            where: { deletedAt: null, isDraft: false },
            orderBy: { createdAt: 'desc' },
            include: {
                timelines: { where: { deletedAt: null } },
            },
        });
        expect(result).toEqual(mockClasses);
    });

    test('getClassById should fetch a specific class by ID including relations', async () => {
        const mockClass = { id: 1, title: 'Test Class 1' };
        (prisma.class.findUnique as any).mockResolvedValue(mockClass);

        const result = await getClassById(1);

        expect(prisma.class.findUnique).toHaveBeenCalledWith({
            where: { id: 1, deletedAt: null },
            include: {
                timelines: {
                    where: { deletedAt: null },
                    orderBy: { date: 'asc' },
                },
                courses: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        expect(result).toEqual(mockClass);
    });
});
