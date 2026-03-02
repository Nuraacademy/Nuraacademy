import { getSessionDetails } from "@/controllers/courseController";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { SessionVideoPlayer } from "@/components/ui/video/session_video_player";
import Link from "next/link";

export default async function SessionRecordingPage({ params }: { params: Promise<{ id: string, course_id: string, module_id: string }> }) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const session = await getSessionDetails(moduleId);

    if (!session) {
        return <div className="p-10 text-center">Session not found</div>;
    }

    const zoomSession = session.zoomSession;
    if (!zoomSession || !zoomSession.recordingUrl) {
        return <div className="p-10 text-center text-gray-800">Recording is not available for this session</div>;
    }

    const { course } = session;
    const { class: classInfo } = course;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classInfo.title, href: `/classes/${classId}/overview` },
        { label: course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: "Session Recording", href: "#" },
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">Session Recording</h1>
                </section>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Time Section */}
                    <div>
                        <p className="text-sm">
                            <span className="font-bold text-gray-900 mr-2">Session:</span>
                            <span className="text-gray-700">{session.title}</span>
                        </p>
                        {session.scheduledAt && (
                            <p className="text-sm mt-1">
                                <span className="font-bold text-gray-900 mr-2">Scheduled:</span>
                                <span className="text-gray-700">{session.scheduledAt.toLocaleString()}</span>
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Video */}
                    <SessionVideoPlayer
                        title={zoomSession.recordingTitle || "Session Recording"}
                        url={zoomSession.recordingUrl}
                    />

                    {/* Footer Button */}
                    <div className="flex justify-center mt-4">
                        <Link href={`/classes/${classId}/course/${courseId}/session/${moduleId}`}>
                            <NuraButton
                                label="Back to Session"
                                variant="primary"
                                className="min-w-[160px] h-10 text-sm font-bold"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
