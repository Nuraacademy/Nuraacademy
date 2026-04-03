"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CurriculaSectionProps {
    curricula: {
        id: number;
        title: string;
    }[];
}

export default function CurriculaSection({ curricula }: CurriculaSectionProps) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Curricula</h2>
                <button 
                    onClick={() => router.push('/curricula')} 
                    className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                    See All
                </button>
            </div>
            <div className="space-y-4">
                {curricula.slice(0, 3).map((item) => (
                    <div 
                        key={item.id} 
                        className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => router.push(`/curricula/${item.id}/edit`)}
                    >
                        <div className="flex rounded-xl">
                            <Image src="/icons/Curricula.svg" alt="Curricula" width={40} height={40} />
                        </div>
                        <h3 className="text-base font-medium text-[#1C3A37]">{item.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
