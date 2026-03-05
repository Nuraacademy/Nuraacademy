import { getAllClasses } from "@/controllers/classController"
import ClassesGrid from "./class_grid"
import SidebarWrapper from "./sidebar_wrapper"

export default async function ClassesPage() {
    // Fetch live data from the database
    const classes = await getAllClasses()

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            {/* Sidebar State Managed Separately to Avoid Client Wrapper */}
            <SidebarWrapper />

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

            {/* Render the interactive grid using Client Component */}
            <ClassesGrid initialClasses={classes} />
        </main>
    )
}