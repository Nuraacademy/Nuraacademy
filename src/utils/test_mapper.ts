import { Assignment, AssignmentItem, AssignmentItemType } from "@prisma/client";
import {
    ObjectiveQuestion,
    EssayQuestion,
    ProjectQuestion
} from "@/app/classes/[id]/test/types";
import { PAGE_TEXT } from "@/app/classes/[id]/test/constants";

export function mapAssignmentToTestRunner(assignment: any) {
    const items = assignment.assignmentItems || [];

    const objectiveQuestions: ObjectiveQuestion[] = items
        .filter((item: AssignmentItem) => item.type === "OBJECTIVE")
        .map((item: AssignmentItem, index: number) => ({
            id: index + 1,
            question: item.question,
            options: Array.isArray(item.options) ? item.options : [],
            points: item.maxScore || 10,
        }));

    const essayQuestions: EssayQuestion[] = items
        .filter((item: AssignmentItem) => item.type === "ESSAY")
        .map((item: AssignmentItem, index: number) => ({
            id: index + 1,
            question: item.question,
            points: item.maxScore || 20,
        }));

    const projectQuestions: ProjectQuestion[] = items
        .filter((item: AssignmentItem) => item.type === "PROJECT")
        .map((item: AssignmentItem, index: number) => ({
            id: index + 1,
            question: item.question,
            requirements: Array.isArray(item.options) ? item.options : [], // requirements stored in options/json for now
            points: item.maxScore || 50,
        }));

    // Derive course name from the complex include structure
    let courseName = "Class Overview";
    if (assignment.class) {
        courseName = assignment.class.title;
    } else if (assignment.session?.course?.class) {
        courseName = assignment.session.course.class.title;
    }

    const testData = {
        courseName: courseName,
        introDescription: assignment.description || "Selamat datang di tahap awal perjalanan belajarmu. Hasil test ini membantu kami menentukan progress belajarmu.",
        durationMinutes: assignment.duration || 120,
        sectionsCount: (objectiveQuestions.length > 0 ? 1 : 0) + (essayQuestions.length > 0 ? 1 : 0) + (projectQuestions.length > 0 ? 1 : 0),
        deadlineValue: assignment.endDate ? new Date(assignment.endDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "TBA",
        testDescription: assignment.description || "",
        instructions: assignment.instruction ? assignment.instruction.split('\n') : [
            "Pastikan koneksi internet stabil selama pengerjaan.",
            "Tes hanya dapat dilakukan satu kali, pastikan kamu memiliki waktu luang yang cukup.",
            "Dilarang menggunakan alat bantu AI atau mencari jawaban di luar platform selama tes berlangsung."
        ],
    };

    // Update Banner Title based on type
    const pageText = { ...PAGE_TEXT };
    if (assignment.type === "PLACEMENT") {
        pageText.bannerTitle = "Placement Test";
        pageText.breadcrumbTest = "Placement Test";
    } else if (assignment.type === "PRETEST") {
        pageText.bannerTitle = "Pre-Test";
        pageText.breadcrumbTest = "Pre-Test";
    } else if (assignment.type === "POSTTEST") {
        pageText.bannerTitle = "Post-Test";
        pageText.breadcrumbTest = "Post-Test";
    }

    return {
        objectiveQuestions,
        essayQuestions,
        projectQuestions,
        testData,
        pageText,
    };
}
