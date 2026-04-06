"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";
import { startAssignmentAction } from "@/app/actions/assignment";
import { toast } from "sonner";

interface QuestionPreviewClientProps {
    assignmentId: number;
    resultsUrl: string;
}

export default function QuestionPreviewClient({ assignmentId, resultsUrl }: QuestionPreviewClientProps) {
    const router = useRouter();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const handleStartTest = async () => {
        setIsStarting(true);
        const result = await startAssignmentAction(assignmentId);
        setIsStarting(false);
        setIsConfirmOpen(false);

        if (result.success) {
            toast.success("Assignment started successfully!");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to start assignment");
        }
    };

    return (
        <>
            <div className="flex justify-center gap-4 py-8">
                <NuraButton
                    label="Check Test"
                    variant="secondary"
                    onClick={() => router.push(resultsUrl)}
                    className="border border-[#D9F55C] text-black"
                />
                <NuraButton
                    label="Start Test"
                    variant="primary"
                    onClick={() => setIsConfirmOpen(true)}
                />
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Start Assignment"
                message="Are you sure you want to start this assignment now? This will update the start date to today (00:00) and make it available for all learners."
                confirmText="Start Now"
                cancelText="Cancel"
                isLoading={isStarting}
                onConfirm={handleStartTest}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </>
    );
}
