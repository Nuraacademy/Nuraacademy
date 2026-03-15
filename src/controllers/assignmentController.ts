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

        // Objective Answers
        for (const [id, answer] of Object.entries(data.objectiveAnswers)) {
            const itemId = parseInt(id);
            const assignmentItem = assignmentItems.find(i => i.id === itemId);

            let itemScore = 0;
            if (assignmentItem && assignmentItem.type === 'OBJECTIVE') {
                const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();
                const normalizedCorrect = stripHtml(assignmentItem.correctAnswer || "").toLowerCase();
                const normalizedAnswer = stripHtml(answer || "").toLowerCase();

                // 1. Literal match (after normalization)
                let isMatch = normalizedCorrect === normalizedAnswer;

                if (!isMatch) {
                    const stripPrefix = (str: string) => str.replace(/^[a-z]\.\s*/i, "").trim();
                    const correctPrefix = normalizedCorrect.match(/^[a-z](?=\.)/i)?.[0]?.toLowerCase();
                    const answerPrefix = normalizedAnswer.match(/^[a-z](?=\.)/i)?.[0]?.toLowerCase();

                    const correctNoPrefix = stripPrefix(normalizedCorrect);
                    const answerNoPrefix = stripPrefix(normalizedAnswer);

                    // If student provides just the letter (e.g., "a"), and the correct answer starts with "a."
                    if (normalizedAnswer.length === 1 && correctPrefix === normalizedAnswer) {
                        isMatch = true;
                    }
                    // If student provides the "a. Python" and correct is just "a"
                    else if (normalizedCorrect.length === 1 && answerPrefix === normalizedCorrect) {
                        isMatch = true;
                    }
                    // If student provides the full text "Python" and correct is "a. Python" (ignoring prefix)
                    else if (correctPrefix && answerNoPrefix === correctNoPrefix && normalizedAnswer === correctNoPrefix) {
                        isMatch = true;
                    }
                }

                if (isMatch) {
                    itemScore = assignmentItem.maxScore || 10;
                }

                console.log(`Scoring Item ${itemId}: Correct="${normalizedCorrect}", Answer="${normalizedAnswer}", Match=${isMatch}, Score=${itemScore}`);
            }

            calculatedTotalScore += itemScore;

            items.push({
                assignmentResultId: result.id,
                assignmentItemId: itemId,
                answer: answer,
                score: itemScore,
            });
        }

        // Essay Answers & Files
        const essayItemIds = new Set([
            ...Object.keys(data.essayAnswers).map(Number),
            ...Object.keys(data.essayFiles).map(Number)
        ]);
        for (const id of essayItemIds) {
            items.push({
                assignmentResultId: result.id,
                assignmentItemId: id,
                answer: data.essayAnswers[id] || null,
                answerFiles: data.essayFiles[id] ? [data.essayFiles[id]] : Prisma.DbNull,
            });
        }

        // Project Answers & Files
        const projectItemIds = new Set([
            ...Object.keys(data.projectAnswers).map(Number),
            ...Object.keys(data.projectFiles).map(Number)
        ]);
        for (const id of projectItemIds) {
            items.push({
                assignmentResultId: result.id,
                assignmentItemId: id,
                answer: data.projectAnswers[id] || null,
                answerFiles: data.projectFiles[id] ? [data.projectFiles[id]] : Prisma.DbNull,
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
