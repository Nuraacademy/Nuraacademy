import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { AddAssignmentClient } from "@/app/assignment/add/AddAssignmentClient";
import { getAllClasses } from "@/controllers/classController";

export default async function AddAssignmentPage() {
    // We fetch basic standard data that the client component might need for autocompletes
    const classes = await getAllClasses();

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Create Placement Test", href: "#" }
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16 relative overflow-hidden">
            {/* Background design elements to match the mockup */}
            <div className="absolute top-20 -left-64 w-[600px] h-[600px] bg-[#97AFA1]/40 rounded-full blur-3xl z-0 pointer-events-none"></div>
            <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] bg-[#D1EAA3]/40 rounded-full blur-3xl z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 relative z-10">
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <h1 className="text-xl font-bold text-gray-900 mb-8">Create Test</h1>

                <AddAssignmentClient classes={classes} />
            </div>
        </main>
    );
}
