import SidebarServer from "@/components/ui/sidebar/sidebar_server";
import AssignmentList from "./assignment_list";
import { getAssignments } from "@/controllers/assignmentController";

export default async function AssignmentPage() {
    const assignments = await getAssignments();

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 md:pl-80">
            {/* Sidebar */}
            <SidebarServer />

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
            <div className="text-black md:px-12 py-6 space-y-6 w-full max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-bold">
                    Assignments
                </h1>

                <AssignmentList initialAssignments={assignments} />
            </div>
        </main>
    );
} 
