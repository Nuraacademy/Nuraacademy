"use client";

import { DiscussionTopicDialog } from '@/components/ui/discussion/discussion_topic_dialog';
import { useEffect, useState, use, useMemo } from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { NuraButton } from '@/components/ui/button/button';
import ForumTag from '@/components/ui/tag/discussion';
import { getDiscussionByIdAction, createReplyAction, toggleLikeDiscussionAction, toggleLikeReplyAction } from '@/app/actions/discussion';
import { toast } from 'sonner';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { NuraSelect } from '@/components/ui/input/nura_select';
import { hasPermission } from '@/lib/rbac';

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
    const params = use(searchParams);
    const idStr = params.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sortRepliesBy, setSortRepliesBy] = useState("newest");
    const [canReply, setCanReply] = useState(false);

    useEffect(() => {
        hasPermission('Forums', 'REPLY_TOPIC').then(setCanReply).catch(() => { });
    }, []);

    const [discussion_data, setDiscussion_data] = useState<{
        id: number;
        author: string;
        timeAgo: string;
        title: string;
        type: "Technical Help" | "Learning Resource" | "Learning Partner" | "Course Discussion" | "Career & Portos";
        content: string;
        repliesCount: number;
        likeCount: number;
        isLikedByCurrentUser: boolean;
        replies: {
            id: number;
            author: string;
            timeAgo: string;
            text: string;
            likeCount: number;
            isLikedByCurrentUser: boolean;
            createdAt: string
        }[];
    } | null>(null);

    const fetchDiscussion = async () => {
        if (!idStr) return;
        setIsLoading(true);
        const res = await getDiscussionByIdAction(parseInt(idStr));
        if (res.success && res.data) {
            setDiscussion_data({
                id: res.data.id,
                author: res.data.authorName,
                timeAgo: "12 hours ago", // Placeholder for visual consistency with image
                title: res.data.title,
                type: parseDiscussionType(res.data.type) as any,
                content: res.data.content,
                repliesCount: res.data.repliesCount,
                likeCount: res.data.likeCount,
                isLikedByCurrentUser: res.data.isLikedByCurrentUser,
                replies: res.data.replies.map((r: any) => ({
                    id: r.id,
                    author: r.authorName,
                    timeAgo: "8 hours ago", // Placeholder
                    text: r.text,
                    likeCount: r.likeCount,
                    isLikedByCurrentUser: r.isLikedByCurrentUser,
                    createdAt: r.createdAt
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
            fetchDiscussion();
        } else {
            toast.error(res.error || "Failed to post reply.");
        }
        setIsDialogOpen(false);
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const handleToggleLike = async () => {
        if (!discussion_data) return;

        // Optimistic UI update
        const prevData = discussion_data;
        setDiscussion_data({
            ...discussion_data,
            isLikedByCurrentUser: !discussion_data.isLikedByCurrentUser,
            likeCount: discussion_data.isLikedByCurrentUser ? discussion_data.likeCount - 1 : discussion_data.likeCount + 1
        });

        const res = await toggleLikeDiscussionAction(discussion_data.id);
        if (!res.success) {
            toast.error(res.error || "Failed to toggle like.");
            setDiscussion_data(prevData); // Rollback
        }
    };

    const handleToggleLikeReply = async (replyId: number, index: number) => {
        if (!discussion_data) return;

        const prevData = discussion_data;
        const newReplies = [...discussion_data.replies];
        const isCurrentlyLiked = newReplies[index].isLikedByCurrentUser;

        newReplies[index] = {
            ...newReplies[index],
            isLikedByCurrentUser: !isCurrentlyLiked,
            likeCount: isCurrentlyLiked ? newReplies[index].likeCount - 1 : newReplies[index].likeCount + 1
        };

        setDiscussion_data({
            ...discussion_data,
            replies: newReplies
        });

        const res = await toggleLikeReplyAction(replyId);
        if (!res.success) {
            toast.error(res.error || "Failed to toggle like on reply.");
            setDiscussion_data(prevData);
        }
    };

    const sortedReplies = useMemo(() => {
        if (!discussion_data) return [];
        const replies = [...discussion_data.replies];
        if (sortRepliesBy === "newest") {
            replies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortRepliesBy === "likes") {
            replies.sort((a, b) => b.likeCount - a.likeCount);
        }
        return replies;
    }, [discussion_data, sortRepliesBy]);

    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Most Liked", value: "likes" },
    ];

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800">
            {/* Background Image */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none opacity-60"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none opacity-60"
            />

            <div className="flex-grow mx-auto z-1 w-full max-w-7xl py-12 px-6 md:px-16">
                {/* Breadcrumbs */}
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Forums", href: "/discussions" },
                        { label: discussion_data?.title || "Topic", href: "#" }
                    ]}
                />

                <h1 className="text-5xl font-bold text-gray-950 tracking-tight pt-10 pb-12">Forums</h1>

                {isLoading || !discussion_data ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-12 h-12 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin" />
                        <p className="text-xl font-medium text-gray-400">Loading discussion content...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {/* Main Post Card */}
                        <div className="border border-gray-100 bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center text-gray-400 text-sm font-medium mb-5">
                                <span>{discussion_data.author}</span>
                                <span className="mx-2 text-[10px]">●</span>
                                <span>{discussion_data.timeAgo}</span>
                            </div>

                            <div className="flex items-center flex-wrap gap-4 mb-6">
                                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                    {discussion_data.title}
                                </h2>
                                <ForumTag type={discussion_data.type} />
                            </div>

                            <p className="text-gray-700 leading-[1.7] text-lg mb-10 max-w-5xl">
                                {discussion_data.content}
                            </p>

                            <div className="flex items-center text-gray-500 gap-10">
                                <button
                                    onClick={handleToggleLike}
                                    className={`flex items-center gap-2 transition-all hover:scale-105 ${discussion_data.isLikedByCurrentUser ? 'text-red-500' : 'hover:text-red-500'}`}
                                >
                                    <Heart
                                        size={22}
                                        className={`stroke-[1.5] ${discussion_data.isLikedByCurrentUser ? 'fill-current' : ''}`}
                                    />
                                    <span className="text-sm font-semibold">{discussion_data.likeCount} likes</span>
                                </button>

                                <div className='flex items-center gap-2'>
                                    <MessageCircle size={22} className="stroke-[1.5]" />
                                    <span className="text-sm font-semibold">{discussion_data.repliesCount} replies</span>
                                </div>

                                <button
                                    onClick={handleShare}
                                    className='flex items-center gap-2 transition-all hover:text-green-500 hover:scale-105 font-semibold text-sm'
                                >
                                    <Send size={21} className="stroke-[1.5]" />
                                    <span>{Math.floor(discussion_data.likeCount / 3)} shares</span>
                                </button>
                            </div>
                        </div>

                        {/* Replies Section Container */}
                        <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/50">
                            {/* Replies Header */}
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-950">Replies</h2>
                                <div className="flex items-center gap-4">
                                    <NuraSelect
                                        options={sortOptions}
                                        value={sortRepliesBy}
                                        onChange={setSortRepliesBy}
                                        placeholder="Sorted"
                                        className="w-40 shadow-sm"
                                    />
                                    {canReply && (
                                        <NuraButton
                                            label="Add Reply"
                                            variant="primary"
                                            onClick={() => setIsDialogOpen(true)}
                                            className="!w-auto px-8 shadow-sm"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Replies List */}
                            <div className="flex flex-col gap-10">
                                {sortedReplies.map((reply, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-10 last:border-0 last:pb-0">
                                        <div className="flex items-center text-gray-400 text-sm font-medium mb-4">
                                            <span>{reply.author}</span>
                                            <span className="mx-2 text-[10px]">●</span>
                                            <span>{reply.timeAgo}</span>
                                        </div>
                                        <p className="text-gray-700 leading-[1.7] text-lg mb-6">
                                            {reply.text}
                                        </p>
                                        <div className="flex items-center text-gray-500 gap-8">
                                            <button
                                                onClick={() => handleToggleLikeReply((reply as any).id, index)}
                                                className={`flex items-center gap-2 transition-all hover:scale-105 ${reply.isLikedByCurrentUser ? 'text-red-500' : 'hover:text-red-500'}`}
                                            >
                                                <Heart
                                                    size={18}
                                                    className={`stroke-[1.5] ${reply.isLikedByCurrentUser ? 'fill-current' : ''}`}
                                                />
                                                <span className="text-xs font-semibold">{reply.likeCount} likes</span>
                                            </button>
                                            <button
                                                onClick={handleShare}
                                                className='flex items-center gap-2 transition-all hover:text-green-500 hover:scale-105'
                                            >
                                                <Send size={17} className="stroke-[1.5]" />
                                                <span className="text-xs font-semibold">{Math.floor(reply.likeCount / 5)} shares</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {sortedReplies.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 text-lg">No replies yet. Be the first to join the conversation!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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