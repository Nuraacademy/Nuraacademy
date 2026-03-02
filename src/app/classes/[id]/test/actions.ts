"use server"

import { getPlacementTest, submitPlacementTest } from "@/controllers/assessmentController"
import { revalidatePath } from "next/cache"

export async function fetchTestDataAction(classId: string) {
    try {
        const test = await getPlacementTest(classId);
        if (!test) return { success: false, error: "Test not found" };

        return {
            success: true,
            testId: test.id,
            courseName: (test as any).class?.title || "Placement Test",
            questions: {
                objective: test.objectiveQuestions || [],
                essay: test.essayQuestions || [],
                project: test.projectQuestions || []
            },
            testData: {
                courseName: (test as any).class?.title || "Class Test",
                durationMinutes: test.durationMinutes
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function submitTestAction(data: {
    userId: string,
    testId: string,
    objectiveAnswers: Record<string, string>,
    essayAnswers: Record<string, string>,
    projectAnswers: Record<string, string>
}) {
    try {
        const submission = await submitPlacementTest({
            userId: data.userId,
            placementTestId: data.testId,
            objectiveAnswers: Object.entries(data.objectiveAnswers).map(([id, opt]) => ({
                questionId: id,
                selectedOption: opt
            })),
            essayAnswers: Object.entries(data.essayAnswers).map(([id, text]) => ({
                questionId: id,
                answerText: text
            })),
            projectAnswers: Object.entries(data.projectAnswers).map(([id, text]) => ({
                questionId: id,
                answerText: text
            }))
        });

        revalidatePath(`/classes/${submission.placementTestId}/overview`); // Revalidate using the test's relation if possible
        return { success: true, submissionId: submission.id };
    } catch (error: any) {
        console.error("Submission error:", error);
        return { success: false, error: error.message };
    }
}
