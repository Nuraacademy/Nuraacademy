"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';

interface PeerFeedback {
    id: number;
    cooperation: number;
    cooperationFeedback: string | null;
    attendance: number;
    attendanceFeedback: string | null;
    taskCompletion: number;
    taskCompletionFeedback: string | null;
    initiatives: number;
    initiativesFeedback: string | null;
    communication: number;
    communicationFeedback: string | null;
}

interface PeerResultsDetailClientProps {
    classData: any;
    learnerName: string;
    feedback: PeerFeedback | null;
    isFromMe: boolean;
}

export default function PeerResultsDetailClient({ classData, learnerName, feedback, isFromMe }: PeerResultsDetailClientProps) {
    const metrics = [
        { label: 'Cooperation', key: 'cooperation' as keyof PeerFeedback, color: 'bg-[#1C3A37]', score: feedback?.cooperation || 0 },
        { label: 'Attendance', key: 'attendance' as keyof PeerFeedback, color: 'bg-[#1C3A37]', score: feedback?.attendance || 0 },
        { label: 'Task Completion', key: 'taskCompletion' as keyof PeerFeedback, color: 'bg-[#DAEE49]', score: feedback?.taskCompletion || 0 },
        { label: 'Initiatives', key: 'initiatives' as keyof PeerFeedback, color: 'bg-[#DAEE49]', score: feedback?.initiatives || 0 },
        { label: 'Communication', key: 'communication' as keyof PeerFeedback, color: 'bg-[#C9D942]', score: feedback?.communication || 0 },
    ];

    const feedbackDetails = [
        { label: 'Cooperation', key: 'cooperationFeedback' as keyof PeerFeedback },
        { label: 'Attendance', key: 'attendanceFeedback' as keyof PeerFeedback },
        { label: 'Task Completion', key: 'taskCompletionFeedback' as keyof PeerFeedback },
        { label: 'Initiatives', key: 'initiativesFeedback' as keyof PeerFeedback },
        { label: 'Communication', key: 'communicationFeedback' as keyof PeerFeedback },
    ];

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Feedback', href: '/feedback' },
                    { label: 'Final Project Peer Feedback', href: `/classes/${classData.id}/analytics/peer-results` },
                    { label: learnerName, href: '#' },
                ]}
            />

            {/* Header */}
            <div className="bg-[#1C3A37] rounded-[24px] p-8 md:p-10 text-white space-y-1 shadow-lg">
                <h1 className="text-2xl md:text-3xl font-medium font-merriweather">
                    {learnerName}
                </h1>
                <p className="text-gray-300 font-medium opacity-80">
                    {classData.title} <span className="mx-2">|</span> Batch Number
                </p>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-white/50 space-y-12">
                {/* Summary */}
                <div className="space-y-8">
                    <h2 className="text-lg font-medium text-[#1C3A37]">Peer Feedback Summary</h2>
                    <div className="space-y-4 max-w-4xl">
                        {metrics.map((m) => (
                            <div key={m.label} className="flex items-center gap-6">
                                <span className="text-[10px] font-medium text-gray-500 uppercase w-32">{m.label}</span>
                                {feedback ? (
                                    <>
                                        <div className="flex-grow h-4 bg-gray-50 rounded-full overflow-hidden relative border border-gray-100/50">
                                            <div
                                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${m.color}`}
                                                style={{ width: `${(m.score / 10) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-400 w-4 text-right">{m.score}</span>
                                    </>
                                ) : (
                                    <span className="text-[10px] font-medium text-gray-300 italic tracking-wider">Feedback not available</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-8 pt-8 border-t border-gray-100">
                    <h2 className="text-lg font-medium text-[#1C3A37]">Feedback Details</h2>
                    <div className="bg-[#FEFEF2] rounded-[32px] p-8 md:p-10 space-y-10 border border-[#F0F0E0]">
                        {feedbackDetails.map((detail) => {
                            const comment = feedback ? (feedback[detail.key] as string) : null;
                            const hasComment = comment && comment.trim() !== "" && comment !== "null" && comment !== "<p></p>";

                            if (!hasComment) return null;

                            return (
                                <div key={detail.label} className="space-y-4 relative">
                                    <h3 className="text-sm font-medium text-[#1C3A37]">{detail.label}</h3>
                                    <div
                                        className="text-sm text-gray-600 leading-relaxed bg-white/50 p-4 rounded-2xl border border-white/80 shadow-sm"
                                        dangerouslySetInnerHTML={{ __html: comment }}
                                    />
                                    <div className="absolute -bottom-5 inset-x-0 border-b border-gray-200/50" />
                                </div>
                            );
                        })}
                        {!feedback && (
                            <p className="text-center text-gray-400 italic py-10">No detailed feedback received from this peer yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
