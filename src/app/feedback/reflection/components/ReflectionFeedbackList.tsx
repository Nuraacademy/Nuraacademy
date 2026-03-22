"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveReflectionFeedback } from '@/app/actions/reflection';
import { toast } from 'sonner';
import { NuraButton } from '@/components/ui/button/button';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { ChevronRight } from 'lucide-react';

interface ReflectionFeedbackListProps {
    classId: string;
    courseId: string;
    data: any;
    reflections: any[];
}

export default function ReflectionFeedbackList({ classId, courseId, data, reflections }: ReflectionFeedbackListProps) {
    const router = useRouter();

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Feedback", href: "#" },
        { label: `${data.course.title} Reflection Feedback`, href: "#" },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8 ">
            <Breadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <div className="bg-[#005954] rounded-[1.5rem] p-6 text-white shadow-sm">
                <h1 className="text-xl font-medium mb-1">{data.course.title} Reflection Feedback</h1>
                <p className="text-sm opacity-90">{data.class.title} <span className="mx-2 opacity-50">|</span> {data.course.title}</p>
            </div>

            {/* List View */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-6">
                <h2 className="text-sm font-medium text-gray-900 px-2">Hasil Refleksi Learners</h2>

                <div className="border border-gray-200 rounded-[2rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-8 py-4 text-xs font-medium text-gray-900 uppercase tracking-wider">Name</th>
                                <th className="px-8 py-4 text-xs font-medium text-gray-900 uppercase tracking-wider text-right">Feedback</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reflections.map((reflection) => (
                                <tr
                                    key={reflection.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => router.push(`/feedback/reflection/detail/${reflection.id}`)}
                                >
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium text-gray-700">{reflection.user.name || reflection.user.username}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            className={`px-6 py-1.5 rounded-full text-[10px] font-medium transition-colors ${reflection.feedback ? 'bg-[#D9F55C] text-black' : 'bg-[#D9F55C] text-black'
                                                }`}
                                        >
                                            Feedback
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reflections.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-8 py-10 text-center text-gray-400 text-sm italic">
                                        No reflections submitted yet.
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
