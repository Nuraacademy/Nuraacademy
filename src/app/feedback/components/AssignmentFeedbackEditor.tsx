"use client"

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import { saveAssignmentFeedback } from '@/app/actions/assignment';
import { uploadFileAction } from '@/app/actions/common';
import { toast } from 'sonner';
import { NuraButton } from '@/components/ui/button/button';
import { X, FileText } from 'lucide-react';
import { SidebarLayoutPad } from '@/components/providers/sidebar-provider';
import Image from 'next/image';
import TitleCard from '@/components/ui/card/title_card';
import { FeedbackCriteriaField } from '@/components/ui/feedback/FeedbackCriteriaField';

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
    initialProblemUnderstanding?: number;
    initialProblemUnderstandingFeedback?: string;
    initialTechnicalAbility?: number;
    initialTechnicalAbilityFeedback?: string;
    initialSolutionQuality?: number;
    initialSolutionQualityFeedback?: string;
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
    initialFiles = [],
    initialProblemUnderstanding = 0,
    initialProblemUnderstandingFeedback = '',
    initialTechnicalAbility = 0,
    initialTechnicalAbilityFeedback = '',
    initialSolutionQuality = 0,
    initialSolutionQualityFeedback = ''
}: AssignmentFeedbackEditorProps) {
    const router = useRouter();
    const [feedback, setFeedback] = useState(initialFeedback || '');
    const [files, setFiles] = useState<AttachedFile[]>(initialFiles || []);
    const [problemUnderstanding, setProblemUnderstanding] = useState(initialProblemUnderstanding);
    const [problemUnderstandingFeedback, setProblemUnderstandingFeedback] = useState(initialProblemUnderstandingFeedback || '');
    const [technicalAbility, setTechnicalAbility] = useState(initialTechnicalAbility);
    const [technicalAbilityFeedback, setTechnicalAbilityFeedback] = useState(initialTechnicalAbilityFeedback || '');
    const [solutionQuality, setSolutionQuality] = useState(initialSolutionQuality);
    const [solutionQualityFeedback, setSolutionQualityFeedback] = useState(initialSolutionQualityFeedback || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveAssignmentFeedback(resultId, assignmentId, {
            problemUnderstanding,
            problemUnderstandingFeedback,
            technicalAbility,
            technicalAbilityFeedback,
            solutionQuality,
            solutionQualityFeedback,
            feedback,
            feedbackFiles: files
        });

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
        setProblemUnderstanding(0);
        setProblemUnderstandingFeedback('');
        setTechnicalAbility(0);
        setTechnicalAbilityFeedback('');
        setSolutionQuality(0);
        setSolutionQualityFeedback('');
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
        <main className="min-h-screen bg-[#FDFDF7] text-gray-800 pb-20 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
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

            <SidebarLayoutPad className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/classes" },
                        { label: "Assignment", href: "/feedback" },
                        { label: assignmentTitle, href: `/assignment/${assignmentId}/results` },
                        { label: learnerName, href: "#" },
                    ]}
                />

                {/* Hero Section */}
                <TitleCard
                    title={learnerName}
                    description={`${className} ${courseName ? `| ${courseName}` : ''}`}
                />

                {/* Feedback Card */}
                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col gap-12">
                    <div className="space-y-12">
                        <FeedbackCriteriaField
                            label="Pemahaman masalah (Problem understanding)"
                            description="Ability to grasp and define the core problem/requirements."
                            score={problemUnderstanding}
                            onScoreChange={setProblemUnderstanding} 
                            feedback={problemUnderstandingFeedback} 
                            onFeedbackChange={setProblemUnderstandingFeedback} 
                        />
                        <FeedbackCriteriaField
                            label="Kemampuan teknis (Technical ability)"
                            description="Efficiency and correctness of the technical implementation."
                            score={technicalAbility}
                            onScoreChange={setTechnicalAbility} 
                            feedback={technicalAbilityFeedback} 
                            onFeedbackChange={setTechnicalAbilityFeedback} 
                        />
                        <FeedbackCriteriaField
                            label="Kualitas solusi (Solution quality)"
                            description="Overall effectiveness, completeness, and elegance of the solution."
                            score={solutionQuality}
                            onScoreChange={setSolutionQuality} 
                            feedback={solutionQualityFeedback} 
                            onFeedbackChange={setSolutionQualityFeedback} 
                        />
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

                        <NuraButton
                            label={isUploading ? "Uploading..." : "Attach File"}
                            variant="primary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end items-center gap-8 pt-8 border-t border-transparent">
                        <NuraButton
                            label="Clear"
                            variant="secondary"
                            onClick={handleClear}
                        />
                        <NuraButton
                            label={isSaving ? "Submitting..." : "Submit"}
                            variant="primary"
                            onClick={handleSave}
                            disabled={isSaving || isUploading}
                        />
                    </div>
                </div>
            </SidebarLayoutPad>
        </main>
    );
}
