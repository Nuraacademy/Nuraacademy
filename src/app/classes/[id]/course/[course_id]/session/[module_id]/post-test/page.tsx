"use client"

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { PAGE_DATA } from "../../../overview/constants";
import { SESSION_DATA } from "../constants";
import { TEST_COMMON_DATA } from "../test_constants";
import { TestRunner } from "@/components/test/test_runner";
import { OBJECTIVE_QUESTIONS, ESSAY_QUESTIONS, PROJECT_QUESTIONS, TEST_DATA, PAGE_TEXT } from "@/app/classes/[id]/test/constants";

export default function PostTestPage() {
    const params = useParams();
    const router = useRouter();
    const [hasStarted, setHasStarted] = useState(false);

    const classId = params.id as string;
    const courseId = params.course_id as string;
    const moduleId = params.module_id as string;

    const session = SESSION_DATA.sessions[moduleId];

    if (!session) {
        return <div className="p-10 text-center">Session not found</div>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: PAGE_DATA.classTitle, href: `/classes/${classId}/overview` },
        { label: PAGE_DATA.courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: "Python Post-Test", href: "#" },
    ];

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

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold text-white">Python Post-Test</h1>
                        <p className="text-xs text-white/80">
                            {PAGE_DATA.classTitle} | {PAGE_DATA.courseTitle} | {session.title}
                        </p>
                    </div>
                    <span className="px-4 py-1 border border-white/40 rounded-full text-[10px] text-white font-medium">
                        {TEST_COMMON_DATA.badgeLabel}
                    </span>
                </section>

                {/* Main Content */}
                {!hasStarted ? (
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                        <div className="space-y-4 mb-8">
                            <div className="flex gap-4 text-sm">
                                <span className="font-bold min-w-[80px]">Start Date:</span>
                                <span className="text-gray-700">{formatDate(TEST_COMMON_DATA.startDate)}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="font-bold min-w-[80px]">End Date:</span>
                                <span className="text-gray-700">{formatDate(TEST_COMMON_DATA.endDate)}</span>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        <div className="mb-12">
                            <h3 className="font-bold text-sm mb-4">Detail Tugas</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {TEST_COMMON_DATA.detail}
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
                            objectiveQuestions={OBJECTIVE_QUESTIONS}
                            essayQuestions={ESSAY_QUESTIONS}
                            projectQuestions={PROJECT_QUESTIONS}
                            testData={TEST_DATA}
                            pageText={PAGE_TEXT}
                            autoStart
                            showBanner={false}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}

