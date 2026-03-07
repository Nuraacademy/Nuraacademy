import { TestData, PageText } from "../types"
import { NuraButton } from "@/components/ui/button/button";

interface FinishedCardProps {
    classId: string;
    testData: TestData;
    pageText: PageText;
    userName?: string;
    totalScore?: number;
}

export function FinishedCard({ classId, testData, pageText, userName, totalScore }: FinishedCardProps) {
    return (
        <section className="mt-6 flex flex-col items-center px-4 pb-20">
            <div className="w-full max-w-5xl bg-white rounded-[1.5rem] shadow-sm border border-gray-200 px-8 py-10 md:px-12 md:py-12 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{userName || "Learner"}</h2>
                <p className="text-sm md:text-base text-gray-700 mt-2 mb-8">{testData.courseName}</p>

                <hr className="border-gray-200 mb-8" />

                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-6">Detail Hasil Tes</h3>

                <div className="w-full border border-gray-700 rounded-2xl md:rounded-[1.5rem] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-300 bg-white">
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Description</span>
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Result</span>
                    </div>

                    {/* Objective Score Row */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
                        <span className="text-xs md:text-sm text-gray-800">Objective Section Score</span>
                        <span className="text-xs md:text-sm font-bold text-[#075546]">
                            {totalScore ?? 0} points
                        </span>
                    </div>

                    {/* Status Row */}
                    <div className="flex justify-between items-center px-6 py-5 bg-white">
                        <span className="text-xs md:text-sm text-gray-800">Submission Status</span>
                        <span className="px-5 py-1.5 bg-[#a3fa76] text-gray-900 text-xs font-medium rounded-full min-w-[80px] text-center">
                            Submitted
                        </span>
                    </div>
                </div>

                <p className="mt-6 text-xs text-gray-600 italic leading-relaxed">
                    Note: This score only includes automatically graded objective questions. Essay and Project sections will be reviewed manually.
                </p>
            </div>

            <div className="flex justify-center gap-4">
                <NuraButton
                    label="Back"
                    variant="secondary"
                    className="border-transparent"
                    onClick={() => {
                        window.location.href = `/classes/${classId}/overview`
                    }}
                />
                <NuraButton
                    label="See Groups"
                    variant="primary"
                    className="min-w-[160px]"
                    onClick={() => {
                        window.location.href = `/classes/${classId}/groups`
                    }}
                />
            </div>
        </section>
    )
}
