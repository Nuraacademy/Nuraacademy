import { prisma } from '@/lib/prisma';
import { AssignmentType, AssignmentStatus } from '@prisma/client';

/**
 * Get the placement results for all learners in a class.
 */
export async function getLearnerPlacementResults(classId: number) {
    const placementTest = await prisma.assignment.findFirst({
        where: { classId, type: AssignmentType.PLACEMENT, deletedAt: null },
        include: { assignmentItems: { where: { deletedAt: null } } }
    });

    if (!placementTest) return [];

    const maxScore = placementTest.assignmentItems.reduce((acc, item) => acc + (item.maxScore || 0), 0);

    const enrollments = await prisma.enrollment.findMany({
        where: {
            classId,
            deletedAt: null,
            user: { role: { name: 'Learner' } }
        },
        include: {
            user: { select: { id: true, name: true, username: true } },
            assignmentResults: {
                where: { assignmentId: placementTest.id },
                include: {
                    assignmentItemResults: {
                        include: { assignmentItem: true }
                    }
                }
            }
        },
    });

    return enrollments.map(e => {
        const result = e.assignmentResults[0];
        const items = result?.assignmentItemResults || [];

        const activeContentKeys = new Set(placementTest.assignmentItems.map(i => `${i.type}:${i.question}`));
        const uniqueResults = new Map<string, any>();
        
        items.forEach((ir: any) => {
            const item = ir.assignmentItem;
            if (!item) return;
            const contentKey = `${item.type}:${item.question}`;
            if (activeContentKeys.has(contentKey)) {
                const existing = uniqueResults.get(contentKey);
                if (!existing || ir.id > existing.id) {
                    uniqueResults.set(contentKey, ir);
                }
            }
        });

        const validItems = Array.from(uniqueResults.values());
        
        // A test is "Fully Graded" if all items have a non-null score
        const totalItems = placementTest.assignmentItems.length;
        const gradedItems = validItems.filter(i => i.score !== null).length;
        const isGraded = totalItems === 0 || gradedItems === totalItems;

        const objectiveScore = validItems
            .filter(i => i.assignmentItem?.type === 'OBJECTIVE')
            .reduce((acc, i) => acc + (i.score || 0), 0);

        return {
            enrollmentId: e.id,
            name: e.user.name || e.user.username,
            status: result ? (isGraded ? "Graded" : "To Grade") : "Not Started",
            totalScore: result?.totalScore || 0,
            maxScore: maxScore,
            objectiveScore: objectiveScore,
            submittedAt: result?.finishedAt,
            assignmentId: placementTest.id,
        };
    });
}

/**
 * Get detailed grading data for a specific learner's placement test.
 */
export async function getGradingData(assignmentId: number, enrollmentId: number) {
    const result = await prisma.assignmentResult.findUnique({
        where: { assignmentId_enrollmentId: { assignmentId, enrollmentId } },
        include: {
            assignment: {
                include: {
                    assignmentItems: {
                        where: { deletedAt: null },
                        orderBy: { id: 'asc' }
                    }
                }
            },
            assignmentItemResults: {
                include: { assignmentItem: true }
            }
        }
    });

    if (!result) return null;

    // Ensure all items have a result record (for legacy data or skipped answers)
    // We check for both ID match AND content match (question text + type)
    const missingItems = result.assignment.assignmentItems.filter(item => {
        return !result.assignmentItemResults.some(ir => {
            const sameId = ir.assignmentItemId === item.id;
            const sameContent = ir.assignmentItem?.question === item.question && ir.assignmentItem?.type === item.type;
            return sameId || sameContent;
        });
    });

    if (missingItems.length > 0) {
        await prisma.assignmentItemResult.createMany({
            data: missingItems.map(item => ({
                assignmentResultId: result.id,
                assignmentItemId: item.id,
                answer: null,
                score: item.type === 'OBJECTIVE' ? 0 : null
            }))
        });
        
        // Re-fetch with new items
        return getGradingData(assignmentId, enrollmentId);
    }

    // Categorize items and de-duplicate by content
    const objective: any[] = [];
    const essay: any[] = [];
    const project: any[] = [];

    const uniqueResults = new Map<string, any>();
    
    result.assignmentItemResults.forEach((ir: any) => {
        const item = ir.assignmentItem;
        if (!item) return;

        const contentKey = `${item.type}:${item.question}`;
        const existing = uniqueResults.get(contentKey);
                
        const hasData = (ir.answer !== null && ir.answer !== undefined && ir.answer !== "") || (ir.score !== null && ir.score !== undefined);
        const existingHasData = existing && ((existing.answer !== null && existing.answer !== undefined && existing.answer !== "") || (existing.score !== null && existing.score !== undefined));

        const shouldReplace = !existing || (hasData && !existingHasData) || (hasData === existingHasData && ir.id > existing.id);

        if (shouldReplace) {
            uniqueResults.set(contentKey, ir);
        }
    });

    uniqueResults.forEach((ir: any) => {
        const item = ir.assignmentItem;
        const data = {
            id: item.id,
            question: item.question,
            givenAnswer: ir.answer || "",
            correctAnswer: item.correctAnswer,
            score: ir.score,
            maxScore: item.maxScore || 10,
            answerFiles: ir.answerFiles,
            resultItemId: ir.id,
        };

        if (item.type === 'OBJECTIVE') objective.push(data);
        else if (item.type === 'ESSAY') essay.push(data);
        else if (item.type === 'PROJECT') project.push(data);
    });

    // Sort by item ID
    const sorter = (a: any, b: any) => a.id - b.id;
    objective.sort(sorter);
    essay.sort(sorter);
    project.sort(sorter);

    return {
        id: result.id,
        learnerName: "", 
        objective,
        essay,
        project,
        totalScore: result.totalScore,
    };
}

/**
 * Submit manual scores and recalculate total score.
 */
export async function submitManualScores(resultId: number, scores: Record<number, number>) {
    return await prisma.$transaction(async (tx) => {
        // 1. Update individual item results
        for (const [resultItemId, score] of Object.entries(scores)) {
            await tx.assignmentItemResult.update({
                where: { id: parseInt(resultItemId) },
                data: { score }
            });
        }

        // 2. Recalculate total score
        const itemResults = await tx.assignmentItemResult.findMany({
            where: { assignmentResultId: resultId }
        });

        const newTotal = itemResults.reduce((acc, ir) => acc + (ir.score || 0), 0);

        return await tx.assignmentResult.update({
            where: { id: resultId },
            data: {
                totalScore: newTotal,
                status: 'PASS', // Or determine based on some global threshold if needed
            }
        });
    });
}

/**
 * Get the course status for all learners in a class based on current scores.
 */
export async function getLearnerCourseStatus(classId: number) {
    const placementTest = await prisma.assignment.findFirst({
        where: { classId, type: AssignmentType.PLACEMENT, deletedAt: null },
        include: { assignmentItems: { where: { deletedAt: null } } },
    });

    if (!placementTest) return { learners: [], courses: [], groups: [] };

    const courses = await prisma.course.findMany({
        where: { classId, deletedAt: null },
        orderBy: { createdAt: 'asc' },
    });

    const enrollments = await prisma.enrollment.findMany({
        where: {
            classId,
            deletedAt: null,
            user: { role: { name: 'Learner' } }
        },
        include: {
            user: { select: { name: true, username: true } },
            assignmentResults: {
                where: { assignmentId: placementTest.id },
                include: { assignmentItemResults: { include: { assignmentItem: true } } },
            },
            groups: { where: { deletedAt: null } }
        },
    });

    const learnersStatus = enrollments.map((enrollment) => {
        const result = enrollment.assignmentResults[0];
        const itemResults = result?.assignmentItemResults || [];

        const courseStatus = courses.map((course) => {
            const courseItems = placementTest.assignmentItems.filter(item => item.courseId === course.id);
            const totalMaxScore = courseItems.reduce((acc, item) => acc + (item.maxScore || 0), 0);
            const learnerScore = itemResults
                .filter(ir => ir.assignmentItem.courseId === course.id)
                .reduce((acc, ir) => acc + (ir.score || 0), 0);

            const isPassed = (course as any).threshold !== null && learnerScore > ((course as any).threshold as number);

            return {
                courseId: course.id,
                score: learnerScore,
                maxScore: totalMaxScore,
                threshold: (course as any).threshold,
                isPassed,
            };
        });

        return {
            enrollmentId: enrollment.id,
            name: enrollment.user.name || enrollment.user.username,
            courses: courseStatus,
            group: enrollment.groups[0]?.name || "-",
        };
    });

    const groups = Array.from(new Set(enrollments.flatMap(e => e.groups.map(g => g.name)).filter(Boolean))) as string[];

    return {
        learners: learnersStatus,
        courses: courses.map(c => ({ id: c.id, title: c.title, threshold: (c as any).threshold })),
        groups,
    };
}

/**
 * Update thresholds for courses in a class.
 */
export async function updateCourseThresholds(thresholds: { courseId: number, threshold: number }[]) {
    return await prisma.$transaction(
        thresholds.map(t => prisma.course.update({
            where: { id: t.courseId },
            data: { threshold: t.threshold } as any
        }))
    );
}

/**
 * Get current groups for a class.
 */
export async function getClassGroupsSummary(classId: number) {
    const enrollments = await prisma.enrollment.findMany({
        where: {
            classId,
            deletedAt: null,
            user: { role: { name: 'Learner' } }
        },
        include: {
            user: { select: { name: true, username: true } },
            groups: { where: { deletedAt: null } }
        }
    });

    const groupMap: Record<string, { name: string, members: string[] }> = {};

    enrollments.forEach(e => {
        const groupName = e.groups[0]?.name || "Ungrouped";
        if (!groupMap[groupName]) {
            groupMap[groupName] = { name: groupName, members: [] };
        }
        groupMap[groupName].members.push(e.user.name || e.user.username);
    });

    return Object.values(groupMap);
}

/**
 * Bulk update/assign groups for learners.
 */
export async function assignLearnerGroups(classId: number, assignments: { enrollmentId: number, groupName: string | null }[]) {
    return await prisma.$transaction(async (tx) => {
        for (const entry of assignments) {
            // Soft-delete existing group mappings for this enrollment in this class
            await tx.group.updateMany({
                where: {
                    enrollmentId: entry.enrollmentId,
                    deletedAt: null,
                },
                data: { deletedAt: new Date() }
            });

            // Create new group mapping if name is provided
            if (entry.groupName) {
                await tx.group.create({
                    data: {
                        enrollmentId: entry.enrollmentId,
                        name: entry.groupName,
                    }
                });
            }
        }
    });
}
