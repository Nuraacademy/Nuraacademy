"use client"

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseAssignmentLinkProps {
    assignment: {
        id: number;
        title: string | null;
        type: string;
        submissionType?: string | null;
        startDate?: Date | null;
    };
    isAdmin?: boolean;
}

export default function CourseAssignmentLink({ assignment, isAdmin }: CourseAssignmentLinkProps) {
    const router = useRouter();

    const typeLabel = assignment.type === "EXERCISE" ? "Exercise" : "Assignment";

    return (
        <div
            className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            onClick={() => router.push(`/assignment`)}
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

            <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                <ChevronRight size={20} />
            </div>
        </div>
    );
}
