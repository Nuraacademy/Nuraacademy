"use client"

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseSessionLinkProps {
    classId: string;
    courseId: string;
    session: {
        id: string;
        title: string;
        type: string;
    };
}

const SessionTag = ({ label }: { label: string }) => {
    if (label === "None" || !label) return null;
    return (
        <span className="ml-3 px-3 py-0.5 text-[10px] font-medium border border-gray-300 rounded-full text-gray-500 bg-gray-50">
            {label}
        </span>
    );
};

export default function CourseSessionLink({ classId, courseId, session }: CourseSessionLinkProps) {
    const router = useRouter();

    const getIcon = () => {
        if (session.title.includes("Video") || session.type === "Asynchronous") {
            return <img src="/icons/Video.svg" alt="Video" className="w-5 h-5" />;
        }
        if (session.title.includes("Zoom") || session.type === "Synchronous") {
            return <img src="/icons/Zoom.svg" alt="Zoom" className="w-5 h-5" />;
        }
        return <img src="/icons/Task.svg" alt="Assignment" className="w-5 h-5" />;
    };

    return (
        <div
            className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/${session.id}`)}
        >
            <div className="flex items-center gap-3">
                <div className="text-gray-700">
                    {getIcon()}
                </div>
                <div className="flex items-center">
                    <h3 className="text-sm font-bold text-gray-900">{session.title}</h3>
                    <SessionTag label={session.type} />
                </div>
            </div>
            <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                <ChevronRight size={20} />
            </div>
        </div>
    );
}
