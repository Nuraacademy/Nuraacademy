"use client"

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar/sidebar";
import Image from "next/image";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import TitleCard from "@/components/ui/card/title_card";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import { AnalyticsCard } from "@/components/ui/card/analytics_card";

interface ClassListClientProps {
    classes: { id: number, title: string, _count: { enrollments: number } }[];
}

export default function ClassListClient({ classes }: ClassListClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const filteredClasses = classes.filter(cls => 
        cls.title.toLowerCase().includes(searchValue.toLowerCase())
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
                        { label: 'Class Analytics', href: '#' },
                    ]}
                />

                <TitleCard
                    title="Class Analytics"
                    description="Listing all batches with combined enrollment and feedback statistics"
                />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <NuraSearchInput
                        className="w-full md:w-72"
                        placeholder="Search class batch..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredClasses.map((cls) => (
                        <AnalyticsCard
                            key={cls.id}
                            title={cls.title}
                            type="Class"
                            description={`${cls._count.enrollments} Enrolled Students`}
                            href={`/classes/${cls.id}/analytics`}
                        />
                    ))}
                    {filteredClasses.length === 0 && (
                        <p className="text-center text-gray-500 py-12 italic border border-dashed border-gray-200 rounded-2xl">
                            {searchValue ? "No matching classes found." : "No classes found in the system."}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
