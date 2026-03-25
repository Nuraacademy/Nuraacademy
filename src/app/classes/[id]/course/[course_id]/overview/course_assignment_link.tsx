"use client"

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";
import { toast } from "sonner";
import { removeAssignment } from "@/app/actions/assignment";
import Image from "next/image";

interface CourseAssignmentLinkProps {
    assignment: {
        id: number;
        title: string | null;
        type: string;
        submissionType?: string | null;
        startDate?: Date | null;
    };
    classId: string;
    courseId: string;
    isAdmin?: boolean;
    isLearner?: boolean;
}

export default function CourseAssignmentLink({ assignment, classId, courseId, isAdmin, isLearner }: CourseAssignmentLinkProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const typeLabel = assignment.type === "EXERCISE" ? "Exercise" : "Assignment";

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await removeAssignment(assignment.id, parseInt(classId), parseInt(courseId));
        setIsDeleting(false);
        setIsConfirmOpen(false);

        if (result.success) {
            toast.success("Assignment deleted successfully");
        } else {
            toast.error(result.error || "Failed to delete assignment");
        }
    };

    return (
        <>
        <div
            className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            onClick={() => {
                if (isLearner) {
                    router.push(`/assignment/${assignment.id}`)
                } else {
                    router.push(`/assignment/${assignment.id}/results`)
                }
            }}
        >
            <div className="flex items-center gap-3">
                <div className="text-gray-700">
                    <Image
                        src={assignment.type === "EXERCISE" ? "/icons/assignment/Exercise.svg" : "/icons/assignment/Assignment.svg"}
                        alt="Assignment"
                        width={20}
                        height={20}
                        onError={(e: any) => { e.currentTarget.src = "/icons/Edit.svg"; }}
                    />
                </div>
                <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-md font-medium text-gray-900">{assignment.title}</h3>

                    <span className="px-2 py-0.5 text-[10px] font-medium border border-gray-300 rounded-full text-gray-500 bg-gray-50">
                        {typeLabel}
                    </span>

                    {assignment.submissionType && (
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                            assignment.submissionType === "GROUP"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                            {assignment.submissionType === "GROUP" ? "Group" : "Individual"}
                        </span>
                    )}

                    {assignment.startDate && (
                        <span className="text-xs text-gray-400">
                            Due {new Date(assignment.startDate).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                {isAdmin && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <button
                            className={`p-1.5 rounded-xl transition-colors z-10 ${isDeleting ? 'text-gray-300' : 'hover:bg-gray-100 hover:text-red-500'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsConfirmOpen(true);
                            }}
                            disabled={isDeleting}
                        >
                            <Image src="/icons/Delete.svg" alt="Delete" width={16} height={16} />
                        </button>
                        <button
                            className="p-1.5 hover:bg-gray-100 rounded-xl hover:text-gray-900 transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/assignment/add?id=${assignment.id}`);
                            }}
                        >
                            <Image src="/icons/Edit.svg" alt="Edit" width={16} height={16} />
                        </button>
                    </div>
                )}
                {!isAdmin && (
                    <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                        <ChevronRight size={20} />
                    </div>
                )}
            </div>
        </div>

        <ConfirmModal
            isOpen={isConfirmOpen}
            title="Delete Assignment"
            message={`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`}
            confirmText="Delete"
            onConfirm={handleDelete}
            onCancel={() => setIsConfirmOpen(false)}
            isLoading={isDeleting}
        />
        </>
    );
}
