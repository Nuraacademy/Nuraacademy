"use client"

import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { SESSION_DATA, SynchronousSession } from "../constants";
import { SessionVideoPlayer } from "@/components/ui/video/session_video_player";

export default function SessionRecordingPage() {
    const params = useParams();
    const router = useRouter();

    const classId = params.id as string;
    const courseId = params.course_id as string;
    const moduleId = params.module_id as string;

    const session = SESSION_DATA.sessions[moduleId] as SynchronousSession | undefined;

    if (!session) {
        return <div className="p-10 text-center">Session not found</div>;
    }

    if (!session.recording) {
        return <div className="p-10 text-center">Recording is not available for this session</div>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: SESSION_DATA.classTitle, href: `/classes/${classId}/overview` },
        { label: SESSION_DATA.courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: "Zoom Session", href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
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
                            <span className="font-bold text-gray-900 mr-2">Time:</span>
                            <span className="text-gray-700">{session.time}</span>
                        </p>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Video */}
                    <SessionVideoPlayer
                        title={session.recording.title}
                        url={session.recording.url}
                    />

                    {/* Footer Button */}
                    <div className="flex justify-center mt-4">
                        <NuraButton
                            label="Back to Session"
                            variant="primary"
                            className="min-w-[160px] h-10 text-sm font-bold"
                            onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}`)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

