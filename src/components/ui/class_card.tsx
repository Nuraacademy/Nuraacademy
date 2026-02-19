"use client"

import { useRouter } from 'next/navigation';
import { Clock, BookText } from 'lucide-react';
import { NuraButton } from './button/button';

interface ClassCardProp {
    id: string,
    imageUrl?: string,
    title: string,
    method: string,
    scheduleStart: Date,
    scheduleEnd: Date,
    description: string,
    duration: number,
    modules: number
}

export default function ClassCard({
    id, imageUrl, title, method, scheduleStart, scheduleEnd, description, duration, modules
}: ClassCardProp) {
    const router = useRouter()

    const formatDate = (date: Date) =>
        date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="flex flex-col bg-white rounded-[2rem] p-5 shadow-xl border border-gray-100 w-full max-w-[400px]">
            {/* Image */}
            <div className="mb-4">
                <img
                    src={imageUrl || "/example/dummy.png"}
                    alt={title}
                    className="h-56 w-full object-cover rounded-[1.5rem]"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow gap-3">
                <h3 className="font-bold text-lg text-gray-900 text-left leading-snug">
                    {title}
                </h3>

                {/* Method & Schedule */}
                <div className="flex justify-between items-start text-gray-700 gap-4">
                    <div className="flex flex-col items-start text-left text-xs">
                        <span className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Method</span>
                        {method}
                    </div>
                    <div className="flex flex-col items-start text-left text-xs">
                        <span className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Schedule</span>
                        {formatDate(scheduleStart)} – {formatDate(scheduleEnd)}
                    </div>
                </div>

                {/* Description */}
                <div className="text-left text-xs text-gray-600">
                    <p className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Description</p>
                    <p className="leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{duration} Hours</span>
                </div>
                <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                    <BookText className="w-4 h-4 text-gray-400" />
                    <span>{modules} Modules</span>
                </div>
                <NuraButton
                    label="Enroll Now"
                    variant="navigate"
                    onClick={() => router.push(`/courses/about/${id}`)}
                />
            </div>
        </div>
    );
}