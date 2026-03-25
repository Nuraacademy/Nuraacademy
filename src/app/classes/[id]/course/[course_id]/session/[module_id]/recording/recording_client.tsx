"use client"

import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";

interface RecordingClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
}

export default function RecordingClient({
    classId,
    courseId,
    moduleId
}: RecordingClientProps) {
    const router = useRouter();

    return (
        <NuraButton
            label="Back to Session"
            variant="primary"
            className="min-w-[160px] h-10 text-sm font-medium"
            onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}`)}
        />
    );
}
