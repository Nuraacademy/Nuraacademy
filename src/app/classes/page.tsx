import { getAllClasses } from "@/controllers/classController"
import ClassesGrid from "./class_grid"
import SidebarWrapper from "./sidebar_wrapper"
import Image from "next/image"

export default async function ClassesPage() {
    // Fetch live data from the database
    const classes = await getAllClasses()

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            {/* Sidebar State Managed Separately to Avoid Client Wrapper */}
            <SidebarWrapper />

            {/* Background Image */}
            <div className="absolute -z-10 h-[40rem] w-full top-0 left-0 pointer-events-none">
                <Image
                    src="/background/PolygonBGTop.svg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>
            <div className="absolute -z-10 h-[40rem] w-full bottom-0 right-0 pointer-events-none">
                <Image
                    src="/background/PolygonBGBot.svg"
                    alt="Background"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Render the interactive grid using Client Component */}
            <ClassesGrid initialClasses={classes} />
        </main>
    )
}