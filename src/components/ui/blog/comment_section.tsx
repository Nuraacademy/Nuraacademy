"use client"

import { useState } from "react";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { NuraButton } from "@/components/ui/button/button";
import { Heart, Send, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { addCommentAction, deleteCommentAction } from "@/app/actions/blog";
import { toast } from "sonner";

interface Comment {
    id: number;
    text: string;
    createdAt: Date;
    user: {
        id: number;
        name: string | null;
        username: string;
    };
}

interface CommentSectionProps {
    blogId: number;
    comments: Comment[];
    currentUserId?: number;
    isAdmin?: boolean;
}

export const CommentSection = ({ blogId, comments: initialComments, currentUserId, isAdmin }: CommentSectionProps) => {
    const [comments, setComments] = useState(initialComments);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    }
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-950">Comment</h2>
                {/* Sort Dropdown as shown in image */}
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                    Sorted
                    <ChevronDown size={14} />
                </button>
            </div>

            {/* Comment Input Box */}
            {currentUserId ? (
                <div className="bg-white rounded-[24px] border border-gray-200 p-6 shadow-sm mb-12">
                    <RichTextInput 
                        value={commentText}
                        onChange={setCommentText}
                    />
                    <div className="flex justify-end items-center gap-6 mt-6">
                        <button 
                            onClick={() => setCommentText("")}
                            className="text-xs font-bold text-gray-500 hover:text-gray-950 transition-colors"
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
                <div className="bg-gray-50 rounded-3xl p-8 text-center border border-dashed border-gray-200 mb-12">
                    <p className="text-gray-600 font-medium">Please log in to post a comment.</p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 text-[11px] font-bold">
                                <span className="text-[#D9F55C] bg-[#D9F55C]/10 px-1 rounded">@{comment.user.username}</span>
                                <span className="text-gray-400 font-normal">
                                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                                </span>
                            </div>
                            {(currentUserId === comment.user.id || isAdmin) && (
                                <button 
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
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
                            <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors text-[10px] font-bold">
                                <Heart size={16} strokeWidth={1.5} />
                                <span>67 likes</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors text-[10px] font-bold">
                                <Send size={16} strokeWidth={1.5} />
                                <span>5 shares</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
