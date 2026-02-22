"use client";

import { DiscussionTopicDialog } from '@/components/discussion_topic_dialog';
import { useState, use } from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { NuraButton } from '@/components/ui/button/button';
import ForumTag from '@/components/ui/tag/discussion';

export default function DiscussionTopicPage({
    searchParams
}: {
    searchParams: Promise<{ id?: string }>
}) {
    // Correct way to handle async searchParams in a Client Component
    const params = use(searchParams);
    const id = params.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [discussion_data, setDiscussion_data] = useState({
        author: "Tatang Supratman",
        timeAgo: "12 hours ago",
        title: "A Begginer Journey to Python",
        type: "Learning Resource" as "Technical Help" | "Learning Resource" | "Learning Partner" | "Course Discussion" | "Career & Portos",
        content: "As a new student to software engineering we will be learning python starting next semester. I would like to get ahead of the game and study beforehand on my own, face sime problems and have lots of questions to ask in classes. I am a visual person (learn best if I see or am hands on) and ask you for advice on any courses paid or free that would get me started. I have looked at Udemy, but there are mixed opinions about the quality of the courses there. Many thanks for your support.",
        repliesCount: 3,
        likeCount: 12,
        replies: [
            {
                author: "Ayu Setiawati",
                timeAgo: "8 hours ago",
                text: "I had a great joy doing the Python course on Exercism. It's a free2use course where you can donate to the project if you like. Plus it has a discord where you can post your questions or a forum if you prefer to not use discord. Exercism offers you either to do the whole python experience unguided at your own pace or in a learning mode where you get taught different concepts while doing various exercises."
            },
            {
                author: "Udin Samsudin",
                timeAgo: "5 hours ago",
                text: "I'd highly recommend this full python tutorial on youtube by Mike Dane. It helped me a lot when I was first learning python."
            },
            {
                author: "Siti Markonah",
                timeAgo: "4 hours ago",
                text: "The built-in courses in PyCharm is great, assuming you're fine with reading and doing interactive courses directly in the IDE itself, It's a real IDE, not a toy or education oriented ones, so the cons is the UI might feel overwhelming, but the pros is once you start writing your own app, there's no transition needed."
            }
        ]
    });

    const handleConfirm = (description: string) => {
        // Logic to save the new topic

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
                        { label: "Introduction to Programming", href: "/classes/1/overview" },
                        { label: "Forum Diskusi", href: "/discussions" },
                        { label: discussion_data.title, href: "/discussions/topic" }
                    ]}
                />

                <h1 className="text-4xl font-bold text-gray-900 py-8">Forum Diskusi {id && `- ${id}`}</h1>

                {/* Main Post Card */}
                <div className="border-2 border-gray-900 bg-white rounded-[2.5rem] p-8 mb-12">
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                        <span className="font-medium text-gray-500">{discussion_data.author}</span>
                        <span className="mx-2">•</span>
                        <span>{discussion_data.timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {discussion_data.title}
                        </h2>
                        <ForumTag type={discussion_data.type} />
                    </div>

                    <p className="text-gray-800 leading-relaxed text-lg mb-6">
                        {discussion_data.content}
                    </p>

                    <div className="flex items-center text-gray-600 gap-8">
                        <div className='flex items-center'>
                            <img src="/icons/Like.svg" alt="Like" className="w-5 h-5 mr-2" />
                            {discussion_data.likeCount} likes
                        </div>

                        <div className='flex items-center'>
                            <img src="/icons/Reply.svg" alt="Reply" className="w-5 h-5 mr-2" />
                            {discussion_data.repliesCount} replies
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
                        {discussion_data.replies.map((reply, index) => (
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
                    onConfirm={({ title, description }: { title: string; description: string }) => handleConfirm(description)}
                    onCancel={() => setIsDialogOpen(false)}
                    isReply={true}
                />
            </div>
        </main>
    );
}