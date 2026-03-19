"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"

export async function getClassAnalytics(classId: number) {
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
                        }
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

        const myEnrollment = classData.enrollments.find(e => e.userId === userId);
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

        // Teamwork
        const teamwork = myEnrollment.learnerAnalytics || {
            cooperationScore: 0,
            attendanceScore: 0,
            taskCompletionScore: 0,
            initiativesScore: 0,
            communicationScore: 0
        };

        // Final Project
        const finalProject = myEnrollment.learnerAnalytics || {
            problemUnderstandingScore: 0,
            dataReasoningScore: 0,
            methodsScore: 0,
            insightQualityScore: 0,
            solutionQualityScore: 0
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
                cooperation: teamwork.cooperationScore || 0,
                attendance: teamwork.attendanceScore || 0,
                taskCompletion: teamwork.taskCompletionScore || 0,
                initiatives: teamwork.initiativesScore || 0,
                communication: teamwork.communicationScore || 0
            },
            finalProject: {
                problemUnderstanding: finalProject.problemUnderstandingScore || 0,
                dataReasoning: finalProject.dataReasoningScore || 0,
                methods: finalProject.methodsScore || 0,
                insightQuality: finalProject.insightQualityScore || 0,
                solutionQuality: finalProject.solutionQualityScore || 0
            }
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
