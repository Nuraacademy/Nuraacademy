"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { Zap, Users } from 'lucide-react';
import Link from 'next/link';

interface ClassReportClientProps {
    data: any;
}

export default function ClassReportClient({ data }: ClassReportClientProps) {
    const classData = data.raw;
    const analytics = data.data;

    const learners = analytics.enrollmentCount > 0 ? classData.enrollments.map((e: any) => ({
        id: e.id,
        name: e.user.name || e.user.username
    })) : [];

    const groupMembers = data.groupMembers || [];
    const myEnrollment = data.myEnrollment;
    const groupName = data.groupName || "Your Group";

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: classData.title, href: `/classes/${classData.id}/overview` },
                    { label: 'Report & Analytics', href: '#' },
                ]}
            />

            {/* Header */}
            <div className="bg-[#1C3A37] rounded-[24px] p-8 md:p-10 text-white space-y-1 shadow-lg">
                <h1 className="text-2xl md:text-3xl font-medium font-merriweather flex items-center gap-3">
                    Report & Analytics
                </h1>
                <p className="text-gray-300 font-medium opacity-80">
                    {analytics.className} <span className="mx-2">|</span> {groupName}
                </p>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-white/50 space-y-16">

                {/* Group Members */}
                <div className="space-y-6">
                    <h2 className="text-lg font-medium text-[#1C3A37]">{analytics.groupName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {groupMembers.map((member: any, idx: number) => {
                            const isMe = member.id === myEnrollment?.id;
                            const displayName = member.user.name || member.user.username;
                            const href = isMe
                                ? `/classes/${classData.id}/analytics/peer-results`
                                : `/feedback/peer/${member.id}?classId=${classData.id}`;

                            return (
                                <div key={member.id} className="flex gap-4 items-baseline">
                                    <span className="text-xs font-medium text-gray-400">{idx + 1}.</span>
                                    <Link href={href} className="text-sm font-medium text-[#1C3A37] underline decoration-[#DAEE49] underline-offset-4 decoration-2 cursor-pointer hover:text-black">
                                        {displayName} {isMe && "(You)"}
                                    </Link>
                                </div>
                            );
                        })}
                        {groupMembers.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No group members found.</p>
                        )}
                    </div>
                </div>

                {/* Class Progress */}
                <div className="space-y-10 border-t border-gray-100 pt-10">
                    <h2 className="text-lg font-medium text-[#1C3A37]">Class Progress</h2>
                    <div className="flex flex-wrap gap-12 justify-start items-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="50" fill="transparent" stroke="#F9F9EE" strokeWidth="20" />
                                    <circle cx="64" cy="64" r="50" fill="transparent" stroke="#1C3A37" strokeWidth="20"
                                        strokeDasharray={`${2 * Math.PI * 50}`}
                                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - analytics.progress.courseDone / 100)}`}
                                        strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-[#1C3A37]">{analytics.progress.courseDone}%</span>
                                    <span className="text-[10px] font-medium text-gray-400 uppercase">Course Done</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="50" fill="transparent" stroke="#F9F9EE" strokeWidth="20" />
                                    <circle cx="64" cy="64" r="50" fill="transparent" stroke="#DAEE49" strokeWidth="20"
                                        strokeDasharray={`${2 * Math.PI * 50}`}
                                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - analytics.progress.coursePass / 100)}`}
                                        strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-[#1C3A37]">{analytics.progress.coursePass}%</span>
                                    <span className="text-[10px] font-medium text-gray-400 uppercase">Course Pass</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Engagement */}
                <div className="space-y-10 border-t border-gray-100 pt-10">
                    <h2 className="text-lg font-medium text-[#1C3A37]">Engagement</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                        <div className="bg-white border-2 border-gray-100 rounded-[32px] p-8 flex items-center justify-between shadow-sm">
                            <div className="space-y-1">
                                <span className="text-3xl font-black text-[#1C3A37]">{analytics.engagement.sesScore}%</span>
                                <p className="text-xs font-medium text-gray-400 uppercase">SES Score</p>
                            </div>
                            <div className="w-12 h-12 bg-[#F9F9EE] rounded-2xl flex items-center justify-center text-[#1C3A37]">
                                <Zap size={24} fill="currentColor" />
                            </div>
                        </div>
                        <div className="bg-white border-2 border-gray-100 rounded-[32px] p-8 flex items-center justify-between shadow-sm">
                            <div className="space-y-1">
                                <span className="text-3xl font-black text-[#1C3A37]">{analytics.engagement.presence}%</span>
                                <p className="text-xs font-medium text-gray-400 uppercase">Presence in Session</p>
                            </div>
                            <div className="w-12 h-12 bg-[#F9F9EE] rounded-2xl flex items-center justify-center text-[#1C3A37]">
                                <Users size={24} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance */}
                <div className="space-y-10 border-t border-gray-100 pt-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-[#1C3A37]">Performance</h2>
                        <div className="flex gap-4">
                            {[
                                { label: 'Pre-Test', color: 'bg-[#1C3A37]' },
                                { label: 'Post-Test', color: 'bg-[#8BB730]' },
                                { label: 'Assignment', color: 'bg-[#DAEE49]' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-[10px] font-medium text-gray-400 uppercase">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="min-h-64 w-full flex items-end gap-12 px-8 border-b-2 border-gray-100 pb-2 overflow-x-auto relative">
                        {analytics.performance.map((p: any) => (
                            <div key={p.courseTitle} className="flex-grow flex flex-col items-center gap-4 min-w-[120px]">
                                <div className="flex gap-1 items-end h-48 w-full justify-center">
                                    <div className="w-4 bg-[#1C3A37] rounded-t-sm" style={{ height: `${p.preTest}%` }} />
                                    <div className="w-4 bg-[#8BB730] rounded-t-sm" style={{ height: `${p.postTest}%` }} />
                                    <div className="w-4 bg-[#DAEE49] rounded-t-sm" style={{ height: `${p.assignment}%` }} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-400 uppercase text-center max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">{p.courseTitle}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Gain */}
                <div className="space-y-10 border-t border-gray-100 pt-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-[#1C3A37]">Learning Gain</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#DAEE49]" />
                            <span className="text-[10px] font-medium text-gray-400 italic">LG = Posttest - Pretest / 100 - Pretest</span>
                        </div>
                    </div>
                    <div className="min-h-64 w-full relative px-8 overflow-x-auto">
                        <svg className="w-full h-48" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <path
                                d={analytics.performance.map((p: any, i: number, arr: any[]) => {
                                    const x = (i * (1000 / (arr.length > 1 ? arr.length - 1 : 1)));
                                    const y = 200 - (p.learningGain * 200);
                                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="#DAEE49"
                                strokeWidth="3"
                            />
                            {analytics.performance.map((p: any, i: number, arr: any[]) => {
                                const x = (i * (1000 / (arr.length > 1 ? arr.length - 1 : 1)));
                                const y = 200 - (p.learningGain * 200);
                                return <circle key={i} cx={x} cy={y} r="6" fill="#DAEE49" stroke="white" strokeWidth="2" />;
                            })}
                        </svg>
                        <div className="flex justify-between px-0 mt-4">
                            {analytics.performance.map((p: any) => (
                                <span key={p.courseTitle} className="text-[10px] font-medium text-gray-400 uppercase text-center max-w-[80px] overflow-hidden whitespace-nowrap text-ellipsis">{p.courseTitle}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Work & Collaboration */}
                <div className="space-y-10 border-t border-gray-100 pt-10">
                    <h2 className="text-lg font-medium text-[#1C3A37]">Team Work & Collaboration</h2>
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="80" fill="transparent" stroke="#F9F9EE" strokeWidth="24" />
                                <circle cx="96" cy="96" r="80" fill="transparent" stroke="#1C3A37" strokeWidth="24"
                                    strokeDasharray={`${2 * Math.PI * 80}`}
                                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - analytics.teamwork.cooperation / 10)}`}
                                    strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-[#1C3A37]">{analytics.teamwork.cooperation}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cooperation</span>
                            </div>
                        </div>
                        <div className="space-y-4 pt-8">
                            {[
                                { label: 'Cooperation', value: analytics.teamwork.cooperation, color: 'bg-[#1C3A37]' },
                                { label: 'Attendance', value: analytics.teamwork.attendance, color: 'bg-[#1C3A37]' },
                                { label: 'Task Completion', value: analytics.teamwork.taskCompletion, color: 'bg-[#DAEE49]' },
                                { label: 'Initiatives', value: analytics.teamwork.initiatives, color: 'bg-[#DAEE49]' },
                                { label: 'Communication', value: analytics.teamwork.communication, color: 'bg-[#C9D942]' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-xs font-medium text-gray-500">{item.label}: {item.value} / 10</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final Project */}
                <div className="space-y-10 border-t border-gray-100 pt-10">
                    <h2 className="text-lg font-medium text-[#1C3A37]">Final Project</h2>
                    <div className="space-y-6 max-w-3xl">
                        {[
                            { label: 'Problem Understanding', score: analytics.finalProject.problemUnderstanding, color: 'bg-[#1C3A37]' },
                            { label: 'Data Reasoning', score: analytics.finalProject.dataReasoning, color: 'bg-[#1C3A37]' },
                            { label: 'Methods', score: analytics.finalProject.methods, color: 'bg-[#DAEE49]' },
                            { label: 'Insight Quality', score: analytics.finalProject.insightQuality, color: 'bg-[#DAEE49]' },
                            { label: 'Solution Quality', score: analytics.finalProject.solutionQuality, color: 'bg-[#C9D942]' },
                        ].map((metric) => (
                            <div key={metric.label} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                    <span>{metric.label}</span>
                                    <span>{metric.score}%</span>
                                </div>
                                <div className="h-6 bg-gray-50 rounded-full overflow-hidden relative border border-gray-100/50">
                                    <div
                                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${metric.color}`}
                                        style={{ width: `${metric.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
