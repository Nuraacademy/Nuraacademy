"use client"

import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";

interface PresenceClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
}

export default function PresenceClient({
    classId,
    courseId,
    moduleId
}: PresenceClientProps) {
    const router = useRouter();

    return (
        <NuraButton
            label="Back to Session"
            variant="primary"
            className="min-w-[200px]"
            onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}`)}
        />
    );
}
