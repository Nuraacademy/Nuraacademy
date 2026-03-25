"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveAssignmentFeedback } from '@/app/actions/assignment';
import { toast } from 'sonner';
import { NuraButton } from '@/components/ui/button/button';
import { FeedbackCriteriaField } from '@/components/ui/feedback/FeedbackCriteriaField';
import { RichTextInput } from '@/components/ui/input/rich_text_input';

interface FeedbackClientProps {
    assignmentId: number;
    enrollmentId: number;
    resultId: number;
    learnerName: string;
    assignmentTitle: string;
    className: string;
    courseName: string;
    initialData: any; // assignment result data
    breadcrumbItems: { label: string; href: string }[];
}

export default function FeedbackClient({
    assignmentId,
    enrollmentId,
    resultId,
    learnerName,
    assignmentTitle,
    className,
    courseName,
    initialData,
    breadcrumbItems
}: FeedbackClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const formatScore = (val: number | undefined | null) => {
        return val === undefined || val === null ? 10 : val;
    };

    const [formData, setFormData] = useState({
        problemUnderstanding: formatScore(initialData?.problemUnderstanding),
        problemUnderstandingFeedback: initialData?.problemUnderstandingFeedback || "",
        technicalAbility: formatScore(initialData?.technicalAbility),
        technicalAbilityFeedback: initialData?.technicalAbilityFeedback || "",
        solutionQuality: formatScore(initialData?.solutionQuality),
        solutionQualityFeedback: initialData?.solutionQualityFeedback || "",
        feedback: initialData?.feedback || "",
    });

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveAssignmentFeedback(resultId, assignmentId, formData);

        if (res.success) {
            toast.success("Feedback saved successfully!");
            router.refresh();
            router.push(`/assignment/${assignmentId}/results`);
        } else {
            toast.error("Failed to save feedback: " + res.error);
        }
        setIsSaving(false);
    };

    const sections = [
        { key: 'problemUnderstanding', label: 'Pemahaman masalah (Problem understanding)', description: 'Understanding of the requirements and constraints.' },
        { key: 'technicalAbility', label: 'Kemampuan teknis (Technical ability)', description: 'Correct usage of technologies and coding standards.' },
        { key: 'solutionQuality', label: 'Kualitas solusi (Solution quality)', description: 'Overall effectiveness and efficiency of the proposed solution.' },
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20">
            {/* Background */}
            <Image
                src="/background/OvalBGLeft.svg"
                alt=""
                className="absolute top-0 left-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />
            <Image
                src="/background/OvalBGRight.svg"
                alt=""
                className="absolute bottom-0 right-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
                <Breadcrumb items={breadcrumbItems} />

                {/* Hero Section */}
                <div className="bg-[#005954] rounded-xl p-8 text-white shadow-sm space-y-2">
                    <h1 className="text-2xl font-medium">{learnerName}</h1>
                    <p className="text-white/80 text-sm font-medium">
                        {className} {courseName ? `| ${courseName}` : ''}
                    </p>
                </div>

                {/* Feedback Sections */}
                <div className="bg-white rounded-xl p-6 md:p-12 shadow-sm border border-gray-100 space-y-12">
                    {sections.map((section) => (
                        <FeedbackCriteriaField
                            key={section.key}
                            label={section.label}
                            description={section.description}
                            score={formData[section.key as keyof typeof formData] as number}
                            feedback={formData[`${section.key}Feedback` as keyof typeof formData] as string}
                            onScoreChange={(val) => setFormData({ ...formData, [section.key]: val })}
                            onFeedbackChange={(val) => setFormData({ ...formData, [`${section.key}Feedback`]: val })}
                        />
                    ))}

                    <div className="space-y-4 pt-8 border-t border-gray-100">
                        <h2 className="text-lg font-medium text-[#1C3A37]">Additional Comments</h2>
                        <RichTextInput
                            value={formData.feedback}
                            onChange={(val) => setFormData({ ...formData, feedback: val })}
                        />
                    </div>

                    <div className="flex justify-center items-center gap-6 pt-4">
                        <button
                            onClick={() => router.back()}
                            className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <NuraButton
                            label={isSaving ? "Submitting..." : "Submit"}
                            variant="primary"
                            className="min-w-[160px] h-12 text-sm font-medium bg-[#DAEE49] text-[#005954] hover:bg-[#C9D942]"
                            onClick={handleSave}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
