"use client"

import { useState, useMemo } from "react";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { NuraButton } from "@/components/ui/button/button";
import { NuraSelect } from "@/components/ui/input/nura_select";
import { Heart, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { addCommentAction, deleteCommentAction, toggleLikeCommentAction, recordCommentShareAction } from "@/app/actions/blog";
import { toast } from "sonner";
import { ShareModal } from "@/components/ui/modal/share_modal";

interface Comment {
    id: number;
    text: string;
    createdAt: Date;
    user: {
        id: number;
        name: string | null;
        username: string;
    };
    isLikedByCurrentUser?: boolean;
    _count?: {
        likes: number;
        shares: number;
    };
}

interface CommentSectionProps {
    blogId: number;
    comments: Comment[];
    currentUserId?: number;
    isAdmin?: boolean;
}

const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Most Liked", value: "likes" },
];

export const CommentSection = ({ blogId, comments: initialComments, currentUserId, isAdmin }: CommentSectionProps) => {
    const [comments, setComments] = useState(initialComments);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortCommentsBy, setSortCommentsBy] = useState("newest");

    // Share modal state
    const [sharingComment, setSharingComment] = useState<Comment | null>(null);

    const sortedComments = useMemo(() => {
        const list = [...comments];
        if (sortCommentsBy === "newest") {
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortCommentsBy === "likes") {
            list.sort((a, b) => (b._count?.likes ?? 0) - (a._count?.likes ?? 0));
        }
        return list;
    }, [comments, sortCommentsBy]);

    const handlePublish = async () => {
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        const result = await addCommentAction(blogId, commentText);
        setIsSubmitting(false);

        if (result.success && result.data) {
            toast.success("Comment published");
            setComments([
                {
                    id: result.data.id,
                    text: result.data.text,
                    createdAt: new Date(result.data.createdAt),
                    user: {
                        id: currentUserId!,
                        name: "You",
                        username: "you"
                    },
                    isLikedByCurrentUser: false,
                    _count: { likes: 0, shares: 0 },
                },
                ...comments
            ]);
            setCommentText("");
        } else {
            toast.error(result.error || "Failed to publish comment");
        }
    };

    const handleDelete = async (commentId: number) => {
        const result = await deleteCommentAction(commentId, blogId);
        if (result.success) {
            toast.success("Comment deleted");
            setComments(comments.filter(c => c.id !== commentId));
        } else {
            toast.error(result.error || "Failed to delete comment");
        }
    };

    const handleToggleLike = async (commentId: number) => {
        if (!currentUserId) {
            toast.error("Please log in to like comments");
            return;
        }

        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;

        const result: any = await toggleLikeCommentAction(commentId, blogId);
        if (result.success && result.liked !== undefined) {
            setComments(comments.map(c => 
                c.id === commentId 
                    ? { 
                        ...c, 
                        isLikedByCurrentUser: result.liked,
                        _count: {
                            likes: (c._count?.likes ?? 0) + (result.liked ? 1 : -1),
                            shares: c._count?.shares ?? 0,
                        }
                    } 
                    : c
            ));
        } else if (!result.success) {
            toast.error(result.error || "Failed to like comment");
        }
    };

    const handleShare = (comment: Comment) => {
        setSharingComment(comment);
    };

    const onCommentShareRecord = async (platform: string) => {
        if (!sharingComment) return;
        
        await recordCommentShareAction(sharingComment.id, blogId, platform);
        
        // Update local state for share count
        setComments(comments.map(c => 
            c.id === sharingComment.id 
                ? { 
                    ...c, 
                    _count: {
                        likes: c._count?.likes ?? 0,
                        shares: (c._count?.shares ?? 0) + 1,
                    }
                } 
                : c
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-medium text-gray-950">Comment</h2>
                <NuraSelect
                    options={sortOptions}
                    value={sortCommentsBy}
                    onChange={setSortCommentsBy}
                    placeholder="Sorted"
                    className="w-40 shrink-0 shadow-sm"
                />
            </div>

            {/* Comment Input Box */}
            {currentUserId ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-12">
                    <RichTextInput
                        value={commentText}
                        onChange={setCommentText}
                    />
                    <div className="flex justify-end items-center gap-6 mt-6">
                        <button
                            onClick={() => setCommentText("")}
                            className="text-xs font-medium text-gray-500 hover:text-gray-950 transition-colors"
                        >
                            Clear
                        </button>
                        <NuraButton
                            label="Publish"
                            variant="primary"
                            onClick={handlePublish}
                            isLoading={isSubmitting}
                            className="!w-auto px-10 !bg-[#D9F55C] !text-black hover:!bg-[#c8e44a] border-none shadow-sm"
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200 mb-12">
                    <p className="text-gray-600 font-medium">Please log in to post a comment.</p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {sortedComments.map((comment) => (
                    <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 text-[11px] font-medium">
                                <span className="text-[#D9F55C] bg-[#D9F55C]/10 px-1 rounded-xl">@{comment.user.username}</span>
                                <span className="text-gray-400 font-normal">
                                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                                </span>
                            </div>
                            {(currentUserId === comment.user.id || isAdmin) && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-[10px] font-medium text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                        <div
                            className="text-gray-900 text-[13px] leading-relaxed mb-4 max-w-none prose prose-p:my-0 prose-sm focus:outline-none"
                            dangerouslySetInnerHTML={{ __html: comment.text }}
                        />
                        <div className="flex items-center gap-5 text-gray-400">
                            <button 
                                onClick={() => handleToggleLike(comment.id)}
                                className={`flex items-center gap-1.5 transition-colors text-[10px] font-medium ${comment.isLikedByCurrentUser ? 'text-red-500' : 'hover:text-red-500'}`}
                            >
                                <Heart size={16} strokeWidth={1.5} className={comment.isLikedByCurrentUser ? 'fill-current' : ''} />
                                <span>{comment._count?.likes || 0} likes</span>
                            </button>
                            <button 
                                onClick={() => handleShare(comment)}
                                className="flex items-center gap-1.5 hover:text-blue-500 transition-colors text-[10px] font-medium"
                            >
                                <Send size={16} strokeWidth={1.5} />
                                <span>{comment._count?.shares || 0} shares</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Share Modal for Comments */}
            <ShareModal
                isOpen={!!sharingComment}
                onClose={() => setSharingComment(null)}
                shareUrl={typeof window !== 'undefined' && sharingComment ? `${window.location.origin}${window.location.pathname}#comment-${sharingComment.id}` : ""}
                title="Share Comment"
                onShare={onCommentShareRecord}
            />
        </div>
    );
};
