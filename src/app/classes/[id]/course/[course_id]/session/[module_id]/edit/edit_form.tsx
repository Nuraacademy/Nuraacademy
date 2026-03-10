"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSessionContent, createSession, uploadSessionFile } from "@/app/actions/session";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { NuraTextArea } from "@/components/ui/input/text_area";
import { Trash2, Plus } from "lucide-react";
import FileUpload from "@/components/ui/upload/file_upload";
import { M3DateTimePicker } from "@/components/ui/input/datetime_picker";

interface ReferenceMaterial {
    name: string;
    description: string;
    url: string;
}

export default function EditSessionForm({
    classId,
    courseId,
    moduleId,
    initialTitle = "",
    initialIsSynchronous = false,
    initialSchedule,
    initialContent,
    initialReference
}: {
    classId: string;
    courseId: string;
    moduleId: string;
    initialTitle?: string;
    initialIsSynchronous?: boolean;
    initialSchedule: any;
    initialContent: any;
    initialReference: ReferenceMaterial[];
}) {
    const router = useRouter();
    const isNew = moduleId === "new";

    const [sessionTitle, setSessionTitle] = useState(initialTitle);
    const [isSynchronous, setIsSynchronous] = useState(initialIsSynchronous);

    // State for Async Content Type (Video vs File)
    const [asyncContentType, setAsyncContentType] = useState<'video' | 'file'>(
        initialContent?.file ? 'file' : 'video'
    );

    // State for Schedule
    const [scheduleDate, setScheduleDate] = useState<Date | null>(
        initialSchedule?.date ? new Date(initialSchedule.date) : null
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for Video
    const [videoUrl, setVideoUrl] = useState(initialContent?.video?.url || "");
    const [videoTitle, setVideoTitle] = useState(initialContent?.video?.title || "");

    // State for File (PDF)
    const [fileUrl, setFileUrl] = useState(initialContent?.file?.url || "");
    const [fileTitle, setFileTitle] = useState(initialContent?.file?.title || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // State for Zoom
    const [zoomUrl, setZoomUrl] = useState(initialContent?.zoom?.url || "");
    const [zoomStatus, setZoomStatus] = useState(initialContent?.zoom?.status || "Scheduled");

    // State for References
    const [references, setReferences] = useState<ReferenceMaterial[]>(
        initialReference.length > 0 ? initialReference : []
    );

    const handleAddReference = () => {
        setReferences([...references, { name: "", description: "", url: "" }]);
    };

    const handleRemoveReference = (index: number) => {
        const newReferences = [...references];
        newReferences.splice(index, 1);
        setReferences(newReferences);
    };

    const handleReferenceChange = (index: number, field: keyof ReferenceMaterial, value: string) => {
        const newReferences = [...references];
        newReferences[index][field] = value;
        setReferences(newReferences);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!sessionTitle.trim()) {
                setError("Session title is required.");
                setIsSubmitting(false);
                return;
            }

            // Construct the new content object
            const newContent = {
                ...initialContent,
            };

            // Handle Asynchronous Content
            if (!isSynchronous) {
                if (asyncContentType === 'video') {
                    if (videoUrl || videoTitle) {
                        newContent.video = { url: videoUrl, title: videoTitle };
                    } else {
                        delete newContent.video;
                    }
                    delete newContent.file;
                } else if (asyncContentType === 'file') {
                    let finalFileUrl = fileUrl;

                    // Upload file if selected
                    if (selectedFile) {
                        const formData = new FormData();
                        formData.append("file", selectedFile);
                        const uploadRes = await uploadSessionFile(formData);
                        if (uploadRes.success && uploadRes.url) {
                            finalFileUrl = uploadRes.url;
                        } else {
                            setError(uploadRes.error || "Failed to upload file");
                            setIsSubmitting(false);
                            return;
                        }
                    }

                    if (finalFileUrl || fileTitle) {
                        newContent.file = { url: finalFileUrl, title: fileTitle };
                    } else {
                        delete newContent.file;
                    }
                    delete newContent.video;
                }
            }

            if (zoomUrl) {
                newContent.zoom = { url: zoomUrl, status: zoomStatus };
            } else {
                delete newContent.zoom;
            }

            // Construct the new schedule object
            const newSchedule = scheduleDate ? { date: scheduleDate.toISOString() } : null;

            const cleanReferences = references.filter(ref => ref.name || ref.url);

            let result;
            if (isNew) {
                result = await createSession(classId, parseInt(courseId), {
                    title: sessionTitle,
                    isSynchronous: isSynchronous,
                    schedule: newSchedule,
                    content: newContent,
                    reference: cleanReferences
                });
            } else {
                result = await updateSessionContent(
                    moduleId,
                    classId,
                    courseId,
                    sessionTitle,
                    isSynchronous,
                    newSchedule,
                    newContent,
                    cleanReferences
                );
            }

            if (result.success) {
                if (isNew && "sessionId" in result && result.sessionId) {
                    router.push(`/classes/${classId}/course/${courseId}/session/${result.sessionId}`);
                } else {
                    router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}`);
                }
                router.refresh();
            } else {
                setError(result.error || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-6 text-sm w-full bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100">
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-gray-900">Session Settings</span>
                    <p className="text-gray-500 text-xs">Configure the basic settings for this session.</p>
                </div>
                <NuraTextInput
                    label="Session Title"
                    placeholder="e.g. Module 1: Introduction to SQL"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                />

                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium mb-1 text-gray-900">Session Type</label>
                    <div className="flex bg-white border border-gray-200 p-1 rounded-2xl w-fit">
                        <button
                            type="button"
                            onClick={() => setIsSynchronous(false)}
                            className={`rounded-xl px-6 py-1.5 text-sm transition-all ${!isSynchronous
                                ? "bg-[#cdff2b] font-bold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Asynchronous
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSynchronous(true)}
                            className={`rounded-xl px-6 py-1.5 text-sm transition-all ${isSynchronous
                                ? "bg-[#cdff2b] font-bold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Synchronous
                        </button>
                    </div>
                </div>

                <M3DateTimePicker
                    label="Schedule Date"
                    value={scheduleDate}
                    onChange={(date) => setScheduleDate(date)}
                    required
                />
            </div>

            {!isSynchronous && (
                <div className="flex flex-col gap-6 w-full bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100">
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-gray-900">Asynchronous Content Type</span>
                        <p className="text-gray-500 text-xs">Choose the type of content for this asynchronous session.</p>
                    </div>
                    <div className="flex bg-white border border-gray-200 p-1 rounded-2xl w-fit">
                        <button
                            type="button"
                            onClick={() => setAsyncContentType('video')}
                            className={`rounded-xl px-6 py-1.5 text-sm transition-all ${asyncContentType === 'video'
                                ? "bg-[#cdff2b] font-bold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Video
                        </button>
                        <button
                            type="button"
                            onClick={() => setAsyncContentType('file')}
                            className={`rounded-xl px-6 py-1.5 text-sm transition-all ${asyncContentType === 'file'
                                ? "bg-[#cdff2b] font-bold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            File (PDF)
                        </button>
                    </div>

                    {asyncContentType === 'video' ? (
                        <div className="flex flex-col gap-4 mt-2">
                            <NuraTextInput
                                label="Video URL (Youtube URL)"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                            />
                            <NuraTextInput
                                label="Video Title"
                                placeholder="Module 1: Getting Started..."
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-medium mb-1 text-gray-900">PDF File</label>
                                {fileUrl && !selectedFile && (
                                    <p className="text-xs text-[#005954] mb-2 font-medium">Current file: {fileUrl.split('/').pop()}</p>
                                )}
                                <FileUpload
                                    onFileSelect={(file) => setSelectedFile(file)}
                                    accept=".pdf"
                                    supportedFileType=".pdf"
                                />
                            </div>
                            <NuraTextInput
                                label="File Title"
                                placeholder="e.g. Module 1 Handbook"
                                value={fileTitle}
                                onChange={(e) => setFileTitle(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="border-t border-gray-100" />

            {/* Zoom Section */}
            {isSynchronous && (
                <div className="flex flex-col gap-4 text-sm w-full">
                    <span className="font-bold text-gray-900">Live Zoom Link</span>
                    <div className="flex flex-col gap-4">
                        <NuraTextInput
                            label="Zoom URL"
                            placeholder="https://zoom.us/j/..."
                            value={zoomUrl}
                            onChange={(e) => setZoomUrl(e.target.value)}
                        />
                        <NuraTextInput
                            label="Status"
                            placeholder="Scheduled"
                            value={zoomStatus}
                            onChange={(e) => setZoomStatus(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="border-t border-gray-100" />

            {/* References Section */}
            <div className="flex flex-col gap-4 text-sm w-full">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Reference Materials</span>
                    <button
                        type="button"
                        onClick={handleAddReference}
                        className="flex items-center gap-1 text-sm text-[#005954] font-semibold hover:underline"
                    >
                        <Plus size={16} /> Add Link
                    </button>
                </div>

                {references.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No reference materials added yet.</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {references.map((ref, index) => (
                            <div key={index} className="relative bg-white p-4 rounded-[1.5rem] border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveReference(index)}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition z-10"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="flex flex-col gap-4 pr-10">
                                    <NuraTextInput
                                        label="Name / Title"
                                        placeholder="SQL Installation Guide"
                                        value={ref.name}
                                        onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                                    />
                                    <NuraTextInput
                                        label="URL"
                                        placeholder="https://..."
                                        value={ref.url}
                                        onChange={(e) => handleReferenceChange(index, 'url', e.target.value)}
                                    />
                                    <NuraTextArea
                                        label="Description"
                                        placeholder="Step-by-step guide..."
                                        value={ref.description}
                                        onChange={(e) => handleReferenceChange(index, 'description', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-2">
                <NuraButton
                    label="Cancel"
                    variant="secondary"
                    className="min-w-[120px] h-10 text-sm font-bold border border-black"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(`/classes/${classId}/course/${courseId}/overview`);
                    }}
                />
                <NuraButton
                    label={isSubmitting ? "Saving..." : "Save Changes"}
                    variant="primary"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                />
            </div>
        </form>
    );
}
