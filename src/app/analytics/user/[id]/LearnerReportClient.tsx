"use client"

import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { useRouter } from 'next/navigation';

interface LearnerReportClientProps {
    data: any;
}

export default function LearnerReportClient({ data }: LearnerReportClientProps) {
    const router = useRouter();
    const analytics = data.learnerAnalytics;
    const user = data.user;
    const classTitle = data.class.title;

    const metrics = [
        { label: 'Cooperation', score: analytics?.cooperationScore || 0, color: 'bg-[#1C3A37]', feedback: analytics?.cooperationFeedback },
        { label: 'Attendance', score: analytics?.attendanceScore || 0, color: 'bg-[#1C3A37]', feedback: analytics?.attendanceFeedback },
        { label: 'Task Completion', score: analytics?.taskCompletionScore || 0, color: 'bg-[#DAEE49]', feedback: analytics?.taskCompletionFeedback },
        { label: 'Initiatives', score: analytics?.initiativesScore || 0, color: 'bg-[#DAEE49]', feedback: analytics?.initiativesFeedback },
        { label: 'Communication', score: analytics?.communicationScore || 0, color: 'bg-[#C9D942]', feedback: analytics?.communicationFeedback },
    ];

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Report & Analytics', href: '/admin' },
                    { label: classTitle, href: '#' },
                    { label: user.name || user.username, href: '#' },
                ]}
            />

            {/* Header */}
            <div className="bg-[#1C3A37] rounded-xl p-8 md:p-10 text-white space-y-2 shadow-lg">
                <h1 className="text-2xl md:text-3xl font-medium">{user.name || user.username}</h1>
                <p className="text-gray-300 font-medium opacity-80">
                    {classTitle} <span className="mx-2">|</span> Batch Number
                </p>
            </div>

            {/* Peer Feedback Summary */}
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-white/50 space-y-12">
                <div className="space-y-8">
                    <h2 className="text-xl md:text-2xl font-medium text-[#1C3A37]">Peer Feedback Summary</h2>
                    <div className="space-y-6">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="flex items-center gap-6">
                                <span className="w-32 md:w-40 text-sm md:text-base font-medium text-gray-500">{metric.label}</span>
                                <div className="flex-grow h-3 bg-gray-50 rounded-full overflow-hidden relative">
                                    <div
                                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${metric.color}`}
                                        style={{ width: `${metric.score}%` }}
                                    />
                                </div>
                                <span className="w-10 text-right text-sm md:text-base font-medium text-[#1C3A37]">{metric.score}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Project Feedback */}
                {(analytics?.problemUnderstandingScore > 0 || analytics?.methodsScore > 0 || analytics?.solutionQualityScore > 0) && (
                    <div className="space-y-8 pt-8 border-t border-gray-100">
                        <h2 className="text-xl md:text-2xl font-medium text-[#1C3A37]">Final Project Feedback</h2>
                        <div className="space-y-6">
                            {[
                                { label: 'Problem Understanding', score: analytics.problemUnderstandingScore, feedback: analytics.problemUnderstandingFeedback, color: 'bg-[#1C3A37]' },
                                { label: 'Data Reasoning', score: analytics.dataReasoningScore, feedback: analytics.dataReasoningFeedback, color: 'bg-[#005954]' },
                                { label: 'Technical Ability', score: analytics.methodsScore, feedback: analytics.methodsFeedback, color: 'bg-[#8BB730]' },
                                { label: 'Insight Quality', score: analytics.insightQualityScore, feedback: analytics.insightQualityFeedback, color: 'bg-[#DAEE49]' },
                                { label: 'Solution Quality', score: analytics.solutionQualityScore, feedback: analytics.solutionQualityFeedback, color: 'bg-[#C9D942]' },
                            ].filter(m => m.score > 0).map((metric) => (
                                <div key={metric.label} className="space-y-4">
                                    <div className="flex items-center gap-6">
                                        <span className="w-32 md:w-40 text-sm md:text-base font-medium text-gray-500">{metric.label}</span>
                                        <div className="flex-grow h-3 bg-gray-50 rounded-full overflow-hidden relative">
                                            <div
                                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${metric.color}`}
                                                style={{ width: `${metric.score}%` }}
                                            />
                                        </div>
                                        <span className="w-10 text-right text-sm md:text-base font-medium text-[#1C3A37]">{metric.score}%</span>
                                    </div>
                                    {metric.feedback && (
                                        <p className="text-sm text-gray-600 leading-relaxed italic pl-4 border-l-2 border-gray-100">
                                            "{metric.feedback}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feedback Details */}
                <div className="space-y-8 pt-8 border-t border-gray-100">
                    <h2 className="text-xl md:text-2xl font-medium text-[#1C3A37]">Feedback Details</h2>
                    <div className="bg-[#F9F9EE]/50 rounded-xl p-6 md:p-10 space-y-10">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="space-y-3">
                                <h3 className="text-base md:text-lg font-medium text-[#1C3A37]">{metric.label}</h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {metric.feedback || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                                </p>
                                <div className="h-[1px] bg-gray-200/50 w-full mt-8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={() => router.push(`/analytics/${data.id}/edit`)}
                    className="bg-[#DAEE49] hover:bg-[#C9D942] text-[#1C3A37] font-black py-4 px-12 rounded-full transition-all shadow-md hover:shadow-lg uppercase tracking-widest text-xs"
                >
                    Edit Feedback
                </button>
            </div>
        </div>
    );
}
