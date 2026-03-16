"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveLearnerAnalytics } from '@/app/actions/analytics';
import { toast } from 'sonner';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { Bold, Italic, Link2, Image as ImageIcon, Trash2, Pencil } from 'lucide-react';

interface FeedbackFormClientProps {
    data: any;
}

export default function FeedbackFormClient({ data }: FeedbackFormClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const analytics = data.learnerAnalytics;
    const [scores, setScores] = useState({
        cooperationScore: analytics?.cooperationScore || 80,
        cooperationFeedback: analytics?.cooperationFeedback || '',
        attendanceScore: analytics?.attendanceScore || 80,
        attendanceFeedback: analytics?.attendanceFeedback || '',
        taskCompletionScore: analytics?.taskCompletionScore || 80,
        taskCompletionFeedback: analytics?.taskCompletionFeedback || '',
        initiativesScore: analytics?.initiativesScore || 80,
        initiativesFeedback: analytics?.initiativesFeedback || '',
        communicationScore: analytics?.communicationScore || 80,
        communicationFeedback: analytics?.communicationFeedback || '',
    });

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveLearnerAnalytics({
            enrollmentId: data.id,
            ...scores
        });

        if (res.success) {
            toast.success("Feedback saved successfully!");
            router.push(`/analytics/${data.id}`);
        } else {
            toast.error("Failed to save feedback: " + res.error);
        }
        setIsSaving(false);
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
                    { label: 'Report & Analytics', href: '/admin' },
                    { label: data.class.title, href: '#' },
                    { label: `Edit Feedback: ${data.user.name || data.user.username}`, href: '#' },
                ]} 
            />

            <div className="bg-[#1C3A37] rounded-[24px] p-8 md:p-10 text-white space-y-2 shadow-lg">
                <h1 className="text-2xl md:text-3xl font-bold">{data.user.name || data.user.username}</h1>
                <p className="text-gray-300 font-medium opacity-80">{data.class.title}</p>
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
                                    <span className="text-sm font-bold text-gray-400">{scores[`${section.key}Score` as keyof typeof scores]}</span>
                                </div>
                                <div className="relative flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={scores[`${section.key}Score` as keyof typeof scores] as number}
                                        onChange={(e) => setScores({ ...scores, [`${section.key}Score`]: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#1C3A37]"
                                    />
                                </div>
                            </div>

                            {/* Feedback Area */}
                            <div className="space-y-4">
                                <span className="text-sm font-bold text-[#1C3A37]">Feedback</span>
                                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    {/* Toolbar Mock */}
                                    <div className="bg-gray-50 border-b border-gray-100 p-2 flex items-center gap-2">
                                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-gray-400"><Bold size={16} /></button>
                                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-gray-400"><Italic size={16} /></button>
                                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-gray-400"><Link2 size={16} /></button>
                                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-gray-400"><ImageIcon size={16} /></button>
                                        <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-gray-400"><Trash2 size={16} /></button>
                                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-[#1C3A37] bg-white shadow-sm border border-gray-100"><Pencil size={14} /></button>
                                    </div>
                                    <textarea 
                                        className="w-full h-32 bg-white border-none p-6 text-sm text-[#1C3A37] focus:ring-0 outline-none transition-all resize-none placeholder:text-gray-300 placeholder:italic"
                                        placeholder="Feedback"
                                        value={scores[`${section.key}Feedback` as keyof typeof scores] as string}
                                        onChange={(e) => setScores({ ...scores, [`${section.key}Feedback`]: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end items-center gap-6 pt-8">
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
    );
}
