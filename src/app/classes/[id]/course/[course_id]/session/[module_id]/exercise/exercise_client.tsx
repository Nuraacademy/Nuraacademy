"use client"

import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";

interface ExerciseClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
    colabUrl: string;
}

export default function ExerciseClient({
    classId,
    courseId,
    moduleId,
    colabUrl
}: ExerciseClientProps) {
    const router = useRouter();

    return (
        <div className="flex justify-center gap-6 pt-4">
            <button
                className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                onClick={() => router.back()}
            >
                Back
            </button>
            <NuraButton
                label="Open in Colab"
                variant="primary"
                onClick={() => window.open(colabUrl, "_blank")}
            />
        </div>
    );
}
