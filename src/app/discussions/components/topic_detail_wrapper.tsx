"use client"

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import ForumTag from "@/components/ui/tag/discussion";
import { DiscussionTopicDialog } from "@/components/discussion_topic_dialog";
import { createReplyAction, likeTopicAction } from "../actions";
import { toast } from "sonner";

export function TopicDetailWrapper({ topic }: { topic: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [likes, setLikes] = useState<number>(topic.likeCount);

    const handleReply = async (data: { title: string, description: string }) => {
        const result = await createReplyAction({
            topicId: topic.id,
            authorId: "temp-user-123",
            content: data.description
        });

        if (result.success) {
            setIsDialogOpen(false);
            toast.success("Reply posted!");
        } else {
            toast.error(result.error || "Failed to post reply");
        }
    };

    const handleLike = async () => {
        const result = await likeTopicAction(topic.id);
        if (result.success) {
            setLikes((prev: number) => prev + 1);
        }
    };

    return (
        <>
            <h1 className="text-4xl font-bold text-gray-900 py-8">Forum Diskusi</h1>

            {/* Main Post Card */}
            <div className="border-2 border-gray-900 bg-white rounded-[2.5rem] p-8 mb-12">
                <div className="flex items-center text-gray-400 text-sm mb-4">
                    <span className="font-medium text-gray-500">{topic.author}</span>
                    <span className="mx-2">•</span>
                    <span>{topic.timeAgo}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {topic.title}
                    </h2>
                    <ForumTag type={topic.type} />
                </div>

                <p className="text-gray-800 leading-relaxed text-lg mb-6">
                    {topic.content}
                </p>

                <div className="flex items-center text-gray-600 gap-8">
                    <button onClick={handleLike} className='flex items-center hover:text-black transition-colors'>
                        <img src="/icons/Like.svg" alt="Like" className="w-5 h-5 mr-2" />
                        {likes} likes
                    </button>

                    <div className='flex items-center'>
                        <img src="/icons/Reply.svg" alt="Reply" className="w-5 h-5 mr-2" />
                        {topic.repliesCount} replies
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            <div className="bg-white rounded-[2.5rem] p-8 mb-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl text-gray-900">Replies</h2>
                    <NuraButton
                        label="Reply"
                        variant="primary"
                        onClick={() => setIsDialogOpen(true)}
                    />
                </div>

                <div className="space-y-10">
                    {topic.replies.map((reply: any, index: number) => (
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
                </div>
            </div>

            <DiscussionTopicDialog
                isOpen={isDialogOpen}
                onConfirm={handleReply}
                onCancel={() => setIsDialogOpen(false)}
                isReply={true}
            />
        </>
    );
}
