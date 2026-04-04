"use client"

import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { NuraButton } from "@/components/ui/button/button";
import ReferenceMaterials from "@/components/ui/reference_materials/reference_materials";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("@/components/ui/video/pdf_viewer"), { 
    ssr: false,
    loading: () => <div className="p-10 text-center animate-pulse text-gray-400">Loading document engine...</div>
});
import { startSessionAction } from "@/app/actions/session";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

interface SessionContentProps {
    classId: string;
    courseId: string;
    moduleId: string;
    isSynchronous: boolean | null;
    content: any;
    referenceMaterials: { name: string; description: string; url: string }[];
    isAdmin: boolean;
    preTestId?: number;
    postTestId?: number;
}

export default function SessionContent({
    classId,
    courseId,
    moduleId,
    isSynchronous,
    content,
    referenceMaterials,
    isAdmin,
    preTestId,
    postTestId
}: SessionContentProps) {
    const router = useRouter();

    const [isStarting, setIsStarting] = useState(false);

    const handleJoin = async () => {
        setIsStarting(true);
        const result = await startSessionAction(classId, courseId, moduleId);
        setIsStarting(false);

        if (result.success && result.url) {
            window.location.href = result.url;
        } else {
            toast.error(result.error || "Failed to start session");
        }
    };

    const makeVideoUrl = (url: string) => {
        return url.replace("watch?v=", "embed/");
    };

    const renderAsynchronousLayout = () => (
        <>
            {/* Video */}
            {content?.video && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-medium text-gray-900">Video: {content.video.title}</h2>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-lg">
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
                        <h2 className="text-sm font-medium text-gray-900">Zoom</h2>
                        <div className="flex flex-col gap-3 text-sm">
                            <p className="flex items-center gap-2">
                                <span className="text-gray-600">Link Zoom :</span>
                                <a href={content.zoom.url} className="text-blue-600 underline hover:text-blue-800 flex items-center gap-1">
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
                                label={isStarting ? "Starting..." : "Join"}
                                variant="medium"
                                onClick={handleJoin}
                                disabled={isStarting}
                            />
                            {content?.recording && (
                                <NuraButton
                                    label="View Record"
                                    variant="secondary"
                                    onClick={() => {
                                        router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}/recording`);
                                    }}
                                />
                            )}
                        </div>

                        <div className="border-t border-gray-100"></div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-sm font-medium text-gray-900">Presence & SES</h2>
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
            <div className="flex flex-col items-center gap-4 mt-10">
                <div className="flex justify-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <NuraButton
                            label={preTestId ? "Pre-test" : isAdmin ? "Create Pre-test" : "Pre-test"}
                            variant={preTestId ? "primary" : isAdmin ? "secondary" : "primary"}
                            onClick={() => {
                                if (preTestId) {
                                    router.push(`/assignment/${preTestId}`);
                                } else if (isAdmin) {
                                    router.push(`/assignment/add?classId=${classId}&courseId=${courseId}&sessionId=${moduleId}&type=PRETEST`);
                                } else {
                                    toast.error("Pre-test not available");
                                }
                            }}
                            disabled={!preTestId && !isAdmin}
                        />
                        {isAdmin && preTestId && (
                            <Link
                                href={`/assignment/add?id=${preTestId}`}
                                className="text-[10px] font-medium text-[#005954] hover:underline uppercase tracking-wider"
                            >
                                Manage Pre-test
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <NuraButton
                            label={postTestId ? "Post-test" : isAdmin ? "Create Post-test" : "Post-test"}
                            variant={postTestId ? "primary" : isAdmin ? "secondary" : "primary"}
                            onClick={() => {
                                if (postTestId) {
                                    router.push(`/assignment/${postTestId}`);
                                } else if (isAdmin) {
                                    router.push(`/assignment/add?classId=${classId}&courseId=${courseId}&sessionId=${moduleId}&type=POSTTEST`);
                                } else {
                                    toast.error("Post-test not available");
                                }
                            }}
                            disabled={!postTestId && !isAdmin}
                        />
                        {isAdmin && postTestId && (
                            <Link
                                href={`/assignment/add?id=${postTestId}`}
                                className="text-[10px] font-medium text-[#005954] hover:underline uppercase tracking-wider"
                            >
                                Manage Post-test
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
