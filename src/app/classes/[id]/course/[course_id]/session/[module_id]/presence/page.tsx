import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getSessionById, getSessionPresence } from "@/controllers/sessionController";
import { notFound } from "next/navigation";
import PresenceClient from "./presence_client";

export default async function PresenceAndSESPage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const [session, enrollments] = await Promise.all([
        getSessionById(parseInt(moduleId)),
        getSessionPresence(parseInt(moduleId))
    ]);

    if (!session) {
        return notFound();
    }

    const classTitle = session.course?.class?.title || "Class";
    const courseTitle = session.course?.title || "Course";

    const studentPresence = enrollments.map(enrollment => {
        const ses = enrollment.ses[0]; // Get the SES for this session
        return {
            name: enrollment.user?.name || enrollment.user?.username || "Unknown",
            status: ses ? "attend" : "absent", // Simple status for now
            sesScore: ses?.score || 0
        };
    });

    const col1_5Style = { gridColumn: "span 1 / span 1" }; // Standardize to 1 for simplicity or use specific widths

    return (
        <main className="min-h-screen bg-[#F5F5EC] font-sans text-gray-800 pb-12">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Class", href: "/classes" },
                            { label: classTitle, href: `/classes/${classId}/overview` },
                            { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
                            { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
                            { label: "Presence & SES", href: "" },
                        ]}
                    />
                </div>

                {/* Banner */}
                <div className="bg-[#005954] rounded-2xl p-6 mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-white">Presence & SES</h1>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-black">{session.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">{classTitle}</p>
                    </div>

                    <hr className="border-gray-200 mb-8" />

                    <h3 className="text-lg font-bold text-black mb-6">Student Presence List</h3>

                    {/* Presence Table */}
                    <div className="w-full border border-black rounded-[1.5rem] overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 border-b border-black bg-white px-8 py-5">
                            <div className="col-span-4 text-sm font-semibold text-black text-left">Name</div>
                            <div className="col-span-1 text-sm font-semibold text-black text-center">Attend</div>
                            <div className="col-span-1 text-sm font-semibold text-black text-center">Sick</div>
                            <div className="col-span-1 text-sm font-semibold text-black text-center">Permit</div>
                            <div className="col-span-1 text-sm font-semibold text-black text-center">Absent</div>
                            <div className="col-span-4 text-sm font-semibold text-black text-right">SES Score</div>
                        </div>

                        {/* Table Rows */}
                        {studentPresence.length > 0 ? (
                            studentPresence.map((student, index) => (
                                <div
                                    key={index}
                                    className={`grid grid-cols-12 px-8 py-5 border-black ${index !== studentPresence.length - 1 ? 'border-b' : ''} bg-white items-center`}
                                >
                                    <div className="col-span-4 text-sm text-black font-medium">{student.name}</div>

                                    {/* Radio Buttons Simulation */}
                                    <div className="col-span-1 flex justify-center">
                                        <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                            {student.status === "attend" && <div className="w-full h-full bg-black rounded-full" />}
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                            {student.status === "sick" && <div className="w-full h-full bg-black rounded-full" />}
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                            {student.status === "permit" && <div className="w-full h-full bg-black rounded-full" />}
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                            {student.status === "absent" && <div className="w-full h-full bg-black rounded-full" />}
                                        </div>
                                    </div>

                                    <div className="col-span-4 text-sm text-black text-right pr-4">{student.sesScore}</div>
                                </div>
                            ))
                        ) : (
                            <div className="px-8 py-5 text-center text-gray-500">No students enrolled in this class.</div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-center">
                        <PresenceClient
                            classId={classId}
                            courseId={courseId}
                            moduleId={moduleId}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
