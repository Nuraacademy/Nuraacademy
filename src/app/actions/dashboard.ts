"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { AssignmentType } from "@prisma/client"

export interface DashboardData {
    user: {
        username: string;
        name: string;
        role: string;
    };
    classes: {
        id: number;
        title: string;
        imgUrl: string | null;
        hours: number;
        methods: string | null;
        startDate: Date | null;
        endDate: Date | null;
        description: string | null;
        modules: number;
        learnerCount: number;
    }[];
    assignments: {
        id: number;
        title: string;
        type: AssignmentType;
        submissionType: string | null;
        className: string;
        courseName: string;
        classId: number | null;
        courseId: number | null;
        sessionId: number | null;
    }[];
    analytics: {
        id: number;
        name: string;
        className: string;
        image: string | null;
    }[];
    trainers: {
        id: number;
        name: string;
        role: string;
        username: string;
        image: string | null;
    }[];
    stats: {
        totalLearners: number;
        ungradedAssignments: number;
        ungradedExercises: number;
        uncheckedFeedback: number;
        uncheckedReflections: number;
    };
    schedule: {
        id: number;
        date: Date | null;
        activity: string;
        className: string;
    }[];
    curricula: {
        id: number;
        title: string;
    }[];
}

export async function getDashboardData() {
    const userId = await getSession();
    if (!userId) return { success: false, error: "Unauthorized" };

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });

    if (!user || user.role?.name === 'Learner') {
        return { success: false, error: "Unauthorized" };
    }

    const isTrainerOrInstructor = ['Trainer', 'Instructor', 'Instructur'].includes(user.role?.name || '');
    const classFilter = isTrainerOrInstructor ? { OR: [{ trainerId: userId }, { createdBy: userId }] } : {};

    // 1. Fetch Classes
    const classes = await prisma.class.findMany({
        where: { deletedAt: null, ...classFilter },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
            enrollments: { where: { deletedAt: null } }
        }
    });

    // 2. Fetch Assignments (Recent across classes)
    const assignments = await prisma.assignment.findMany({
        where: { deletedAt: null, class: classFilter },
        include: {
            class: { select: { title: true } },
            course: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    // 3. Fetch Recent Enrollments (Analytics & Report)
    const enrollments = await prisma.enrollment.findMany({
        where: {
            deletedAt: null,
            user: { role: { name: 'Learner' } },
            class: classFilter
        },
        include: {
            user: { select: { id: true, name: true, username: true } },
            class: { select: { title: true } }
        },
        orderBy: { enrolledAt: 'desc' },
        take: 15 // Take more to allow for unique user filtering
    });

    // Manual filtering for unique users (Learners)
    const uniqueLearners = [];
    const seenUserIds = new Set();
    for (const e of enrollments) {
        if (!seenUserIds.has(e.userId)) {
            uniqueLearners.push(e);
            seenUserIds.add(e.userId);
            if (uniqueLearners.length >= 5) break; 
        }
    }

    // 4. Fetch Instructors & Trainers
    const trainers = await prisma.user.findMany({
        where: {
            role: { name: { in: ['Instructor', 'Trainer', 'Admin'] } },
            deletedAt: null
        },
        select: {
            id: true,
            name: true,
            username: true,
        },
        take: 5
    });

    // 5. Fetch Global Stats
    const totalLearners = await prisma.user.count({
        where: { role: { name: 'Learner' }, deletedAt: null }
    });

    const ungradedAssignments = await prisma.assignmentResult.count({
        where: { 
            totalScore: null, 
            finishedAt: { not: null },
            deletedAt: null,
            assignment: { type: { in: ['ASSIGNMENT', 'PROJECT'] }, deletedAt: null, class: classFilter }
        }
    });

    const ungradedExercises = await prisma.assignmentResult.count({
        where: { 
            totalScore: null, 
            finishedAt: { not: null },
            deletedAt: null,
            assignment: { type: 'EXERCISE', deletedAt: null, class: classFilter }
        }
    });

    const uncheckedReflections = await prisma.reflection.count({
        where: {
            deletedAt: null,
            feedback: null,
            enrollment: { class: classFilter }
        }
    });

    const uncheckedFeedback = await prisma.classFeedback.count({
        where: { deletedAt: null, class: classFilter }
    });

    // 6. Fetch Global Schedule (Timelines)
    const timelines = await prisma.timeline.findMany({
        where: { deletedAt: null },
        include: {
            class: { select: { title: true } }
        },
        orderBy: { date: 'asc' },
        take: 5
    });

    // 7. Fetch Recent Curricula
    const curricula = await prisma.curricula.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    return {
        success: true,
        data: {
            user: {
                username: user.username,
                name: user.name || user.username,
                role: user.role?.name || "Member"
            },
            classes: classes.map(c => ({
                id: c.id,
                title: c.title,
                imgUrl: c.imgUrl,
                hours: c.hours,
                methods: c.methods,
                startDate: c.startDate,
                endDate: c.endDate,
                description: c.description,
                modules: c.modules,
                learnerCount: c.enrollments.length
            })),
            assignments: assignments.map(a => ({
                id: a.id,
                title: a.title,
                type: a.type,
                submissionType: a.submissionType,
                className: a.class?.title || "Global",
                courseName: a.course?.title || "N/A",
                classId: a.classId,
                courseId: a.courseId,
                sessionId: null
            })),
            analytics: uniqueLearners.map(l => ({
                id: l.id, // Using enrollment ID for specific class context
                name: l.user.name || l.user.username,
                className: l.class.title,
                image: null // User model doesn't have image field currently
            })),
            trainers: trainers.map(t => ({
                id: t.id,
                name: t.name || t.username,
                username: t.username,
                role: "Mentor", // Simplified for UI
                image: null
            })),
            stats: {
                totalLearners,
                ungradedAssignments,
                ungradedExercises,
                uncheckedFeedback,
                uncheckedReflections
            },
            schedule: timelines.map(t => ({
                id: t.id,
                date: t.date,
                activity: t.activity,
                className: t.class.title
            })),
            curricula: curricula.map(c => ({
                id: c.id,
                title: c.title
            }))
        }
    };
}
