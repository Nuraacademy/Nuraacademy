"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { Mail, MessageSquare, ThumbsUp, Reply, Users, Star } from 'lucide-react';
import Image from 'next/image';

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

    const metrics = [
        { label: 'Mastery', value: feedback.mastery, color: 'bg-[#1C3A37]' },
        { label: 'Communication', value: feedback.communication, color: 'bg-[#005954]' },
        { label: 'Engagement', value: feedback.engagement, color: 'bg-[#8BB730]' },
        { label: 'Responsiveness', value: feedback.responsiveness, color: 'bg-[#DAEE49]' },
        { label: 'Motivation & Inspiration', value: feedback.motivation, color: 'bg-[#C9D942]' },
    ];

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: className, href: `/classes/${classId}/overview` },
                    { label: 'Report & Analytics', href: `/classes/${classId}/analytics` },
                    { label: 'Trainer Analytics', href: '#' },
                ]}
            />

            {/* Header */}
            <div className="bg-[#1C3A37] rounded-[24px] p-8 md:p-10 text-white space-y-1 shadow-lg border border-white/10">
                <h1 className="text-2xl md:text-4xl font-black font-merriweather tracking-tight">
                    Report & Analytics
                </h1>
                <p className="text-gray-300 font-medium text-sm tracking-wide opacity-90 uppercase">
                    {className} <span className="mx-3 opacity-30">|</span> Trainer: {trainer?.name || trainer?.username || 'Batch Trainer'}
                </p>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-white/50 space-y-16">

                {/* Feedback Metrics */}
                <div className="space-y-10">
                    <h2 className="text-xl font-black text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4">Feedback</h2>
                    <div className="space-y-8 max-w-5xl">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                                <span className="md:col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {metric.label}
                                </span>
                                <div className="md:col-span-9 h-3 bg-gray-50 rounded-full overflow-hidden relative border border-gray-100/50 shadow-inner">
                                    <div
                                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${metric.color} shadow-lg`}
                                        style={{ width: `${(metric.value / 10) * 100}%` }}
                                    />
                                </div>
                                <span className="md:col-span-1 text-sm font-black text-[#1C3A37] text-right">
                                    {metric.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feedback Details */}
                <div className="space-y-10 border-t border-gray-100 pt-16">
                    <h2 className="text-xl font-black text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4">Feedback Details</h2>
                    <div className="bg-[#FDFDF7] rounded-[32px] p-8 md:p-10 space-y-12 border border-[#1C3A37]/5 shadow-sm">
                        {metrics.map((metric, idx) => (
                            <div key={metric.label} className={`space-y-4 ${idx !== metrics.length - 1 ? 'border-b border-gray-100 pb-10' : ''}`}>
                                <h3 className="text-sm font-black text-[#1C3A37] uppercase tracking-[0.1em]">{metric.label}</h3>
                                <div className="space-y-3">
                                    {(details[metric.label.toLowerCase().split(' ')[0] as keyof typeof details] || []).length > 0 ? (
                                        (details[metric.label.toLowerCase().split(' ')[0] as keyof typeof details] || []).slice(0, 3).map((comment, cidx) => (
                                            <p key={cidx} className="text-gray-600 text-sm leading-relaxed italic">
                                                "{comment}"
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-xs italic">No specific comments recorded for this category.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Forum Section */}
                <div className="space-y-10 border-t border-gray-100 pt-16 ">
                    <h2 className="text-xl font-black text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4">Forum</h2>
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white border-2 border-gray-100 rounded-[32px] p-8 space-y-2 hover:border-[#1C3A37]/10 transition-all shadow-sm">
                                <span className="text-4xl font-black text-[#1C3A37]">{forum.totalPost}</span>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Post</p>
                            </div>
                            <div className="bg-white border-2 border-gray-100 rounded-[32px] p-8 space-y-2 hover:border-[#1C3A37]/10 transition-all shadow-sm">
                                <span className="text-4xl font-black text-[#1C3A37]">{forum.totalLikes}</span>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Likes</p>
                            </div>
                            <div className="bg-white border-2 border-gray-100 rounded-[32px] p-8 space-y-2 hover:border-[#1C3A37]/10 transition-all shadow-sm">
                                <span className="text-4xl font-black text-[#1C3A37]">{forum.totalReply}</span>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Reply</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#1C3A37] rounded-[32px] p-8 flex items-center justify-between text-white shadow-xl shadow-[#1C3A37]/10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#DAEE49] tracking-widest">
                                        <ThumbsUp size={12} fill="currentColor" /> Average Likes
                                    </div>
                                    <span className="text-4xl font-black">{forum.avgLikes}</span>
                                </div>
                            </div>
                            <div className="bg-[#DAEE49] rounded-[32px] p-8 flex items-center justify-between text-[#1C3A37] shadow-xl shadow-[#DAEE49]/10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60 tracking-widest">
                                        <Reply size={12} fill="currentColor" /> Average Reply
                                    </div>
                                    <span className="text-4xl font-black">{forum.avgReply}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
