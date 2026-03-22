"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveReflectionFeedback, deleteReflectionFeedback } from '@/app/actions/reflection';
import { toast } from 'sonner';
import { NuraButton } from '@/components/ui/button/button';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { ConfirmModal } from '@/components/ui/modal/confirmation_modal';

interface ReflectionFeedbackDetailProps {
    reflection: any;
    hasPrivilege: boolean;
}

export default function ReflectionFeedbackDetail({ reflection, hasPrivilege }: ReflectionFeedbackDetailProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(!reflection.feedback);
    const [feedbackContent, setFeedbackContent] = useState(reflection.feedback?.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveFeedback = async () => {
        if (!feedbackContent.trim()) {
            toast.error("Please enter some feedback.");
            return;
        }

        setIsSaving(true);
        const res = await saveReflectionFeedback(reflection.id, feedbackContent);

        if (res.success) {
            toast.success("Feedback saved successfully!");
            setIsEditing(false);
            router.refresh();
        } else {
            toast.error("Failed to save feedback: " + res.error);
        }
        setIsSaving(false);
    };

    const handleDeleteFeedback = async () => {
        setIsDeleting(true);
        const res = await deleteReflectionFeedback(reflection.id);
        if (res.success) {
            toast.success("Feedback deleted successfully!");
            setIsEditing(true);
            setFeedbackContent('');
            setIsModalOpen(false);
            router.refresh();
        } else {
            toast.error("Failed to delete feedback: " + res.error);
        }
        setIsDeleting(false);
    };

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Feedback", href: "/feedback/reflection" },
        { label: reflection.user.name || reflection.user.username, href: "#" },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 font-sans">
            <Breadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <div className="bg-[#005954] rounded-[1.5rem] p-6 text-white shadow-sm">
                <h1 className="text-xl font-medium mb-1">{reflection.user.name || reflection.user.username}</h1>
                <p className="text-sm opacity-90">
                    {reflection.class?.title || "Class Name"} <span className="mx-2 opacity-50">|</span> {reflection.course?.title || reflection.session?.title}
                </p>
            </div>

            {/* Learner Reflection Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-6">
                <h2 className="text-sm font-medium text-gray-900 mb-6">Learner Reflection</h2>

                <div className="bg-[#FBFCF2] rounded-3xl p-8 space-y-4 border border-[#F0F5D8]">
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
                            dangerouslySetInnerHTML={{ __html: reflection.content }}
                        />
                    </div>
                </div>

                {/* Feedback Section */}
                {(hasPrivilege || reflection.feedback) && (
                    <div className="space-y-6 mt-4">
                        <h2 className="text-sm font-medium text-gray-900">Reflection Feedback</h2>

                        {hasPrivilege && isEditing ? (
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white p-4">
                                    <RichTextInput
                                        value={feedbackContent}
                                        onChange={(val) => setFeedbackContent(val)}
                                    />
                                </div>
                            </div>
                        ) : reflection.feedback ? (
                            <div className="bg-[#FBFCF2] rounded-3xl p-8 border border-[#F0F5D8] group relative min-h-[100px]">
                                <div
                                    className="rich-text text-xs text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: reflection.feedback?.content }}
                                />
                            </div>
                        ) : null}
                    </div>
                )}

                {hasPrivilege && isEditing && (
                    <div className="flex justify-end items-center gap-8 mt-4">
                        <button
                            onClick={() => {
                                if (reflection.feedback) {
                                    setFeedbackContent(reflection.feedback.content);
                                    setIsEditing(false);
                                } else {
                                    setFeedbackContent('');
                                    router.back();
                                }
                            }}
                            className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                        >
                            {reflection.feedback ? "Cancel" : "Clear"}
                        </button>
                        <NuraButton
                            label={isSaving ? "Submitting..." : "Submit"}
                            variant="primary"
                            className="w-[160px] h-10 text-sm font-medium bg-[#D9F55C] hover:bg-[#c8e54b] text-black border-none rounded-2xl"
                            onClick={handleSaveFeedback}
                            disabled={isSaving}
                        />
                    </div>
                )}

                {hasPrivilege && !isEditing && reflection.feedback && (
                    <div className="flex justify-end items-center gap-8 mt-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm font-medium text-gray-900 hover:text-red-500 transition-colors"
                        >
                            Delete
                        </button>
                        <NuraButton
                            label="Edit"
                            variant="primary"
                            className="w-[160px] h-10 text-sm font-medium bg-[#D9F55C] hover:bg-[#c8e54b] text-black border-none rounded-2xl"
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Delete Feedback"
                message="Are you sure you want to delete this feedback? This action cannot be undone."
                onConfirm={handleDeleteFeedback}
                onCancel={() => setIsModalOpen(false)}
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </div>
    );
}
