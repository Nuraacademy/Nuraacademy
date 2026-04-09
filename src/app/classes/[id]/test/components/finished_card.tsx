"use client"

import { TestData, PageText } from "../types"
import { NuraButton } from "@/components/ui/button/button";
import Link from "next/link";

interface FinishedCardProps {
    classId: string;
    assignmentId?: number;
    enrollmentId?: number;
    testData: TestData;
    pageText: PageText;
    userName?: string;
    totalScore?: number;
    feedback?: string;
    isPlacement?: boolean;
    problemUnderstanding?: number;
    technicalAbility?: number;
    solutionQuality?: number;
    problemUnderstandingFeedback?: string;
    technicalAbilityFeedback?: string;
    solutionQualityFeedback?: string;
    objectiveScore?: number;
    maxObjectiveScore?: number;
    essayScore?: number;
    maxEssayScore?: number;
    projectScore?: number;
    maxProjectScore?: number;
}

export function FinishedCard({ 
    classId, 
    assignmentId,
    enrollmentId,
    testData, 
    pageText, 
    userName, 
    totalScore, 
    feedback,
    isPlacement = false,
    problemUnderstanding = 0,
    technicalAbility = 0,
    solutionQuality = 0,
    problemUnderstandingFeedback = '',
    technicalAbilityFeedback = '',
    solutionQualityFeedback = '',
    objectiveScore = 0,
    maxObjectiveScore = 0,
    essayScore = 0,
    maxEssayScore = 0,
    projectScore = 0,
    maxProjectScore = 0,
}: FinishedCardProps) {
    
    // Original layout for Placement Tests
    if (isPlacement) {
        return (
            <section className="mt-6 flex flex-col items-center pb-20 w-full max-w-7xl mx-auto">
                <div className="w-full bg-white rounded-[1.5rem] shadow-sm border border-gray-200 px-8 py-10 md:px-12 md:py-12 mb-8">
                    <h2 className="text-lg md:text-lg font-medium text-gray-900">{userName || "Learner"}</h2>
                    <p className="text-sm md:text-sm text-gray-700 mt-2 mb-8">{testData.courseName}</p>

                    <hr className="border-gray-200 mb-8" />

                    <h3 className="text-sm md:text-base font-medium text-gray-900 mb-6">Detail Hasil Tes</h3>

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
                                <div className="flex items-center gap-4">
                                    <span className={`px-5 py-1.5 text-gray-900 text-xs font-semibold rounded-full min-w-[80px] text-center ${
                                        course.status === "Pass" ? "bg-[#b0ff8a]" : course.status === "Grading" ? "bg-[#fae8b4]" : "bg-[#ff7066]"
                                        }`}>
                                        {course.status}
                                    </span>
                                    <a href={`/classes/${classId}/feedback`} className="text-xs text-[#075546] underline hover:text-[#005954] transition-colors">
                                        Feedback
                                    </a>
                                </div>
                            </div>
                        ))}

                        {/* If no results, show the total score as fallback */}
                        {(!testData.courseResults || testData.courseResults.length === 0) && (
                            <div className="flex justify-between items-center px-6 py-5 bg-white">
                                <span className="text-xs md:text-sm text-gray-800 italic">{testData.courseName}</span>
                                <span className="text-xs md:text-sm font-medium text-[#075546]">
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
                        onClick={() => {
                            window.location.href = `/classes/${classId}/overview`
                        }}
                    />
                    <NuraButton
                        label="See Groups"
                        variant="primary"
                        onClick={() => {
                            window.location.href = `/classes/${classId}/groups`
                        }}
                    />
                </div>
            </section>
        );
    }

    // New layout for Assignments
    return (
        <section className="mt-6 flex flex-col items-center pb-20">
            <div className="w-full bg-white rounded-[1.5rem] shadow-sm border border-gray-200 px-8 py-10 md:px-12 md:py-12 mb-8">
                <h2 className="text-lg md:text-lg font-medium text-gray-900">{userName || "Learner"}</h2>
                <p className="text-sm md:text-sm text-gray-700 mt-2 mb-8">{testData.courseName}</p>

                <hr className="border-gray-200 mb-8" />

                {feedback && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h3 className="text-sm md:text-sm font-medium text-[#005954] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#DAEE49]"></span>
                            Trainer Feedback
                        </h3>
                        <div className="bg-[#FDFDF7] border border-[#005954]/10 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                            {/* Scoring Metrics */}
                            {(problemUnderstanding > 0 || technicalAbility > 0 || solutionQuality > 0) && (
                                <div className="space-y-8 pt-4">
                                    {[
                                        { label: 'Problem Understanding', value: problemUnderstanding, feedback: problemUnderstandingFeedback, color: "#1C3A37" },
                                        { label: 'Technical Ability', value: technicalAbility, feedback: technicalAbilityFeedback, color: "#8BB730" },
                                        { label: 'Solution Quality', value: solutionQuality, feedback: solutionQualityFeedback, color: "#DAEE49" },
                                    ].map((item) => (
                                        <div key={item.label} className="space-y-4">
                                            <div className="grid grid-cols-[160px_1fr_40px] items-center gap-6">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{item.label}</span>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000"
                                                        style={{ width: `${item.value * 10}%`, backgroundColor: item.color }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-[#1C3A37] text-right">{item.value}/10</span>
                                            </div>
                                            {item.feedback && (
                                                <p className="text-xs text-gray-600 pl-4" dangerouslySetInnerHTML={{ __html: item.feedback }}> 
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <h3 className="text-sm md:text-base font-medium text-gray-900 mb-6">Detail Hasil Tes</h3>

                <div className="w-full border border-gray-200 rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_100px_80px_80px] md:grid-cols-[1fr_120px_100px_100px] items-center px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                        <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-500">Course Title</span>
                        <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Status</span>
                        <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Details</span>
                        <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Feedback</span>
                    </div>

                    {/* Course results */}
                    {(testData.courseResults || []).map((course, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_100px_80px_80px] md:grid-cols-[1fr_120px_100px_100px] items-center px-6 py-5 border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50/30 transition-colors">
                            <span className="text-xs md:text-sm text-gray-800 font-medium">{course.courseTitle}</span>
                            
                            <div className="flex justify-center">
                                <span className={`px-4 py-1.5 text-gray-900 text-[10px] md:text-xs font-bold rounded-full min-w-[70px] md:min-w-[80px] text-center shadow-sm ${
                                    course.status === "Pass" ? "bg-[#b0ff8a] text-[#075546]" : course.status === "Grading" ? "bg-[#fae8b4] text-[#856404]" : "bg-[#ff7066] text-white"
                                    }`}>
                                    {course.status}
                                </span>
                            </div>

                            <div className="flex justify-center">
                                {assignmentId && enrollmentId && (
                                    <Link 
                                        href={`/assignment/${assignmentId}/results/${enrollmentId}/detail`}
                                        className="text-xs text-[#075546] font-semibold underline hover:text-[#005954] transition-colors"
                                    >
                                        Details
                                    </Link>
                                )}
                            </div>

                            <div className="flex justify-end">
                                {assignmentId && enrollmentId ? (
                                    <a 
                                        href={`/feedback/assignment/${assignmentId}/learner/${enrollmentId}/view`} 
                                        className="text-xs text-[#075546] font-semibold underline hover:text-[#005954] transition-colors"
                                    >
                                        Feedback
                                    </a>
                                ) : (
                                    <a href={`/classes/${classId}/feedback`} className="text-xs text-[#075546] font-semibold underline hover:text-[#005954] transition-colors">
                                        Feedback
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* If no results, show the total score as fallback */}
                    {(!testData.courseResults || testData.courseResults.length === 0) && (
                        <div className="grid grid-cols-[1fr_120px_100px_100px] items-center px-6 py-8 bg-white">
                            <span className="text-xs md:text-sm text-gray-800 italic font-medium">{testData.courseName}</span>
                            
                            <div className="flex justify-center">
                                <span className="text-xs md:text-sm font-bold text-[#075546]">
                                    {totalScore ?? 0} points
                                </span>
                            </div>

                            <div className="flex justify-center">
                                {assignmentId && enrollmentId && (
                                    <Link 
                                        href={`/assignment/${assignmentId}/results/${enrollmentId}/detail`}
                                        className="text-xs text-[#075546] font-semibold underline hover:text-[#005954] transition-colors"
                                    >
                                        Details
                                    </Link>
                                )}
                            </div>

                            <div className="flex justify-end">
                                {assignmentId && enrollmentId ? (
                                    <a 
                                        href={`/feedback/assignment/${assignmentId}/learner/${enrollmentId}/view`} 
                                        className="text-xs text-[#075546] font-semibold underline hover:text-[#005954] transition-colors"
                                    >
                                        Feedback
                                    </a>
                                ) : (
                                    <a href={`/classes/${classId}/feedback`} className="text-xs text-[#075546] font-semibold underline hover:text-[#005954] transition-colors">
                                        Feedback
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="mt-10 text-[10px] md:text-xs text-gray-500 italic leading-relaxed text-center">
                    Note: Assignment results determines your evaluation for each course.
                </p>
            </div>

            <div className="flex justify-center gap-6">
                <NuraButton
                    label="Back to Overview"
                    variant="secondary"
                    className="min-w-[160px]"
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
