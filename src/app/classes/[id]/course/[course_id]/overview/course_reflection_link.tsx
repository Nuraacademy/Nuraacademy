"use client"

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CourseReflectionLinkProps {
    classId: string;
    courseId: string;
    href: string;
}

export default function CourseReflectionLink({ classId, courseId, href }: CourseReflectionLinkProps) {
    const router = useRouter();

    return (
        <div
            className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            onClick={() => router.push(href)}
        >
            <div className="flex items-center gap-3">
                <div className="text-gray-700">
                    <Image  
                        src="/icons/sidebar/SubReflection.svg"
                        alt="Reflection"
                        width={20}
                        height={20}
                    />
                </div>
                <div className="flex items-center">
                    <h3 className="text-md font-medium text-gray-900">Participant Reflection</h3>
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
