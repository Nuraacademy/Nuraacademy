"use client"

import { useRouter } from 'next/navigation';

interface TimelineSectionProps {
    schedule: any[];
}

export default function TimelineSection({ schedule }: TimelineSectionProps) {
    const router = useRouter();

    // Grouping by the first class name found in the schedule
    const firstClassName = schedule[0]?.className || "Class Schedule";
    const classSchedule = schedule.filter(item => item.className === firstClassName);

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    return (
        <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-white/50 space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-[#1C3A37]">Timeline</h2>
                <button 
                    onClick={() => router.push('/classes')}
                    className="text-sm font-bold text-gray-400 hover:text-[#1C3A37] transition-colors"
                >
                    See All
                </button>
            </div>
            
            <div className="space-y-8">
                <h3 className="text-base md:text-lg font-bold text-[#1C3A37]">{firstClassName}</h3>
                <div className="relative pb-6 px-4 overflow-x-auto scrollbar-hide">
                    <div className="flex justify-between min-w-[700px] relative">
                        {classSchedule.map((step, idx) => (
                            <div key={step.id || idx} className="flex flex-col items-center gap-6 text-center group cursor-pointer max-w-[140px]">
                                <span className="text-xs">
                                    {formatDate(step.date)}
                                </span>
                                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-white shadow-md transition-all duration-500 group-hover:scale-125 ${idx === 0 ? 'bg-[#1C3A37]' : 'bg-gray-200 group-hover:bg-[#DAEE49]'}`} />
                                <span className="text-xs">
                                    {step.activity}
                                </span>
                            </div>
                        ))}
                        {classSchedule.length === 0 && (
                            <div className="w-full text-center text-gray-400 text-sm py-4">
                                No schedule items available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
