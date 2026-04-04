"use server"

import { prisma } from "@/lib/prisma";
import { getSession } from "./auth";

export type AppNotification = {
    id: string;
    type: "class_started" | "class_ending" | "session_soon" | "assignment_due" | "timeline_today" | "reflection_pending" | "placement_test_soon" | "placement_test_ending";
    title: string;
    message: string;
    href: string;
};

export async function getNotificationsAction(): Promise<{ success: boolean; data: AppNotification[] }> {
    try {
        const userId = await getSession();
        if (!userId) return { success: true, data: [] };

        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const in1h = new Date(now.getTime() + 60 * 60 * 1000);
        const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now); endOfToday.setHours(23, 59, 59, 999);

        // Get user's active enrollments with full related data
        const enrollments = await prisma.enrollment.findMany({
            where: { userId, status: "ACTIVE", deletedAt: null },
            include: {
                class: {
                    include: {
                        timelines: {
                            where: { date: { gte: startOfToday, lte: endOfToday }, deletedAt: null }
                        },
                        courses: {
                            include: {
                                sessions: {
                                    where: { deletedAt: null, isSynchronous: true }
                                }
                            }
                        },
                        assignments: {
                            where: {
                                deletedAt: null,
                                OR: [
                                    { endDate: { gte: now, lte: in3Days } },
                                    { startDate: { gte: now, lte: in3Days } },
                                    { type: "PLACEMENT" }
                                ]
                            }
                        }
                    }
                },
                reflections: { select: { sessionId: true } }
            }
        });

        const notifications: AppNotification[] = [];

        for (const enrollment of enrollments) {
            const cls = enrollment.class;
            const classHref = `/classes/${cls.id}/overview`;

            // 1. Class starting today
            if (cls.startDate && cls.startDate >= startOfToday && cls.startDate <= endOfToday) {
                notifications.push({
                    id: `class-start-${cls.id}`,
                    type: "class_started",
                    title: "Class started today",
                    message: `${cls.title} has started today. Welcome!`,
                    href: classHref,
                });
            }

            // 2. Class ending within 24 hours
            if (cls.endDate && cls.endDate > now && cls.endDate <= in24h) {
                notifications.push({
                    id: `class-end-${cls.id}`,
                    type: "class_ending",
                    title: "Class ending soon",
                    message: `${cls.title} ends in less than 24 hours.`,
                    href: classHref,
                });
            }

            // 3. Timeline activity today
            for (const timeline of cls.timelines) {
                notifications.push({
                    id: `timeline-${timeline.id}`,
                    type: "timeline_today",
                    title: "Activity scheduled today",
                    message: `${cls.title}: "${timeline.activity}"`,
                    href: classHref,
                });
            }

            // 4. Assignment due and Placement Tests
            for (const assignment of cls.assignments) {
                if (assignment.type === "PLACEMENT") {
                    // Placement Start soon (3 days)
                    if (assignment.startDate && assignment.startDate > now && assignment.startDate <= in3Days) {
                        notifications.push({
                            id: `placement-start-${assignment.id}`,
                            type: "placement_test_soon",
                            title: "Placement test starting soon",
                            message: `The placement test for ${cls.title} starts on ${assignment.startDate.toLocaleDateString()}.`,
                            href: `/classes/${cls.id}/test`,
                        });
                    }
                    // Placement End soon (3 days)
                    if (assignment.endDate && assignment.endDate > now && assignment.endDate <= in3Days) {
                        notifications.push({
                            id: `placement-end-${assignment.id}`,
                            type: "placement_test_ending",
                            title: "Placement test ending soon",
                            message: `The placement test for ${cls.title} ends on ${assignment.endDate.toLocaleDateString()}.`,
                            href: `/classes/${cls.id}/test`,
                        });
                    }
                } else if (assignment.endDate && assignment.endDate > now && assignment.endDate <= in24h) {
                    // Normal assignment due soon (24 hours)
                    notifications.push({
                        id: `assignment-due-${assignment.id}`,
                        type: "assignment_due",
                        title: "Assignment deadline tomorrow",
                        message: `"${assignment.title || 'Assignment'}" in ${cls.title} is due soon.`,
                        href: `/assignment/${assignment.id}`,
                    });
                }
            }


            // 5. Synchronous session starting within 1 hour (reads schedule JSON)
            const submittedSessionIds = new Set(enrollment.reflections.map(r => r.sessionId));
            for (const course of cls.courses) {
                for (const session of course.sessions) {
                    // Check schedule JSON: expects { startTime: ISO string }
                    const schedule = session.schedule as any;
                    if (schedule?.startTime) {
                        const start = new Date(schedule.startTime);
                        if (start > now && start <= in1h) {
                            notifications.push({
                                id: `session-soon-${session.id}`,
                                type: "session_soon",
                                title: "Session starting soon",
                                message: `"${session.title}" starts in less than 1 hour.`,
                                href: `/classes/${cls.id}/course/${course.id}/session/${session.id}`,
                            });
                        }
                    }

                    // 6. Pending reflection: session exists in SES but no reflection submitted
                    if (!submittedSessionIds.has(session.id)) {
                        const ses = await prisma.sES.findUnique({
                            where: { enrollmentId_sessionId: { enrollmentId: enrollment.id, sessionId: session.id } }
                        });
                        if (ses) {
                            notifications.push({
                                id: `reflection-${enrollment.id}-${session.id}`,
                                type: "reflection_pending",
                                title: "Reflection pending",
                                message: `You haven't submitted a reflection for "${session.title}".`,
                                href: `/classes/${cls.id}/course/${course.id}/session/${session.id}/reflection`,
                            });
                        }
                    }
                }
            }
        }

        return { success: true, data: notifications };
    } catch (error: any) {
        console.error("Notification error:", error);
        return { success: true, data: [] }; // Always return gracefully
    }
}
