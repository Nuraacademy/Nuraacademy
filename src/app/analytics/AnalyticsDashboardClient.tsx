"use client"

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar/sidebar";
import Image from "next/image";
import { Users, BarChart3, MessageSquare, Briefcase } from "lucide-react";
import { AnalyticsCard, AnalyticsReportType } from "@/components/ui/card/analytics_card";

interface AnalyticsDashboardClientProps {
    stats: {
        enrollmentCount: number;
        classCount: number;
        feedbackCount: number;
        discussionCount: number;
    }
}

export default function AnalyticsDashboardClient({ stats }: AnalyticsDashboardClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const statItems = [
        { label: 'Total Enrollment', value: stats.enrollmentCount, icon: <Users size={18} />, color: 'bg-blue-100/50 text-blue-600' },
        { label: 'Classes Running', value: stats.classCount, icon: <Briefcase size={18} />, color: 'bg-[#DAEE49]/30 text-[#1C3A37]' },
        { label: 'Student Feedbacks', value: stats.feedbackCount, icon: <MessageSquare size={18} />, color: 'bg-purple-100/50 text-purple-600' },
    ];

    const reports: { title: string, type: AnalyticsReportType, description: string, href: string }[] = [
        {
            title: 'Trainer Analytics',
            type: 'Trainer',
            description: 'Evaluate instructor performance, subject mastery, and communication scores from students.',
            href: '/analytics/trainer'
        },
        {
            title: 'Class Analytics',
            type: 'Class',
            description: 'Batch-level performance metrics, overall progress, and group collaboration results.',
            href: '/analytics/classes'
        },
        {
            title: 'Learner Analytics',
            type: 'Learner',
            description: 'Deep dive into individual student progress, assignment results, and grade history.',
            href: '/analytics/user'
        }
    ];

    return (
        <main className={`relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 ${isSidebarOpen ? "md:pl-80" : "md:pl-8"}`}>
            {/* Sidebar */}
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Background Polygons */}
            <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
                <Image
                    src="/background/PolygonBGTop.svg"
                    alt=""
                    className="absolute top-0 left-0 w-auto h-[40rem] opacity-40"
                    width={500}
                    height={500}
                    priority
                />
                <Image
                    src="/background/PolygonBGBot.svg"
                    alt=""
                    className="absolute bottom-0 right-0 w-auto h-[40rem] opacity-40"
                    width={500}
                    height={500}
                />
            </div>

            {/* Content Container */}
            <div className="text-black md:px-12 py-6 space-y-10 w-full max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-medium">
                    Analytics
                </h1>

                {/* Stats Summary Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-sm">
                    {statItems.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-4 px-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-black">{stat.value}</span>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                            {idx < statItems.length - 1 && (
                                <div className="hidden md:block ml-auto h-8 w-[1px] bg-gray-200" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Report List Grid */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-medium text-gray-400">Regional Reports</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {reports.map((report, idx) => (
                            <AnalyticsCard
                                key={idx}
                                title={report.title}
                                type={report.type}
                                description={report.description}
                                href={report.href}
                            />
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-[#1C3A37] rounded-3xl p-10 text-white flex flex-col items-start gap-4 shadow-xl mt-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAEE49]/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                    <h3 className="text-2xl font-bold">Data Management Notice</h3>
                    <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
                        The analytics presented here are derived from real-time classroom data. 
                        Please ensure data privacy protocols are followed when sharing individual learner results with external stakeholders.
                    </p>
                </div>
            </div>
        </main>
    );
}
