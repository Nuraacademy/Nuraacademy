"use client"

import { useState } from "react"
import { NuraButton } from "../button/button"
import { NuraTextInput } from "../input/text_input"
import FileUpload from "../upload/file_upload"
import { createCurriculaAction, uploadCurriculaFile } from "@/app/actions/curricula"
import { toast } from "sonner"

interface CurriculaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (curricula: any) => void;
}

export default function CurriculaModal({ isOpen, onClose, onCreated }: CurriculaModalProps) {
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSubmitting(true);
        try {
            let fileUrl = "";
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await uploadCurriculaFile(formData);
                if (uploadRes.success && uploadRes.url) {
                    fileUrl = uploadRes.url;
                } else {
                    toast.error(uploadRes.error || "Failed to upload file");
                    setIsSubmitting(false);
                    return;
                }
            }

            const res = await createCurriculaAction({
                title,
                fileUrl,
                status: "Active"
            });

            if (res.success && res.curricula) {
                toast.success("Curricula created successfully");
                onCreated(res.curricula);
                onClose();
                // Reset state
                setTitle("");
                setSelectedFile(null);
            } else {
                toast.error(res.error || "Failed to create curricula");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => !isSubmitting && onClose()}
            />

            {/* Modal Card */}
            <div className="relative bg-white w-full max-w-lg rounded-xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-medium text-gray-900 mb-6">Add New Curricula</h2>

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Curricula Title</label>
                        <NuraTextInput
                            placeholder="Curricula title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Upload Curricula</label>
                        <FileUpload
                            onFileSelect={setSelectedFile}
                            accept=".csv,.pdf"
                            supportedFileType=".pdf"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <NuraButton
                            label="Cancel"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        />
                        <NuraButton
                            label={isSubmitting ? "Creating..." : "Create"}
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
