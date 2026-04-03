"use client"

import Image from 'next/image';
import { DashboardData } from '@/app/actions/dashboard';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardProps {
    data: DashboardData;
}

export default function TrainerDashboard({ data }: DashboardProps) {
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
                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 ring-1 ring-black/5">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h2 className="text-2xl font-semibold text-[#1C3A37]">Active Courses</h2>
                                <button className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">See All</button>
                            </div>
                            <div className="space-y-4">
                                {data.classes.slice(0, 3).map((item) => (
                                    <div key={item.id} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#D9F55C] hover:bg-gray-50/50 transition-all duration-300">
                                        <h3 className="text-lg font-semibold text-[#1C3A37] mb-2 group-hover:text-black">{item.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                            {item.description || "Memahami konsep dasar pemrograman, cara kerja program (input-process-output), serta pengenalan Google Colab & environment Python"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Placement Test & Projects Bottom Half */}
                        <div className="grid grid-cols-1 gap-10">
                            {/* Placement Test */}
                            <div>
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <h2 className="text-2xl font-semibold text-[#1C3A37]">Placement Test</h2>
                                    <button className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">See All</button>
                                </div>
                                <div className="space-y-4">
                                    {data.assignments.filter(a => a.type === "PLACEMENT" || a.type === "PRETEST").slice(0, 2).map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <Image src="/icons/sidebar/SubTest.svg" alt="Test" width={24} height={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-[#1C3A37]">{item.title}</h3>
                                                        <span className="px-3 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Individual</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.className} | {item.courseName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {data.assignments.filter(a => a.type === "PLACEMENT" || a.type === "PRETEST").length === 0 && (
                                        <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-gray-400 italic">No placement tests found</div>
                                    )}
                                </div>
                            </div>

                            {/* Projects */}
                            <div>
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <h2 className="text-2xl font-semibold text-[#1C3A37]">Projects</h2>
                                    <button className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">See All</button>
                                </div>
                                <div className="space-y-4">
                                    {data.assignments.filter(a => a.type === "PROJECT").slice(0, 1).map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <Image src="/icons/sidebar/SubFinalProject.svg" alt="Project" width={24} height={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-[#1C3A37]">{item.title}</h3>
                                                        <span className="px-3 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Group</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.className} | {item.courseName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {data.assignments.filter(a => a.type === "PROJECT").length === 0 && (
                                        <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-gray-400 italic">No final projects found</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Area - 5 columns */}
                    <div className="lg:col-span-5 space-y-10">
                        {/* Stats Boxes (2x2) */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-[#5C8D89] rounded-3xl p-8 text-white relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">45</span>
                                    <p className="text-sm font-light opacity-90 leading-tight pr-4">
                                        <strong className="font-bold">Assignments</strong> has not been graded
                                    </p>
                                </div>
                            </div>
                            <div className="bg-[#E4E9BD] rounded-3xl p-8 text-[#1C3A37] relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#1C3A37]/20 flex items-center justify-center hover:bg-black/5 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">33</span>
                                    <p className="text-sm font-light opacity-80 leading-tight pr-4">
                                        <strong className="font-bold">Exercises</strong> has not been graded
                                    </p>
                                </div>
                            </div>
                            <div className="bg-[#BED175] rounded-3xl p-8 text-[#1C3A37] relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#1C3A37]/20 flex items-center justify-center hover:bg-black/5 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">43</span>
                                    <p className="text-sm font-light opacity-80 leading-tight pr-4">
                                        <strong className="font-bold">Feedback</strong> has not been checked
                                    </p>
                                </div>
                            </div>
                            <div className="bg-[#5C718D] rounded-3xl p-8 text-white relative flex flex-col justify-between aspect-[1.1] group cursor-pointer hover:shadow-xl transition-all">
                                <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div>
                                    <span className="text-5xl font-bold block mb-4">24</span>
                                    <p className="text-sm font-light opacity-90 leading-tight pr-4">
                                        <strong className="font-bold">Learner reflection</strong> has not been checked
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-6">
                            <button className="bg-[#D9F55C] hover:bg-[#c6e350] rounded-2xl p-6 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95 group">
                                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <Image src="/icons/sidebar/Report.svg" alt="Analytics" width={24} height={24} />
                                </div>
                                <span className="font-bold text-[#1C3A37] text-sm text-center leading-tight">My Analytics<br/>& Report</span>
                            </button>
                            <button className="bg-[#D9F55C] hover:bg-[#c6e350] rounded-2xl p-6 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95 group">
                                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <Image src="/icons/sidebar/Class.svg" alt="Presence" width={24} height={24} />
                                </div>
                                <span className="font-bold text-[#1C3A37] text-sm text-center leading-tight">Student<br/>Presence</span>
                            </button>
                        </div>

                        {/* Learner Analytics & Report */}
                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 ring-1 ring-black/5">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h2 className="text-2xl font-semibold text-[#1C3A37]">Learner Analytics & Report</h2>
                                <button className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">See All</button>
                            </div>
                            <div className="space-y-4">
                                {data.analytics.slice(0, 2).map((learner) => (
                                    <div key={learner.id} className="p-4 rounded-2xl border border-gray-50 flex items-center justify-between group hover:bg-gray-50 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#D9F55C]/20 border border-[#D9F55C]/40 overflow-hidden relative">
                                                <Image src={learner.image || "/images/instructor-default.png"} alt={learner.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1C3A37] group-hover:text-black">{learner.name}</h4>
                                                <p className="text-xs text-gray-400 font-medium">{learner.className}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

