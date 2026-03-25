"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import TitleCard from '@/components/ui/card/title_card';
import AmBarChart from '@/components/ui/charts/AmBarChart';

interface ClassFeedbackAnalyticsProps {
    data: {
        className: string;
        metrics: {
            courseStructure: number;
            learningEnvironment: number;
            materialQuality: number;
            practicalRelevance: number;
            technicalSupport: number;
        };
        details: {
            courseStructure: string[];
            learningEnvironment: string[];
            materialQuality: string[];
            practicalRelevance: string[];
            technicalSupport: string[];
        };
        totalFeedbacks: number;
    };
    classId: number;
}

export default function ClassFeedbackAnalyticsClient({ data, classId }: ClassFeedbackAnalyticsProps) {
    const { metrics, details, className, totalFeedbacks } = data;

    const metricsData = [
        { label: 'Course Structure', value: metrics.courseStructure * 10 },
        { label: 'Learning Environment', value: metrics.learningEnvironment * 10 },
        { label: 'Material Quality', value: metrics.materialQuality * 10 },
        { label: 'Practical Relevance', value: metrics.practicalRelevance * 10 },
        { label: 'Technical Support', value: metrics.technicalSupport * 10 },
    ];

    const categoryMap: Record<string, string> = {
        'Course Structure': 'courseStructure',
        'Learning Environment': 'learningEnvironment',
        'Material Quality': 'materialQuality',
        'Practical Relevance': 'practicalRelevance',
        'Technical Support': 'technicalSupport',
    };

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
                            { label: 'Class Feedback', href: '#' },
                        ]}
                    />
                </div>

                {/* Header */}
                <TitleCard
                    title="Class Feedback Analytics"
                    description={`${className} | Total Submissions: ${totalFeedbacks}`}
                />

                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-[#1C3A37]/5 flex flex-col gap-16">

                    {/* Feedback Metrics */}
                    <div className="flex flex-col gap-10">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 uppercase">Overall Ratings</h2>
                        <div className="px-4">
                            <AmBarChart
                                data={metricsData}
                                categoryField="label"
                                valueFields={[
                                    { field: "value", label: "Rate (out of 100%)", color: "#1C3A37" }
                                ]}
                                height="350px"
                            />
                        </div>
                    </div>

                    {/* Feedback Details */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-16">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 uppercase">Student Comments</h2>
                        <div className="bg-[#FDFDF7] rounded-xl p-8 md:p-10 space-y-12 border border-[#1C3A37]/5 shadow-sm mx-4">
                            {metricsData.map((metric, idx) => {
                                const key = categoryMap[metric.label] as keyof typeof details;
                                const comments = details[key] || [];

                                return (
                                    <div key={metric.label} className={`space-y-4 ${idx !== metricsData.length - 1 ? 'border-b border-gray-100 pb-10' : ''}`}>
                                        <h3 className="text-[10px] font-black text-[#1C3A37] uppercase tracking-[0.2em]">{metric.label}</h3>
                                        <div className="space-y-4">
                                            {comments.length > 0 ? (
                                                comments.slice(0, 5).map((comment, cidx) => (
                                                    <p key={cidx} className="text-gray-600 text-sm leading-relaxed italic pl-4 border-l-2 border-gray-100" dangerouslySetInnerHTML={{ __html: comment }} />
                                                ))
                                            ) : (
                                                <p className="text-gray-400 text-[10px] italic pl-4">No specific comments recorded for this category.</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
