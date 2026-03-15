"use client"

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";
import { toast } from "sonner";
import { removeAssignment } from "@/app/actions/assignment";

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
}

export default function CourseAssignmentLink({ assignment, classId, courseId, isAdmin }: CourseAssignmentLinkProps) {
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
            onClick={() => router.push(`/assignment/${assignment.id}`)}
        >
            <div className="flex items-center gap-3">
                <div className="text-gray-700">
                    <img
                        src={assignment.type === "EXERCISE" ? "/icons/assignment/Exercise.svg" : "/icons/assignment/Assignment.svg"}
                        alt="Assignment"
                        className="w-5 h-5"
                        onError={(e: any) => { e.currentTarget.src = "/icons/Edit.svg"; }}
                    />
                </div>
                <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{assignment.title}</h3>

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
                            className={`p-1.5 rounded transition-colors z-10 ${isDeleting ? 'text-gray-300' : 'hover:bg-gray-100 hover:text-red-500'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsConfirmOpen(true);
                            }}
                            disabled={isDeleting}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                        <button
                            className="p-1.5 hover:bg-gray-100 rounded hover:text-gray-900 transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/assignment/add?id=${assignment.id}`);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
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
