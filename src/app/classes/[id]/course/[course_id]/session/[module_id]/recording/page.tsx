import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { SessionVideoPlayer } from "@/components/ui/video/session_video_player";
import { getSessionById } from "@/controllers/sessionController";
import { notFound } from "next/navigation";
import RecordingClient from "./recording_client";

export default async function SessionRecordingPage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const session = await getSessionById(parseInt(moduleId));

    if (!session) {
        return notFound();
    }

    // Parse JSON fields safely
    const parseJson = (val: any) => {
        if (!val) return null;
        if (typeof val === 'object') return val;
        try { return JSON.parse(val); } catch { return null; }
    };

    const content = parseJson(session.content);
    const schedule = parseJson(session.schedule);

    if (!content?.recording) {
        return (
            <main className="min-h-screen bg-[#FDFDF7] font-sans flex items-center justify-center">
                <div className="p-10 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">No Recording Available</h2>
                    <p className="text-gray-600 mb-6">Recording is not available for this session at the moment.</p>
                    <RecordingClient classId={classId} courseId={courseId} moduleId={moduleId} />
                </div>
            </main>
        );
    }

    const classTitle = session.course?.class?.title || "Class";
    const courseTitle = session.course?.title || "Course";

    // Build time string from schedule
    const timeString = schedule?.date
        ? new Date(schedule.date).toLocaleString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "TBA";

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
    ];

    const makeVideoUrl = (url: string) => {
        return url.replace("watch?v=", "embed/");
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">{session.title}</h1>
                </section>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Time Section */}
                    <div>
                        <p className="text-sm">
                            <span className="font-bold text-gray-900 mr-2">Time:</span>
                            <span className="text-gray-700">{timeString}</span>
                        </p>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Video - Render Asynchronous Layout Style */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-gray-900">Recording: {content.recording.title}</h2>
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                            <iframe
                                width="100%"
                                height="100%"
                                src={makeVideoUrl(content.recording.url)}
                                title={content.recording.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>

                    {/* Footer Button */}
                    <div className="flex justify-center mt-4">
                        <RecordingClient
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

