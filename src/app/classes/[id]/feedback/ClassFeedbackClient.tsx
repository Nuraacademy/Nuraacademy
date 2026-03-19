"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveClassFeedback } from '@/app/actions/classFeedback';
import { toast } from 'sonner';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { NuraButton } from '@/components/ui/button/button';

interface ClassFeedbackClientProps {
    classId: string;
    data: any;
    initialFeedback: any;
}

export default function ClassFeedbackClient({ classId, data, initialFeedback }: ClassFeedbackClientProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(!initialFeedback);
    const [content, setContent] = useState(initialFeedback?.content || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) {
            toast.error("Please enter some content for your feedback.");
            return;
        }

        setIsSaving(true);
        const res = await saveClassFeedback({
            classId: parseInt(classId),
            enrollmentId: data.enrollmentId,
            content: content
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
        { label: "Home", href: "/" },
        { label: data.classTitle, href: `/classes/${classId}/overview` },
        { label: "Class Feedback", href: "#" },
    ];

    if (!isEditing && initialFeedback) {
        return (
            <div className="min-h-screen bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 font-sans">
                <Breadcrumb items={breadcrumbItems} />

                {/* Hero */}
                <div className="bg-[#005954] rounded-[1.5rem] p-6 text-white shadow-sm">
                    <h1 className="text-xl font-bold mb-1">Class Feedback</h1>
                    <p className="text-sm opacity-90">{data.classTitle}</p>
                </div>

                {/* Details View */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-6">
                    <h2 className="text-sm font-bold text-gray-900 px-2">Your Feedback</h2>
                    
                    <div className="bg-[#FBFCF2] rounded-3xl p-8 space-y-4 border border-[#F0F5D8]">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Question</h3>
                            <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                Please share with us what you feel about this class, how you would improve it, and any other feedback you have.
                            </p>
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Answer</h3>
                            <div 
                                className="rich-text text-xs text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: initialFeedback.content }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4 mt-4">
                        <NuraButton 
                            label="Edit"
                            variant="primary"
                            className="min-w-[140px] h-11 text-xs font-bold rounded-2xl bg-[#D9F55C] hover:bg-[#c8e54b] text-black border-none shadow-none"
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 font-sans">
            <Breadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <div className="bg-[#005954] rounded-[1.5rem] p-6 text-white shadow-sm">
                <h1 className="text-xl font-bold">Class Feedback</h1>
            </div>

            {/* Editor View */}
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-10">
                <p className="text-gray-700 text-sm leading-relaxed">
                    Please share with us what you feel about this class, how you would improve it, and any other feedback you have.
                </p>

                <div className="space-y-4">
                    <span className="text-sm font-bold text-gray-900">Your Feedback</span>
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm p-4">
                        <RichTextInput 
                            value={content}
                            onChange={(val) => setContent(val)}
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-8">
                    <button 
                        onClick={() => initialFeedback ? setIsEditing(false) : router.back()}
                        className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <NuraButton 
                        label={isSaving ? "Saving..." : "Submit"}
                        variant="primary"
                        className="min-w-[160px] h-10 text-sm font-bold"
                        onClick={handleSave}
                        disabled={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}
