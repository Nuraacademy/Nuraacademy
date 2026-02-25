"use client"

import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { PAGE_DATA } from "../overview/constants";
import { ASSIGNMENT_DATA } from "./constants";

export default function CourseAssignmentPage() {
    const params = useParams();
    const router = useRouter();

    const classId = params.id as string;
    const courseId = params.course_id as string;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: PAGE_DATA.classTitle, href: `/classes/${classId}/overview` },
        { label: PAGE_DATA.courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: ASSIGNMENT_DATA.title, href: "#" },
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
                        <h1 className="text-xl font-bold text-white">{ASSIGNMENT_DATA.title}</h1>
                        <p className="text-xs text-white/80">
                            {PAGE_DATA.classTitle} | {PAGE_DATA.courseTitle} | {ASSIGNMENT_DATA.context}
                        </p>
                    </div>
                    <span className="px-3 py-1 bg-[#1C3A37] border border-white/20 rounded-full text-[10px] text-white/80 font-medium">
                        {ASSIGNMENT_DATA.groupLabel}
                    </span>
                </section>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900">Start Date:</span>
                            <span className="text-gray-700">{ASSIGNMENT_DATA.startDate.toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900">End Date:</span>
                            <span className="text-gray-700">{ASSIGNMENT_DATA.endDate.toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Detail Tugas */}
                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-bold text-gray-900">Detail Tugas</span>
                        <p className="text-gray-700 leading-relaxed">{ASSIGNMENT_DATA.detail}</p>
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
                            label="Work on Assignment"
                            variant="primary"
                            className="h-10 text-sm font-bold"
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

