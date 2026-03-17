import SidebarWrapper from "@/app/classes/sidebar_wrapper";
import { getAssignmentBySessionAndType } from "@/controllers/assignmentController";
import { getSessionById } from "@/controllers/sessionController";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import ExerciseClient from "./exercise_client";

export default async function ExercisePage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const [assignment, session] = await Promise.all([
        getAssignmentBySessionAndType(parseInt(moduleId), 'EXERCISE'),
        getSessionById(parseInt(moduleId))
    ]);

    if (!session) {
        return notFound();
    }

    const classTitle = session.course?.class?.title || "Class";
    const courseTitle = session.course?.title || "Course";
    const sessionTitle = session.title;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: sessionTitle, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: "Exercise", href: "#" },
    ];

    const exerciseDetail = assignment?.description || "No description available for this exercise.";
    const colabUrl = assignment?.instruction || "#";
    const exerciseTitle = "Exercise: " + sessionTitle;

    return (
        <main className="relative bg-[#FDFDF7] min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 md:pl-8">
            <SidebarWrapper />

            <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] md:px-12 w-full max-w-screen-2xl mx-auto gap-4 z-10 relative">
                <div className="flex-none flex-col items-end justify-between space-y-4">
                    <div>
                        <Breadcrumb items={breadcrumbItems} />
                        <h1 className="text-4xl font-bold mt-6 text-black">
                            {exerciseTitle}
                        </h1>
                    </div>
                    {/* Main Content Card */}
                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                        {/* Dates */}
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold text-black">
                                    {sessionTitle}
                                </h1>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-700">
                                    {exerciseDetail}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100"></div>

                        {/* Detail Tugas */}
                        <div className="flex flex-col gap-2 text-sm">
                            <span className="font-bold text-gray-900">Detail Tugas</span>
                            <p className="text-gray-700 leading-relaxed">
                                {assignment?.instruction || "Kunjungi link di bawah ini untuk mengerjakan exercise."}
                            </p>
                        </div>

                        {/* Footer Buttons */}
                        <ExerciseClient
                            classId={classId}
                            courseId={courseId}
                            moduleId={moduleId}
                            colabUrl={colabUrl}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
