"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { savePeerFeedback, clearPeerFeedback } from '@/app/actions/peer_feedback';
import { toast } from 'sonner';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { FeedbackCriteriaField } from '@/components/ui/feedback/FeedbackCriteriaField';
import { ConfirmModal } from '@/components/ui/modal/confirmation_modal';
import Image from 'next/image';
import TitleCard from '@/components/ui/card/title_card';
import { NuraButton } from '@/components/ui/button/button';

interface PeerFeedbackFormClientProps {
    data: any; // evaluatee enrollment
    evaluatorEnrollmentId: number;
    classId: number;
    initialFeedback?: any;
    groupName: string;
}

export default function PeerFeedbackFormClient({ data, evaluatorEnrollmentId, classId, initialFeedback, groupName }: PeerFeedbackFormClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    const formatScore = (val: number | undefined | null, defaultScore: number) => {
        if (val === undefined || val === null) return defaultScore;
        // If the existing score is > 10, assume it was on a 0-100 scale and divide by 10
        return val > 10 ? Math.round(val / 10) : val;
    };

    const [formData, setFormData] = useState({
        cooperation: formatScore(initialFeedback?.cooperation, 8),
        cooperationFeedback: initialFeedback?.cooperationFeedback || "",
        attendance: formatScore(initialFeedback?.attendance, 8),
        attendanceFeedback: initialFeedback?.attendanceFeedback || "",
        taskCompletion: formatScore(initialFeedback?.taskCompletion, 8),
        taskCompletionFeedback: initialFeedback?.taskCompletionFeedback || "",
        initiatives: formatScore(initialFeedback?.initiatives, 8),
        initiativesFeedback: initialFeedback?.initiativesFeedback || "",
        communication: formatScore(initialFeedback?.communication, 8),
        communicationFeedback: initialFeedback?.communicationFeedback || "",
    });

    const handleSave = async () => {
        setIsSaving(true);
        const res = await savePeerFeedback({
            evaluatorId: evaluatorEnrollmentId,
            evaluateeId: data.id,
            classId: classId,
            ...formData
        });

        if (res.success) {
            toast.success("Feedback saved successfully!");
            router.push(`/classes/${classId}/analytics`);
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
        const res = await clearPeerFeedback(evaluatorEnrollmentId, data.id, classId);

        if (res.success) {
            toast.success("Feedback cleared successfully!");
            setFormData({
                cooperation: 0,
                cooperationFeedback: "",
                attendance: 0,
                attendanceFeedback: "",
                taskCompletion: 0,
                taskCompletionFeedback: "",
                initiatives: 0,
                initiativesFeedback: "",
                communication: 0,
                communicationFeedback: "",
            });
        } else {
            toast.error("Failed to clear feedback: " + res.error);
        }
        setIsClearing(false);
        setIsClearModalOpen(false);
    };

    const sections = [
        { key: 'cooperation', label: 'Kerjasama (Cooperation)', description: 'Works well with team members and supports group collaboration.' },
        { key: 'attendance', label: 'Kehadiran (Attendance)', description: 'Consistently attends and participates in team meetings or activities.' },
        { key: 'taskCompletion', label: 'Penyelesaian tugas (Task completion)', description: 'Completes assigned tasks according to expectations.' },
        { key: 'initiatives', label: 'Inisiatif (Initiatives)', description: 'Shows initiative by proactively starting or helping with tasks.' },
        { key: 'communication', label: 'Komunikasi (Communication)', description: 'Communicates task progress, ideas, and information clearly with the team.' },
    ];

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Report & Analytics', href: `/classes/${classId}/analytics` },
                    { label: data.class.title, href: '#' },
                    { label: `Peer Feedback: ${data.user.name || data.user.username}`, href: '#' },
                ]}
            />
            <TitleCard
                title={data.user.name || data.user.username}
                description={`${data.class.title} | ${groupName}`}
                actions={initialFeedback?.isEdited && (
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                      
                        <span className="text-xs font-medium uppercase tracking-widest text-[#DAEE49]">Edited</span>
                    </div>
                )}
            />
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
                    <NuraButton
                        label="Clear All Data"
                        variant="secondary"
                        onClick={handleClearClick}
                        disabled={isClearing || !initialFeedback}
                        className="text-red-400 hover:text-red-600 border-red-400 hover:border-red-600"
                    />

                    <div className="flex justify-end items-center gap-10">
                        <NuraButton
                            onClick={() => router.back()}
                            label="Cancel"
                            variant="secondary"
                        />
                        <NuraButton
                            onClick={handleSave}
                            disabled={isSaving}
                            label={isSaving ? "Saving..." : "Submit"}
                        />
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
