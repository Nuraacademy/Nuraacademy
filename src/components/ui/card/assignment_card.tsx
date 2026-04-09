"use client"

import { useState } from "react";
import { useNuraRouter } from "@/components/providers/navigation-provider";
import { getAssignmentIcon, getAssignmentEndpoint, AssignmentType } from "@/utils/assignment";
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";
import { toast } from "sonner";
import { removeAssignment } from "@/app/actions/assignment";
import Image from "next/image";

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
    isAdmin?: boolean;
    canGrade?: boolean;
    canStartAssignment?: boolean;
    syntheticType?: string;
    showActions?: boolean;
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
    className = "",
    isAdmin = false,
    canGrade = false,
    canStartAssignment = false,
    syntheticType,
    showActions = true
}: AssignmentCardProps) => {
    const router = useNuraRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDelete = async () => {
        if (!id) return;
        setIsDeleting(true);
        const result = await removeAssignment(id, parseInt(classId), courseId ? parseInt(courseId) : undefined);
        setIsDeleting(false);
        setIsConfirmOpen(false);

        if (result.success) {
            toast.success("Assignment deleted successfully");
        } else {
            toast.error(result.error || "Failed to delete assignment");
        }
    };

    const handleClick = () => {
        if (syntheticType === "Class Feedback") {
            router.push(`/classes/${classId}/feedback`);
        } else if (id && (canStartAssignment || canGrade)) {
            router.push(`/assignment/${id}/questions`);
        } else if (id && type === "Placement" && isAdmin) {
            router.push(`/classes/${classId}/test/create`);
        } else if (id && type !== "Placement") {
            router.push(`/assignment/${id}`);
        } else {
            router.push(getAssignmentEndpoint(classId, courseId, sessionId, type));
        }
    };


    return (
        <>
            <div
                className={`flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-400 hover:shadow-md cursor-pointer group relative ${className}`}
                onClick={handleClick}
            >
                <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                        <img src={getAssignmentIcon(type)} alt={title} className="h-12 w-12" />
                    </div>
                    <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg text-black">{title ? title : courseTitle ? `${courseTitle} - ${type}` : `${classTitle} - ${type}`}</h3>
                            <span className="rounded-full border border-black px-3 py-0 text-xs font-medium text-black">
                                {tag}
                            </span>
                        </div>
                        <p className="text-base text-gray-700">
                            {classTitle} {courseTitle && <><span className="mx-2 text-gray-400">|</span> {courseTitle}</>}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {canGrade && id && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/assignment/${id}/results`);
                            }}
                            className="rounded-full bg-[#00524D] px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-[#00423D]"
                        >
                            Results
                        </button>
                    )}

                    {!isAdmin && !canGrade && type === "Final Project" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/classes/${classId}/feedback`);
                            }}
                            className="rounded-full bg-[#D9F55C] px-4 py-1.5 text-xs font-medium text-black transition-all hover:bg-[#c8e54b]"
                        >
                            Class Feedback
                        </button>
                    )}

                    {isAdmin && showActions && id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsConfirmOpen(true);
                                }}
                                disabled={isDeleting}
                            >
                                <Image src="/icons/Delete.svg" alt="Delete" width={20} height={20} />
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/assignment/add?id=${id}`);
                                }}
                            >
                                <Image src="/icons/Edit.svg" alt="Edit" width={20} height={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Delete Assignment"
                message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </>
    );
};
