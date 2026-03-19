"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { savePeerFeedback, clearPeerFeedback, getPeerFeedback } from '@/app/actions/peer_feedback';
import { toast } from 'sonner';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { Bold, Italic, Link2, Image as ImageIcon, Trash2, Pencil, History } from 'lucide-react';

interface PeerFeedbackFormClientProps {
    data: any; // evaluatee enrollment
    evaluatorEnrollmentId: number;
    classId: number;
    initialFeedback?: any;
}

export default function PeerFeedbackFormClient({ data, evaluatorEnrollmentId, classId, initialFeedback }: PeerFeedbackFormClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [scores, setScores] = useState({
        cooperation: initialFeedback?.cooperation || 80,
        attendance: initialFeedback?.attendance || 80,
        taskCompletion: initialFeedback?.taskCompletion || 80,
        initiatives: initialFeedback?.initiatives || 80,
        communication: initialFeedback?.communication || 80,
    });

    const handleSave = async () => {
        setIsSaving(true);
        const res = await savePeerFeedback({
            evaluatorId: evaluatorEnrollmentId,
            evaluateeId: data.id,
            classId: classId,
            ...scores
        });

        if (res.success) {
            toast.success("Feedback saved successfully!");
            router.push(`/classes/${classId}/analytics`);
        } else {
            toast.error("Failed to save feedback: " + res.error);
        }
        setIsSaving(false);
    };

    const handleClear = async () => {
        if (!confirm("Are you sure you want to clear all feedback data on this page?")) return;
        
        setIsClearing(true);
        const res = await clearPeerFeedback(evaluatorEnrollmentId, data.id, classId);

        if (res.success) {
            toast.success("Feedback cleared successfully!");
            setScores({
                cooperation: 0,
                attendance: 0,
                taskCompletion: 0,
                initiatives: 0,
                communication: 0,
            });
        } else {
            toast.error("Failed to clear feedback: " + res.error);
        }
        setIsClearing(false);
    };

    const sections = [
        { key: 'cooperation', label: 'Cooperation', description: 'Works well with team members and supports group collaboration.' },
        { key: 'attendance', label: 'Attendance', description: 'Consistently attends and participates in team meetings or activities.' },
        { key: 'taskCompletion', label: 'Task Completion', description: 'Completes assigned tasks according to expectations.' },
        { key: 'initiatives', label: 'Initiatives', description: 'Shows initiative by proactively starting or helping with tasks.' },
        { key: 'communication', label: 'Communication', description: 'Communicates task progress, ideas, and information clearly with the team.' },
    ];

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 font-sans">
            <Breadcrumb 
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Report & Analytics', href: `/classes/${classId}/analytics` },
                    { label: data.class.title, href: '#' },
                    { label: `Peer Feedback: ${data.user.name || data.user.username}`, href: '#' },
                ]} 
            />

            <div className="bg-[#1C3A37] rounded-[24px] p-8 md:p-10 text-white flex justify-between items-center shadow-lg">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{data.user.name || data.user.username}</h1>
                    <p className="text-gray-300 font-medium opacity-80">{data.class.title}</p>
                </div>
                {initialFeedback?.isEdited && (
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                        <History size={16} className="text-[#DAEE49]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DAEE49]">Edited</span>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.key} className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-white/50 space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-lg md:text-xl font-bold text-[#1C3A37]">{section.label}</h2>
                            <p className="text-sm text-gray-500">{section.description}</p>
                        </div>

                        <div className="space-y-10">
                            {/* Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-[#1C3A37]">Score</span>
                                    <span className="text-sm font-bold text-gray-400">{scores[section.key as keyof typeof scores]}</span>
                                </div>
                                <div className="relative flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={scores[section.key as keyof typeof scores]}
                                        onChange={(e) => setScores({ ...scores, [section.key]: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#1C3A37]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-8">
                <button 
                    onClick={handleClear}
                    disabled={isClearing || !initialFeedback}
                    className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Trash2 size={16} />
                    Clear All Data
                </button>
                
                <div className="flex justify-end items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="text-sm font-bold text-gray-400 hover:text-[#1C3A37] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#DAEE49] hover:bg-[#C9D942] disabled:opacity-50 text-[#1C3A37] font-black py-4 px-12 rounded-full transition-all shadow-md hover:shadow-lg uppercase tracking-widest text-xs"
                    >
                        {isSaving ? "Saving..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}
