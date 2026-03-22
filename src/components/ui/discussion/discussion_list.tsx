"use client"

import { useRouter } from 'next/navigation';
import ForumTag from '../tag/discussion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

export interface Topic {
    id: string;
    author: string;
    timeAgo: string;
    title: string;
    preview: string;
    likeCount: number;
    repliesCount: number;
    type: "Technical Help" | "Learning Resource" | "Learning Partner" | "Course Discussion" | "Career & Portos";
}

export default function DiscussionList({ topics }: { topics: Topic[] }) {
    const router = useRouter();
    const handleShare = (e: React.MouseEvent, topicId: string) => {
        e.stopPropagation();
        const url = `${window.location.origin}/discussions/topic?id=${topicId}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="space-y-6 pb-20">
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    className="border border-gray-100 rounded-[2.5rem] p-8 transition-all cursor-pointer bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#D9F066]"
                    onClick={() => router.push(`/discussions/topic?id=${topic.id}`)}
                >
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-400 font-medium">
                        <span>{topic.author}</span>
                        <span className="text-[10px]">●</span>
                        <span>{topic.timeAgo}</span>
                    </div>

                    <div className="flex items-center flex-wrap gap-4 mb-5">
                        <h2 className="text-2xl font-medium text-gray-900 leading-tight">
                            {topic.title}
                        </h2>
                        <ForumTag type={topic.type} />
                    </div>

                    <p className="text-gray-600 text-[16px] leading-[1.6] mb-8 line-clamp-2 max-w-4xl">
                        {topic.preview}
                    </p>

                    <div className="flex items-center text-gray-500 gap-10">
                        <div className='flex items-center gap-2 transition-colors hover:text-red-500'>
                            <Heart size={20} className="stroke-[1.5]" />
                            <span className="text-sm font-semibold">{topic.likeCount} likes</span>
                        </div>

                        <div className='flex items-center gap-2 transition-colors hover:text-blue-500'>
                            <MessageCircle size={20} className="stroke-[1.5]" />
                            <span className="text-sm font-semibold">{topic.repliesCount} replies</span>
                        </div>

                        <button
                            className='flex items-center gap-2 transition-colors hover:text-green-500 hover:scale-105 transition-all'
                            onClick={(e) => handleShare(e, topic.id)}
                        >
                            <Send size={19} className="stroke-[1.5]" />
                            <span className="text-sm font-semibold">{Math.floor(topic.likeCount / 3)} shares</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}