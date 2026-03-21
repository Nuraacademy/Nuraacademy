"use client"

import Sidebar from "@/components/ui/sidebar/sidebar";
import { useEffect, useState, useMemo } from "react";
import DiscussionList, { Topic } from "@/components/ui/discussion/discussion_list";
import { DiscussionTopicDialog } from "@/components/ui/discussion/discussion_topic_dialog";
import { NuraButton } from "@/components/ui/button/button";
import { getDiscussionsAction, createDiscussionAction } from "@/app/actions/discussion";
import { DiscussionType } from "@prisma/client";
import { toast } from "sonner";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import { NuraSelect } from "@/components/ui/input/nura_select";
import { hasPermission } from "@/lib/rbac";
import Image from "next/image";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [canCreateTopic, setCanCreateTopic] = useState(false);

    useEffect(() => {
        hasPermission('Forums', 'CREATE_EDIT_TOPIC').then(setCanCreateTopic).catch(() => { });
    }, []);

    const fetchDiscussions = async () => {
        setIsLoading(true);
        const res = await getDiscussionsAction();
        if (res.success && res.data) {
            setDiscussions(res.data.map((d: any) => ({
                id: d.id.toString(),
                author: d.authorName,
                timeAgo: "12 hours ago", // Placeholder to match image exactly, or use real logic: new Date(d.createdAt).toLocaleDateString()
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

    const filteredDiscussions = useMemo(() => {
        let result = discussions.filter(d =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.author.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === "likes") {
            result.sort((a, b) => b.likeCount - a.likeCount);
        } else if (sortBy === "replies") {
            result.sort((a, b) => b.repliesCount - a.repliesCount);
        } else {
            // Newest is default (backend already sorts by desc createdAt)
        }

        return result;
    }, [discussions, searchQuery, sortBy]);

    const handleConfirm = async (title: string, description: string, type?: string) => {
        const res = await createDiscussionAction(title, description, (type as DiscussionType) || "TECHNICAL_HELP");
        setIsDialogOpen(false);
        if (res.success) {
            toast.success("Topic created successfully!");
            fetchDiscussions();
        } else {
            toast.error(res.error || "Failed to create topic");
        }
    };

    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Most Liked", value: "likes" },
        { label: "Most Replied", value: "replies" },
    ];

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800">
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Background Image */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 -z-10 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
                priority
            />
            <Image
                src="/background/PolygonBGBot.svg"
                alt=""
                className="absolute bottom-0 right-0 -z-10 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            <div className="flex-grow z-1 mx-auto w-full max-w-7xl py-12 px-6 md:px-16">
                <div className="flex flex-col gap-6 mb-12">
                    <h1 className="text-5xl font-bold text-gray-950 tracking-tight">
                        Forums
                    </h1>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <NuraSearchInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search discussions..."
                            className="w-full max-w-md shadow-sm"
                        />

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <NuraSelect
                                options={sortOptions}
                                value={sortBy}
                                onChange={setSortBy}
                                placeholder="Sorted"
                                className="w-48 shadow-sm"
                            />
                            {canCreateTopic && (
                                <NuraButton
                                    label="New Topic"
                                    variant="primary"
                                    onClick={() => setIsDialogOpen(true)}
                                    className="!w-auto px-8 shadow-sm"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-12 h-12 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin" />
                        <p className="text-xl font-medium text-gray-400">Fetching forum data...</p>
                    </div>
                ) : filteredDiscussions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-white/50 backdrop-blur-sm mt-8">
                        <div className="bg-blue-50 p-6 rounded-full mb-6 text-blue-500">
                            <img src="/icons/Reply.svg" alt="" className="w-12 h-12 opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">No discussions found</h3>
                        <p className="text-gray-500 max-w-md mb-8 text-lg">
                            {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "Be the first to start a conversation!"}
                        </p>
                    </div>
                ) : (
                    <DiscussionList topics={filteredDiscussions} />
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