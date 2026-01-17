"use client"

import { MessageSquareReply } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Topic {
    id: string;
    author: string;
    timeAgo: string;
    title: string;
    preview: string;
    replies: number;
}

export default function DiscussionList({ topics }: { topics: Topic[] }) {
    const router = useRouter();
    return (
        <div className="space-y-6">
            {topics.map((topic) => (
                <div 
                    key={topic.id} 
                    className="border border-black rounded-[2rem] p-6 transition-all cursor-pointer bg-white shadow-sm hover:border-[#D9F066]"
                    onClick={() => router.push(`/discussions/topic?id=${topic.id}`)}
                >
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                        <span className="font-medium">{topic.author}</span>
                        <span>•</span>
                        <span>{topic.timeAgo}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-black mb-3">
                        {topic.title}
                    </h2>
                    
                    <p className="text-[#4a4a4a] text-[15px] leading-relaxed mb-4 line-clamp-2">
                        {topic.preview}
                    </p>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MessageSquareReply size={18} className="rotate-180" />
                        <span>{topic.replies} replies</span>
                    </div>
                </div>
            ))}
        </div>
    );
}