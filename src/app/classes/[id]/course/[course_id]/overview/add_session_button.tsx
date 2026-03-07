"use client";

import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";

interface AddSessionButtonProps {
    classId: string;
    courseId: string;
}

export default function AddSessionButton({ classId, courseId }: AddSessionButtonProps) {
    const router = useRouter();
    return (
        <NuraButton
            label="Add Session"
            variant="primary"
            onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/new/edit`)}
        />
    );
}
