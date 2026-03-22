"use client"

import { useState } from "react";
import { NuraSelect } from "@/components/ui/input/nura_select";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { FeedbackCard } from "@/components/ui/card/feedback_card";
import { FeedbackItem } from "@/app/actions/feedback";
import Image from "next/image";

interface FeedbackListProps {
    initialFeedbacks: FeedbackItem[];
}

export default function FeedbackList({ initialFeedbacks }: FeedbackListProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [feedbackType, setFeedbackType] = useState("all");

    const filteredFeedbacks = initialFeedbacks.filter((feedback) => {
        const matchesSearch = feedback.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            feedback.className.toLowerCase().includes(searchValue.toLowerCase());
        const matchesType = feedbackType === "all" || feedback.type === feedbackType;
        return matchesSearch && matchesType;
    });

    return (
        <main className={`relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 ${isSidebarOpen ? "md:pl-80" : "md:pl-8"}`}>
            {/* Sidebar */}
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Background Images - Using the same as assignment page */}
            <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
                <Image
                    src="/background/PolygonBGTop.svg"
                    alt=""
                    className="absolute top-0 left-0 w-auto h-[40rem] opacity-40"
                    width={500}
                    height={500}
                    priority
                />
                <Image
                    src="/background/PolygonBGBot.svg"
                    alt=""
                    className="absolute bottom-0 right-0 w-auto h-[40rem] opacity-40"
                    width={500}
                    height={500}
                />
            </div>

            {/* Content */}
            <div className="text-black md:px-12 py-6 space-y-8 w-full max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-medium">
                    Feedbacks
                </h1>

                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    <NuraSearchInput
                        className="w-full md:w-72"
                        placeholder="Search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <NuraSelect
                            className="w-full md:w-48"
                            value={feedbackType}
                            onChange={setFeedbackType}
                            options={[
                                { label: "All", value: "all" },
                                { label: "Reflection", value: "Reflection" },
                                { label: "Assignment", value: "Assignment" },
                                { label: "Peer", value: "Peer" },
                                { label: "Class", value: "Class" },
                                { label: "Trainer", value: "Trainer" },
                            ]}
                            placeholder="Type"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pb-20">
                    {filteredFeedbacks.map((feedback) => (
                        <FeedbackCard
                            key={feedback.id}
                            id={feedback.id}
                            title={feedback.title}
                            type={feedback.type}
                            classTitle={feedback.className}
                            href={feedback.href}
                        />
                    ))}
                    {filteredFeedbacks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                            <img src="/icons/sidebar/Feedback.svg" alt="No feedback" className="w-16 h-16 opacity-20 mb-4" />
                            <p className="text-gray-500 text-lg">No feedbacks found.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
