import { prisma } from '@/lib/prisma';

/**
 * Saves a new set of timelines for a class, replacing the old ones.
 * @param classId The ID of the class
 * @param timelines Array of timeline objects to save
 */
export async function saveClassTimelines(classId: number, timelines: { activity: string, date: Date }[]) {
    // We use a transaction to safely delete the old timelines and insert the new ones
    return await prisma.$transaction(async (tx) => {
        // Find existing timelines to hard-delete or soft-delete. 
        // We'll hard delete them here since timelines are entirely replaced.
        await tx.timeline.deleteMany({
            where: { classId }
        });

        // If there are new timelines to create
        if (timelines.length > 0) {
            await tx.timeline.createMany({
                data: timelines.map(t => ({
                    classId,
                    activity: t.activity,
                    date: t.date,
                }))
            });
        }

        return true;
    });
}
