import { prisma } from '@/lib/prisma';
import { AssignmentType, Prisma } from '@prisma/client';

export async function getAssignmentsBySessionId(sessionId: number, type?: AssignmentType) {
    return await prisma.assignment.findMany({
        where: {
            sessionId,
            ...(type && { type }),
            deletedAt: null,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
}

export async function getAssignments(userId?: number) {
    if (userId) {
        // Fetch user's enrollments to know which classes they are in
        const enrollments = await prisma.enrollment.findMany({
            where: { userId, deletedAt: null },
            select: { classId: true }
        });
        const enrolledClassIds = enrollments.map(e => e.classId);

        // Fetch assignments for those classes, excluding those finished by the user
        return await prisma.assignment.findMany({
            where: {
                classId: { in: enrolledClassIds },
                deletedAt: null,
                // Check for results where this user hasn't finished
                NOT: {
                    assignmentResults: {
                        some: {
                            enrollment: { userId: userId },
                            finishedAt: { not: null }
                        }
                    }
                }
            },
            include: {
                class: { select: { title: true } },
                course: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Default admin/instructor view (fetch all)
    return await prisma.assignment.findMany({
        where: {
            deletedAt: null,
        },
        include: {
            class: {
                select: {
                    title: true,
                },
            },
            course: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function getProjectAssignmentsByClassId(classId: number) {
    return await prisma.assignment.findMany({
        where: {
            classId,
            type: "PROJECT",
            deletedAt: null,
        },
        include: {
            course: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}


export async function getAssignmentById(id: number) {
    return await prisma.assignment.findUnique({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            class: { select: { title: true } },
            course: { select: { title: true } },
            assignmentItems: {
                where: { deletedAt: null },
            },
        },
    });
}


export async function getPlacementTestByClassId(classId: number) {
    return await prisma.assignment.findFirst({
        where: {
            classId,
            type: 'PLACEMENT',
            deletedAt: null,
        },
        include: {
            class: true,
            assignmentItems: {
                where: { deletedAt: null },
            },
        },
    });
}

export async function findExistingAssignment(params: {
    classId: number,
    courseId?: number | null,
    sessionId?: number | null,
    type: AssignmentType
}) {
    return await prisma.assignment.findFirst({
        where: {
            classId: params.classId,
            courseId: params.courseId ?? null,
            sessionId: params.sessionId ?? null,
            type: params.type,
            deletedAt: null,
        },
        include: {
            assignmentItems: {
                where: { deletedAt: null },
            },
        },
    });
}

export async function getAssignmentResult(assignmentId: number, enrollmentId: number) {
    return await prisma.assignmentResult.findUnique({
        where: {
            assignmentId_enrollmentId: {
                assignmentId,
                enrollmentId,
            },
        },
        include: {
            assignmentItemResults: {
                include: {
                    assignmentItem: {
                        include: {
                            course: true
                        }
                    }
                }
            }
        }
    });
}

export async function getAssignmentBySessionAndType(sessionId: number, type: AssignmentType) {
    return await prisma.assignment.findFirst({
        where: {
            sessionId,
            type,
            deletedAt: null,
        },
        include: {
            session: {
                include: {
                    course: {
                        include: {
                            class: true
                        }
                    }
                }
            },
            assignmentItems: {
                where: { deletedAt: null },
            },
        },
    });
}

export async function submitAssignment(assignmentId: number, enrollmentId: number, data: {
    objectiveAnswers: Record<number, string>,
    essayAnswers: Record<number, string>,
    essayFiles: Record<number, string>,
    projectAnswers: Record<number, string>,
    projectFiles: Record<number, string>,
    startedAt: Date,
    finishedAt: Date
}) {
    return await prisma.$transaction(async (tx) => {
        // 1. Check for existing result and update it, or create a new one
        const result = await tx.assignmentResult.upsert({
            where: {
                assignmentId_enrollmentId: {
                    assignmentId,
                    enrollmentId,
                },
            },
            update: {
                startedAt: data.startedAt,
                finishedAt: data.finishedAt,
                status: 'NOT_PASS', // Reset or recalculate
                updatedAt: new Date(),
            },
            create: {
                assignmentId,
                enrollmentId,
                startedAt: data.startedAt,
                finishedAt: data.finishedAt,
                status: 'NOT_PASS',
            },
        });

        // 2. Clear existing item results for this assignment result if any
        await tx.assignmentItemResult.deleteMany({
            where: {
                assignmentResultId: result.id,
            },
        });

        // 3. Prepare all item results and calculate objective score
        const assignmentItems = await tx.assignmentItem.findMany({
            where: { assignmentId, deletedAt: null }
        });

        const items: Prisma.AssignmentItemResultCreateManyInput[] = [];
        let calculatedTotalScore = 0;

        // Create results for ALL assignment items
        for (const assignmentItem of assignmentItems) {
            const itemId = assignmentItem.id;
            const type = assignmentItem.type;
            
            let answer: string | null = null;
            let answerFiles: any = Prisma.DbNull;
            let itemScore: number | null = null;

            if (type === 'OBJECTIVE') {
                answer = data.objectiveAnswers[itemId] || "";
                
                // Calculate score for objective
                const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();
                const normalizedCorrect = stripHtml(assignmentItem.correctAnswer || "").toLowerCase();
                const normalizedAnswer = stripHtml(answer || "").toLowerCase();

                let isMatch = normalizedCorrect === normalizedAnswer;
                if (!isMatch && normalizedAnswer) {
                    const stripPrefix = (str: string) => str.replace(/^[a-z]\.\s*/i, "").trim();
                    const correctPrefix = normalizedCorrect.match(/^[a-z](?=\.)/i)?.[0]?.toLowerCase();
                    const answerPrefix = normalizedAnswer.match(/^[a-z](?=\.)/i)?.[0]?.toLowerCase();

                    const correctNoPrefix = stripPrefix(normalizedCorrect);
                    const answerNoPrefix = stripPrefix(normalizedAnswer);

                    if (normalizedAnswer.length === 1 && correctPrefix === normalizedAnswer) isMatch = true;
                    else if (normalizedCorrect.length === 1 && answerPrefix === normalizedCorrect) isMatch = true;
                    else if (correctPrefix && answerNoPrefix === correctNoPrefix && normalizedAnswer === correctNoPrefix) isMatch = true;
                }

                if (isMatch) itemScore = assignmentItem.maxScore || 10;
                else itemScore = 0;
                
                calculatedTotalScore += itemScore;
            } else if (type === 'ESSAY') {
                answer = data.essayAnswers[itemId] || null;
                answerFiles = data.essayFiles[itemId] ? [data.essayFiles[itemId]] : Prisma.DbNull;
            } else if (type === 'PROJECT') {
                answer = data.projectAnswers[itemId] || null;
                answerFiles = data.projectFiles[itemId] ? [data.projectFiles[itemId]] : Prisma.DbNull;
            }

            items.push({
                assignmentResultId: result.id,
                assignmentItemId: itemId,
                answer: answer,
                answerFiles: answerFiles,
                score: itemScore,
            });
        }


        // 4. Create all AssignmentItemResult records
        if (items.length > 0) {
            await tx.assignmentItemResult.createMany({
                data: items,
            });
        }

        // 5. Update the totalScore in AssignmentResult
        const updatedResult = await tx.assignmentResult.update({
            where: { id: result.id },
            data: { totalScore: calculatedTotalScore },
        });

        return updatedResult;
    });
}

export async function createAssignment(
    data: Prisma.AssignmentCreateInput,
    items: Prisma.AssignmentItemCreateWithoutAssignmentInput[],
    thresholds?: { courseId: number, threshold: number }[]
) {
    return await prisma.$transaction(async (tx) => {
        const assignment = await tx.assignment.create({
            data: {
                ...data,
                assignmentItems: {
                    create: items
                }
            }
        });

        if (thresholds && thresholds.length > 0) {
            for (const { courseId, threshold } of thresholds) {
                await tx.course.update({
                    where: { id: courseId },
                    data: { threshold }
                });
            }
        }

        return assignment;
    });
}

export async function updateAssignment(
    assignmentId: number,
    data: Prisma.AssignmentUpdateInput,
    items: Prisma.AssignmentItemCreateWithoutAssignmentInput[],
    thresholds?: { courseId: number, threshold: number }[]
) {
    return await prisma.$transaction(async (tx) => {
        // 1. Soft-delete existing assignment items
        await tx.assignmentItem.updateMany({
            where: { assignmentId, deletedAt: null },
            data: { deletedAt: new Date() }
        });

        // 2. Update the assignment and create new items
        const updated = await tx.assignment.update({
            where: { id: assignmentId },
            data: {
                ...data,
                assignmentItems: {
                    create: items
                }
            }
        });

        if (thresholds && thresholds.length > 0) {
            for (const { courseId, threshold } of thresholds) {
                await tx.course.update({
                    where: { id: courseId },
                    data: { threshold }
                });
            }
        }

        return updated;
    });
}

export async function deleteAssignment(assignmentId: number) {
    return await prisma.$transaction(async (tx) => {
        const now = new Date();
        // 1. Soft-delete the assignment items
        await tx.assignmentItem.updateMany({
            where: { assignmentId, deletedAt: null },
            data: { deletedAt: now }
        });

        // 2. Soft-delete the assignment
        return await tx.assignment.update({
            where: { id: assignmentId },
            data: { deletedAt: now }
        });
    });
}

/**
 * Get detailed grading data for a specific learner's assignment.
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
    // to avoid creating duplicates when an assignment is updated/re-saved.
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
        
        // Re-fetch with new items to get the IDs and updated relation
        const updatedResult = await prisma.assignmentResult.findUnique({
            where: { id: result.id },
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
        
        if (!updatedResult) return null;
        return processGradingData(updatedResult);
    }

    return processGradingData(result);
}

function processGradingData(result: any) {
    const objective: any[] = [];
    const essay: any[] = [];
    const project: any[] = [];

    // Use a Map to de-duplicate by Question Content (Type + Question Text)
    // This is the most reliable way to handle assignment updates where items are soft-deleted and replaced.
    const uniqueResults = new Map<string, any>();
    
    result.assignmentItemResults.forEach((ir: any) => {
        const item = ir.assignmentItem;
        if (!item) return;

        const contentKey = `${item.type}:${item.question}`;
        const existing = uniqueResults.get(contentKey);
        
        // Priority: 
        // 1. Record with an answer OR a manually given score
        // 2. Most recent record (higher ID) if both have or both lack the above
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

    // Sort by item ID to maintain a consistent order
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
                status: 'PASS',
            }
        });
    });
}

/**
 * Get results for all learners for a specific assignment.
 */
export async function getAssignmentResultsByAssignmentId(assignmentId: number) {
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId, deletedAt: null },
        include: {
            class: true,
            course: { include: { class: true } },
            session: { include: { course: { include: { class: true } } } },
            assignmentItems: { where: { deletedAt: null } }
        }
    });

    if (!assignment) return [];

    const maxScore = assignment.assignmentItems.reduce((acc, item) => acc + (item.maxScore || 0), 0);

    const classId = assignment.classId || assignment.course?.classId || assignment.session?.course?.classId;

    if (!classId) return [];

    const enrollments = await prisma.enrollment.findMany({
        where: {
            classId,
            deletedAt: null,
            user: { role: { name: 'Learner' } }
        },
        include: {
            user: { select: { id: true, name: true, username: true } },
            assignmentResults: {
                where: { assignmentId: assignment.id },
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

        const totalItems = items.length;
        const gradedItems = items.filter(i => i.score !== null).length;
        const isGraded = totalItems > 0 && gradedItems === totalItems;
        const hasSubmitted = !!result?.finishedAt;

        return {
            enrollmentId: e.id,
            name: e.user.name || e.user.username,
            status: hasSubmitted ? (isGraded ? "Graded" : "To Grade") : "Not Started",
            totalScore: result?.totalScore || 0,
            maxScore: maxScore,
            submittedAt: result?.finishedAt,
            assignmentId: assignment.id,
        };
    });
}
