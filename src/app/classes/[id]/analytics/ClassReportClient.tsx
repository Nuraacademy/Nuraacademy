"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { Zap, Users } from 'lucide-react';
import TitleCard from '@/components/ui/card/title_card';
import Link from 'next/link';
import AmPieChart from '@/components/ui/charts/AmPieChart';
import AmBarChart from '@/components/ui/charts/AmBarChart';
import AmLineChart from '@/components/ui/charts/AmLineChart';

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
        <main className="min-h-screen bg-[#F9F9EE] text-[#1C3A37]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/classes' },
                            { label: classData.title, href: `/classes/${classData.id}/overview` },
                            { label: 'Report & Analytics', href: '#' },
                        ]}
                    />
                </div>

                {/* Header */}
                <TitleCard
                    title="Report & Analytics"
                    description={`${classData.title} | Group: ${groupName}`}
                />

                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-[#1C3A37]/5 flex flex-col gap-16">

                    {/* Group Members */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-lg font-medium border-l-4 border-[#DAEE49] pl-4 ">Group Members</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                            {groupMembers.map((member: any, idx: number) => {
                                const isMe = member.id === myEnrollment?.id;
                                const displayName = member.user.name || member.user.username;
                                const href = isMe
                                    ? `/classes/${classData.id}/analytics/peer-results`
                                    : `/feedback/peer/${member.id}?classId=${classData.id}`;

                                return (
                                    <div key={member.id} className="flex gap-4 items-baseline group">
                                        <span className="text-xs font-medium text-gray-400">{idx + 1}.</span>
                                        <Link href={href} className="text-sm font-medium text-[#1C3A37] underline decoration-[#DAEE49] underline-offset-4 decoration-2 cursor-pointer hover:text-black transition-colors">
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
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-10">
                        <h2 className="text-lg font-medium tracking-tight border-l-4 border-[#DAEE49] pl-4 ">Class Progress</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-40 h-40">
                                    <AmPieChart
                                        data={[
                                            { category: "Done", value: analytics.progress.courseDone, color: "#1C3A37" },
                                            { category: "Remaining", value: 100 - analytics.progress.courseDone, color: "#F9F9EE" }
                                        ]}
                                        innerRadius={70}
                                        radius={80}
                                        height="160px"
                                        centerLabel={`${analytics.progress.courseDone}%`}
                                        centerSubLabel="Course Done"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-40 h-40">
                                    <AmPieChart
                                        data={[
                                            { category: "Pass", value: analytics.progress.coursePass, color: "#8BB730" },
                                            { category: "Remaining", value: 100 - analytics.progress.coursePass, color: "#F9F9EE" }
                                        ]}
                                        innerRadius={70}
                                        radius={80}
                                        height="160px"
                                        centerLabel={`${analytics.progress.coursePass}%`}
                                        centerSubLabel="Course Pass"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Engagement */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-10">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 ">Engagement</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl px-4">
                            <div className="bg-white border-2 border-gray-100 rounded-xl p-8 flex items-center justify-between shadow-sm hover:border-[#1C3A37]/10 transition-colors">
                                <div className="flex flex-col gap-1">
                                    <span className="text-3xl font-medium text-[#1C3A37]">{analytics.engagement.sesScore}%</span>
                                    <p className="text-[10px] font-medium text-gray-400  tracking-widest">SES Score</p>
                                </div>
                                <div className="w-12 h-12 bg-[#F9F9EE] rounded-xl flex items-center justify-center text-[#1C3A37]">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                            </div>
                            <div className="bg-white border-2 border-gray-100 rounded-xl p-8 flex items-center justify-between shadow-sm hover:border-[#1C3A37]/10 transition-colors">
                                <div className="flex flex-col gap-1">
                                    <span className="text-3xl font-medium text-[#1C3A37]">{analytics.engagement.presence}%</span>
                                    <p className="text-[10px] font-medium text-gray-400  tracking-widest">Presence in Session</p>
                                </div>
                                <div className="w-12 h-12 bg-[#F9F9EE] rounded-xl flex items-center justify-center text-[#1C3A37]">
                                    <Users size={24} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-10">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 ">Performance</h2>
                        </div>
                        <div className="px-4">
                            <AmBarChart
                                data={analytics.performance}
                                categoryField="courseTitle"
                                valueFields={[
                                    { field: "preTest", label: "Pre-Test", color: "#1C3A37" },
                                    { field: "postTest", label: "Post-Test", color: "#8BB730" },
                                    { field: "assignment", label: "Assignment", color: "#DAEE49" }
                                ]}
                                height="400px"
                            />
                        </div>
                    </div>

                    {/* Learning Gain */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-10">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 ">Learning Gain</h2>
                        </div>
                        <div className="px-4">
                            <AmLineChart
                                data={analytics.performance}
                                categoryField="courseTitle"
                                valueField="learningGain"
                                strokeColor="#DAEE49"
                                fillColor="#1C3A37"
                                height="400px"
                            />
                            <p className="mt-4 text-[10px] font-bold text-gray-400 italic text-right px-4">LG = Posttest - Pretest / 100 - Pretest</p>
                        </div>
                    </div>

                    {/* Team Work & Collaboration */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-10">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 ">Team Work & Collaboration</h2>
                        <div className="flex flex-col md:flex-row gap-8 items-center px-4 max-w-5xl">
                            <div className="w-full h-[350px]">
                                <AmPieChart
                                    data={[
                                        { category: "Cooperation", value: analytics.teamwork.cooperation, color: "#1C3A37" },
                                        { category: "Attendance", value: analytics.teamwork.attendance, color: "#005954" },
                                        { category: "Task Completion", value: analytics.teamwork.taskCompletion, color: "#8BB730" },
                                        { category: "Initiatives", value: analytics.teamwork.initiatives, color: "#DAEE49" },
                                        { category: "Communication", value: analytics.teamwork.communication, color: "#C9D942" },
                                    ]}
                                    innerRadius={75}
                                    radius={70}
                                    height="350px"
                                    showLegend={true}
                                    centerLabel={`${analytics.teamwork.cooperation}%`}
                                    centerSubLabel="Cooperation"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Final Project */}
                    <div className="flex flex-col gap-10 border-t border-gray-100 pt-10">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 ">Final Project</h2>
                        <div className="px-4 space-y-4 max-w-4xl">
                            {[
                                { label: 'Problem Understanding', value: analytics.finalProject.problemUnderstanding, color: "#1C3A37" },
                                { label: 'Technical Ability', value: analytics.finalProject.methods, color: "#8BB730" },
                                { label: 'Solution Quality', value: analytics.finalProject.solutionQuality, color: "#C9D942" },
                            ].map((item) => (
                                <div key={item.label} className="grid grid-cols-[180px_1fr_40px] items-center gap-6">
                                    <span className="text-xs font-medium text-[#1C3A37]">{item.label}</span>
                                    <div className="h-4 bg-[#F9F9EE] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-400 text-right">{Math.round(item.value / 10)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

