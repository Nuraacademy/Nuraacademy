"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveClassFeedback } from '@/app/actions/classFeedback';
import { toast } from 'sonner';
import { NuraButton } from '@/components/ui/button/button';
import TitleCard from '@/components/ui/card/title_card';
import { FeedbackCriteriaField } from '@/components/ui/feedback/FeedbackCriteriaField';

interface ClassFeedbackClientProps {
    classId: string;
    data: any;
    initialFeedback: any;
}

export default function ClassFeedbackClient({ classId, data, initialFeedback }: ClassFeedbackClientProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(!initialFeedback);
    const [isSaving, setIsSaving] = useState(false);

    const formatScore = (val: number | undefined | null) => {
        return val === undefined || val === null ? 10 : val;
    };

    const [formData, setFormData] = useState({
        courseStructure: formatScore(initialFeedback?.courseStructure),
        courseStructureFeedback: initialFeedback?.courseStructureFeedback || "",
        materialQuality: formatScore(initialFeedback?.materialQuality),
        materialQualityFeedback: initialFeedback?.materialQualityFeedback || "",
        practicalRelevance: formatScore(initialFeedback?.practicalRelevance),
        practicalRelevanceFeedback: initialFeedback?.practicalRelevanceFeedback || "",
        learningEnvironment: formatScore(initialFeedback?.learningEnvironment),
        learningEnvironmentFeedback: initialFeedback?.learningEnvironmentFeedback || "",
        technicalSupport: formatScore(initialFeedback?.technicalSupport),
        technicalSupportFeedback: initialFeedback?.technicalSupportFeedback || "",
        content: initialFeedback?.content || "",
    });

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveClassFeedback({
            classId: parseInt(classId),
            enrollmentId: data.enrollmentId,
            ...formData
        });

        if (res.success) {
            toast.success("Feedback saved successfully!");
            setIsEditing(false);
            router.refresh();
        } else {
            toast.error("Failed to save feedback: " + res.error);
        }
        setIsSaving(false);
    };

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: data.classTitle, href: `/classes/${classId}/overview` },
        { label: "Class Feedback", href: "#" },
    ];

    const sections = [
        { key: 'courseStructure', label: 'Struktur kursus (Course structure)', description: 'Organization and flow of the course content.' },
        { key: 'materialQuality', label: 'Kualitas & relevansi materi (Material quality & relevance)', description: 'Quality of slides, documents, and relevance to the topic.' },
        { key: 'practicalRelevance', label: 'Relevansi praktis (Practical relevance)', description: 'Applicability of the material to real-world scenarios.' },
        { key: 'learningEnvironment', label: 'Lingkungan belajar (Learning environment)', description: 'Comfort and atmosphere of the physical or virtual classroom.' },
        { key: 'technicalSupport', label: 'Kesiapan & dukungan teknis (Technical readiness & support)', description: 'Reliability of tools, equipment, and technical assistance.' },
    ];

    if (!isEditing && initialFeedback) {
        return (
            <div className="min-h-screen bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 ">
                <Breadcrumb items={breadcrumbItems} />

                {/* Hero */}
                <div className="bg-[#005954] rounded-xl p-6 text-white shadow-sm">
                    <h1 className="text-xl font-medium mb-1">Class Feedback</h1>
                    <p className="text-sm opacity-90">{data.classTitle}</p>
                </div>

                {/* Details View */}
                <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-10">
                    {sections.map(section => (
                        <div key={section.key} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-900">{section.label}</h3>
                                <span className="text-xs font-bold bg-[#FBFCF2] px-3 py-1 rounded-full border border-[#F0F5D8]">Score: {formData[section.key as keyof typeof formData]}/10</span>
                            </div>
                            <div className="bg-[#FBFCF2] rounded-xl p-6 border border-[#F0F5D8]">
                                <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 mb-2">Feedback</p>
                                <div
                                    className="rich-text text-xs text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: formData[`${section.key}Feedback` as keyof typeof formData] as string || "No additional feedback provided." }}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end items-center gap-4 mt-4 pt-8 border-t border-gray-100">
                        <NuraButton
                            label="Back to Class"
                            variant="secondary"
                            onClick={() => router.push(`/classes/${classId}/overview`)}
                        />
                        <NuraButton
                            label="Edit"
                            variant="primary"
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 ">
            <Breadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <TitleCard
                title="Class Feedback"
                description={data.classTitle}
            />

            {/* Editor View */}
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

                <div className="flex justify-end items-center gap-8 pt-8 border-t border-gray-100">
                    <NuraButton
                        label="Cancel"
                        variant="secondary"
                        onClick={() => initialFeedback ? setIsEditing(false) : router.back()}
                    />
                    <NuraButton
                        label={isSaving ? "Saving..." : "Submit"}
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}
