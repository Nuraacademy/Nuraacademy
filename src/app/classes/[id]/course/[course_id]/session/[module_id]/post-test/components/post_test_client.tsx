"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";
import { TestRunner } from "@/components/test/test_runner";

export function PostTestClient({ classId, testId, questions, testData }: { classId: string, testId: string, questions: any[], testData: any }) {
    const [hasStarted, setHasStarted] = useState(false);
    const router = useRouter();

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date).replace(' at ', ', ');
    };

    // Placeholder dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (hasStarted) {
        return (
            <div className="mt-4">
                <TestRunner
                    classId={classId}
                    testId={testId}
                    objectiveQuestions={questions}
                    essayQuestions={[]}
                    projectQuestions={[]}
                    testData={testData}
                    pageText={{
                        bannerTitle: "Post-Test",
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
                        finishedDescription: "Thank you for completing the post-test.",
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
                        breadcrumbTest: "Post-Test",
                    }}
                    autoStart
                    showBanner={false}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="space-y-4 mb-8">
                <div className="flex gap-4 text-sm">
                    <span className="font-bold min-w-[80px]">Start Date:</span>
                    <span className="text-gray-700">{formatDate(startDate)}</span>
                </div>
                <div className="flex gap-4 text-sm">
                    <span className="font-bold min-w-[80px]">End Date:</span>
                    <span className="text-gray-700">{formatDate(endDate)}</span>
                </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            <div className="mb-12">
                <h3 className="font-bold text-sm mb-4">Detail Tugas</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    This post-test evaluates your understanding of the concepts covered in this module.
                </p>
            </div>

            <div className="flex justify-center items-center gap-8">
                <button
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => router.back()}
                >
                    Back
                </button>
                <NuraButton
                    label="Take Test"
                    variant="primary"
                    className="w-full max-w-[140px] !rounded-full py-2 text-sm font-bold"
                    onClick={() => setHasStarted(true)}
                />
            </div>
        </div>
    );
}
