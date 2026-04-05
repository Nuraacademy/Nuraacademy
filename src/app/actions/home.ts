"use server"

import { prisma } from "@/lib/prisma";

export async function getHomeStats() {
    try {
        const [userCount, curriculaCount, submissionCount] = await Promise.all([
            prisma.user.count({
                where: { deletedAt: null }
            }),
            prisma.curricula.count({
                where: { 
                    deletedAt: null,
                    status: 'Active'
                }
            }),
            prisma.assignmentResult.count({
                where: { 
                    deletedAt: null,
                    totalScore: { not: null }
                }
            })
        ]);

        return {
            success: true,
            stats: {
                users: userCount,
                curricula: curriculaCount,
                submissions: submissionCount
            }
        };
    } catch (error: any) {
        console.error("Error fetching home stats:", error);
        return { success: false, error: error.message };
    }
}
