"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveReflection, deleteReflection } from '@/app/actions/reflection';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/modal/confirmation_modal';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { NuraButton } from '@/components/ui/button/button';

interface ReflectionClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
    data: any;
    initialReflection: any;
}

export default function ReflectionClient({ classId, courseId, moduleId, data, initialReflection }: ReflectionClientProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(!initialReflection);
    const [content, setContent] = useState(initialReflection?.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) {
            toast.error("Please enter some content for your reflection.");
            return;
        }

        setIsSaving(true);
        const res = await saveReflection({
            sessionId: moduleId ? parseInt(moduleId) : undefined,
            courseId: moduleId ? undefined : parseInt(courseId),
            enrollmentId: data.enrollmentId,
            content: content
        });

        if (res.success) {
            toast.success("Reflection saved successfully!");
            setIsEditing(false);
            router.refresh();
        } else {
            toast.error("Failed to save reflection: " + res.error);
        }
        setIsSaving(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteReflection(initialReflection.id, moduleId ? parseInt(moduleId) : -1);
        if (res.success) {
            toast.success("Reflection deleted.");
            setIsEditing(true);
            setContent('');
            setIsModalOpen(false);
            router.refresh();
        } else {
            toast.error("Failed to delete reflection: " + res.error);
        }
        setIsDeleting(false);
    };

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: data.class.title, href: `/classes/${classId}/overview` },
        { label: data.course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: moduleId ? "Session Reflection" : "Course Reflection", href: "#" },
    ];

    const heroTitle = moduleId ? "Session Reflection" : "Course Reflection";

    if (!isEditing && initialReflection) {
        return (
            <div className="min-h-screen bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 font-sans">
                <Breadcrumb items={breadcrumbItems} />

                {/* Hero */}
                <div className="bg-[#005954] rounded-[1.5rem] p-6 text-white shadow-sm">
                    <h1 className="text-xl font-bold">{heroTitle}</h1>
                </div>

                {/* Details View */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-10">
                    <div className="space-y-6">
                        <h2 className="text-sm font-bold text-gray-900">Reflection Details</h2>
                        <div className="bg-gray-50/50 rounded-2xl p-8 text-gray-700 leading-relaxed text-sm md:text-base border border-gray-100">
                            <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-6">
                                Please share with us what you feel about your learning progress, what your difficulties are, how you would improve it. You also can share anything else related this training
                            </p>
                            <div 
                                className="rich-text"
                                dangerouslySetInnerHTML={{ __html: initialReflection.content }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-6">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Delete
                        </button>
                        <NuraButton 
                            label="Edit"
                            variant="primary"
                            className="min-w-[140px] h-10 text-sm font-bold"
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                </div>

                <ConfirmModal
                    isOpen={isModalOpen}
                    title="Delete Reflection"
                    message="Are you sure you want to delete this reflection? This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setIsModalOpen(false)}
                    confirmText="Delete"
                    isLoading={isDeleting}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 font-sans">
            <Breadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <div className="bg-[#005954] rounded-[1.5rem] p-6 text-white shadow-sm">
                <h1 className="text-xl font-bold">{heroTitle}</h1>
            </div>

            {/* Editor View */}
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-10">
                <p className="text-gray-700 text-sm leading-relaxed">
                    Please share with us what you feel about your learning progress, what your difficulties are, how you would improve it. You also can share anything else related this training
                </p>

                <div className="space-y-4">
                    <span className="text-sm font-bold text-gray-900">Answer</span>
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm p-4">
                        <RichTextInput 
                            value={content}
                            onChange={(val) => setContent(val)}
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-8">
                    <button 
                        onClick={() => initialReflection ? setIsEditing(false) : router.back()}
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
