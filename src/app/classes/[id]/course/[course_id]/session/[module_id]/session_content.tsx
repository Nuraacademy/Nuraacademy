"use client"

import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { NuraButton } from "@/components/ui/button/button";
import ReferenceMaterials from "@/components/ui/reference_materials/reference_materials";
import PDFViewer from "@/components/ui/video/pdf_viewer";

interface SessionContentProps {
    classId: string;
    courseId: string;
    moduleId: string;
    isSynchronous: boolean | null;
    content: any;
    referenceMaterials: { name: string; description: string; url: string }[];
    isAdmin: boolean;
}

export default function SessionContent({
    classId,
    courseId,
    moduleId,
    isSynchronous,
    content,
    referenceMaterials,
    isAdmin
}: SessionContentProps) {
    const router = useRouter();

    const makeVideoUrl = (url: string) => {
        return url.replace("watch?v=", "embed/");
    };

    const renderAsynchronousLayout = () => (
        <>
            {/* Video */}
            {content?.video && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold text-gray-900">Video: {content.video.title}</h2>
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={makeVideoUrl(content.video.url)}
                            title={content.video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>
            )}

            {/* Asynchronous File (PDF) */}
            {content?.file && (
                <PDFViewer
                    url={content.file.url}
                    title={content.file.title}
                    editUrl={`/classes/${classId}/course/${courseId}/session/${moduleId}/edit`}
                    isAdmin={isAdmin}
                />
            )}

            {/* Reference Materials */}
            {referenceMaterials.length > 0 && (
                <ReferenceMaterials materials={referenceMaterials} />
            )}
        </>
    );

    const renderSynchronousLayout = () => (
        <>
            {/* Reference Materials */}
            {referenceMaterials.length > 0 && (
                <ReferenceMaterials materials={referenceMaterials} />
            )}

            {/* Zoom */}
            {content?.zoom && (
                <>
                    <div className="border-t border-gray-100"></div>
                    <div className="flex flex-col gap-6">
                        <h2 className="text-sm font-bold text-gray-900">Zoom</h2>
                        <div className="flex flex-col gap-3 text-sm">
                            <p className="flex items-center gap-2">
                                <span className="text-gray-600">Link Zoom :</span>
                                <a href={content.zoom.url} className="text-gray-900 font-medium hover:underline flex items-center gap-1">
                                    {content.zoom.url}
                                </a>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-gray-600">Status :</span>
                                <span className="text-gray-900 font-medium">{content.zoom.status || "Scheduled"}</span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <NuraButton
                                label="Join"
                                variant="medium"
                                className="min-w-[120px] h-10 text-sm font-bold"
                                onClick={() => { window.location.href = content.zoom.url; }}
                            />
                            <NuraButton
                                label="View Record"
                                variant="secondary"
                                className="min-w-[120px] h-10 text-sm font-bold border border-black"
                                onClick={() => {
                                    router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}/recording`);
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-sm font-bold text-gray-900">Presence & SES</h2>
                            <a
                                href={`/classes/${classId}/course/${courseId}/session/${moduleId}/presence`}
                                className="text-xs text-[#008B8B] font-medium hover:underline flex items-center gap-1"
                            >
                                Lihat daftar hadir
                                <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </>
            )}
        </>
    );

    const renderContent = () => {
        if (isSynchronous === true && (content?.video || content?.file) && content?.zoom?.startTime && new Date() > new Date(content.zoom.startTime)) {
            return renderAsynchronousLayout();
        }
        if (isSynchronous === true) {
            return renderSynchronousLayout();
        }
        else if (isSynchronous === false) {
            return renderAsynchronousLayout();
        }
        // Default: just show reference materials
        return referenceMaterials.length > 0 ? <ReferenceMaterials materials={referenceMaterials} /> : null;
    };

    return (
        <>
            {renderContent()}

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
        </>
    );
}
