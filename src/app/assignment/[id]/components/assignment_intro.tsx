"use client"

import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";

interface AssignmentIntroProps {
    assignmentId: number;
    title: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    isSubmitted: boolean;
    classTitle: string;
    courseTitle: string;
    type: string;
    isGroup?: boolean;
}

export function AssignmentIntroCard({
    assignmentId,
    title,
    description,
    startDate,
    endDate,
    isSubmitted,
    classTitle,
    courseTitle,
    type,
    isGroup = false,
}: AssignmentIntroProps) {
    const router = useRouter();

    const formatDate = (date: Date | null) => {
        if (!date) return "-";
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date)).replace('pukul', '').trim();
    };

    return (
        <section className="mt-6 flex flex-col gap-6 px-4 pb-12 items-center">
            {/* Banner */}
            <div className="w-full max-w-5xl bg-[#075546] text-white py-6 px-8 rounded-[1rem] shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <span className="border border-white/50 rounded-full px-3 py-0.5 text-xs text-white/90">
                        {type === "PROJECT" ? "Project" : "Assignment"}
                    </span>
                    {isGroup && (
                        <span className="border border-white/50 rounded-full px-3 py-0.5 text-xs text-white/90">
                            Group
                        </span>
                    )}
                </div>
                <p className="text-sm text-white/80">
                    {courseTitle} {courseTitle && classTitle ? " | " : ""} {classTitle}
                </p>
            </div>

            {/* Content Card */}
            <div className="w-full max-w-5xl bg-white rounded-[1.5rem] shadow-sm border border-gray-100 px-8 py-8">
                <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm text-gray-800 mb-6">
                    <div className="font-semibold">Start Date:</div>
                    <div>{formatDate(startDate)}</div>

                    <div className="font-semibold">End Date:</div>
                    <div>{formatDate(endDate)}</div>
                </div>

                <hr className="border-gray-100 my-6" />

                <div className="mb-6">
                    <h3 className="text-base font-semibold mb-3 text-gray-900">Detail Tugas</h3>
                    <div
                        className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: description || "Tidak ada deskripsi." }}
                    />
                </div>

                <div className="flex items-center gap-4 mb-8 text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isSubmitted
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-[#a5b4fc] text-indigo-900"
                        }`}
                    >
                        {isSubmitted ? "Submitted" : "Assignment has not been submitted"}
                    </span>
                </div>

                <div className="flex justify-center gap-4">
                    <NuraButton
                        label="Back"
                        variant="secondary"
                        type="button"
                        className="w-[180px] border-transparent"
                        onClick={() => router.back()}
                    />
                    <NuraButton
                        label={isSubmitted ? "View Result" : "Work on Assignment"}
                        variant="primary"
                        type="button"
                        onClick={() => router.push(`?skipIntro=1`)}
                    />
                </div>
            </div>
        </section>
    );
}
