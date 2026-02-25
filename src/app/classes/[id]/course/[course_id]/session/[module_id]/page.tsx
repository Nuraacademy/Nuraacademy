"use client"

import { useParams, useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { SESSION_DATA, AsynchronousSession, SynchronousSession } from "./constants";
import ReferenceMaterials from "@/components/ui/reference_materials/reference_materials";

export default function SessionPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;
    const courseId = params.course_id as string;
    const moduleId = params.module_id as string;

    const session = SESSION_DATA.sessions[moduleId];

    const isRecordingPage = session?.type === "Asynchronous";

    if (!session) {
        return <div className="p-10 text-center">Session not found</div>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: SESSION_DATA.classTitle, href: `/classes/${classId}/overview` },
        { label: SESSION_DATA.courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: "#" },
    ];

    const renderAsynchronousLayout = (s: AsynchronousSession) => (
        <>
            {/* Video */}
            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-bold text-gray-900">Video: {s.video.title}</h2>
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                    <iframe
                        width="100%"
                        height="100%"
                        src={s.video.url}
                        title={s.video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>

            {/* Reference Materials */}
            <ReferenceMaterials materials={s.referenceMaterials} />
        </>
    );

    const renderSynchronousLayout = (s: SynchronousSession) => (
        <>
            {/* Reference Materials */}
            <ReferenceMaterials materials={s.referenceMaterials} />

            {/* Zoom */}
            <div className="border-t border-gray-100"></div>
            <div className="flex flex-col gap-6">
                <h2 className="text-sm font-bold text-gray-900">Zoom</h2>
                <div className="flex flex-col gap-3 text-sm">
                    <p className="flex items-center gap-2">
                        <span className="text-gray-600">Link Zoom :</span>
                        <a href={s.zoom.link} className="text-gray-900 font-medium hover:underline flex items-center gap-1">
                            {s.zoom.link}
                        </a>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="text-gray-600">Status :</span>
                        <span className="text-gray-900 font-medium">{s.zoom.status}</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <NuraButton
                        label="Join"
                        variant="medium"
                        className="min-w-[120px] h-10 text-sm font-bold"
                        onClick={() => { window.location.href = s.zoom.link; }}
                    />
                    <NuraButton
                        label="View Record"
                        variant="secondary"
                        className="min-w-[120px] h-10 text-sm font-bold"
                        onClick={() => {
                            router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}/recording`);
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-bold text-gray-900">Presence & SES</h2>
                    <a
                        href={s.presence.href}
                        className="text-xs text-[#008B8B] font-medium hover:underline flex items-center gap-1"
                    >
                        {s.presence.label}
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </>
    );



    const renderSessionContent = () => {
        switch (session.type) {
            case "Asynchronous":
                return renderAsynchronousLayout(session);
            case "Synchronous":
                return renderSynchronousLayout(session);
            case "Assignment":
                return <ReferenceMaterials materials={session.referenceMaterials} />;
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title with Badge */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">
                        {isRecordingPage ? "Session Recording" : session.title}
                    </h1>
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

                    {/* Type-specific content */}
                    {renderSessionContent()}

                    {/* Footer Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                        <NuraButton
                            label="Pre-test"
                            variant="primary"
                            className="min-w-[160px] h-10 text-sm font-bold"
                            onClick={() => {
                                router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}/pre-test`);
                            }}
                        />
                        <NuraButton
                            label="Post-test"
                            variant="primary"
                            className="min-w-[160px] h-10 text-sm font-bold"
                            onClick={() => {
                                router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}/post-test`);
                            }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
