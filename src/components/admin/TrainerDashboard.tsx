"use client"

import Image from 'next/image';
import { DashboardData } from '@/app/actions/dashboard';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ClassSection from './dashboard/ClassSection';
import AssignmentSection from './dashboard/AssignmentSection';
import AnalyticsSection from './dashboard/AnalyticsSection';

interface DashboardProps {
    data: DashboardData;
    permissions: Record<string, boolean>;
}

export default function TrainerDashboard({ data, permissions }: DashboardProps) {
    const router = useRouter();

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
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1C3A37] tracking-tight">
                        Welcome, {data.user.name.split(' ')[0]}!
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Main Content Area - 7 columns */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Active Courses */}
                        <ClassSection 
                            classes={data.classes} 
                            canEditClass={permissions['Class_CREATE_UPDATE_CLASS']} 
                            canDeleteClass={permissions['Class_DELETE_CLASS']} 
                        />

                        {/* Assignments */}
                        <AssignmentSection assignments={data.assignments} canGrade={true} isAdmin={true} />
                    </div>

                    {/* Right Area - 5 columns */}
                    <div className="lg:col-span-5 space-y-10">
                        {/* Stats Boxes (2x2) */}
                        <div className="grid grid-cols-2 gap-6">
                            <div onClick={() => router.push('/assignment')} className="bg-[#5C8D89] rounded-3xl p-8 text-white relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">{data.stats.ungradedAssignments}</span>
                                    <p className="text-sm font-light opacity-90 leading-tight pr-4">
                                        <strong className="font-bold">Assignments</strong> has not been graded
                                    </p>
                                </div>
                            </div>
                            <div onClick={() => router.push('/assignment')} className="bg-[#E4E9BD] rounded-3xl p-8 text-[#1C3A37] relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#1C3A37]/20 flex items-center justify-center hover:bg-black/5 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">{data.stats.ungradedExercises}</span>
                                    <p className="text-sm font-light opacity-80 leading-tight pr-4">
                                        <strong className="font-bold">Exercises</strong> has not been graded
                                    </p>
                                </div>
                            </div>
                            <div onClick={() => router.push('/feedback')} className="bg-[#BED175] rounded-3xl p-8 text-[#1C3A37] relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#1C3A37]/20 flex items-center justify-center hover:bg-black/5 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">{data.stats.uncheckedFeedback}</span>
                                    <p className="text-sm font-light opacity-80 leading-tight pr-4">
                                        <strong className="font-bold">Feedback</strong> has not been checked
                                    </p>
                                </div>
                            </div>
                            <div onClick={() => router.push('/feedback')} className="bg-[#5C718D] rounded-3xl p-8 text-white relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">{data.stats.uncheckedReflections}</span>
                                    <p className="text-sm font-light opacity-90 leading-tight pr-4">
                                        <strong className="font-bold">Learner reflection</strong> has not been checked
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-6">
                            <button onClick={() => router.push('/analytics')} className="bg-[#D9F55C] hover:bg-[#c6e350] rounded-2xl p-6 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95 group">
                                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <Image src="/icons/Classroom.svg" alt="Analytics" width={24} height={24} />
                                </div>
                                <span className="font-bold text-[#1C3A37] text-sm text-center leading-tight">My Analytics<br />& Report</span>
                            </button>
                            <button onClick={() => router.push('/classes')} className="flex bg-[#D9F55C] hover:bg-[#c6e350] rounded-2xl p-6 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95 group">
                                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <Image src="/icons/Task.svg" alt="Presence" width={24} height={24} />
                                </div>
                                <span className="font-bold text-[#1C3A37] text-sm text-center leading-tight">Student<br />Presence</span>
                            </button>
                        </div>

                        {/* Learner Analytics & Report */}
                        <AnalyticsSection data={data.analytics} />
                    </div>
                </div>
            </div>
        </div>
    );
}

