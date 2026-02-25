"use client"

import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { PAGE_DATA } from "../../../overview/constants";
import { SESSION_DATA } from "../constants";
import { TEST_COMMON_DATA } from "../test_constants";
import { TestRunner } from "@/components/test/test_runner";
import { OBJECTIVE_QUESTIONS, ESSAY_QUESTIONS, PROJECT_QUESTIONS, TEST_DATA, PAGE_TEXT } from "@/app/classes/[id]/test/constants";

export default function PostTestPage() {
    const params = useParams();
    const router = useRouter();

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
                        <h1 className="text-xl font-bold text-white">Post-Test</h1>
                        <p className="text-xs text-white/80">
                            {PAGE_DATA.classTitle} | {PAGE_DATA.courseTitle} | {session.title}
                        </p>
                    </div>
                    <span className="px-3 py-1 bg-[#1C3A37] border border-white/20 rounded-full text-[10px] text-white/80 font-medium">
                        {TEST_COMMON_DATA.badgeLabel}
                    </span>
                </section>

                {/* Main Content: Test Runner */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 mt-4">
                    <TestRunner
                        classId={classId}
                        objectiveQuestions={OBJECTIVE_QUESTIONS}
                        essayQuestions={ESSAY_QUESTIONS}
                        projectQuestions={PROJECT_QUESTIONS}
                        testData={TEST_DATA}
                        pageText={PAGE_TEXT}
                        autoStart
                    />
                    <div className="flex justify-center mt-6">
                        <button
                            className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                            onClick={() => router.back()}
                        >
                            Back to Session
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

