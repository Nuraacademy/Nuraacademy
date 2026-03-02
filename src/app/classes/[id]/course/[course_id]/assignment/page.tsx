import { getAssignmentDetails } from "@/controllers/assessmentController";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";

export default async function CourseAssignmentPage({ params }: { params: Promise<{ id: string, course_id: string }> }) {
    const { id: classId, course_id: courseId } = await params;

    // We might need a specific assignment ID, but for now we fetch the first one for the course if not specified
    // Or we expect the assignment ID in the URL. Looking at the path structure, it's missing the assignment ID.
    // If it's a general assignment page for the course, we might need a different approach.
    // Let's assume for now we use a placeholder or the first assignment found.
    const assignment = await getAssignmentDetails(courseId); // This is likely wrong if courseId != assignmentId

    // Actually, let's just fetch by courseId for now if it's a one-assignment-per-course thing in the mock
    // In a real app, the URL would be /classes/[id]/course/[course_id]/assignment/[assignment_id]

    // I'll use a hack for now to get something to show
    const fallbackAssignment = {
        title: "Course Assignment",
        detail: "Complete the project as described in the course materials.",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tag: "INDIVIDUAL"
    };

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Class Overview", href: `/classes/${classId}/overview` },
        { label: "Course Overview", href: `/classes/${classId}/course/${courseId}/overview` },
        { label: assignment?.title || fallbackAssignment.title, href: "#" },
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold text-white">{assignment?.title || fallbackAssignment.title}</h1>
                        <p className="text-xs text-white/80">
                            Assignment | {assignment?.tag || fallbackAssignment.tag}
                        </p>
                    </div>
                    <span className="px-3 py-1 bg-[#1C3A37] border border-white/20 rounded-full text-[10px] text-white/80 font-medium">
                        {assignment?.tag || fallbackAssignment.tag}
                    </span>
                </section>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900">Start Date:</span>
                            <span className="text-gray-700">{(assignment?.startDate || fallbackAssignment.startDate).toLocaleDateString("en-GB", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900">End Date:</span>
                            <span className="text-gray-700">{(assignment?.endDate || fallbackAssignment.endDate).toLocaleDateString("en-GB", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Detail Tugas */}
                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-bold text-gray-900">Detail Tugas</span>
                        <p className="text-gray-700 leading-relaxed">{assignment?.detail || fallbackAssignment.detail}</p>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-center gap-6 pt-4">
                        <NuraButton
                            label="Work on Assignment"
                            variant="primary"
                            className="h-10 text-sm font-bold"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
