"use client"

import { useRouter } from "next/navigation";
import { getAssignmentIcon, getAssignmentEndpoint, AssignmentType } from "@/utils/assignment";

interface AssignmentCardProps {
    id?: number;
    title: string;
    tag: "Individual" | "Group";
    classId: string;
    courseId: string;
    sessionId: string;
    type: AssignmentType;
    classTitle?: string;
    courseTitle?: string;
    className?: string;
}

export const AssignmentCard = ({
    id,
    title,
    tag,
    classId,
    courseId,
    sessionId,
    type,
    classTitle = "",
    courseTitle = "",
    className = ""
}: AssignmentCardProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (id && type !== "Placement") {
            router.push(`/assignment/${id}`);
        } else {
            router.push(getAssignmentEndpoint(classId, courseId, sessionId, type));
        }
    };

    return (
        <div
            className={`flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-pointer ${className}`}
            onClick={handleClick}
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <img src={getAssignmentIcon(type)} alt={title} className="h-12 w-12" />
            </div>
            <div className="flex flex-col gap-0.5 w-full">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg text-black">{title}</h3>
                    <span className="rounded-full border border-black px-3 py-0 text-xs font-medium text-black">
                        {tag}
                    </span>
                </div>
                <p className="text-base text-gray-700">
                    {classTitle} {courseTitle && <><span className="mx-2 text-gray-400">|</span> {courseTitle}</>}
                </p>
            </div>
        </div>
    );
};
