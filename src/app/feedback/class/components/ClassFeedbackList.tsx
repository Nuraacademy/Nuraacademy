"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import TitleCard from '@/components/ui/card/title_card';

interface ClassFeedbackListProps {
    classId: string;
    data: any;
    feedbacks: any[];
}

export default function ClassFeedbackList({ classId, data, feedbacks }: ClassFeedbackListProps) {
    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: "Feedback", href: "/feedback" },
        { label: `${data.class.title} Feedback`, href: "#" },
    ];

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 ">
            <Breadcrumb items={breadcrumbItems} />

            <TitleCard title={`${data.class.title} Feedback`} />

            {/* List View */}
            <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 flex flex-col gap-6">
                <h2 className="text-sm font-medium text-gray-900 px-2">Learner Feedbacks</h2>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-8 py-4 text-xs font-medium text-gray-900 uppercase tracking-wider w-1/4">Learner</th>
                                <th className="px-8 py-4 text-xs font-medium text-gray-900 uppercase tracking-wider">Feedback Content</th>
                                <th className="px-8 py-4 text-xs font-medium text-gray-900 uppercase tracking-wider text-right w-1/4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {feedbacks.map((fb) => (
                                <tr
                                    key={fb.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-8 py-6 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700">{fb.user.name || fb.user.username}</span>
                                            <span className="text-[10px] text-gray-400">@{fb.user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div
                                            className="text-xs text-gray-600 leading-relaxed max-w-2xl rich-text"
                                            dangerouslySetInnerHTML={{ __html: fb.content }}
                                        />
                                    </td>
                                    <td className="px-8 py-6 text-right align-top">
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(fb.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {feedbacks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-8 py-10 text-center text-gray-400 text-sm italic">
                                        No feedbacks submitted yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
