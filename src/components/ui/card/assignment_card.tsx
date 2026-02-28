"use client"

import { useRouter } from "next/navigation";
import { getAssignmentIcon, getAssignmentEndpoint, AssignmentType } from "@/utils/assignment";

interface AssignmentCardProps {
    title: string;
    tag: "Individual" | "Group";
    classId: string;
    courseId: string;
    sessionId: string;
    type: AssignmentType;
    className?: string;
    courseName?: string;
}

export const AssignmentCard = ({
    title,
    tag,
    classId,
    courseId,
    sessionId,
    type,
    className = "",
    courseName = ""
}: AssignmentCardProps) => {
    const router = useRouter();

    return (
        <div
            className={`flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md ${className}`}
            onClick={() => router.push(getAssignmentEndpoint(classId, courseId, sessionId, type))}
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <img src={getAssignmentIcon(type)} alt={title} className="h-12 w-12" />
            </div>
            <div className="flex flex-col gap-0.5 w-full">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-black">{title}</h3>
                    <span className="rounded-full border border-black px-3 py-0 text-xs font-medium text-black">
                        {tag}
                    </span>
                </div>
                <p className="text-base text-gray-700">
                    {className} <span className="mx-2 text-gray-400">|</span> {courseName}
                </p>
            </div>
        </div>
    );
};
