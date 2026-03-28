"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { hasPermission, requirePermission } from "@/lib/rbac"

export async function getClassAnalytics(classId: number) {
    await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
    try {
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                enrollments: {
                    where: { deletedAt: null },
                    include: {
                        user: { select: { id: true, name: true, username: true } },
                        learnerAnalytics: true,
                        assignmentResults: {
                            where: { deletedAt: null },
                            include: { assignment: true }
                        },
                        ses: {
                            where: { deletedAt: null },
                            include: { session: true }
                        },
                        peerFeedbackReceiver: true
                    }
                },
                courses: {
                    where: { deletedAt: null },
                    include: {
                        sessions: { where: { deletedAt: null } },
                        assignments: { where: { deletedAt: null } }
                    }
                }
            }
        });

        if (!classData) return { success: false, error: "Class not found" };

        let myEnrollment = classData.enrollments.find(e => e.userId === userId);
        
        if (!myEnrollment && classData.enrollments.length > 0) {
            // Check if user is Admin/Trainer and allow viewing a representative report
            const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
            if (user?.role?.name !== 'Learner') {
                myEnrollment = classData.enrollments[0];
            }
        }

        if (!myEnrollment) return { success: false, error: "Enrolled user not found" };

        // 1. Group Logic
        const myGroup = await prisma.group.findFirst({
            where: { enrollmentId: myEnrollment.id, deletedAt: null }
        });

        let myExperienceMembers: any[] = [];
        if (myGroup) {
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

        // 2. Metrics Calculation
        const totalSessions = classData.courses.reduce((acc, c) => acc + c.sessions.length, 0);
        const attendedSessions = myEnrollment.ses.filter(s => s.status !== 'absent').length;
        const sesScores = myEnrollment.ses.filter(s => s.score !== null).map(s => s.score as number);
        const avgSes = sesScores.length > 0 ? sesScores.reduce((a, b) => a + b, 0) / sesScores.length : 0;

        const totalAssignments = classData.courses.reduce((acc, c) => acc + c.assignments.length, 0);
        const passedAssignments = myEnrollment.assignmentResults.filter(ar => ar.status === 'PASS').length;
        const finishedAssignments = myEnrollment.assignmentResults.filter(ar => ar.finishedAt !== null).length;

        // Progress
        const courseDone = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
        const coursePass = totalAssignments > 0 ? (passedAssignments / totalAssignments) * 100 : 0;

        // Performance per course
        const performance = classData.courses.map(course => {
            const courseAssignments = myEnrollment.assignmentResults.filter(ar => ar.assignment.courseId === course.id);
            const preTest = courseAssignments.find(ar => ar.assignment.type === 'PRETEST')?.totalScore || 0;
            const postTest = courseAssignments.find(ar => ar.assignment.type === 'POSTTEST')?.totalScore || 0;
            const avgAssignment = courseAssignments
                .filter(ar => ar.assignment.type === 'ASSIGNMENT')
                .reduce((acc, ar, _, arr) => acc + (ar.totalScore || 0) / arr.length, 0);

            // Learning Gain: (Post - Pre) / (100 - Pre)
            const learningGain = (preTest < 100) ? (postTest - preTest) / (100 - preTest) : 0;

            return {
                courseTitle: course.title,
                preTest,
                postTest,
                assignment: avgAssignment,
                learningGain: Math.max(0, learningGain) // Ensure non-negative
            };
        });

        // Teamwork (Formula: (score / 10) * 100%, averaged over all potential group records)
        const peerFeedbacks = myEnrollment.peerFeedbackReceiver || [];
        const potentialPeerCount = Math.max(1, myExperienceMembers.length - 1);

        const avgPeer = (key: string) => {
            const sum = peerFeedbacks.reduce((acc, f: any) => acc + (f[key] || 0), 0);
            return (sum / potentialPeerCount) * 10; // Convert 0-10 to 0-100%
        };

        const teamwork = myEnrollment.learnerAnalytics;

        // Final Project (Priority: PROJECT type assignment result > learnerAnalytics)
        const projectResult = myEnrollment.assignmentResults.find(ar => ar.assignment.type === 'PROJECT');
        const finalProjectData = projectResult ? {
            problemUnderstanding: ((projectResult as any).problemUnderstanding || 0) * 10, // Scale to 0-100% for the progress bars
            dataReasoning: (myEnrollment.learnerAnalytics?.dataReasoningScore || 0),
            methods: ((projectResult as any).technicalAbility || 0) * 10,
            insightQuality: (myEnrollment.learnerAnalytics?.insightQualityScore || 0),
            solutionQuality: ((projectResult as any).solutionQuality || 0) * 10
        } : {
            problemUnderstanding: (myEnrollment.learnerAnalytics?.problemUnderstandingScore || 0),
            dataReasoning: (myEnrollment.learnerAnalytics?.dataReasoningScore || 0),
            methods: (myEnrollment.learnerAnalytics?.methodsScore || 0),
            insightQuality: (myEnrollment.learnerAnalytics?.insightQualityScore || 0),
            solutionQuality: (myEnrollment.learnerAnalytics?.solutionQualityScore || 0)
        };

        const analytics = {
            className: classData.title,
            groupName: myGroup?.name || "Your Group",
            progress: {
                courseDone: Math.round(courseDone),
                coursePass: Math.round(coursePass)
            },
            engagement: {
                sesScore: Math.round(avgSes),
                presence: Math.round(totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0)
            },
            performance,
            teamwork: {
                cooperation: Math.round(avgPeer('cooperation') || (teamwork?.cooperationScore ? teamwork.cooperationScore * 10 : 0)),
                attendance: Math.round(avgPeer('attendance') || (teamwork?.attendanceScore ? teamwork.attendanceScore * 10 : 0)),
                taskCompletion: Math.round(avgPeer('taskCompletion') || (teamwork?.taskCompletionScore ? teamwork.taskCompletionScore * 10 : 0)),
                initiatives: Math.round(avgPeer('initiatives') || (teamwork?.initiativesScore ? teamwork.initiativesScore * 10 : 0)),
                communication: Math.round(avgPeer('communication') || (teamwork?.communicationScore ? teamwork.communicationScore * 10 : 0))
            },
            finalProject: finalProjectData
        };

        return {
            success: true,
            data: analytics,
            raw: classData,
            myEnrollment,
            groupMembers: myExperienceMembers,
            groupName: myGroup?.name || "Your Group"
        };
    } catch (error: any) {
        console.error("Get Class Analytics Error:", error);
        return { success: false, error: error.message };
    }
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
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Verify user is Admin/Trainer/Instructor
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });

    if (!user || user.role?.name === 'Learner') {
        return { success: false, error: "Insufficient permissions" };
    }

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

export async function getTrainerAnalytics(classId: number, trainerUserId?: number) {
    try {
        await requirePermission('Analytics', 'ANALYTICS_REPORT_TRAINER');
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                trainerFeedbacks: {
                    where: { trainerId: trainerUserId || { not: 0 } }, // If no trainerId provided, potentially multi-trainer or default?
                    include: {
                        evaluator: { include: { user: true } }
                    }
                }
            }
        });

        if (!classData) return { success: false, error: "Class not found" };

        // Determine trainer to report on
        // For now, if trainerUserId is not provided, we take the class creator if they are a trainer, or the first trainer receiving feedback
        const targetTrainerId = trainerUserId || (classData.trainerFeedbacks[0]?.trainerId) || classData.createdBy;

        if (!targetTrainerId) return { success: false, error: "No trainer found for this class" };

        const trainerUser = await prisma.user.findUnique({
            where: { id: targetTrainerId },
            select: { id: true, name: true, username: true }
        });

        // 1. Calculate feedback scores (1-10 range as in Peer Feedback)
        const feedbacks = classData.trainerFeedbacks.filter(f => f.trainerId === targetTrainerId);
        const count = feedbacks.length;

        const avg = (key: string) => {
            if (count === 0) return 0;
            const sum = feedbacks.reduce((acc, f: any) => acc + (f[key] || 0), 0);
            return Math.round(sum / count);
        };

        const feedbackMetrics = {
            mastery: avg('mastery'),
            communication: avg('communication'),
            engagement: avg('engagement'),
            responsiveness: avg('responsiveness'),
            motivation: avg('motivation'),
        };

        // 2. Aggregate feedback details (comments)
        const feedbackDetails = {
            mastery: feedbacks.map(f => (f as any).masteryFeedback).filter(Boolean),
            communication: feedbacks.map(f => (f as any).communicationFeedback).filter(Boolean),
            engagement: feedbacks.map(f => (f as any).engagementFeedback).filter(Boolean),
            responsiveness: feedbacks.map(f => (f as any).responsivenessFeedback).filter(Boolean),
            motivation: feedbacks.map(f => (f as any).motivationFeedback).filter(Boolean),
        };

        // 3. Forum Stats
        const discussions = await prisma.discussion.findMany({
            where: { userId: targetTrainerId, deletedAt: null },
            include: {
                likes: true,
                replies: {
                    include: { likes: true }
                }
            }
        });

        const totalPost = discussions.length;
        const totalLikes = discussions.reduce((acc, d) => acc + d.likes.length, 0);
        const totalReply = discussions.reduce((acc, d) => acc + d.replies.length, 0);

        const avgLikes = totalPost > 0 ? (totalLikes / totalPost) : 0;
        const avgReply = totalPost > 0 ? (totalReply / totalPost) : 0;

        const analytics = {
            className: classData.title,
            trainer: trainerUser,
            feedback: feedbackMetrics,
            details: feedbackDetails,
            forum: {
                totalPost,
                totalLikes,
                totalReply,
                avgLikes: Math.round(avgLikes),
                avgReply: Math.round(avgReply)
            }
        };

        return { success: true, data: analytics };
    } catch (error: any) {
        console.error("Get Trainer Analytics Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getClassFeedbackAnalytics(classId: number) {
    try {
        await requirePermission('Analytics', 'ANALYTICS_REPORT_TRAINER');
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                classFeedbacks: {
                    where: { deletedAt: null },
                    include: {
                        user: { select: { id: true, name: true, username: true } }
                    }
                }
            }
        });

        if (!classData) return { success: false, error: "Class not found" };

        const feedbacks = classData.classFeedbacks;
        const count = feedbacks.length;

        const avg = (key: string) => {
            if (count === 0) return 0;
            const sum = feedbacks.reduce((acc, f: any) => acc + (f[key] || 0), 0);
            return Math.round(sum / count);
        };

        const feedbackMetrics = {
            courseStructure: avg('courseStructure'),
            learningEnvironment: avg('learningEnvironment'),
            materialQuality: avg('materialQuality'),
            practicalRelevance: avg('practicalRelevance'),
            technicalSupport: avg('technicalSupport'),
        };

        const feedbackDetails = {
            courseStructure: feedbacks.map(f => (f as any).courseStructureFeedback).filter(Boolean),
            learningEnvironment: feedbacks.map(f => (f as any).learningEnvironmentFeedback).filter(Boolean),
            materialQuality: feedbacks.map(f => (f as any).materialQualityFeedback).filter(Boolean),
            practicalRelevance: feedbacks.map(f => (f as any).practicalRelevanceFeedback).filter(Boolean),
            technicalSupport: feedbacks.map(f => (f as any).technicalSupportFeedback).filter(Boolean),
        };

        return {
            success: true,
            data: {
                className: classData.title,
                metrics: feedbackMetrics,
                details: feedbackDetails,
                totalFeedbacks: count
            }
        };
    } catch (error: any) {
        console.error("Get Class Feedback Analytics Error:", error);
        return { success: false, error: error.message };
    }
}
export async function getAllLearners() {
    try {
        await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const enrollments = await prisma.enrollment.findMany({
            where: { deletedAt: null },
            include: {
                user: { select: { id: true, name: true, username: true, email: true } },
                class: { select: { id: true, title: true } }
            },
            orderBy: { enrolledAt: 'desc' }
        });

        return { success: true, data: enrollments };
    } catch (error: any) {
        console.error("Get All Learners Analytics Error:", error);
        return { success: false, error: error.message };
    }
}
