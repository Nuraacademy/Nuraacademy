"use client"

import ClassCard from "@/components/ui/card/class_card"
import { NuraTextInput } from "@/components/ui/input/text_input"
import Sidebar from "@/components/ui/sidebar/sidebar"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation";

const MOCK_CLASSES = [
    {
        id: "1",
        imageUrl: "/example/dummy.png",
        title: "Introduction to Programming",
        duration: 55,
        scheduleStart: new Date("2026-02-22"),
        scheduleEnd: new Date("2026-05-31"),
        method: "Flipped Blended Classroom",
        modules: 5,
        description: "Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan Python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file.",
    },
    {
        id: "2",
        imageUrl: "/example/dummy.png",
        title: "Introduction to Programming",
        duration: 55,
        scheduleStart: new Date("2026-02-22"),
        scheduleEnd: new Date("2026-05-31"),
        method: "Flipped Blended Classroom",
        modules: 5,
        description: "Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan Python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file.",
    },
    {
        id: "3",
        imageUrl: "/example/dummy.png",
        title: "Introduction to Programming",
        duration: 55,
        scheduleStart: new Date("2026-02-22"),
        scheduleEnd: new Date("2026-05-31"),
        method: "Flipped Blended Classroom",
        modules: 5,
        description: "Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan Python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file.",
    },
    {
        id: "4",
        imageUrl: "/example/dummy.png",
        title: "Introduction to Programming",
        duration: 55,
        scheduleStart: new Date("2026-02-22"),
        scheduleEnd: new Date("2026-05-31"),
        method: "Flipped Blended Classroom",
        modules: 5,
        description: "Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan Python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file.",
    },
    {
        id: "5",
        imageUrl: "/example/dummy.png",
        title: "Introduction to Programming",
        duration: 55,
        scheduleStart: new Date("2026-02-22"),
        scheduleEnd: new Date("2026-05-31"),
        method: "Flipped Blended Classroom",
        modules: 5,
        description: "Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan Python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file.",
    },
    {
        id: "6",
        imageUrl: "/example/dummy.png",
        title: "Introduction to Programming",
        duration: 55,
        scheduleStart: new Date("2026-02-22"),
        scheduleEnd: new Date("2026-05-31"),
        method: "Flipped Blended Classroom",
        modules: 5,
        description: "Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan Python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file.",
    },
]

export default function ClassesPage() {
    const [searchValue, setSearchValue] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const classData = MOCK_CLASSES;

    return (
        <main className={`relative min-h-screen w-full overflow-hidden py-8 pr-8 transition-all duration-300 ${isSidebarOpen ? "pl-80" : "pl-8"}`}>
            {/* Sidebar */}
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Background Image */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute -z-10 h-[40rem] object-cover top-0 left-0"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute -z-10 h-[40rem] object-cover bottom-0 right-0"
            />

            {/* Content */}
            <div className="flex justify-between items-center text-black mb-10 w-full max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-bold">
                    Explore Our Classes
                </h1>
                <div className="relative w-64">
                    <NuraTextInput
                        placeholder="Search class"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        icon={<Search strokeWidth={1.5} />}
                    />
                </div>
            </div>

            {/* Classes Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-2xl mx-auto">
                {
                    classData.map((item) => (
                        <ClassCard
                            key={item.id}
                            id={item.id}
                            imageUrl={item.imageUrl}
                            title={item.title}
                            duration={item.duration}
                            scheduleStart={item.scheduleStart}
                            scheduleEnd={item.scheduleEnd}
                            method={item.method}
                            modules={item.modules}
                            description={item.description}
                            onClick={() => router.push(`/classes/${item.id}/overview`)}
                        />
                    ))
                }
            </div>

        </main>
    )
}