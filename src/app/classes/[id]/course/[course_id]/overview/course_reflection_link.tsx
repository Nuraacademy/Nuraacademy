"use client"

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseReflectionLinkProps {
    classId: string;
    courseId: string;
}

export default function CourseReflectionLink({ classId, courseId }: CourseReflectionLinkProps) {
    const router = useRouter();

    return (
        <div
            className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            onClick={() => router.push(`/classes/${classId}/course/${courseId}/reflection`)}
        >
            <div className="flex items-center gap-3">
                <div className="text-gray-700">
                    <img
                        src="/icons/sidebar/SubReflection.svg"
                        alt="Reflection"
                        className="w-5 h-5"
                    />
                </div>
                <div className="flex items-center">
                    <h3 className="text-sm font-bold text-gray-900">Course Reflection</h3>
                </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                    <ChevronRight size={20} />
                </div>
            </div>
        </div>
    );
}
