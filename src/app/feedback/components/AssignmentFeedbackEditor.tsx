"use client"

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveAssignmentFeedback } from '@/app/actions/assignment';
import { uploadFileAction } from '@/app/actions/common';
import { toast } from 'sonner';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { NuraButton } from '@/components/ui/button/button';
import { X, Paperclip, FileText } from 'lucide-react';
import Sidebar from '@/components/ui/sidebar/sidebar';
import Image from 'next/image';

interface AttachedFile {
    name: string;
    url: string;
    size?: number;
}

interface AssignmentFeedbackEditorProps {
    assignmentId: number;
    enrollmentId: number;
    resultId: number;
    learnerName: string;
    assignmentTitle: string;
    className: string;
    courseName: string;
    initialFeedback: string;
    initialFiles: AttachedFile[];
}

export default function AssignmentFeedbackEditor({
    assignmentId,
    enrollmentId,
    resultId,
    learnerName,
    assignmentTitle,
    className,
    courseName,
    initialFeedback,
    initialFiles = []
}: AssignmentFeedbackEditorProps) {
    const router = useRouter();
    const [feedback, setFeedback] = useState(initialFeedback || '');
    const [files, setFiles] = useState<AttachedFile[]>(initialFiles || []);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveAssignmentFeedback(resultId, feedback, assignmentId, files);

        if (res.success) {
            toast.success("Feedback submitted successfully!");
            router.push(`/assignment/${assignmentId}/results`);
        } else {
            toast.error("Failed to submit feedback: " + res.error);
        }
        setIsSaving(false);
    };

    const handleClear = () => {
        setFeedback('');
        setFiles([]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadFileAction(formData);
        if (res.success) {
            setFiles(prev => [...prev, {
                name: res.name!,
                url: res.url!,
                size: res.size
            }]);
            toast.success("File attached!");
        } else {
            toast.error("Upload failed: " + res.error);
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20 relative">
            <Sidebar />

            <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <Image
                    src="/background/PolygonBGTop.svg"
                    alt=""
                    className="absolute top-0 left-0 w-auto h-[40rem]"
                    width={500}
                    height={500}
                    priority
                />
                <Image
                    src="/background/PolygonBGBot.svg"
                    alt=""
                    className="absolute bottom-0 right-0 w-auto h-[40rem]"
                    width={500}
                    height={500}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8 transition-all duration-300 md:pl-80">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/classes" },
                        { label: "Assignment", href: "/feedback" },
                        { label: assignmentTitle, href: `/assignment/${assignmentId}/results` },
                        { label: learnerName, href: "#" },
                    ]}
                />

                {/* Hero Section */}
                <div className="bg-[#005954] rounded-xl p-8 text-white shadow-sm space-y-2">
                    <h1 className="text-2xl font-medium">{learnerName}</h1>
                    <p className="text-white/80 text-sm font-medium">
                        {className} {courseName ? `| ${courseName}` : ''}
                    </p>
                </div>

                {/* Feedback Card */}
                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col gap-8">
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-tight">Feedback Answer</h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <RichTextInput
                                value={feedback}
                                onChange={(val) => setFeedback(val)}
                            />
                        </div>
                    </div>

                    {/* File Attachment List */}
                    <div className="space-y-4">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-[#FAFAFA]">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <FileText className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                                        <span className="text-xs text-gray-500">{formatSize(file.size)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        ))}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`flex items-center gap-2 px-4 py-2 bg-[#DAEE49] text-[#005954] rounded-full text-xs font-medium hover:bg-[#C9D942] transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Paperclip className="w-4 h-4" />
                            {isUploading ? "Uploading..." : "Attach File"}
                        </button>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end items-center gap-8 pt-8 border-t border-transparent">
                        <button
                            onClick={handleClear}
                            className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                        >
                            Clear
                        </button>
                        <NuraButton
                            label={isSaving ? "Submitting..." : "Submit"}
                            variant="primary"
                            className="min-w-[160px] h-12 text-sm font-medium bg-[#DAEE49] text-[#005954] hover:bg-[#C9D942] rounded-xl"
                            onClick={handleSave}
                            disabled={isSaving || isUploading}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
