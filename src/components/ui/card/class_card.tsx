"use client"

import { useRouter } from 'next/navigation';
import { Clock, BookText } from 'lucide-react';
import { NuraButton } from '../button/button';

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
        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
        <div className="flex flex-col bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 w-full max-w-[400px]">
            {/* Image */}
            <div className="mb-4">
                <img
                    src={imageUrl || "/example/dummy.png"}
                    alt={title}
                    className="h-44 w-full object-cover rounded-2xl"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow gap-4">
                <h3 className="font-bold text-base text-gray-900 text-left leading-snug">
                    {title}
                </h3>

                {/* Method & Schedule */}
                <div className="grid grid-cols-2 text-gray-700 gap-4">
                    <div className="flex flex-col items-start text-left text-xs gap-1.5">
                        <span className="font-bold text-gray-900">Methods</span>
                        <span className="text-gray-700">{method}</span>
                    </div>
                    <div className="flex flex-col items-start text-left text-xs gap-1.5">
                        <span className="font-bold text-gray-900">Schedules</span>
                        <span className="text-gray-700">{formatDate(scheduleStart)} - {formatDate(scheduleEnd)}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="text-left text-xs text-gray-700 flex flex-col gap-1.5">
                    <span className="font-bold text-gray-900">Description</span>
                    <p className="leading-relaxed line-clamp-4">
                        {description}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-row items-center justify-between gap-3 mt-5">
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                        <Clock className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                        <span>{duration} hours</span>
                    </div>
                    <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                        <BookText className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                        <span>{modules} modules</span>
                    </div>
                </div>
                <NuraButton
                    label="Enroll Now"
                    variant="navigate"
                    onClick={() => router.push(`/classes/${id}/enrollment`)}
                // onClick={() => router.push(`/classes/${id}/overview`)}
                />
            </div>
        </div>
    );
}