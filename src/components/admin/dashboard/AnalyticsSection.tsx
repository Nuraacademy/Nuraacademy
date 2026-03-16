"use client"

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface AnalyticsSectionProps {
    data: any[];
}

export default function AnalyticsSection({ data }: AnalyticsSectionProps) {
    return (
        <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-[#1C3A37]">Analytics</h2>
                <button className="text-sm font-bold text-gray-400 hover:text-[#1C3A37] transition-colors flex items-center gap-1">
                    See All <ChevronRight size={16} />
                </button>
            </div>
            
            <div className="space-y-6">
                {data.map((learner) => (
                    <div key={learner.id} className="flex items-center gap-4 group cursor-pointer p-2 rounded-[24px] hover:bg-gray-50 transition-colors">
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-sm">
                            <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${learner.name}`} alt={learner.name} fill />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-[#1C3A37] group-hover:text-[#2D5A54]">{learner.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider line-clamp-1">{learner.className}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
