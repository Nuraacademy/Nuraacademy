"use client"

import { useState } from "react";
import DiscussionList from "@/components/discussion_list";
import { LimeButton } from "@/components/lime_button";
import {DiscussionTopicDialog } from "@/components/discussion_topic_dialog";

interface Topic {
    id: string;
    author: string;
    timeAgo: string;
    title: string;
    preview: string;
    replies: number;
}

export default function DiscussionClientWrapper({ topics }: { topics: Topic[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleConfirm = (title: string, description: string) => {
        // Logic to save the new topic

        setIsDialogOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-black tracking-tight">
                    Forum Diskusi
                </h1>
                <LimeButton 
                    label="New Topic"
                    variant="submit"
                    onClick={() => setIsDialogOpen(true)}
                />
            </div>

            <DiscussionList topics={topics} />

            <DiscussionTopicDialog 
                isOpen={isDialogOpen} 
                onConfirm={({ title, description }: { title: string; description: string }) => handleConfirm(title, description)} 
                onCancel={() => setIsDialogOpen(false)}
            />
        </>
    );
}