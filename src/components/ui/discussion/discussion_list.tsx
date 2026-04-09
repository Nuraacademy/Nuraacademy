"use client"

import { useRouter } from 'next/navigation';
import ForumTag from '../tag/discussion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { ShareModal } from '../modal/share_modal';

export interface Topic {
    id: string;
    author: string;
    timeAgo: string;
    title: string;
    preview: string;
    likeCount: number;
    repliesCount: number;
    shareCount: number;
    type: "Technical Help" | "Learning Resource" | "Learning Partner" | "Course Discussion" | "Career & Portos";
}

export default function DiscussionList({ topics, onShareRecorded }: { topics: Topic[], onShareRecorded?: (topicId: string, platform: string) => void }) {
    const router = useRouter();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [sharingUrl, setSharingUrl] = useState("");

    const handleShare = (e: React.MouseEvent, topicId: string) => {
        e.stopPropagation();
        const url = `${window.location.origin}/discussions/topic?id=${topicId}`;
        setSharingUrl(url);
        setSharingTopicId(topicId);
        setIsShareModalOpen(true);
    };

    const [sharingTopicId, setSharingTopicId] = useState<string | null>(null);

    const handleShareRecord = (platform: string) => {
        if (sharingTopicId && onShareRecorded) {
            onShareRecorded(sharingTopicId, platform);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    className="border border-gray-100 rounded-xl p-8 transition-all cursor-pointer bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#D9F066] min-w-0 overflow-hidden"
                    onClick={() => router.push(`/discussions/topic?id=${topic.id}`)}
                >
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-400 font-medium min-w-0">
                        <span className="min-w-0 truncate">{topic.author}</span>
                        <span className="text-[10px]">●</span>
                        <span>{topic.timeAgo}</span>
                    </div>

                    <div className="flex items-center flex-wrap gap-4 mb-5 min-w-0">
                        <h2 className="text-xl font-medium text-gray-900 leading-tight min-w-0 max-w-full break-words">
                            {topic.title}
                        </h2>
                        <ForumTag type={topic.type} />
                    </div>

                    <p className="text-gray-600 text-[16px] leading-[1.6] mb-8 line-clamp-2 max-w-full break-words min-w-0">
                        {topic.preview}
                    </p>

                    <div className="flex items-center text-gray-500 gap-10">
                        <div className='flex items-center gap-2 transition-colors hover:text-red-500'>
                            <Heart size={20} className="stroke-[1.5]" />
                            <span className="text-xs font-semibold">{topic.likeCount} likes</span>
                        </div>

                        <div className='flex items-center gap-2 transition-colors hover:text-blue-500'>
                            <MessageCircle size={20} className="stroke-[1.5]" />
                            <span className="text-xs font-semibold">{topic.repliesCount} replies</span>
                        </div>

                        <button
                            className='flex items-center gap-2 transition-colors hover:text-green-500 hover:scale-105 transition-all'
                            onClick={(e) => handleShare(e, topic.id)}
                        >
                            <Send size={19} className="stroke-[1.5]" />
                            <span className="text-xs font-semibold">{topic.shareCount} shares</span>
                        </button>
                    </div>
                </div>
            ))}

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => {
                    setIsShareModalOpen(false);
                    setSharingTopicId(null);
                }}
                shareUrl={sharingUrl}
                title="Share Thread"
                onShare={handleShareRecord}
            />
        </div>
    );
}