"use client"

import ClassCard from "@/components/ui/card/class_card"
import { NuraTextInput } from "@/components/ui/input/text_input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ClassesGrid({ initialClasses }: { initialClasses: any[] }) {
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();

    const filteredClasses = initialClasses.filter(c =>
        c.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <>
            {/* Search Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-black mb-10 w-full max-w-screen-2xl mx-auto md:pl-16 relative z-10">
                <h1 className="text-4xl font-bold">
                    Explore Our Classes
                </h1>
                <div className="relative w-full md:w-64">
                    <NuraTextInput
                        placeholder="Search class"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        icon={<Search strokeWidth={1.5} />}
                    />
                </div>
            </div>

            {/* Classes Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-2xl mx-auto md:pl-16 relative z-10">
                {
                    filteredClasses.map((item) => (
                        <ClassCard
                            key={item.id}
                            id={String(item.id)}
                            imageUrl={item.imgUrl}
                            title={item.title}
                            duration={item.hours || 0}
                            scheduleStart={item.startDate ? new Date(item.startDate) : undefined}
                            scheduleEnd={item.endDate ? new Date(item.endDate) : undefined}
                            method={item.methods}
                            courses={item.courses?.length || 0}
                            description={item.description}
                            isEnrolled={item.isEnrolled}
                            onClick={() => router.push(`/classes/${item.id}/overview`)}
                        />
                    ))
                }

                {filteredClasses.length === 0 && (
                    <div className="col-span-1 border border-dashed rounded-lg flex items-center justify-center p-8 bg-white/50 w-full min-h-32">
                        <p className="text-black/50">No classes found.</p>
                    </div>
                )}
            </div>
        </>
    )
}
