"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { NuraButton } from '@/components/ui/button/button';
import TitleCard from '@/components/ui/card/title_card';
import { useRouter } from 'next/navigation';

interface ClassFeedbackDetailProps {
    classId: string;
    classTitle: string;
    feedback: any;
}

export default function ClassFeedbackDetail({ classId, classTitle, feedback }: ClassFeedbackDetailProps) {
    const router = useRouter();

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: "Feedback", href: "/feedback" },
        { label: `${classTitle} Feedback`, href: `/feedback/class/${classId}` },
        { label: "Detail", href: "#" },
    ];

    const sections = [
        { key: 'courseStructure', label: 'Struktur kursus (Course structure)' },
        { key: 'materialQuality', label: 'Kualitas & relevansi materi (Material quality & relevance)' },
        { key: 'practicalRelevance', label: 'Relevansi praktis (Practical relevance)' },
        { key: 'learningEnvironment', label: 'Lingkungan belajar (Learning environment)' },
        { key: 'technicalSupport', label: 'Kesiapan & dukungan teknis (Technical readiness & support)' },
    ];

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 ">
            <Breadcrumb items={breadcrumbItems} />

            <TitleCard 
                title="Class Feedback Detail" 
                description={`${classTitle} - ${feedback.user.name || feedback.user.username}`}
            />

            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-10">
                {sections.map(section => (
                    <div key={section.key} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium text-gray-900">{section.label}</h3>
                            <span className="text-xs font-bold bg-[#FBFCF2] px-3 py-1 rounded-full border border-[#F0F5D8]">Score: {feedback[section.key]}/10</span>
                        </div>
                        <div className="bg-[#FBFCF2] rounded-xl p-6 border border-[#F0F5D8]">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 mb-2">Feedback</p>
                            <div
                                className="rich-text text-xs text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: feedback[`${section.key}Feedback`] || "No additional feedback provided." }}
                            />
                        </div>
                    </div>
                ))}
                <div className="flex justify-end pt-8">
                    <NuraButton
                        label="Back to List"
                        variant="secondary"
                        onClick={() => router.back()}
                    />
                </div>
            </div>
        </div>
    );
}
