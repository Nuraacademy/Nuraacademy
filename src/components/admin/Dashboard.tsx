"use client"

import React from 'react';
import Image from 'next/image';
import { DashboardData } from '@/app/actions/dashboard';
import ClassSection from './dashboard/ClassSection';
import TimelineSection from './dashboard/TimelineSection';
import InstructorSection from './dashboard/InstructorSection';
import StatSection from './dashboard/StatSection';
import AssignmentSection from './dashboard/AssignmentSection';
import AnalyticsSection from './dashboard/AnalyticsSection';

interface DashboardProps {
    data: DashboardData;
}

export default function AdminDashboard({ data }: DashboardProps) {


    return (
        <div className="min-h-screen bg-[#F9F9EE] relative overflow-hidden ">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full md:w-[60%] h-[40rem] pointer-events-none opacity-40">
                <Image
                    src="/background/PolygonBGTop.svg"
                    alt="Background Top"
                    fill
                    className="object-cover object-left-top"
                    priority
                />
            </div>
            <div className="absolute bottom-0 right-0 w-full md:w-[60%] h-[40rem] pointer-events-none opacity-40">
                <Image
                    src="/background/PolygonBGBot.svg"
                    alt="Background Bottom"
                    fill
                    className="object-cover object-right-bottom"
                />
            </div>

            <div className="relative z-10 px-4 md:px-16 py-10 md:py-16 space-y-12">
                {/* Header Welcome Section */}
                <header className="space-y-2">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#1C3A37] tracking-tight">
                        Welcome, {data.user.name}!
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Main Content Area - 8 columns */}
                    <div className="lg:col-span-8 space-y-12">

                        <ClassSection classes={data.classes} />

                        <TimelineSection schedule={data.schedule} />

                        {/* Bottom Row - Combined Stats and Lists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <InstructorSection trainers={data.trainers} />
                            <StatSection totalLearners={data.stats.totalLearners} />
                        </div>
                    </div>

                    {/* Sidebar Area - 4 columns */}
                    <div className="lg:col-span-4 space-y-12">
                        <AssignmentSection assignments={data.assignments} />
                        <AnalyticsSection data={data.analytics} />
                    </div>
                </div>
            </div>
        </div>
    );
}
