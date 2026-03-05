import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getCoursesByClassId, getCourseById } from '../courseController';

// Mock the prisma module
mock.module('@/lib/prisma', () => ({
    prisma: {
        course: {
            findMany: mock(),
            findUnique: mock(),
        },
    },
}));

import { prisma } from '@/lib/prisma';

describe('courseController', () => {
    beforeEach(() => {
        mock.restore();
    });

    test('getCoursesByClassId should fetch courses for a specific class', async () => {
        const mockCourses = [
            { id: 1, classId: 10, title: 'Course 1' },
            { id: 2, classId: 10, title: 'Course 2' },
        ];
        (prisma.course.findMany as any).mockResolvedValue(mockCourses);

        const result = await getCoursesByClassId(10);

        expect(prisma.course.findMany).toHaveBeenCalledWith({
            where: { classId: 10, deletedAt: null },
            orderBy: { createdAt: 'asc' },
        });
        expect(result).toEqual(mockCourses as any);
    });

    test('getCourseById should fetch a specific course by ID including class and sessions', async () => {
        const mockCourse = { id: 1, title: 'Course 1' };
        (prisma.course.findUnique as any).mockResolvedValue(mockCourse);

        const result = await getCourseById(1);

        expect(prisma.course.findUnique).toHaveBeenCalledWith({
            where: { id: 1, deletedAt: null },
            include: {
                class: true,
                sessions: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'asc' },
                    include: {
                        assignments: { where: { deletedAt: null } },
                    },
                },
            },
        });
        expect(result).toEqual(mockCourse as any);
    });
});
