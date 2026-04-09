"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { NuraButton } from '@/components/ui/button/button';
import { FileText, Download } from 'lucide-react';
import Image from 'next/image';
import TitleCard from '@/components/ui/card/title_card';

interface AttachedFile {
    name: string;
    url: string;
    size?: number;
}

interface AssignmentFeedbackViewProps {
    assignmentId: number;
    enrollmentId: number;
    learnerName: string;
    assignmentTitle: string;
    className: string;
    courseName: string;
    feedback: string;
    files: AttachedFile[];
    problemUnderstanding?: number;
    problemUnderstandingFeedback?: string;
    technicalAbility?: number;
    technicalAbilityFeedback?: string;
    solutionQuality?: number;
    solutionQualityFeedback?: string;
}

export default function AssignmentFeedbackView({
    assignmentId,
    enrollmentId,
    learnerName,
    assignmentTitle,
    className,
    courseName,
    feedback,
    files = [],
    problemUnderstanding = 0,
    problemUnderstandingFeedback = '',
    technicalAbility = 0,
    technicalAbilityFeedback = '',
    solutionQuality = 0,
    solutionQualityFeedback = ''
}: AssignmentFeedbackViewProps) {
    const router = useRouter();

    const formatSize = (bytes?: number) => {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    const sections = [
        { 
            label: "Pemahaman masalah (Problem understanding)", 
            score: problemUnderstanding, 
            feedback: problemUnderstandingFeedback,
            color: "#1C3A37"
        },
        { 
            label: "Kemampuan teknis (Technical ability)", 
            score: technicalAbility, 
            feedback: technicalAbilityFeedback,
            color: "#8BB730"
        },
        { 
            label: "Kualitas solusi (Solution quality)", 
            score: solutionQuality, 
            feedback: solutionQualityFeedback,
            color: "#DAEE49"
        },
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7] text-gray-800 pb-20 relative">
            <img 
                src="/background/OvalBGLeft.svg" 
                alt="" 
                className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none opacity-40" 
            />
            <img 
                src="/background/OvalBGRight.svg" 
                alt="" 
                className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none opacity-40" 
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/classes" },
                        { label: "Assignments", href: "/assignment" },
                        { label: assignmentTitle, href: `/assignment/${assignmentId}?skipIntro=1` },
                        { label: "Feedback", href: "#" },
                    ]}
                />

                <TitleCard
                    title="Assignment Feedback"
                    description={`${className} | ${courseName}`}
                />

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-12">
                    {/* Scoring Metrics */}
                    <div className="space-y-12">
                        {sections.map((section, idx) => (
                            <div key={idx} className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="text-sm text-gray-900">{section.label}</h3>
                                    </div>
                                    <span className="text-sm text-[#005954] bg-[#FDFDF7] px-4 py-2 rounded-full border border-[#DAEE49]/30 shadow-sm">
                                        Score: {section.score}/10
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${section.score * 10}%`, backgroundColor: section.color }}
                                    />
                                </div>
                                {section.feedback && (
                                    <div className="bg-[#FBFCF2] rounded-2xl p-6 border border-[#F0F5D8]">
                                        <p className="text-[10px] text-gray-400 mb-2">Trainer's Comments</p>
                                        <div 
                                            className="text-xs text-gray-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: section.feedback }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* General Feedback */}
                    {feedback && (
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-sm text-gray-900 mb-6">General Feedback</h3>
                            <div 
                                className="bg-[#FDFDF7] rounded-2xl p-8 border border-[#DAEE49]/10 text-sm text-gray-700 leading-relaxed shadow-sm"
                                dangerouslySetInnerHTML={{ __html: feedback }}
                            />
                        </div>
                    )}

                    {/* Files */}
                    {files.length > 0 && (
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-sm text-gray-900 mb-6">Attached Resources</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group cursor-pointer" onClick={() => window.open(file.url, '_blank')}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-[#075546]">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-900 truncate max-w-[150px]">{file.name}</span>
                                                <span className="text-[10px] text-gray-400">{formatSize(file.size)}</span>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-gray-300 group-hover:text-[#075546] transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end pt-8 border-t border-gray-50">
                        <NuraButton
                            label="Back to Results"
                            variant="secondary"
                            onClick={() => router.back()}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
