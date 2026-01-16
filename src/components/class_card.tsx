"use client"

import { useRouter } from 'next/navigation';

import { Clock, BarChart, Users, ChevronRight } from 'lucide-react';

interface ClassCardProp {
    id : string,
    imageUrl?: string;
    title: string;
    duration: number;
    level: string;
    capacity: number;
    description: string;
    price: number;
}

export default function ClassCard({ 
    id, imageUrl, title, duration, level, capacity, description, price 
}: ClassCardProp) {
    const router = useRouter()
    
    return (
        <div className="flex flex-col bg-white rounded-[2rem] p-5 shadow-xl border border-gray-100 w-full max-w-[400px]">
            {/* Image Container */}
            <div className="mb-4">
                <img
                    src={imageUrl || "/example/dummy.png"}
                    alt={title}
                    className="h-56 w-full object-cover rounded-[1.5rem]"
                />
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow gap-3">
                <h3 className="font-bold text-xl text-gray-900 leading-tight">
                    {title}
                </h3>

                {/* Info Row - Using Lucide Icons */}
                <div className="flex justify-between items-center text-gray-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                        {duration} Jam
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <BarChart className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                        {level}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <Users className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                        {capacity.toLocaleString('id-ID')} Peserta
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-lg">
                    Rp{price.toLocaleString('id-ID')}/bulan
                </span>
                
                <button 
                    onClick={() => router.push(`/courses/${id}`)}
                    className="flex items-center gap-2 bg-[#D9F066] hover:bg-[#CCE44B] transition-all py-2 px-5 rounded-full font-bold text-sm shadow-sm active:scale-95"
                >
                    See Details
                    <ChevronRight className="w-4 h-4" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}