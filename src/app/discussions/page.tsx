"use client"

import Sidebar from "@/components/ui/sidebar/sidebar";
import { useEffect, useState } from "react";
import DiscussionList, { Topic } from "@/components/discussion_list";
import { DiscussionTopicDialog } from "@/components/discussion_topic_dialog";
import { NuraButton } from "@/components/ui/button/button";
import { getDiscussionsAction, createDiscussionAction } from "@/app/actions/discussion";
import { DiscussionType } from "@prisma/client";
import { toast } from "sonner";

// Mapping backend types to frontend types format
const parseDiscussionType = (type: string) => {
    switch (type) {
        case "TECHNICAL_HELP": return "Technical Help";
        case "LEARNING_RESOURCE": return "Learning Resource";
        case "LEARNING_PARTNER": return "Learning Partner";
        case "COURSE_DISCUSSION": return "Course Discussion";
        case "CAREER_PORTOS": return "Career & Portos";
        default: return "Technical Help";
    }
}

export default function DiscussionPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [discussions, setDiscussions] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDiscussions = async () => {
        setIsLoading(true);
        const res = await getDiscussionsAction();
        if (res.success && res.data) {
            setDiscussions(res.data.map((d: any) => ({
                id: d.id.toString(),
                author: d.authorName,
                timeAgo: new Date(d.createdAt).toLocaleDateString(), // Simplification
                title: d.title,
                preview: d.content,
                likeCount: d.likeCount,
                repliesCount: d.repliesCount,
                type: parseDiscussionType(d.type),
            })));
        } else {
            console.error("Failed to load discussions", res.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const handleConfirm = async (title: string, description: string, type?: string) => {
        // Validation could be added here
        const res = await createDiscussionAction(title, description, (type as DiscussionType) || "TECHNICAL_HELP");
        setIsDialogOpen(false);
        if (res.success) {
            toast.success("Topic created successfully!");
            fetchDiscussions(); // Refresh the list
        } else {
            toast.error(res.error || "Failed to create topic");
        }
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

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <p className="text-xl">Loading discussions...</p>
                    </div>
                ) : discussions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50 backdrop-blur-sm mt-8">
                        <div className="bg-blue-50 p-6 rounded-full mb-6">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">No discussions yet</h3>
                        <p className="text-gray-500 max-w-md mb-8 text-lg">
                            Be the first to start a conversation! Ask a question, share a useful resource, or start a new topic.
                        </p>
                        <NuraButton
                            label="Start a New Topic"
                            variant="primary"
                            onClick={() => setIsDialogOpen(true)}
                        />
                    </div>
                ) : (
                    <DiscussionList topics={discussions} />
                )}

                <DiscussionTopicDialog
                    isOpen={isDialogOpen}
                    onConfirm={({ title, description, type }: { title: string; description: string; type?: string }) => handleConfirm(title, description, type)}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </div>
        </main>
    );
}