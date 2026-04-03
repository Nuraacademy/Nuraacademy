"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AnalyticsSectionProps {
    data: any[];
}

export default function AnalyticsSection({ data }: AnalyticsSectionProps) {
    const router = useRouter();

    return (
        <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Analytics</h2>
                <button
                    onClick={() => router.push('/admin/users?filter=learner')}
                    className="text-sm font-medium text-gray-400 hover:text-[#1C3A37] transition-colors"
                >
                    See All
                </button>
            </div>

            <div className="space-y-6">
                {data.slice(0, 3).map((learner, idx) => (
                    <React.Fragment key={learner.id}>
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push(`/analytics/user/${learner.id}`)}>
                            <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-sm border-2 border-white">
                                {learner.image ? (
                                    <Image
                                        src={learner.image}
                                        alt={learner.name}
                                        fill
                                        className='object-cover'
                                    />
                                ) : (
                                    <Image
                                        src={`/example/human.png`}
                                        alt={learner.name}
                                        fill
                                        className='object-cover'
                                    />
                                )}
                            </div>
                            <div className="">
                                <h4 className="text-md font-medium text-[#1C3A37] group-hover:text-[#2D5A54] transition-colors">{learner.name}</h4>
                                <p className="text-sm text-gray-400 font-medium line-clamp-1">{learner.className}</p>
                            </div>
                        </div>
                        {idx < data.slice(0, 3).length - 1 && (
                            <div className="h-[1px] bg-gray-100 w-full" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}
