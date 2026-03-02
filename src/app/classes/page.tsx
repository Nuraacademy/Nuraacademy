import ClassCard from "@/components/ui/card/class_card"
import { NuraTextInput } from "@/components/ui/input/text_input"
import Sidebar from "@/components/ui/sidebar/sidebar"
import { Search } from "lucide-react"
import { getClasses } from "@/controllers/classController"
import SearchInput from "@/components/search/search_input"

export default async function ClassesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const query = (await searchParams).q || "";
    const allClassData = await getClasses();

    // Filter by search query if present
    const classData = query
        ? allClassData.filter((c: any) =>
            c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.description.toLowerCase().includes(query.toLowerCase())
        )
        : allClassData;

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300">
            {/* Sidebar - Note: Sidebar might need its own client-side state for open/close */}
            <Sidebar />

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-black mb-10 w-full max-w-screen-2xl mx-auto relative z-10">
                <h1 className="text-4xl font-bold">
                    Explore Our Classes
                </h1>
                <div className="relative w-full md:w-64">
                    <SearchInput defaultValue={query} />
                </div>
            </div>

            {/* Classes Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-2xl mx-auto relative z-10">
                {
                    allClassData.map((item: any) => (
                        <ClassCard
                            key={item.id}
                            id={item.id}
                            imageUrl={item.imageUrl || "/example/dummy.png"}
                            title={item.title}
                            duration={item.durationHours}
                            scheduleStart={item.scheduleStart}
                            scheduleEnd={item.scheduleEnd}
                            method={item.method}
                            modules={0}
                            description={item.description}
                        />
                    ))
                }
                {classData.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No classes found matching "{query}"
                    </div>
                )}
            </div>

        </main>
    )
}