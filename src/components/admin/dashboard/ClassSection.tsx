"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import ClassCard from '@/components/ui/card/class_card';

interface ClassSectionProps {
    classes: any[];
}

export default function ClassSection({ classes }: ClassSectionProps) {
    const router = useRouter();

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-[#1C3A37] flex items-center gap-2">
                    Classes
                </h2>
                <button onClick={() => router.push('/classes')} className="text-sm font-bold text-gray-400 hover:text-[#1C3A37] transition-colors flex items-center gap-1">
                    See All <ChevronRight size={16} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.slice(0, 2).map((cls) => (
                    <ClassCard 
                        key={cls.id}
                        id={cls.id}
                        imageUrl={cls.imgUrl}
                        title={cls.title}
                        method={cls.methods || 'Flipped learning'}
                        scheduleStart={cls.startDate ? new Date(cls.startDate) : undefined}
                        scheduleEnd={cls.endDate ? new Date(cls.endDate) : undefined}
                        description={cls.description || "In-depth learning journey designed for modern industry requirements..."}
                        duration={cls.hours || 0}
                        courses={cls.modules || 0}
                        isEnrolled={true}
                        canEdit={true}
                        canDelete={true}
                        onClick={() => router.push(`/classes/${cls.id}/overview`)}
                    />
                ))}
            </div>
        </section>
    );
}
