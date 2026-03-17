"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { requirePermission } from "@/lib/rbac"

export async function getClassAnalytics(classId: number) {
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Fetch class data
    const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            enrollments: {
                where: { deletedAt: null },
                include: {
                    user: { select: { name: true, username: true } },
                    learnerAnalytics: true,
                    assignmentResults: {
                        include: { assignment: true }
                    }
                }
            },
            courses: {
                where: { deletedAt: null },
                include: {
                    assignments: true
                }
            }
        }
    });

    if (!classData) return { success: false, error: "Class not found" };

    // Aggregate stats
    const analytics = {
        className: classData.title,
        enrollmentCount: classData.enrollments.length,
    };

    // Find current user's enrollment and their group
    const myEnrollment = classData.enrollments.find(e => e.userId === userId);
    let myExperienceMembers: any[] = [];
    
    if (myEnrollment) {
        const myGroup = await prisma.group.findFirst({
            where: { enrollmentId: myEnrollment.id, deletedAt: null }
        });

        if (myGroup) {
            // Find all enrollments that share this group name in this class
            const groupMembers = await prisma.group.findMany({
                where: { 
                    name: myGroup.name, 
                    deletedAt: null,
                    enrollment: { classId: classId }
                },
                include: {
                    enrollment: {
                        include: {
                            user: { select: { id: true, name: true, username: true } }
                        }
                    }
                }
            });
            myExperienceMembers = groupMembers.map(gm => gm.enrollment);
        }
    }

    return { 
        success: true, 
        data: analytics, 
        raw: classData,
        myEnrollment,
        groupMembers: myExperienceMembers
    };
}

export async function getLearnerAnalytics(enrollmentId: number) {
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            user: { select: { name: true, username: true } },
            class: { select: { title: true } },
            learnerAnalytics: true,
            assignmentResults: {
                where: { deletedAt: null },
                include: {
                    assignment: true
                }
            }
        }
    });

    if (!enrollment) return { success: false, error: "Enrollment not found" };

    return { success: true, data: enrollment };
}

export async function saveLearnerAnalytics(data: {
    enrollmentId: number;
    cooperationScore?: number;
    cooperationFeedback?: string;
    attendanceScore?: number;
    attendanceFeedback?: string;
    taskCompletionScore?: number;
    taskCompletionFeedback?: string;
    initiativesScore?: number;
    initiativesFeedback?: string;
    communicationScore?: number;
    communicationFeedback?: string;
    problemUnderstandingScore?: number;
    dataReasoningScore?: number;
    methodsScore?: number;
    insightQualityScore?: number;
    solutionQualityScore?: number;
}) {
    await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    const { enrollmentId, ...scores } = data;

    try {
        const result = await prisma.learnerAnalytics.upsert({
            where: { enrollmentId },
            update: scores,
            create: {
                enrollmentId,
                ...scores
            }
        });
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
