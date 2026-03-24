"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import TitleCard from '@/components/ui/card/title_card';
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
        { label: "Home", href: "/classes" },
        { label: data.class.title, href: `/classes/${classId}/overview` },
        { label: data.course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: moduleId ? "Session Reflection" : "Participant Reflection", href: "#" },
    ];

    const heroTitle = moduleId ? "Session Reflection" : "Participant Reflection";

    if (!isEditing && initialReflection) {
        return (
            <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 ">
                <Breadcrumb items={breadcrumbItems} />

                <TitleCard title="Reflection" />

                {/* Details View */}
                <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 flex flex-col gap-6">
                    <h2 className="text-sm font-medium text-gray-900 px-2">Learner Reflection</h2>

                    <div className="bg-[#FBFCF2] rounded-xl p-8 space-y-4 border border-[#F0F5D8]">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Question</h3>
                            <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                Please share with us what you feel about your learning progress, what your difficulties are, how you would improve it. You also can share anything else related this training.
                            </p>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Answer</h3>
                            <div
                                className="rich-text text-xs text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: initialReflection.content }}
                            />
                        </div>
                    </div>

                    {initialReflection.feedback && (
                        <div className="space-y-4 mt-4">
                            <h2 className="text-sm font-medium text-gray-900 px-2">Reflection Feedback</h2>
                            <div className="bg-[#FBFCF2] rounded-xl p-8 border border-[#F0F5D8]">
                                <div
                                    className="rich-text text-xs text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: initialReflection.feedback.content }}
                                />
                            </div>
                        </div>
                    )}

                    {!initialReflection.feedback && (
                        <div className="flex justify-end items-center gap-4 mt-4">
                            <NuraButton
                                label="Delete"
                                variant="secondary"
                                onClick={() => setIsModalOpen(true)}
                            />
                            <NuraButton
                                label="Edit"
                                variant="primary"
                                onClick={() => setIsEditing(true)}
                            />
                        </div>
                    )}
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
        <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 ">
            <Breadcrumb items={breadcrumbItems} />

            <TitleCard title={heroTitle} />

            {/* Editor View */}
            <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 flex flex-col gap-10">
                <p className="text-gray-700 text-sm leading-relaxed">
                    Please share with us what you feel about your learning progress, what your difficulties are, how you would improve it. You also can share anything else related this training
                </p>

                <div className="space-y-4">
                    <span className="text-sm font-medium text-gray-900">Answer</span>
                    <div className="mt-4 overflow-hidden bg-white">
                        <RichTextInput
                            value={content}
                            onChange={(val) => setContent(val)}
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-8">
                    <NuraButton
                        label="Cancel"
                        variant="secondary"
                        onClick={() => initialReflection ? setIsEditing(false) : router.back()}
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
