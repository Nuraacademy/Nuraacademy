import { Assignment, AssignmentItem, AssignmentItemType } from "@prisma/client";
import {
    ObjectiveQuestion,
    EssayQuestion,
    ProjectQuestion,
    PageText,
    TestData
} from "@/app/classes/[id]/test/types";

export function mapAssignmentToTestRunner(assignment: any) {
    const items = assignment.assignmentItems || [];

    const objectiveQuestions: ObjectiveQuestion[] = items
        .filter((item: AssignmentItem) => item.type === "OBJECTIVE")
        .map((item: AssignmentItem) => ({
            id: item.id,
            question: item.question,
            options: Array.isArray(item.options) ? item.options : [],
            points: item.maxScore || 10,
        }));

    const essayQuestions: EssayQuestion[] = items
        .filter((item: AssignmentItem) => item.type === "ESSAY")
        .map((item: AssignmentItem) => ({
            id: item.id,
            question: item.question,
            points: item.maxScore || 20,
        }));

    const projectQuestions: ProjectQuestion[] = items
        .filter((item: AssignmentItem) => item.type === "PROJECT")
        .map((item: AssignmentItem) => ({
            id: item.id,
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

    const defaultIntro: Record<string, string> = {
        PLACEMENT:  "Selamat datang di tahap awal perjalanan belajarmu. Hasil test ini membantu kami menentukan progress belajarmu.",
        PRETEST:    "Sebelum memulai sesi ini, jawab beberapa pertanyaan singkat untuk mengukur pemahamanmu saat ini. Hasil pre-test membantu kami menyesuaikan materi belajar untukmu.",
        POSTTEST:   "Kamu hampir selesai! Ikuti post-test ini untuk menunjukkan seberapa jauh perkembanganmu setelah mempelajari materi sesi ini.",
        ASSIGNMENT: "Kerjakan tugas berikut sesuai instruksi yang diberikan. Pastikan jawabanmu lengkap dan dikumpulkan sebelum batas waktu.",
        EXERCISE:   "Latihan ini dirancang untuk memperkuat pemahamanmu terhadap materi yang telah dipelajari. Kerjakan dengan sungguh-sungguh!",
        PROJECT:    "Ini adalah proyek akhir yang mencerminkan seluruh perjalanan belajarmu. Tunjukkan kemampuan terbaikmu dan selesaikan sebelum deadline.",
    };

    const testData = {
        courseName: courseName,
        introDescription: assignment.description || defaultIntro[assignment.type] || "Selesaikan assignment ini sesuai instruksi yang diberikan.",
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


    // Base UI labels
    const pageText: PageText = {
        bannerTitle: "Test",
        introTitle: "Hello, Learner!",
        infoTitle: "Detail Informasi Tes",
        durationLabel: "Duration:",
        durationValue: "minutes",
        sectionLabel: "Section:",
        sectionValue: "sections",
        deadlineLabel: "Deadline:",
        instructionTitle: "Instruksi",
        buttonCancel: "Cancel",
        buttonStart: "Start",
        sidebarTimeLeft: "Time Left",
        sidebarObjective: "Objective Answer",
        buttonSubmit: "Submit Test",
        finishedTitle: "Test Submitted!",
        finishedDescription: "Thank you for completing the test. Your answers have been recorded. We will review your results.",
        buttonBackToCourse: "Back to Course Overview",
        sidebarEssay: "Essay Answer",
        sidebarProject: "Project Answer",
        contentObjective: "Objective",
        contentEssay: "Essay",
        contentProject: "Project",
        contentQuestions: "Questions",
        contentOf: "of",
        contentPoints: "points",
        contentAnswer: "Answer",
        testPrevButton: "Previous questions",
        testNextButton: "Next questions",
        breadcrumbHome: "Home",
        breadcrumbTest: "Test",
    };

    if (assignment.type === "PLACEMENT") {
        pageText.bannerTitle = "Placement Test";
        pageText.breadcrumbTest = "Placement Test";
        pageText.finishedDescription = "Thank you for completing the placement test. Your answers have been recorded. We will review your results and assign you to the appropriate group.";
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
