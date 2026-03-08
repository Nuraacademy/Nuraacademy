"use client";

import { DiscussionTopicDialog } from '@/components/discussion_topic_dialog';
import { useEffect, useState, use } from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { NuraButton } from '@/components/ui/button/button';
import ForumTag from '@/components/ui/tag/discussion';
import { getDiscussionByIdAction, createReplyAction } from '@/app/actions/discussion';
import { toast } from 'sonner';

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

export default function DiscussionTopicPage({
    searchParams
}: {
    searchParams: Promise<{ id?: string }>
}) {
    // Correct way to handle async searchParams in a Client Component
    const params = use(searchParams);
    const idStr = params.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [discussion_data, setDiscussion_data] = useState<{
        author: string;
        timeAgo: string;
        title: string;
        type: "Technical Help" | "Learning Resource" | "Learning Partner" | "Course Discussion" | "Career & Portos";
        content: string;
        repliesCount: number;
        likeCount: number;
        replies: { author: string; timeAgo: string; text: string }[];
    } | null>(null);

    const fetchDiscussion = async () => {
        if (!idStr) return;
        setIsLoading(true);
        const res = await getDiscussionByIdAction(parseInt(idStr));
        if (res.success && res.data) {
            setDiscussion_data({
                author: res.data.authorName,
                timeAgo: new Date(res.data.createdAt).toLocaleDateString(),
                title: res.data.title,
                type: parseDiscussionType(res.data.type) as any,
                content: res.data.content,
                repliesCount: res.data.repliesCount,
                likeCount: res.data.likeCount,
                replies: res.data.replies.map((r: any) => ({
                    author: r.authorName,
                    timeAgo: new Date(r.createdAt).toLocaleDateString(),
                    text: r.text,
                })),
            });
        } else {
            console.error("Failed to load discussion", res.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDiscussion();
    }, [idStr]);

    const handleConfirm = async (description: string) => {
        if (!idStr) return;
        const res = await createReplyAction(parseInt(idStr), description);
        if (res.success) {
            toast.success("Reply posted successfully!");
            fetchDiscussion(); // Refresh discussion data
        } else {
            toast.error(res.error || "Failed to post reply.");
        }
        setIsDialogOpen(false);
    };


    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800">
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
            <div className="flex-grow mx-auto z-1 w-full max-w-7xl py-8 px-6 md:px-16">
                {/* Breadcrumbs */}
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Introduction to Programming", href: "/classes/1/overview" },
                        { label: "Forum Diskusi", href: "/discussions" },
                        { label: discussion_data?.title || "Topic", href: "/discussions/topic" }
                    ]}
                />

                <h1 className="text-4xl font-bold text-gray-900 py-8">Forum Diskusi {idStr && `- ${idStr}`}</h1>

                {isLoading || !discussion_data ? (
                    <div className="flex justify-center p-12">
                        <p className="text-xl">Loading discussion...</p>
                    </div>
                ) : (
                    <>
                        {/* Main Post Card */}
                        <div className="border-2 border-gray-900 bg-white rounded-[2.5rem] p-8 mb-12">
                            <div className="flex items-center text-gray-400 text-sm mb-4">
                                <span className="font-medium text-gray-500">{discussion_data?.author}</span>
                                <span className="mx-2">•</span>
                                <span>{discussion_data?.timeAgo}</span>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {discussion_data?.title}
                                </h2>
                                <ForumTag type={discussion_data?.type || "Technical Help"} />
                            </div>

                            <p className="text-gray-800 leading-relaxed text-lg mb-6">
                                {discussion_data?.content}
                            </p>

                            <div className="flex items-center text-gray-600 gap-8">
                                <div className='flex items-center'>
                                    <img src="/icons/Like.svg" alt="Like" className="w-5 h-5 mr-2" />
                                    {discussion_data?.likeCount} likes
                                </div>

                                <div className='flex items-center'>
                                    <img src="/icons/Reply.svg" alt="Reply" className="w-5 h-5 mr-2" />
                                    {discussion_data?.repliesCount} replies
                                </div>
                            </div>
                        </div>

                        {/* Replies Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 mb-12">
                            {/* Replies Header */}
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl text-gray-900">Replies</h2>
                                <NuraButton
                                    label="Reply"
                                    variant="primary"
                                    onClick={() => setIsDialogOpen(true)}
                                />
                            </div>

                            {/* Replies List */}
                            <div className="space-y-10">
                                {discussion_data?.replies.map((reply, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-10 last:border-0">
                                        <div className="flex items-center text-gray-400 text-sm mb-3">
                                            <span className="font-medium text-gray-500">{reply.author}</span>
                                            <span className="mx-2">•</span>
                                            <span>{reply.timeAgo}</span>
                                        </div>
                                        <p className="text-gray-800 leading-relaxed text-lg">
                                            {reply.text}
                                        </p>
                                    </div>
                                ))}
                                {discussion_data?.replies.length === 0 && (
                                    <p className="text-gray-500">No replies yet. Be the first to join the discussion!</p>
                                )}
                            </div>
                        </div>
                    </>
                )}


                <DiscussionTopicDialog
                    isOpen={isDialogOpen}
                    onConfirm={({ title, description }: { title: string; description: string }) => handleConfirm(description)}
                    onCancel={() => setIsDialogOpen(false)}
                    isReply={true}
                />
            </div>
        </main>
    );
}