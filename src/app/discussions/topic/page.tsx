"use client";

import { DiscussionTopicDialog } from '@/components/ui/discussion/discussion_topic_dialog';
import { useEffect, useState, use, useMemo } from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { NuraButton } from '@/components/ui/button/button';
import ForumTag from '@/components/ui/tag/discussion';
import { getDiscussionByIdAction, createReplyAction, toggleLikeDiscussionAction, toggleLikeReplyAction, deleteDiscussionAction, editReplyAction, deleteReplyAction, editDiscussionAction, recordDiscussionShareAction, recordReplyShareAction } from '@/app/actions/discussion';
import { getSession } from '@/app/actions/auth';
import { toast } from 'sonner';
import { Heart, MessageCircle, Send, Edit, Trash2 } from 'lucide-react';
import { NuraSelect } from '@/components/ui/input/nura_select';
import { hasPermission } from '@/lib/rbac';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/components/ui/modal/confirmation_modal';
import Image from 'next/image';
import Sidebar from '@/components/ui/sidebar/sidebar';
import { ShareModal } from '@/components/ui/modal/share_modal';
import { formatDistanceToNow } from "date-fns";

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

const reverseParseDiscussionType = (type: string) => {
    switch (type) {
        case "Technical Help": return "TECHNICAL_HELP";
        case "Learning Resource": return "LEARNING_RESOURCE";
        case "Learning Partner": return "LEARNING_PARTNER";
        case "Course Discussion": return "COURSE_DISCUSSION";
        case "Career & Portos": return "CAREER_PORTOS";
        default: return "TECHNICAL_HELP";
    }
}

export default function DiscussionTopicPage({
    searchParams
}: {
    searchParams: Promise<{ id?: string }>
}) {
    const params = use(searchParams);
    const idStr = params.id;
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [sharingItem, setSharingItem] = useState<{ type: 'topic' | 'reply', id: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortRepliesBy, setSortRepliesBy] = useState("newest");

    // Permissions & State
    const [perms, setPerms] = useState({
        replySelf: false,
        replyOthers: false,
        deleteSelfTopic: false,
        deleteOthersTopic: false,
        editSelfReply: false,
        editOthersReply: false,
        deleteSelfReply: false,
        deleteOthersReply: false,
        createEditTopic: false,
    });
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Modals
    const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
    const [isDeleteTopicModalOpen, setIsDeleteTopicModalOpen] = useState(false);
    const [isDeleteReplyModalOpen, setIsDeleteReplyModalOpen] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState<number | null>(null);
    const [replyToEdit, setReplyToEdit] = useState<{ id: number, text: string } | null>(null);

    useEffect(() => {
        Promise.all([
            hasPermission('Forums', 'REPLY_SELF_TOPIC'),
            hasPermission('Forums', 'REPLY_OTHERS_TOPIC'),
            hasPermission('Forums', 'DELETE_SELF_TOPIC'),
            hasPermission('Forums', 'DELETE_OTHERS_TOPIC'),
            hasPermission('Forums', 'EDIT_SELF_REPLY'),
            hasPermission('Forums', 'EDIT_OTHERS_REPLY'),
            hasPermission('Forums', 'DELETE_SELF_REPLY'),
            hasPermission('Forums', 'DELETE_OTHERS_REPLY'),
            hasPermission('Forums', 'CREATE_EDIT_TOPIC'),
            getSession()
        ]).then(([
            replySelf, replyOthers,
            delSelfTopic, delOthersTopic,
            editSelfReply, editOthersReply,
            delSelfReply, delOthersReply,
            createEditTopic,
            sessionUserId
        ]) => {
            setPerms({
                replySelf, replyOthers,
                deleteSelfTopic: delSelfTopic,
                deleteOthersTopic: delOthersTopic,
                editSelfReply, editOthersReply,
                deleteSelfReply: delSelfReply,
                deleteOthersReply: delOthersReply,
                createEditTopic,
            });
            setCurrentUserId(sessionUserId);
        }).catch(console.error);
    }, []);

    const [discussion_data, setDiscussion_data] = useState<{
        id: number;
        userId: number;
        author: string;
        timeAgo: string;
        title: string;
        type: "Technical Help" | "Learning Resource" | "Learning Partner" | "Course Discussion" | "Career & Portos";
        content: string;
        repliesCount: number;
        likeCount: number;
        shareCount: number;
        isLikedByCurrentUser: boolean;
        replies: {
            id: number;
            userId: number;
            author: string;
            timeAgo: string;
            text: string;
            likeCount: number;
            shareCount: number;
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
                userId: res.data.userId,
                author: res.data.authorName,
                timeAgo: res.data.createdAt ? formatDistanceToNow(new Date(res.data.createdAt)) + " ago" : "Just now",
                title: res.data.title,
                type: parseDiscussionType(res.data.type) as any,
                content: res.data.content,
                repliesCount: res.data.repliesCount,
                likeCount: res.data.likeCount,
                shareCount: res.data.shareCount || 0,
                isLikedByCurrentUser: res.data.isLikedByCurrentUser,
                replies: res.data.replies.map((r: any) => ({
                    id: r.id,
                    userId: r.userId,
                    author: r.authorName,
                    timeAgo: r.createdAt ? formatDistanceToNow(new Date(r.createdAt)) + " ago" : "Just now",
                    text: r.text,
                    likeCount: r.likeCount,
                    shareCount: r.shareCount || 0,
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

    const handleShare = (type: 'topic' | 'reply', id: number) => {
        setSharingItem({ type, id });
        setIsShareModalOpen(true);
    };

    const handleShareRecord = async (platform: string) => {
        if (!sharingItem || !discussion_data) return;

        if (sharingItem.type === 'topic') {
            recordDiscussionShareAction(sharingItem.id, platform);
            setDiscussion_data({
                ...discussion_data,
                shareCount: (discussion_data.shareCount || 0) + 1
            });
        } else {
            recordReplyShareAction(sharingItem.id, platform);
            const newReplies = discussion_data.replies.map(r => 
                r.id === sharingItem.id ? { ...r, shareCount: (r.shareCount || 0) + 1 } : r
            );
            setDiscussion_data({
                ...discussion_data,
                replies: newReplies
            });
        }
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

    const handleToggleLikeReply = async (replyId: number) => {
        if (!discussion_data) return;

        const originalIndex = discussion_data.replies.findIndex(r => r.id === replyId);
        if (originalIndex === -1) return;

        const prevData = discussion_data;
        const newReplies = [...discussion_data.replies];
        const isCurrentlyLiked = newReplies[originalIndex].isLikedByCurrentUser;

        newReplies[originalIndex] = {
            ...newReplies[originalIndex],
            isLikedByCurrentUser: !isCurrentlyLiked,
            likeCount: isCurrentlyLiked ? newReplies[originalIndex].likeCount - 1 : newReplies[originalIndex].likeCount + 1
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

    const handleDeleteTopic = async () => {
        if (!discussion_data) return;
        const res = await deleteDiscussionAction(discussion_data.id);
        if (res.success) {
            toast.success("Topic deleted successfully!");
            router.push('/discussions');
        } else {
            toast.error(res.error || "Failed to delete topic.");
            setIsDeleteTopicModalOpen(false);
        }
    };

    const handleEditTopicConfirm = async ({ title, description, type }: { title: string; description: string; type?: string }) => {
        if (!discussion_data) return;
        const res = await editDiscussionAction(discussion_data.id, title, description, type as any);
        if (res.success) {
            toast.success("Topic updated successfully!");
            fetchDiscussion();
        } else {
            toast.error(res.error || "Failed to update topic.");
        }
        setIsEditTopicModalOpen(false);
    };

    const handleDeleteReplyConfirm = async () => {
        if (!replyToDelete) return;
        const res = await deleteReplyAction(replyToDelete);
        if (res.success) {
            toast.success("Reply deleted successfully!");
            fetchDiscussion();
        } else {
            toast.error(res.error || "Failed to delete reply.");
        }
        setIsDeleteReplyModalOpen(false);
        setReplyToDelete(null);
    };

    const handleEditReplyConfirm = async (description: string) => {
        if (!replyToEdit) return;
        const res = await editReplyAction(replyToEdit.id, description);
        if (res.success) {
            toast.success("Reply edited successfully!");
            fetchDiscussion();
        } else {
            toast.error(res.error || "Failed to edit reply.");
        }
        setReplyToEdit(null);
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
            <Sidebar onOpenChange={setIsSidebarOpen} />
            {/* Background Image */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
                priority
            />
            <Image
                src="/background/PolygonBGBot.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            <div className="flex-grow z-1 mx-auto w-full max-w-7xl py-12 px-6 md:px-16">
                {/* Breadcrumbs */}
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/classes" },
                        { label: "Forums", href: "/discussions" },
                        { label: discussion_data?.title || "Topic", href: "#" }
                    ]}
                />

                <h1 className="text-3xl font-medium text-black tracking-tight pt-10 pb-12">Forums</h1>

                {isLoading || !discussion_data ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-12 h-12 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin" />
                        <p className="text-xl font-medium text-gray-400">Loading discussion content...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {/* Main Post Card */}
                        <div className="border border-gray-100 bg-white rounded-2xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center text-gray-400 text-xs font-medium mb-5">
                                <span>{discussion_data.author}</span>
                                <span className="mx-2 text-[10px]">●</span>
                                <span>{discussion_data.timeAgo}</span>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center flex-wrap gap-4">
                                    <h2 className="text-2xl font-medium text-gray-900 leading-tight">
                                        {discussion_data.title}
                                    </h2>
                                    <ForumTag type={discussion_data.type} />
                                </div>
                                <div className="flex items-center gap-2">
                                    {(perms.createEditTopic || currentUserId === discussion_data.userId) && (
                                        <button
                                            onClick={() => setIsEditTopicModalOpen(true)}
                                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                            title="Edit Topic"
                                        >
                                            <Image src="/icons/Edit.svg" alt="Edit" width={20} height={20} />
                                        </button>
                                    )}
                                    {(perms.deleteOthersTopic || (perms.deleteSelfTopic && currentUserId === discussion_data.userId)) && (
                                        <button
                                            onClick={() => setIsDeleteTopicModalOpen(true)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                                            title="Delete Topic"
                                        >
                                            <Image src="/icons/Delete.svg" alt="Delete" width={20} height={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div 
                                className="prose prose-base max-w-5xl text-gray-700 leading-[1.7] mb-10"
                                dangerouslySetInnerHTML={{ __html: discussion_data.content }}
                            />

                            <div className="flex items-center text-gray-500 gap-10">
                                <button
                                    onClick={handleToggleLike}
                                    className={`flex items-center gap-2 transition-all hover:scale-105 ${discussion_data.isLikedByCurrentUser ? 'text-red-500' : 'hover:text-red-500'}`}
                                >
                                    <Heart
                                        size={22}
                                        className={`stroke-[1.5] ${discussion_data.isLikedByCurrentUser ? 'fill-current' : ''}`}
                                    />
                                    <span className="text-xs font-semibold">{discussion_data.likeCount} likes</span>
                                </button>

                                <div className='flex items-center gap-2'>
                                    <MessageCircle size={22} className="stroke-[1.5]" />
                                    <span className="text-xs font-semibold">{discussion_data.repliesCount} replies</span>
                                </div>

                                <button
                                    onClick={() => handleShare('topic', discussion_data.id)}
                                    className='flex items-center gap-2 transition-all hover:text-green-500 hover:scale-105 font-semibold text-xs'
                                >
                                    <Send size={21} className="stroke-[1.5]" />
                                    <span>{discussion_data.shareCount} shares</span>
                                </button>
                            </div>
                        </div>

                        {/* Replies Section Container */}
                        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/50">
                            {/* Replies Header */}
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-2xl font-medium text-gray-900">Replies</h2>
                                <div className="flex items-center gap-4">
                                    <NuraSelect
                                        options={sortOptions}
                                        value={sortRepliesBy}
                                        onChange={setSortRepliesBy}
                                        placeholder="Sorted"
                                        className="w-40 shadow-sm"
                                    />
                                    {(perms.replyOthers || (perms.replySelf && currentUserId === discussion_data.userId)) && (
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
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center text-gray-400 text-xs font-medium">
                                                <span>{reply.author}</span>
                                                <span className="mx-2 text-[10px]">●</span>
                                                <span>{reply.timeAgo}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {(perms.editSelfReply && currentUserId === reply.userId) && (
                                                    <button
                                                        onClick={() => setReplyToEdit({ id: reply.id, text: reply.text })}
                                                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                                        title="Edit Reply"
                                                    >
                                                        <Image src="/icons/Edit.svg" alt="Edit" width={16} height={16} />
                                                    </button>
                                                )}
                                                {(perms.deleteOthersReply || (perms.deleteSelfReply && currentUserId === reply.userId) || currentUserId === discussion_data.userId) && (
                                                    <button
                                                        onClick={() => {
                                                            setReplyToDelete(reply.id);
                                                            setIsDeleteReplyModalOpen(true);
                                                        }}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete Reply"
                                                    >
                                                        <Image src="/icons/Delete.svg" alt="Delete" width={16} height={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div 
                                            className="prose prose-base max-w-none text-gray-700 leading-[1.7] mb-6"
                                            dangerouslySetInnerHTML={{ __html: reply.text }}
                                        />
                                        <div className="flex items-center text-gray-500 gap-8">
                                            <button
                                                onClick={() => handleToggleLikeReply((reply as any).id)}
                                                className={`flex items-center gap-2 transition-all hover:scale-105 ${reply.isLikedByCurrentUser ? 'text-red-500' : 'hover:text-red-500'}`}
                                            >
                                                <Heart
                                                    size={18}
                                                    className={`stroke-[1.5] ${reply.isLikedByCurrentUser ? 'fill-current' : ''}`}
                                                />
                                                <span className="text-xs font-semibold">{reply.likeCount} likes</span>
                                            </button>
                                            <button
                                                onClick={() => handleShare('reply', reply.id)}
                                                className='flex items-center gap-2 transition-all hover:text-green-500 hover:scale-105'
                                            >
                                                <Send size={17} className="stroke-[1.5]" />
                                                <span className="text-xs font-semibold">{reply.shareCount} shares</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {sortedReplies.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 text-base">No replies yet. Be the first to join the conversation!</p>
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

                <DiscussionTopicDialog
                    isOpen={isEditTopicModalOpen}
                    onConfirm={handleEditTopicConfirm}
                    onCancel={() => setIsEditTopicModalOpen(false)}
                    initialData={{
                        title: discussion_data?.title || "",
                        content: discussion_data?.content || "",
                        type: discussion_data ? reverseParseDiscussionType(discussion_data.type) : "TECHNICAL_HELP"
                    }}
                />

                <DiscussionTopicDialog
                    isOpen={!!replyToEdit}
                    onConfirm={({ title, description }: { title: string; description: string }) => handleEditReplyConfirm(description)}
                    onCancel={() => setReplyToEdit(null)}
                    isReply={true}
                    initialData={{ title: "", content: replyToEdit?.text || "" }}
                />

                <ConfirmModal
                    isOpen={isDeleteTopicModalOpen}
                    title="Delete Topic"
                    message="Are you sure you want to delete this topic? This action cannot be undone."
                    onConfirm={handleDeleteTopic}
                    onCancel={() => setIsDeleteTopicModalOpen(false)}
                    confirmText="Delete"
                />

                <ConfirmModal
                    isOpen={isDeleteReplyModalOpen}
                    title="Delete Reply"
                    message="Are you sure you want to delete this reply? This action cannot be undone."
                    onConfirm={handleDeleteReplyConfirm}
                    onCancel={() => {
                        setIsDeleteReplyModalOpen(false);
                        setReplyToDelete(null);
                    }}
                    confirmText="Delete"
                />

                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => {
                        setIsShareModalOpen(false);
                        setSharingItem(null);
                    }}
                    shareUrl={typeof window !== 'undefined' ? window.location.href : ""}
                    title={sharingItem?.type === 'reply' ? "Share Comment" : "Share Thread"}
                    onShare={handleShareRecord}
                />
            </div>
        </main>
    );
}