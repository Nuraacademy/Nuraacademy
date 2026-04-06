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

        // Ensure unique dates within the batch to prevent "Unique constraint failed on the fields: (`classId`, `date`)"
        const usedDates = new Set<number>();
        const safeTimelines = timelines.map(t => {
            let time = new Date(t.date).getTime();
            while (usedDates.has(time)) {
                time += 1000; // Offset by 1 second to ensure uniqueness
            }
            usedDates.add(time);
            return {
                classId,
                activity: t.activity,
                date: new Date(time),
            };
        });

        // If there are new timelines to create
        if (safeTimelines.length > 0) {
            await tx.timeline.createMany({
                data: safeTimelines
            });

            // --- SYNC ASSIGNMENTS ---
            // Update PLACEMENT assignments for this class
            const placementStart = timelines.find(t => 
                t.activity.toLowerCase().includes("placement test") && t.activity.toLowerCase().includes("start")
            )?.date;
            const placementEnd = timelines.find(t => 
                t.activity.toLowerCase().includes("placement test") && t.activity.toLowerCase().includes("end")
            )?.date;
            
            if (placementStart) {
                await tx.assignment.updateMany({
                    where: { classId, type: "PLACEMENT", deletedAt: null },
                    data: { 
                        startDate: placementStart, 
                        ...(placementEnd ? { endDate: placementEnd } : {})
                    }
                });
            }

            // Update PROJECT assignments for this class
            const projectStart = timelines.find(t => 
                (t.activity.toLowerCase().includes("project") || t.activity.toLowerCase().includes("final project")) 
                && t.activity.toLowerCase().includes("start")
            )?.date;
            const projectEnd = timelines.find(t => 
                (t.activity.toLowerCase().includes("project") || t.activity.toLowerCase().includes("final project")) 
                && t.activity.toLowerCase().includes("end")
            )?.date;

            if (projectStart) {
                await tx.assignment.updateMany({
                    where: { classId, type: "PROJECT", deletedAt: null },
                    data: { 
                        startDate: projectStart, 
                        ...(projectEnd ? { endDate: projectEnd } : {})
                    }
                });
            }
        }

        return true;
    });
}
