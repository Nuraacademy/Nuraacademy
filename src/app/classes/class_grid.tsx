"use client"

import ClassCard from "@/components/ui/card/class_card"
import { NuraTextInput } from "@/components/ui/input/text_input"
import { NuraButton } from "@/components/ui/button/button"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useNavigation } from "@/components/providers/navigation-provider"
import { NuraSearchInput } from "@/components/ui/input/nura_search_input"

export default function ClassesGrid({ initialClasses, canCreate, canDelete }: { initialClasses: any[], canCreate?: boolean, canDelete?: boolean }) {
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();
    const { startRedirect } = useNavigation();

    const filteredClasses = initialClasses.filter(c =>
        c.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <>
            {/* Search Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-black mb-4 w-full max-w-screen-2xl mx-auto md:px-16 relative z-10">
                <h1 className="text-4xl font-medium">
                    Explore Our Classes
                </h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <NuraSearchInput
                            placeholder="Search class"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    {canCreate && (
                        <NuraButton
                            label="Add Class"
                            variant="primary"
                            onClick={() => startRedirect('/classes/add')}
                            className="shrink-0"
                        />
                    )}
                </div>
            </div>

            {/* Classes Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-2xl mx-auto md:px-16 relative z-10">
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
                            canEdit={canCreate}
                            canDelete={canDelete}
                            onClick={() => startRedirect(`/classes/${item.id}/overview`)}
                        />
                    ))
                }

                {filteredClasses.length === 0 && (
                    <div className="col-span-1 border border-dashed rounded-xl flex items-center justify-center p-8 bg-white/50 w-full min-h-32">
                        <p className="text-black/50">No classes found.</p>
                    </div>
                )}
            </div>
        </>
    )
}
