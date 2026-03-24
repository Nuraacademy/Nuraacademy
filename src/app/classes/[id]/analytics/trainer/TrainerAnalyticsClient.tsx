"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { ThumbsUp, Reply } from 'lucide-react';
import TitleCard from '@/components/ui/card/title_card';
import AmBarChart from '@/components/ui/charts/AmBarChart';

interface TrainerAnalyticsProps {
    data: {
        className: string;
        trainer: {
            id: number;
            name: string | null;
            username: string;
        } | null;
        feedback: {
            mastery: number;
            communication: number;
            engagement: number;
            responsiveness: number;
            motivation: number;
        };
        details: {
            mastery: string[];
            communication: string[];
            engagement: string[];
            responsiveness: string[];
            motivation: string[];
        };
        forum: {
            totalPost: number;
            totalLikes: number;
            totalReply: number;
            avgLikes: number;
            avgReply: number;
        };
    };
    classId: number;
}

export default function TrainerAnalyticsClient({ data, classId }: TrainerAnalyticsProps) {
    const { feedback, details, forum, className, trainer } = data;

    const metricsData = [
        { label: 'Mastery', value: feedback.mastery },
        { label: 'Communication', value: feedback.communication },
        { label: 'Engagement', value: feedback.engagement },
        { label: 'Responsiveness', value: feedback.responsiveness },
        { label: 'Motivation & Inspiration', value: feedback.motivation },
    ];

    return (
        <main className="min-h-screen bg-[#F9F9EE] text-[#1C3A37]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 px-1">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: className, href: `/classes/${classId}/overview` },
                            { label: 'Report & Analytics', href: `/classes/${classId}/analytics` },
                            { label: 'Trainer Analytics', href: '#' },
                        ]}
                    />
                </div>

                {/* Header */}
                <TitleCard
                    title="Report & Analytics"
                    description={`${className} | Trainer: ${trainer?.name || trainer?.username || 'Batch Trainer'}`}
                />

                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-[#1C3A37]/5 flex flex-col gap-16">

                    {/* Feedback Metrics */}
                    <div className="flex flex-col gap-10">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 uppercase">Feedback</h2>
                        <div className="px-4">
                            <AmBarChart
                                data={metricsData}
                                categoryField="label"
                                valueFields={[
                                    { field: "value", label: "Rate (out of 10)", color: "#1C3A37" }
                                ]}
                                height="350px"
                            />
                        </div>
                    </div>

                    {/* Feedback Details */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-16">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 uppercase">Feedback Details</h2>
                        <div className="bg-[#FDFDF7] rounded-xl p-8 md:p-10 space-y-12 border border-[#1C3A37]/5 shadow-sm mx-4">
                            {metricsData.map((metric, idx) => (
                                <div key={metric.label} className={`space-y-4 ${idx !== metricsData.length - 1 ? 'border-b border-gray-100 pb-10' : ''}`}>
                                    <h3 className="text-[10px] font-black text-[#1C3A37] uppercase tracking-[0.2em]">{metric.label}</h3>
                                    <div className="space-y-4">
                                        {(details[metric.label.toLowerCase().split(' ')[0] as keyof typeof details] || []).length > 0 ? (
                                            (details[metric.label.toLowerCase().split(' ')[0] as keyof typeof details] || []).slice(0, 3).map((comment, cidx) => (
                                                <p key={cidx} className="text-gray-600 text-sm leading-relaxed italic pl-4 border-l-2 border-gray-100">
                                                    "{comment}"
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-[10px] italic pl-4">No specific comments recorded for this category.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Forum Section */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-16">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 uppercase">Thread Insight</h2>
                        <div className="space-y-8 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border-2 border-gray-50 rounded-xl p-8 space-y-1 hover:border-[#1C3A37]/5 transition-all shadow-sm">
                                    <span className="text-4xl font-black text-[#1C3A37] tracking-tighter">{forum.totalPost}</span>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Post</p>
                                </div>
                                <div className="bg-white border-2 border-gray-50 rounded-xl p-8 space-y-1 hover:border-[#1C3A37]/5 transition-all shadow-sm">
                                    <span className="text-4xl font-black text-[#1C3A37] tracking-tighter">{forum.totalLikes}</span>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Likes</p>
                                </div>
                                <div className="bg-white border-2 border-gray-50 rounded-xl p-8 space-y-1 hover:border-[#1C3A37]/5 transition-all shadow-sm">
                                    <span className="text-4xl font-black text-[#1C3A37] tracking-tighter">{forum.totalReply}</span>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Reply</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#1C3A37] rounded-xl p-8 flex items-center justify-between text-white shadow-xl shadow-[#1C3A37]/10 group">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#DAEE49] tracking-widest mb-2">
                                            <ThumbsUp size={14} fill="currentColor" /> Average Likes
                                        </div>
                                        <span className="text-5xl font-black tracking-tighter">{forum.avgLikes}</span>
                                    </div>
                                </div>
                                <div className="bg-[#DAEE49] rounded-xl p-8 flex items-center justify-between text-[#1C3A37] shadow-xl shadow-[#DAEE49]/10 group">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60 tracking-widest mb-2">
                                            <Reply size={14} fill="currentColor" /> Average Reply
                                        </div>
                                        <span className="text-5xl font-black tracking-tighter">{forum.avgReply}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
