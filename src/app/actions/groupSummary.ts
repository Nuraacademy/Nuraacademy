"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";

export async function saveGroupSummary(data: {
    sessionId: number;
    groupName: string;
    content: string;
}) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const summary = await prisma.groupSummary.upsert({
            where: {
                sessionId_groupName: {
                    sessionId: data.sessionId,
                    groupName: data.groupName
                }
            },
            update: {
                content: data.content,
                submittedBy: userId
            },
            create: {
                sessionId: data.sessionId,
                groupName: data.groupName,
                content: data.content,
                submittedBy: userId
            }
        });

        revalidatePath(`/classes/[id]/course/[course_id]/session/${data.sessionId}/group-summary`, 'page');
        
        return { success: true, data: summary };
    } catch (error: any) {
        console.error("Save Group Summary Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getGroupSummaries(sessionId: number, groupNames: string[]) {
    try {
        const summaries = await prisma.groupSummary.findMany({
            where: {
                sessionId: sessionId,
                groupName: { in: groupNames },
                deletedAt: null
            }
        });
        return { success: true, data: summaries };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
