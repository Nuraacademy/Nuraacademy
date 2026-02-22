"use client"

import Sidebar from "@/components/ui/sidebar/sidebar";
import { useState } from "react";
import DiscussionList, { Topic } from "@/components/discussion_list";
import { DiscussionTopicDialog } from "@/components/discussion_topic_dialog";
import { NuraButton } from "@/components/ui/button/button";

const MOCK_DATA: Topic[] = [
    {
        id: "1",
        author: "Tatang Supratman",
        timeAgo: "12 hours ago",
        title: "A Beginner Journey to Python",
        preview: "As a new student to software engineering...",
        likeCount: 12,
        repliesCount: 24,
        type: "Learning Resource"
    },
    {
        id: "2",
        author: "Tatang Supratman",
        timeAgo: "12 hours ago",
        title: "A Beginner Journey to Python",
        preview: "As a new student to software engineering...",
        likeCount: 12,
        repliesCount: 24,
        type: "Technical Help"
    }
]

export default function DiscussionPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Simulate fetching data on the server
    const data = MOCK_DATA;

    const handleConfirm = (title: string, description: string) => {
        // Logic to save the new topic

        setIsDialogOpen(false);
    };

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800">
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

                <DiscussionList topics={data} />

                <DiscussionTopicDialog
                    isOpen={isDialogOpen}
                    onConfirm={({ title, description }: { title: string; description: string }) => handleConfirm(title, description)}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </div>
        </main>
    );
}