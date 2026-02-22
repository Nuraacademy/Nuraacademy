"use client"

import { useRouter } from 'next/navigation';
import ForumTag from './ui/tag/discussion';

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

                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xl font-bold text-black">
                            {topic.title}
                        </h2>
                        <ForumTag type={topic.type} />
                    </div>


                    <p className="text-gray-600 text-[15px] leading-relaxed mb-4 line-clamp-2">
                        {topic.preview}
                    </p>

                    <div className="flex items-center text-gray-600 gap-8">
                        <div className='flex items-center'>
                            <img src="/icons/Like.svg" alt="Like" className="w-5 h-5 mr-2" />
                            {topic.likeCount} likes
                        </div>

                        <div className='flex items-center'>
                            <img src="/icons/Reply.svg" alt="Reply" className="w-5 h-5 mr-2" />
                            {topic.repliesCount} replies
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}