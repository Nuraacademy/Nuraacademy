"use server";

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function updateSessionContent(
    moduleId: string,
    classId: string,
    courseId: string,
    contentData: any,
    referenceData: any[]
) {
    try {
        const id = parseInt(moduleId);

        // Update the session in the database
        await prisma.session.update({
            where: { id },
            data: {
                content: contentData,
                reference: referenceData
            }
        });

        // Revalidate the session page to show the updated data
        const sessionPath = `/classes/${classId}/course/${courseId}/session/${moduleId}`;
        revalidatePath(sessionPath);

        return { success: true };
    } catch (error) {
        console.error("Failed to update session:", error);
        return { success: false, error: "Failed to update session" };
    }
}
