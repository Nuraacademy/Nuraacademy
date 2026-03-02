"use client"

import Sidebar from "@/components/ui/sidebar/sidebar";
import { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";

export function SidebarWrapper({
    breadcrumbItems,
    exerciseTitle,
    exerciseDetail
}: {
    classId: string,
    courseId: string,
    breadcrumbItems: any[],
    exerciseTitle: string,
    exerciseDetail: string
}) {
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
                        <Breadcrumb items={breadcrumbItems} />
                        <h1 className="text-4xl font-bold mt-6 text-black">
                            Exercise
                        </h1>
                    </div>
                    {/* Main Content Card */}
                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                        {/* Dates */}
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold text-black">
                                    {exerciseTitle}
                                </h1>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-700">
                                    In this exercise, you will learn and practice concepts related to {exerciseTitle}.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100"></div>

                        {/* Detail Tugas */}
                        <div className="flex flex-col gap-2 text-sm">
                            <span className="font-bold text-gray-900">Detail Tugas</span>
                            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: exerciseDetail }} />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-center gap-6 pt-4">
                            <button
                                className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                                onClick={() => router.back()}
                            >
                                Back
                            </button>
                            <NuraButton
                                label="Open Exercise"
                                variant="primary"
                                onClick={() => window.open("#", "_blank")} // Should be a real link if available
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
