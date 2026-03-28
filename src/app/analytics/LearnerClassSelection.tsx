"use client"

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar/sidebar";
import Image from "next/image";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import TitleCard from "@/components/ui/card/title_card";
import { useNuraRouter } from "@/components/providers/navigation-provider";

interface LearnerClassSelectionProps {
    classes: { id: number, title: string, imgUrl?: string | null }[];
}

export default function LearnerClassSelection({ classes }: LearnerClassSelectionProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useNuraRouter();

    return (
        <main className={`relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 ${isSidebarOpen ? "md:pl-80" : "md:pl-8"}`}>
            <Sidebar onOpenChange={setIsSidebarOpen} />

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

            <div className="text-black md:px-12 py-6 space-y-8 w-full max-w-screen-2xl mx-auto">
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Analytics', href: '#' },
                    ]}
                />

                <TitleCard
                    title="Your Performance Reports"
                    description="Select a class batch to view your learning progress and feedback"
                />

                {classes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {classes.map((cls) => (
                            <div 
                                key={cls.id}
                                onClick={() => router.push(`/classes/${cls.id}/analytics`)}
                                className="group relative bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-[24rem]"
                            >
                                {/* Batch Banner */}
                                <div className="h-2/3 bg-gray-100 overflow-hidden relative">
                                    <Image 
                                        src={cls.imgUrl || "/example/data_science.png"}
                                        alt={cls.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                
                                <div className="h-1/3 p-8 flex flex-col justify-center relative">
                                    <div className="absolute -top-10 left-8">
                                        <div className="bg-[#DAEE49] p-4 rounded-2xl shadow-lg group-hover:rotate-6 transition-transform">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="#1C3A37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 12V12.01" stroke="#1C3A37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-[#1C3A37] group-hover:text-black transition-colors truncate">
                                        {cls.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-black text-[10px]">
                                        Open Report →
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 bg-white/20 backdrop-blur-sm rounded-[3rem] border border-dashed border-gray-400/50">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                            </svg>
                        </div>
                        <p className="text-xl font-medium text-gray-400 italic">You don't have any active classes yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
