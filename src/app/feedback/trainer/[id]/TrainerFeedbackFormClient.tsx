"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveTrainerFeedback, clearTrainerFeedback } from '@/app/actions/trainer_feedback';
import { toast } from 'sonner';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { FeedbackCriteriaField } from '@/components/ui/feedback/FeedbackCriteriaField';
import { History, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/modal/confirmation_modal';

interface TrainerFeedbackFormClientProps {
    trainer: any; // trainer user data
    evaluatorEnrollmentId: number;
    classId: number;
    initialFeedback?: any;
    classTitle: string;
}

export default function TrainerFeedbackFormClient({ trainer, evaluatorEnrollmentId, classId, initialFeedback, classTitle }: TrainerFeedbackFormClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    const formatScore = (val: number | undefined | null, defaultScore: number) => {
        if (val === undefined || val === null) return defaultScore;
        return val;
    };

    const [formData, setFormData] = useState({
        mastery: formatScore(initialFeedback?.mastery, 10),
        masteryFeedback: initialFeedback?.masteryFeedback || "",
        communication: formatScore(initialFeedback?.communication, 10),
        communicationFeedback: initialFeedback?.communicationFeedback || "",
        engagement: formatScore(initialFeedback?.engagement, 10),
        engagementFeedback: initialFeedback?.engagementFeedback || "",
        responsiveness: formatScore(initialFeedback?.responsiveness, 10),
        responsivenessFeedback: initialFeedback?.responsivenessFeedback || "",
        motivation: formatScore(initialFeedback?.motivation, 10),
        motivationFeedback: initialFeedback?.motivationFeedback || "",
    });

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveTrainerFeedback({
            evaluatorId: evaluatorEnrollmentId,
            trainerId: trainer.id,
            classId: classId,
            ...formData
        });

        if (res.success) {
            toast.success("Feedback saved successfully!");
            router.push(`/classes/${classId}/overview`);
        } else {
            toast.error("Failed to save feedback: " + res.error);
        }
        setIsSaving(false);
    };

    const handleClearClick = () => {
        setIsClearModalOpen(true);
    };

    const handleConfirmClear = async () => {
        setIsClearing(true);
        const res = await clearTrainerFeedback(evaluatorEnrollmentId, trainer.id, classId);

        if (res.success) {
            toast.success("Feedback cleared successfully!");
            setFormData({
                mastery: 0,
                masteryFeedback: "",
                communication: 0,
                communicationFeedback: "",
                engagement: 0,
                engagementFeedback: "",
                responsiveness: 0,
                responsivenessFeedback: "",
                motivation: 0,
                motivationFeedback: "",
            });
        } else {
            toast.error("Failed to clear feedback: " + res.error);
        }
        setIsClearing(false);
        setIsClearModalOpen(false);
    };

    const sections = [
        { key: 'mastery', label: 'Penguasaan materi (Mastery)', description: 'Demonstrates deep understanding of the subject matter.' },
        { key: 'communication', label: 'Komunikasi (Communication)', description: 'Explains concepts clearly and uses effective teaching methods.' },
        { key: 'engagement', label: 'Keterlibatan (Engagement)', description: 'Encourages participation and provides helpful support to learners.' },
        { key: 'responsiveness', label: 'Responsivitas (Responsiveness)', description: 'Consistently responsive and maintains a professional demeanor.' },
        { key: 'motivation', label: 'Motivasi & inspirasi (Motivation & inspiration)', description: 'Provides motivation and inspiration to learn.' },
    ];

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: classTitle, href: `/classes/${classId}/overview` },
                    { label: `Trainer Feedback: ${trainer.name || trainer.username}`, href: '#' },
                ]}
            />

            <div className="bg-[#1C3A37] rounded-xl p-8 md:p-10 text-white flex justify-between items-center shadow-lg">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-medium font-merriweather">{trainer.name || trainer.username}</h1>
                    <p className="text-gray-300 font-medium opacity-80">
                        {classTitle} <span className="mx-2">|</span> Instructor
                    </p>
                </div>
                {initialFeedback?.isEdited && (
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                        <History size={16} className="text-[#DAEE49]" />
                        <span className="text-xs font-medium uppercase tracking-widest text-[#DAEE49]">Edited</span>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl p-6 md:p-12 shadow-sm border border-white/50 space-y-12">
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

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <button
                        onClick={handleClearClick}
                        disabled={isClearing || !initialFeedback}
                        className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Trash2 size={16} />
                        Clear All Data
                    </button>

                    <div className="flex justify-end items-center gap-10">
                        <button
                            onClick={() => router.back()}
                            className="text-sm font-medium text-gray-500 hover:text-[#1C3A37] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#DAEE49] hover:bg-[#C9D942] disabled:opacity-50 text-[#1C3A37] font-black py-4 px-16 rounded-full transition-all shadow-md hover:shadow-lg uppercase tracking-widest text-xs min-w-[180px]"
                        >
                            {isSaving ? "Saving..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isClearModalOpen}
                title="Clear Feedback Data"
                message="Are you sure you want to clear all feedback data on this page? This action cannot be undone."
                onConfirm={handleConfirmClear}
                onCancel={() => setIsClearModalOpen(false)}
                isLoading={isClearing}
                confirmText="Clear"
                cancelText="Cancel"
            />
        </div>
    );
}
