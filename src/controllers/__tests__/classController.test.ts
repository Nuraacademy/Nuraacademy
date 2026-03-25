import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getAllClasses, getClassById } from '../classController';

// Mock the prisma module
mock.module('@/lib/prisma', () => ({
    prisma: {
        class: {
            findMany: mock(),
            findUnique: mock(),
            findFirst: mock(),
            create: mock(),
            update: mock(),
        },
        curricula: {
            findMany: mock(),
        }
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
                courses: { where: { deletedAt: null } },
            },
        });
        expect(result).toEqual(mockClasses as any);
    });

    test('getClassById should fetch a specific class by ID including relations', async () => {
        const mockClass = { id: 1, title: 'Test Class 1' };
        (prisma.class.findFirst as any).mockResolvedValue(mockClass);

        const result = await getClassById(1);

        expect(prisma.class.findFirst).toHaveBeenCalledWith({
            where: { id: 1, deletedAt: null },
            include: {
                timelines: {
                    where: { deletedAt: null },
                    orderBy: { date: 'asc' },
                },
                courses: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: { id: true, name: true, username: true, role: { select: { name: true } } }
                        },
                        sessions: {
                            where: { deletedAt: null },
                            include: {
                                user: {
                                    select: { id: true, name: true, username: true, role: { select: { name: true } } }
                                }
                            }
                        }
                    }
                },
            },
        });
        expect(result).toEqual(mockClass as any);
    });

    test('createClass should create a class with dates', async () => {
        const date = new Date();
        const inputData = {
            title: 'New Class',
            startDate: date,
            endDate: date,
        };
        const mockClass = { id: 1, ...inputData };
        (prisma.class.create as any).mockResolvedValue(mockClass);

        const { createClass } = await import('../classController');
        const result = await createClass(inputData);

        expect(prisma.class.create).toHaveBeenCalledWith({
            data: {
                title: 'New Class',
                startDate: date,
                endDate: date,
                curricula: undefined
            },
        });
        expect(result).toEqual(mockClass as any);
    });

    test('updateClass should update a class with dates', async () => {
        const date = new Date();
        const inputData = {
            title: 'Updated Class',
            startDate: date,
            endDate: date,
        };
        const mockClass = { id: 1, ...inputData };
        (prisma.class.update as any).mockResolvedValue(mockClass);

        const { updateClass } = await import('../classController');
        await updateClass(1, inputData);

        expect(prisma.class.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                title: 'Updated Class',
                startDate: date,
                endDate: date,
                curricula: undefined
            },
        });
    });
});
