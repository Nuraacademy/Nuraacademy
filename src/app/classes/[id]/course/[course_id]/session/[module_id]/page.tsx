import { getSessionDetails } from "@/controllers/courseController";
import { getCourseDetails } from "@/controllers/courseController";
import { getClassDetails } from "@/controllers/classController";
import { ExternalLink } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import ReferenceMaterials from "@/components/ui/reference_materials/reference_materials";
import Link from "next/link";

export default async function SessionPage({ params }: { params: Promise<{ id: string, course_id: string, module_id: string }> }) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const [session, course, classInfo] = await Promise.all([
        getSessionDetails(moduleId),
        getCourseDetails(courseId),
        getClassDetails(classId)
    ]);

    if (!session || !course || !classInfo) {
        return <div className="p-10 text-center">Session, course, or class not found</div>;
    }

    const isRecordingPage = false; // Add logic if needed for recording view

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classInfo.title, href: `/classes/${classId}/overview` },
        { label: course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: "#" },
    ];

    const formatTime = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
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
                            <span className="text-gray-700">{session.scheduledAt ? formatTime(session.scheduledAt) : "Not scheduled"}</span>
                        </p>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Type-specific content */}
                    {session.type === "ASYNCHRONOUS" && session.video && (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-sm font-bold text-gray-900">Video: {session.video.title}</h2>
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={session.video.url}
                                    title={session.video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen>
                                </iframe>
                            </div>
                        </div>
                    )}

                    {session.type === "SYNCHRONOUS" && session.zoomSession && (
                        <div className="flex flex-col gap-6">
                            <h2 className="text-sm font-bold text-gray-900">Zoom</h2>
                            <div className="flex flex-col gap-3 text-sm">
                                <p className="flex items-center gap-2">
                                    <span className="text-gray-600">Link Zoom :</span>
                                    <a href={session.zoomSession.link} className="text-gray-900 font-medium hover:underline flex items-center gap-1">
                                        {session.zoomSession.link}
                                    </a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-gray-600">Status :</span>
                                    <span className="text-gray-900 font-medium">{session.zoomSession.status}</span>
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Link href={session.zoomSession.link}>
                                    <NuraButton
                                        label="Join"
                                        variant="medium"
                                        className="min-w-[120px] h-10 text-sm font-bold"
                                    />
                                </Link>
                                <Link href={`/classes/${classId}/course/${courseId}/session/${moduleId}/recording`}>
                                    <NuraButton
                                        label="View Record"
                                        variant="secondary"
                                        className="min-w-[120px] h-10 text-sm font-bold"
                                    />
                                </Link>
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-sm font-bold text-gray-900">Presence & SES</h3>
                                <a
                                    href={`/classes/${classId}/course/${courseId}/session/${moduleId}/presence`}
                                    className="text-xs text-[#008B8B] font-medium hover:underline flex items-center gap-1"
                                >
                                    Presence & Feedback Form
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Reference Materials */}
                    {session.referenceMaterials.length > 0 && (
                        <ReferenceMaterials materials={session.referenceMaterials.map(m => ({
                            name: m.name,
                            description: m.description || "",
                            url: m.fileUrl || "#"
                        }))} />
                    )}

                    {/* Footer Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                        <Link href={`/classes/${classId}/course/${courseId}/session/${moduleId}/pre-test`}>
                            <NuraButton
                                label="Pre-test"
                                variant="primary"
                                className="min-w-[160px] h-10 text-sm font-bold"
                            />
                        </Link>
                        <Link href={`/classes/${classId}/course/${courseId}/session/${moduleId}/post-test`}>
                            <NuraButton
                                label="Post-test"
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
