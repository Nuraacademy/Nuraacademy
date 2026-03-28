"use client"

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar/sidebar";
import Image from "next/image";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import TitleCard from "@/components/ui/card/title_card";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import { AnalyticsCard } from "@/components/ui/card/analytics_card";

interface TrainerListClientProps {
    trainers: { 
        id: number, 
        name: string, 
        username: string, 
        email: string,
        trainedClasses: { id: number, title: string }[]
    }[];
}

export default function TrainerListClient({ trainers }: TrainerListClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const filteredTrainers = trainers.filter(trainer =>
        trainer.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        trainer.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchValue.toLowerCase())
    );

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
                        { label: 'Analytics', href: '/analytics' },
                        { label: 'Trainer Analytics', href: '#' },
                    ]}
                />

                <TitleCard
                    title="Trainer Analytics"
                    description="Listing all instructional staff members for performance evaluation"
                />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <NuraSearchInput
                        className="w-full md:w-72"
                        placeholder="Search trainer..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredTrainers.map((trainer) => (
                        <div key={trainer.id} className="flex flex-col gap-3">
                            {trainer.trainedClasses.length > 0 ? (
                                trainer.trainedClasses.map((cls) => (
                                    <AnalyticsCard
                                        key={`${trainer.id}-${cls.id}`}
                                        title={`${trainer.name || trainer.username}`}
                                        type="Trainer"
                                        description={`Evaluating ${cls.title}`}
                                        href={`/classes/${cls.id}/analytics/trainer?trainerId=${trainer.id}`}
                                    />
                                ))
                            ) : (
                                <div className="p-10 border border-gray-100 rounded-2xl bg-white/50 text-gray-400 text-center italic text-sm">
                                    No assigned classes for {trainer.name || trainer.username}
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredTrainers.length === 0 && (
                        <p className="text-center text-gray-500 py-12 italic border border-dashed border-gray-200 rounded-2xl">
                            {searchValue ? "No matching trainers found." : "No trainers found in the system."}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
