"use client"

import Sidebar from "@/components/ui/sidebar/sidebar";
import { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";

interface ExercisePageClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
    classTitle: string;
    courseTitle: string;
    sessionTitle: string;
    exerciseTitle: string;
    description: string;
    instruction: string;
    colabUrl?: string;
}

export default function ExercisePageClient({
    classId,
    courseId,
    moduleId,
    classTitle,
    courseTitle,
    sessionTitle,
    exerciseTitle,
    description,
    instruction,
    colabUrl
}: ExercisePageClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    return (
        <main className={`relative bg-[#FDFDF7] min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 ${isSidebarOpen ? "md:pl-80" : "md:pl-8"}`}>
            {/* Sidebar */}
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Content */}
            <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] md:px-12 w-full max-w-screen-2xl mx-auto gap-4 z-10 relative">
                <div className="flex-none flex-col items-end justify-between space-y-4">
                    <div>
                        <Breadcrumb
                            items={[
                                { label: "Home", href: "/" },
                                { label: classTitle, href: `/classes/${classId}/overview` },
                                { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
                                { label: sessionTitle, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
                                { label: "Exercise", href: "#" },
                            ]}
                        />
                        <h1 className="text-4xl font-bold mt-6 text-black">
                            Exercise: {exerciseTitle}
                        </h1>
                    </div>
                    {/* Main Content Card */}
                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                        {/* Title & Description */}
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-bold text-black">
                                    {exerciseTitle}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-700">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100"></div>

                        {/* Detail Tugas */}
                        <div className="flex flex-col gap-2 text-sm">
                            <span className="font-bold text-gray-900">Task Detail</span>
                            <div
                                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: instruction || "No instruction provided." }}
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-center gap-6 pt-4">
                            <button
                                className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                                onClick={() => router.back()}
                            >
                                Back
                            </button>
                            {colabUrl && (
                                <NuraButton
                                    label="Open in Colab"
                                    variant="primary"
                                    onClick={() => window.open(colabUrl, "_blank")}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
