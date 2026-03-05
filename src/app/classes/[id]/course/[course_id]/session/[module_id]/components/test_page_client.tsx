"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { TestRunner } from "@/components/test/test_runner";

interface TestPageClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
    assignmentId: number;
    enrollmentId: number;
    sessionTitle: string;
    classTitle: string;
    courseTitle: string;
    testTitle: string;
    assignmentData: any; // Mapped data from test_mapper
}

export default function TestPageClient({
    classId,
    courseId,
    moduleId,
    assignmentId,
    enrollmentId,
    sessionTitle,
    classTitle,
    courseTitle,
    testTitle,
    assignmentData
}: TestPageClientProps) {
    const router = useRouter();
    const [hasStarted, setHasStarted] = useState(false);

    const {
        objectiveQuestions,
        essayQuestions,
        projectQuestions,
        testData,
        pageText
    } = assignmentData;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: sessionTitle, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: testTitle, href: "#" },
    ];

    const formatDate = (dateStr: string) => {
        if (dateStr === "TBA") return "TBA";
        return dateStr;
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold text-white">{testTitle}</h1>
                        <p className="text-xs text-white/80">
                            {classTitle} | {courseTitle} | {sessionTitle}
                        </p>
                    </div>
                </section>

                {!hasStarted ? (
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                        <div className="space-y-4 mb-8">
                            <div className="flex gap-4 text-sm">
                                <span className="font-bold min-w-[80px]">Deadline:</span>
                                <span className="text-gray-700">{testData.deadlineValue}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="font-bold min-w-[80px]">Duration:</span>
                                <span className="text-gray-700">{testData.durationMinutes} minutes</span>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        <div className="mb-12">
                            <h3 className="font-bold text-sm mb-4">Detail Tugas</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {testData.testDescription}
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
                ) : (
                    <div className="mt-4">
                        <TestRunner
                            classId={classId}
                            assignmentId={assignmentId}
                            enrollmentId={enrollmentId}
                            objectiveQuestions={objectiveQuestions}
                            essayQuestions={essayQuestions}
                            projectQuestions={projectQuestions}
                            testData={testData}
                            pageText={pageText}
                            autoStart
                            showBanner={false}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
