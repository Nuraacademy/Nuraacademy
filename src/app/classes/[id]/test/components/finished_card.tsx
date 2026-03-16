import { TestData, PageText } from "../types"
import { NuraButton } from "@/components/ui/button/button";

interface FinishedCardProps {
    classId: string;
    testData: TestData;
    pageText: PageText;
    userName?: string;
    totalScore?: number;
    feedback?: string;
}

export function FinishedCard({ classId, testData, pageText, userName, totalScore, feedback }: FinishedCardProps) {
    return (
        <section className="mt-6 flex flex-col items-center px-4 pb-20">
            <div className="w-full max-w-5xl bg-white rounded-[1.5rem] shadow-sm border border-gray-200 px-8 py-10 md:px-12 md:py-12 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{userName || "Learner"}</h2>
                <p className="text-sm md:text-base text-gray-700 mt-2 mb-8">{testData.courseName}</p>

                <hr className="border-gray-200 mb-8" />

                {feedback && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h3 className="text-sm md:text-base font-bold text-[#005954] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#DAEE49]"></span>
                            Trainer Feedback
                        </h3>
                        <div className="bg-[#FDFDF7] border border-[#005954]/10 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div 
                                className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-medium"
                                dangerouslySetInnerHTML={{ __html: feedback }}
                            />
                        </div>
                    </div>
                )}

                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-6">Detail Hasil Tes</h3>

                <div className="w-full border border-gray-200 rounded-2xl md:rounded-[1.5rem] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Course Title</span>
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Status</span>
                    </div>

                    {/* Course results */}
                    {(testData.courseResults || []).map((course, idx) => (
                        <div key={idx} className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white last:border-b-0">
                            <span className="text-xs md:text-sm text-gray-800">{course.courseTitle}</span>
                            <span className={`px-5 py-1.5 text-gray-900 text-xs font-semibold rounded-full min-w-[80px] text-center ${course.status === "Pass" ? "bg-[#b0ff8a]" : "bg-[#ff7066]"
                                }`}>
                                {course.status}
                            </span>
                        </div>
                    ))}

                    {/* If no results, show the total score as fallback */}
                    {(!testData.courseResults || testData.courseResults.length === 0) && (
                        <div className="flex justify-between items-center px-6 py-5 bg-white">
                            <span className="text-xs md:text-sm text-gray-800 italic">{testData.courseName}</span>
                            <span className="text-xs md:text-sm font-bold text-[#075546]">
                                {totalScore ?? 0} points
                            </span>
                        </div>
                    )}
                </div>

                <p className="mt-10 text-xs text-gray-600 italic leading-relaxed">
                    Note: This placement test determines your initial skill level for each course.
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
