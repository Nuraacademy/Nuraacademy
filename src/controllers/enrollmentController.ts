import { prisma } from '@/lib/prisma';
import { EnrollmentStatus, LearningObjective } from '@prisma/client';

export async function createEnrollment(data: {
    userId: string;
    classId: string;
    profession?: string;
    yearsOfExperience?: number;
    workField?: string;
    educationField?: string;
    jobIndustry?: string;
    finalExpectations?: string;
    cvFileUrl?: string;
    learningObjectives: LearningObjective[];
}) {
    return prisma.enrollment.create({
        data: {
            userId: data.userId,
            classId: data.classId,
            profession: data.profession,
            yearsOfExperience: data.yearsOfExperience,
            workField: data.workField,
            educationField: data.educationField,
            jobIndustry: data.jobIndustry,
            finalExpectations: data.finalExpectations,
            cvFileUrl: data.cvFileUrl,
            learningObjectives: {
                create: data.learningObjectives.map((obj) => ({
                    objective: obj,
                })),
            },
        },
    });
}

export async function getEnrollmentStatus(userId: string, classId: string) {
    return prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId,
                classId,
            },
        },
        include: {
            learningObjectives: true,
        },
    });
}
export async function getEnrolledLearners(classId: string) {
    return prisma.enrollment.findMany({
        where: { classId },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            }
        }
    });
}
