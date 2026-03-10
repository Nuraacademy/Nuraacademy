"use client"

import { useRouter } from 'next/navigation';
import { Clock, BookText } from 'lucide-react';
import { NuraButton } from '../button/button';
import Chip from '../chip/chip';
import Image from 'next/image';

interface ClassCardProp {
    id: string,
    imageUrl?: string,
    title: string,
    method: string,
    scheduleStart?: Date,
    scheduleEnd?: Date,
    description: string,
    duration: number,
    courses: number,
    isEnrolled: boolean,
    onClick: () => void
}

export default function ClassCard({
    id, imageUrl, title, method, scheduleStart, scheduleEnd, description, duration, courses, isEnrolled, onClick
}: ClassCardProp) {
    const router = useRouter()

    const formatDate = (date?: Date) =>
        date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : "TBA";

    const getStatus = () => {
        const now = new Date();
        let status;
        if (!scheduleStart || !scheduleEnd) {
            status = "Upcoming";
        } else if (now >= scheduleStart && now <= scheduleEnd) {
            status = "Ongoing";
        } else if (now < scheduleStart) {
            status = "Not Started";
        } else {
            status = "Ended";
        }

        let style;
        if (status === "Ongoing") {
            style = 'bg-[#B8FFA2] text-black';
        } else if (status === "Not Started" || status === "Upcoming") {
            style = 'bg-[#8FF6FF] text-black';
        } else {
            style = 'bg-[#A2A2A2] text-black';
        }

        return <Chip label={status} variant="default" size="sm" className={style} />;
    }

    return (
        <div
            className="flex flex-col bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 w-full max-w-[400px] hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={onClick}
        >
            {/* Image */}
            <div className="mb-4 relative h-44 w-full">
                <Image
                    src={imageUrl || "/example/dummy.png"}
                    alt={title}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow gap-4">
                <div className="flex flex-row items-center justify-between gap-3">
                    <h3 className="font-bold text-base text-gray-900 text-left leading-snug">
                        {title}
                    </h3>

                    {getStatus()}
                </div>

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
            <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                        <Clock className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                        <span>{duration} hours</span>
                    </div>
                    <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                        <BookText className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                        <span>{courses} courses</span>
                    </div>
                </div>
                <NuraButton
                    label={isEnrolled ? "View Class" : "Enroll Now"}
                    variant="navigate"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(isEnrolled ? `/classes/${id}/overview` : `/classes/${id}/enrollment`);
                    }}
                />
            </div>
        </div>
    );
}