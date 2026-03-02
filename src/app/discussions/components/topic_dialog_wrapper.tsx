"use client"

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar/sidebar";
import DiscussionList, { Topic } from "@/components/discussion_list";
import { DiscussionTopicDialog } from "@/components/discussion_topic_dialog";
import { NuraButton } from "@/components/ui/button/button";
import { createTopicAction } from "../actions";
import { toast } from "sonner";

export function TopicDialogWrapper({ topics }: { topics: Topic[] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleConfirm = async (data: { title: string, description: string }) => {
        const result = await createTopicAction({
            classId: "temp-class-123", // Real class ID needed
            authorId: "temp-user-123",
            title: data.title,
            content: data.description,
            type: "COURSE_DISCUSSION"
        });

        if (result.success) {
            setIsDialogOpen(false);
            toast.success("Topic created!");
        } else {
            toast.error(result.error || "Failed to create topic");
        }
    };

    return (
        <div className="flex flex-col w-full">
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Background Image */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0"
            />
            <div className="flex-grow z-1 mx-auto w-full max-w-7xl py-8 px-6 md:px-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-black tracking-tight">
                        Forum Diskusi
                    </h1>
                    <NuraButton
                        label="New Topic"
                        variant="primary"
                        onClick={() => setIsDialogOpen(true)}
                    />
                </div>

                <DiscussionList topics={topics} />

                <DiscussionTopicDialog
                    isOpen={isDialogOpen}
                    onConfirm={handleConfirm}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </div>
        </div>
    );
}
