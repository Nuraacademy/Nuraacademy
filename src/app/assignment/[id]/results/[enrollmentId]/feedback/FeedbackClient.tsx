"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveAssignmentFeedback } from '@/app/actions/assignment';
import { toast } from 'sonner';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { NuraButton } from '@/components/ui/button/button';

interface FeedbackClientProps {
    assignmentId: number;
    enrollmentId: number;
    resultId: number;
    learnerName: string;
    assignmentTitle: string;
    className: string;
    courseName: string;
    initialFeedback: string;
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
    initialFeedback,
    breadcrumbItems
}: FeedbackClientProps) {
    const router = useRouter();
    const [feedback, setFeedback] = useState(initialFeedback || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveAssignmentFeedback(resultId, feedback, assignmentId);

        if (res.success) {
            toast.success("Feedback saved successfully!");
            router.refresh();
            // Optional: redirect back to results
            router.push(`/assignment/${assignmentId}/results`);
        } else {
            toast.error("Failed to save feedback: " + res.error);
        }
        setIsSaving(false);
    };

    const handleClear = () => {
        setFeedback('');
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20">
            {/* Background Orbs */}
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

                {/* Feedback Card */}
                <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-gray-900">Feedback Answer</h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm p-4">
                            <RichTextInput
                                value={feedback}
                                onChange={(val) => setFeedback(val)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-6 pt-4">
                        <button
                            onClick={handleClear}
                            className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                        >
                            Clear
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
