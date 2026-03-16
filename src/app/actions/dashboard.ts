"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "./auth"
import { AssignmentType } from "@prisma/client"

export interface DashboardData {
    user: {
        username: string;
        name: string;
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
    }[];
    analytics: {
        id: number;
        name: string;
        className: string;
    }[];
    trainers: {
        id: number;
        name: string;
        role: string;
        username: string;
    }[];
    stats: {
        totalLearners: number;
    };
    schedule: {
        id: number;
        date: Date | null;
        activity: string;
        className: string;
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

    // 1. Fetch Classes (All active)
    const classes = await prisma.class.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
            enrollments: { where: { deletedAt: null } }
        }
    });

    // 2. Fetch Assignments (Recent across all classes)
    const assignments = await prisma.assignment.findMany({
        where: { deletedAt: null },
        include: {
            class: { select: { title: true } },
            course: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    // 3. Fetch Recent Learners (Analytics & Report)
    const recentLearners = await prisma.enrollment.findMany({
        where: {
            deletedAt: null,
            user: { role: { name: 'Learner' } }
        },
        include: {
            user: { select: { name: true, username: true } },
            class: { select: { title: true } }
        },
        orderBy: { enrolledAt: 'desc' },
        take: 5
    });

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

    // 6. Fetch Global Schedule (Timelines)
    const timelines = await prisma.timeline.findMany({
        where: { deletedAt: null },
        include: {
            class: { select: { title: true } }
        },
        orderBy: { date: 'asc' },
        take: 5
    });

    return {
        success: true,
        data: {
            user: {
                username: user.username,
                name: user.name || user.username
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
                courseName: a.course?.title || "N/A"
            })),
            analytics: recentLearners.map(l => ({
                id: l.id,
                name: l.user.name || l.user.username,
                className: l.class.title
            })),
            trainers: trainers.map(t => ({
                id: t.id,
                name: t.name || t.username,
                username: t.username,
                role: "Mentor" // Simplified for UI
            })),
            stats: {
                totalLearners
            },
            schedule: timelines.map(t => ({
                id: t.id,
                date: t.date,
                activity: t.activity,
                className: t.class.title
            }))
        }
    };
}
