"use client"

import React from 'react';
import Image from 'next/image';

interface InstructorSectionProps {
    trainers: any[];
}

export default function InstructorSection({ trainers }: InstructorSectionProps) {
    return (
        <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-[#1C3A37]">Instructor & Trainer</h2>
                <button className="text-sm font-bold text-gray-400 hover:text-[#1C3A37] transition-colors">See All</button>
            </div>
            <div className="space-y-6">
                {trainers.slice(0, 4).map((trainer) => (
                    <div key={trainer.id} className="flex items-center gap-5 group cursor-pointer">
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-3xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                            <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trainer.username}`} alt={trainer.name} fill />
                        </div>
                        <div>
                            <h4 className="text-sm md:text-base font-bold text-[#1C3A37] group-hover:text-[#2D5A54]">{trainer.name}</h4>
                            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">{trainer.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
