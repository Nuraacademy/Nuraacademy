import { prisma } from '@/lib/prisma';
import { AssignmentType, Prisma } from '@prisma/client';

function assignmentItemContentKey(type: string, question: string) {
    return `${type}:${question}`;
}

/** Same rules as submitAssignment for objective auto-grading. */
function computeObjectiveScoreFromAnswers(
    correctAnswer: string | null | undefined,
    learnerAnswer: string | null | undefined,
    maxScore: number | null | undefined,
): number {
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();
    const normalizedCorrect = stripHtml(correctAnswer || '').toLowerCase();
    const normalizedAnswer = stripHtml(learnerAnswer || '').toLowerCase();

    let isMatch = normalizedCorrect === normalizedAnswer;
    if (!isMatch && normalizedAnswer) {
        const stripPrefix = (str: string) => str.replace(/^[a-z]\.\s*/i, '').trim();
        const correctPrefix = normalizedCorrect.match(/^[a-z](?=\.)/i)?.[0]?.toLowerCase();
        const answerPrefix = normalizedAnswer.match(/^[a-z](?=\.)/i)?.[0]?.toLowerCase();

        const correctNoPrefix = stripPrefix(normalizedCorrect);
        const answerNoPrefix = stripPrefix(normalizedAnswer);

        if (normalizedAnswer.length === 1 && correctPrefix === normalizedAnswer) isMatch = true;
        else if (normalizedCorrect.length === 1 && answerPrefix === normalizedCorrect) isMatch = true;
        else if (correctPrefix && answerNoPrefix === correctNoPrefix && normalizedAnswer === correctNoPrefix) isMatch = true;
    }

    return isMatch ? (maxScore ?? 10) : 0;
}

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
    if (!userId) {
        // Fetch ALL if no user context (Admin/Global view)
        return await prisma.assignment.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                class: { select: { title: true } },
                course: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });

    const isLearner = user?.role?.name === 'Learner';
    const isStaff = ['Trainer', 'Instructor', 'Instructur'].includes(user?.role?.name || '');
    const isAdmin = user?.role?.name === 'Admin' || user?.role?.name === 'Learning Designer';

    if (isAdmin) {
        return await prisma.assignment.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                class: { select: { title: true } },
                course: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    if (isStaff) {
        return await prisma.assignment.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { createdBy: userId },
                    { class: {
                        OR: [
                            { trainers: { some: { id: userId } } },
                            { createdBy: userId },
                            { courses: { some: { createdBy: userId } } },
                            { courses: { some: { sessions: { some: { createdBy: userId } } } } }
                        ]
                    }},
                ],
            },
            include: {
                class: { select: { title: true } },
                course: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Default: Learner view - KEEP the startDate filter
    const enrollments = await prisma.enrollment.findMany({
        where: { userId, deletedAt: null, status: 'ACTIVE' },
        select: { classId: true }
    });
    const enrolledClassIds = enrollments.map(e => e.classId);

    return await prisma.assignment.findMany({
        where: {
            classId: { in: enrolledClassIds },
            deletedAt: null,
            OR: [
                { startDate: null },
                { startDate: { lte: new Date() } }
            ],
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


export async function getAssignmentById(id: number, includeItems: boolean = true) {
    return await prisma.assignment.findUnique({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            class: { select: { title: true } },
            course: { select: { title: true } },
            session: { select: { title: true } },
            ...(includeItems && {
                assignmentItems: {
                    where: { deletedAt: null },
                    include: { course: true }
                },
            }),
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
                include: { course: true }
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

export async function getAssignmentResult(assignmentId: number, enrollmentId: number, includeItems: boolean = true) {
    // 1. Check direct submission
    const directResult = await prisma.assignmentResult.findUnique({
        where: {
            assignmentId_enrollmentId: {
                assignmentId,
                enrollmentId,
            },
        },
        include: {
            ...(includeItems && {
                assignmentItemResults: {
                    include: {
                        assignmentItem: {
                            include: {
                                course: true
                            }
                        }
                    }
                }
            })
        }
    });

    if (directResult?.finishedAt) return directResult;

    // 2. If it's a group assignment, check if anyone in the group submitted
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: { submissionType: true, classId: true }
    });

    if (assignment?.submissionType === 'GROUP') {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: { groups: true }
        });

        if (enrollment && enrollment.groups.length > 0) {
            const groupName = enrollment.groups[0].name;
            const groupResult = await prisma.assignmentResult.findFirst({
                where: {
                    assignmentId,
                    enrollment: {
                        classId: assignment.classId,
                        groups: { some: { name: groupName } }
                    },
                    finishedAt: { not: null }
                },
                include: {
                    ...(includeItems && {
                        assignmentItemResults: {
                            include: {
                                assignmentItem: {
                                    include: {
                                        course: true
                                    }
                                }
                            }
                        }
                    })
                }
            });

            if (groupResult) return groupResult;
        }
    }

    return directResult;
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
                itemScore = computeObjectiveScoreFromAnswers(
                    assignmentItem.correctAnswer,
                    answer,
                    assignmentItem.maxScore,
                );
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

        // 5. Update the totalScore and status in AssignmentResult
        const assignment = await tx.assignment.findUnique({
            where: { id: assignmentId },
            select: { passingGrade: true }
        });

        const status = (assignment?.passingGrade !== null && calculatedTotalScore >= (assignment?.passingGrade || 0)) ? 'PASS' : 'NOT_PASS';

        const updatedResult = await tx.assignmentResult.update({
            where: { id: result.id },
            data: { 
                totalScore: calculatedTotalScore,
                status: status
            },
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
                    data: { threshold: parseFloat(threshold.toString()) }
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
                    data: { threshold: parseFloat(threshold.toString()) }
                });
            }
        }

        // Existing submissions still point at soft-deleted items; map by (type, question) to new rows
        // and re-score OBJECTIVE from updated keys / maxScore.
        const newItems = await tx.assignmentItem.findMany({
            where: { assignmentId, deletedAt: null },
            orderBy: { id: 'asc' },
        });
        const newItemByContentKey = new Map<string, (typeof newItems)[0]>();
        for (const item of newItems) {
            const k = assignmentItemContentKey(item.type, item.question);
            if (!newItemByContentKey.has(k)) newItemByContentKey.set(k, item);
        }

        const assignmentForPassing = await tx.assignment.findUnique({
            where: { id: assignmentId },
            select: { passingGrade: true },
        });

        const finishedResults = await tx.assignmentResult.findMany({
            where: {
                assignmentId,
                finishedAt: { not: null },
                deletedAt: null,
            },
            include: {
                assignmentItemResults: { include: { assignmentItem: true } },
            },
        });

        for (const res of finishedResults) {
            for (const ir of res.assignmentItemResults) {
                const oldItem = ir.assignmentItem;
                if (!oldItem) continue;

                const key = assignmentItemContentKey(oldItem.type, oldItem.question);
                const newItem = newItemByContentKey.get(key);
                if (!newItem) {
                    await tx.assignmentItemResult.delete({ where: { id: ir.id } });
                    continue;
                }

                if (oldItem.type === 'OBJECTIVE') {
                    const score = computeObjectiveScoreFromAnswers(
                        newItem.correctAnswer,
                        ir.answer,
                        newItem.maxScore,
                    );
                    await tx.assignmentItemResult.update({
                        where: { id: ir.id },
                        data: { assignmentItemId: newItem.id, score },
                    });
                } else {
                    await tx.assignmentItemResult.update({
                        where: { id: ir.id },
                        data: { assignmentItemId: newItem.id },
                    });
                }
            }

            const itemResults = await tx.assignmentItemResult.findMany({
                where: { assignmentResultId: res.id },
            });
            const newTotal = itemResults.reduce((acc, r) => acc + (r.score || 0), 0);
            const status =
                assignmentForPassing?.passingGrade !== null &&
                newTotal >= (assignmentForPassing?.passingGrade || 0)
                    ? 'PASS'
                    : 'NOT_PASS';

            await tx.assignmentResult.update({
                where: { id: res.id },
                data: { totalScore: newTotal, status },
            });
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
/**
 * Get detailed grading data for a specific learner's assignment.
 */
export async function getGradingData(assignmentId: number, targetId: number | string) {
    // targetId can be EnrollmentId (number), GroupId (number), or GroupName (string). 
    
    let result: any = null;

    // 1. If it's a number, try direct lookup by enrollmentId first
    if (typeof targetId === 'number') {
        result = await prisma.assignmentResult.findUnique({
            where: { assignmentId_enrollmentId: { assignmentId, enrollmentId: targetId } },
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
    }

    // If not found (or it was a string), resolve via group/context
    if (!result) {
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: { submissionType: true, classId: true }
        });

        if (assignment?.submissionType === 'GROUP') {
            let groupName: string | undefined;
            let groupContext: any = null;

            if (typeof targetId === 'string') {
                groupName = targetId;
            } else {
                // Find the specific group record and enrollment for the targetId
                groupContext = await prisma.group.findFirst({
                    where: { 
                        OR: [
                            { id: targetId },
                            { enrollmentId: targetId }
                        ]
                    },
                    include: { enrollment: true }
                });
                groupName = groupContext?.name;
            }

            const classId = assignment.classId || groupContext?.enrollment.classId;

            if (groupName && classId) {
                // Find ALL group members' enrollment IDs
                const groupMembers = await prisma.group.findMany({
                    where: { name: groupName, deletedAt: null, enrollment: { classId } },
                    select: { enrollmentId: true }
                });
                const memberEnrollmentIds = groupMembers.map(m => m.enrollmentId);

                if (memberEnrollmentIds.length > 0) {
                    // Fetch ALL AssignmentResults from ALL group members
                    const allMemberResults = await prisma.assignmentResult.findMany({
                        where: {
                            assignmentId,
                            enrollmentId: { in: memberEnrollmentIds }
                        },
                        orderBy: { id: 'asc' },
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

                    if (allMemberResults.length > 0) {
                        // Use the most recently finished result as the "primary" (for grading target)
                        const primary = allMemberResults
                            .filter(r => r.finishedAt !== null)
                            .sort((a, b) => (b.finishedAt?.getTime() ?? 0) - (a.finishedAt?.getTime() ?? 0))[0]
                            ?? allMemberResults[allMemberResults.length - 1];

                        // Merge ALL item results from all members into one flat list
                        const allItemResults = allMemberResults.flatMap(r => r.assignmentItemResults);

                        // Build merged result with primary's metadata but aggregated item results
                        result = {
                            ...primary,
                            assignmentItemResults: allItemResults
                        };
                    }
                }

                // If no submitted result exists, create a placeholder for a representative member
                if (!result && memberEnrollmentIds.length > 0) {
                    // Use first member's enrollment for the placeholder
                    const representativeId = memberEnrollmentIds[0];



                    result = await prisma.assignmentResult.create({
                        data: {
                            assignmentId,
                            enrollmentId: representativeId,
                            status: 'NOT_PASS'
                        },
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
                    }) as any;
                }
            }
        } else if (typeof targetId === 'number') {
            // Individual case: Check if targetId is a valid enrollment and create result if missing
            const checkEnrollment = await prisma.enrollment.findUnique({ where: { id: targetId } });
            if (checkEnrollment) {
                result = await prisma.assignmentResult.create({
                    data: {
                        assignmentId,
                        enrollmentId: targetId,
                        status: 'NOT_PASS'
                    },
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
                }) as any;
            }
        }
    }

    if (!result) return null;

    // Ensure all items have a result record (for legacy data or skipped answers)
    // We check for both ID match AND content match (question text + type)
    // to avoid creating duplicates when an assignment is updated/re-saved.
    const missingItems = (result as any).assignment.assignmentItems.filter((item: any) => {
        return !(result as any).assignmentItemResults.some((ir: any) => {
            const sameId = ir.assignmentItemId === item.id;
            const sameContent = ir.assignmentItem?.question === item.question && ir.assignmentItem?.type === item.type;
            return sameId || sameContent;
        });
    });

    if (missingItems.length > 0) {
        await prisma.assignmentItemResult.createMany({
            data: missingItems.map((item: any) => ({
                assignmentResultId: (result as any).id,
                assignmentItemId: item.id,
                answer: null,
                score: item.type === 'OBJECTIVE' ? 0 : null
            }))
        });
        
        // Re-fetch with new items to get the IDs and updated relation
        const updatedResult = await prisma.assignmentResult.findUnique({
            where: { id: (result as any).id },
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
        const hasFiles = Array.isArray(ir.answerFiles) ? ir.answerFiles.length > 0 : (ir.answerFiles !== null && ir.answerFiles !== undefined);
        const hasData = (ir.answer !== null && ir.answer !== undefined && ir.answer !== "") || (ir.score !== null && ir.score !== undefined) || hasFiles;
        const existingHasFiles = existing && (Array.isArray(existing.answerFiles) ? existing.answerFiles.length > 0 : (existing.answerFiles !== null && existing.answerFiles !== undefined));
        const existingHasData = existing && ((existing.answer !== null && existing.answer !== undefined && existing.answer !== "") || (existing.score !== null && existing.score !== undefined) || existingHasFiles);

        const shouldReplace = !existing || (hasData && !existingHasData) || (hasData === existingHasData && ir.id > existing.id);

        if (shouldReplace) {
            uniqueResults.set(contentKey, ir);
        }
    });

    uniqueResults.forEach((ir: any) => {
        const item = ir.assignmentItem;
        // Normalize answerFiles from Prisma JsonValue to a plain string[]
        const rawFiles = ir.answerFiles;
        let answerFiles: string[] = [];
        if (Array.isArray(rawFiles)) {
            answerFiles = rawFiles.filter((f: any) => typeof f === 'string') as string[];
        } else if (typeof rawFiles === 'string' && rawFiles.length > 0) {
            answerFiles = [rawFiles];
        }

        const data = {
            id: item.id,
            question: item.question,
            givenAnswer: ir.answer || "",
            correctAnswer: item.correctAnswer,
            score: ir.score,
            maxScore: item.maxScore || 10,
            answerFiles,
            referenceFiles: (item.options as any)?.attachments || ((item.options as any)?.attachmentUrl ? [(item.options as any).attachmentUrl] : []),
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

        // 3. Find assignment to get passingGrade
        const result = await tx.assignmentResult.findUnique({
            where: { id: resultId },
            select: { assignment: { select: { passingGrade: true } } }
        });
        
        const passingGrade = result?.assignment?.passingGrade || 0;
        const status = newTotal >= passingGrade ? 'PASS' : 'NOT_PASS';

        return await tx.assignmentResult.update({
            where: { id: resultId },
            data: {
                totalScore: newTotal,
                status: status,
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
            },
            groups: {
                where: { deletedAt: null }
            }
        },
    });

    // If it's a group assignment, we need to group results by group name
    if (assignment.submissionType === 'GROUP') {
        const groupResults: Record<string, any> = {};

        for (const e of enrollments) {
            const group = e.groups[0];
            const groupName = group?.name || "No Group";
            const result = e.assignmentResults[0];
            const hasSubmitted = !!result?.finishedAt;

            if (!groupResults[groupName]) {
                groupResults[groupName] = {
                    name: groupName,
                    isGroup: true,
                    // Use Group ID for navigation if available
                    id: group?.id || e.id,
                    status: "Not Started",
                    totalScore: 0,
                    maxScore: maxScore,
                    submittedAt: null,
                    members: [], // { id, name }
                    assignmentId: assignment.id,
                };
            }

            groupResults[groupName].members.push({
                id: e.id,
                name: e.user.name || e.user.username
            });
            
            // Representative submission
            if (hasSubmitted) {
                const items = result?.assignmentItemResults || [];
                const activeContentKeys = new Set(assignment.assignmentItems.map(i => `${i.type}:${i.question}`));
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
                const totalItems = assignment.assignmentItems.length;
                const gradedItems = validItems.filter((i: any) => i.score !== null).length;
                const isGraded = totalItems === 0 || gradedItems === totalItems;

                groupResults[groupName].status = isGraded ? "Graded" : "To Grade";
                groupResults[groupName].submittedAt = result.finishedAt;
                groupResults[groupName].totalScore = result.totalScore;
            }
        }

        return Object.values(groupResults);
    }

    return enrollments.map(e => {
        const result = e.assignmentResults[0];
        const items = result?.assignmentItemResults || [];

        const activeContentKeys = new Set(assignment.assignmentItems.map(i => `${i.type}:${i.question}`));
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
        const totalItems = assignment.assignmentItems.length;
        const gradedItems = validItems.filter(i => i.score !== null).length;
        const isGraded = totalItems === 0 || gradedItems === totalItems;
        const hasSubmitted = !!result?.finishedAt;

        return {
            enrollmentId: e.id,
            name: e.user.name || e.user.username,
            isGroup: false,
            status: hasSubmitted ? (isGraded ? "Graded" : "To Grade") : "Not Started",
            totalScore: result?.totalScore || 0,
            maxScore: maxScore,
            submittedAt: result?.finishedAt,
            assignmentId: assignment.id,
        };
    });
}
