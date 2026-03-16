"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Users, ClipboardCheck } from 'lucide-react';

interface StatSectionProps {
    totalLearners: number;
}

export default function StatSection({ totalLearners }: StatSectionProps) {
    const router = useRouter();

    return (
        <div className="space-y-8">
            {/* Total Learners Card */}
            <div 
                className="bg-[#56817B] rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500 min-h-[180px] md:min-h-[220px] cursor-pointer" 
                onClick={() => router.push('/admin/users')}
            >
                <div className="relative z-10 flex flex-col justify-between h-full space-y-6 md:space-y-8">
                    <div className="flex justify-between items-start">
                        <span className="text-5xl md:text-6xl font-bold tracking-tighter">{totalLearners}</span>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-45 transition-all duration-500">
                            <ArrowUpRight size={20} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <p className="text-white/80 font-bold text-base md:text-lg leading-tight uppercase tracking-widest">Manage<br />user access</p>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
                <button 
                    onClick={() => router.push('/admin/roles')} 
                    className="w-full bg-[#E2F0D9] hover:bg-[#D4E0CD] text-[#1C3A37] font-black py-4 md:py-5 px-8 rounded-3xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md uppercase tracking-widest text-[10px] md:text-xs"
                >
                    <Users size={16} className="md:w-5 md:h-5" /> Manage Access Control
                </button>
                <button 
                    onClick={() => router.push('/admin/users?filter=learner')} 
                    className="w-full bg-[#DAEE49] hover:bg-[#C9D942] text-[#1C3A37] font-black py-4 md:py-5 px-8 rounded-3xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md uppercase tracking-widest text-[10px] md:text-xs"
                >
                    <ClipboardCheck size={16} className="md:w-5 md:h-5" /> Student Presence
                </button>
            </div>
        </div>
    );
}
