import { prisma } from '@/lib/prisma';

// PLACEMENT TEST
export async function getPlacementTest(classId: string) {
    return prisma.placementTest.findUnique({
        where: { classId },
        include: {
            objectiveQuestions: { orderBy: { order: 'asc' } },
            essayQuestions: { orderBy: { order: 'asc' } },
            projectQuestions: { orderBy: { order: 'asc' } },
        },
    });
}

export async function getPreTest(sessionId: string) {
    return prisma.preTest.findFirst({
        where: { sessionId },
        include: {
            questions: { orderBy: { order: 'asc' } },
        },
    });
}

export async function getPostTest(sessionId: string) {
    return prisma.postTest.findFirst({
        where: { sessionId },
        include: {
            questions: { orderBy: { order: 'asc' } },
        },
    });
}

export async function submitPlacementTest(data: {
    userId: string;
    placementTestId: string;
    objectiveAnswers?: { questionId: string; selectedOption: string }[];
    essayAnswers?: { questionId: string; answerText: string }[];
    projectAnswers?: { questionId: string; answerText?: string; fileUrl?: string }[];
}) {
    return prisma.testSubmission.create({
        data: {
            userId: data.userId,
            placementTestId: data.placementTestId,
            isFinished: true,
            submittedAt: new Date(),
            objectiveAnswers: {
                create: data.objectiveAnswers,
            },
            essayAnswers: {
                create: data.essayAnswers,
            },
            projectAnswers: {
                create: data.projectAnswers,
            },
        },
    });
}

// ASSIGNMENT
export async function getAssignmentsByCourse(courseId: string) {
    return prisma.assignment.findMany({
        where: { courseId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getAssignmentDetails(id: string) {
    return prisma.assignment.findUnique({
        where: { id },
        include: {
            course: {
                include: {
                    class: true
                }
            }
        }
    });
}

export async function getCourseAssignments(courseId: string) {
    return prisma.assignment.findMany({
        where: { courseId },
        orderBy: { createdAt: 'asc' }
    });
}

export async function submitAssignment(data: {
    assignmentId: string;
    userId: string;
    fileUrl?: string;
    note?: string;
}) {
    return prisma.assignmentSubmission.upsert({
        where: {
            assignmentId_userId: {
                assignmentId: data.assignmentId,
                userId: data.userId,
            },
        },
        update: {
            fileUrl: data.fileUrl,
            note: data.note,
            submittedAt: new Date(),
        },
        create: {
            assignmentId: data.assignmentId,
            userId: data.userId,
            fileUrl: data.fileUrl,
            note: data.note,
            submittedAt: new Date(),
        },
    });
}
