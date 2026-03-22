"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface InstructorSectionProps {
    trainers: any[];
}

export default function InstructorSection({ trainers }: InstructorSectionProps) {
    const router = useRouter();

    return (
        <section className="bg-white rounded-[40px] p-4 md:p-6 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Instructor & Trainer</h2>
                <button
                    onClick={() => router.push('/admin/users?filter=staff')}
                    className="text-sm font-medium text-gray-400 hover:text-[#1C3A37] transition-colors"
                >
                    See All
                </button>
            </div>
            <div className="space-y-6">
                {trainers.slice(0, 3).map((trainer, idx) => (
                    <React.Fragment key={trainer.id}>
                        <div className="flex items-center gap-5 group cursor-pointer">
                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all border-2 border-white">
                                {trainer.image ? (
                                    <Image
                                        src={trainer.image}
                                        alt={trainer.name}
                                        fill
                                        className='object-cover'
                                    />
                                ) : (
                                    <Image
                                        src={`/example/human.png`}
                                        alt={trainer.name}
                                        fill
                                        className='object-cover'
                                    />
                                )}
                            </div>
                            <div>
                                <h4 className="text-base md:text-lg font-medium text-[#1C3A37] group-hover:text-[#2D5A54] transition-colors">{trainer.name}</h4>
                                <p className="text-sm md:text-base text-gray-400 font-medium">{trainer.role}</p>
                            </div>
                        </div>
                        {idx < trainers.slice(0, 2).length - 1 && (
                            <div className="h-[1px] bg-gray-100 w-full" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}
