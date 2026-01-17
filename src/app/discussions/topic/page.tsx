"use client";

import { LimeButton } from '@/components/lime_button';
import { DiscussionTopicDialog } from '@/components/discussion_topic_dialog';
import React, { useState, use } from 'react';
import { Header2 } from '@/components/header2';

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
        content: "As a new student to software engineering we will be learning python starting next semester. I would like to get ahead of the game and study beforehand on my own, face sime problems and have lots of questions to ask in classes. I am a visual person (learn best if I see or am hands on) and ask you for advice on any courses paid or free that would get me started. I have looked at Udemy, but there are mixed opinions about the quality of the courses there. Many thanks for your support.",
        repliesCount: 3,
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
        <main className="min-h-screen bg-white flex flex-col font-sans text-gray-800">

            <Header2 classId={id ?? ""} variant="discussion" />
            <div className="flex-grow mx-auto w-full max-w-7xl py-8 px-6 md:px-16">
                {/* Breadcrumbs */}
                <nav className="text-gray-400 text-sm mb-6">
                    <span>Introduction to Programming</span>
                    <span className="mx-2">/</span>
                    <span>Forum Diskusi</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-500 font-medium">{discussion_data.title}</span>
                </nav>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Forum Diskusi {id && `- ${id}`}</h1>

                {/* Main Post Card */}
                <div className="border-2 border-gray-900 rounded-[2.5rem] p-8 mb-12">
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                        <span className="font-medium text-gray-500">{discussion_data.author}</span>
                        <span className="mx-2">•</span>
                        <span>{discussion_data.timeAgo}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {discussion_data.title}
                    </h2>
                    
                    <p className="text-gray-800 leading-relaxed text-lg mb-6">
                        {discussion_data.content}
                    </p>

                    <div className="flex items-center text-gray-900 font-medium">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" />
                        </svg>
                        {discussion_data.repliesCount} replies
                    </div>
                </div>

                {/* Replies Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Replies</h2>
                    <LimeButton 
                        label="Join Topic"
                        variant="submit"
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