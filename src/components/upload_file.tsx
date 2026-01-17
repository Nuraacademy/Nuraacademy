"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText } from "lucide-react";
import { LimeButton } from "./lime_button";

interface SelectedFile {
    file: File
    name: string;
    size: string;
    progress: number;
}

interface UploadModalProps {
    onClose: () => void;
    onUploadSuccess: (file: File) => void; 
}

export function UploadModal({ onClose, onUploadSuccess }: UploadModalProps) {
    const [file, setFile] = useState<SelectedFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Format file size from bytes to KB/MB
    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = 2;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            simulateUpload(selectedFile);
        }
    };

    const simulateUpload = (selectedFile: File) => {
        setFile({
            file: selectedFile,
            name: selectedFile.name,
            size: formatSize(selectedFile.size),
            progress: 0,
        });

        // Simulate progress bar increment
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setFile((prev) => (prev ? { ...prev, progress: currentProgress } : null));
            
            if (currentProgress >= 100) {
                clearInterval(interval);
            }
        }, 10);
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Attach File</h2>
                    <button onClick={onClose} className="p-1 border-2 border-black rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Hidden Input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".pdf" 
                    className="hidden" 
                />

                {/* Dropzone Area */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-400 rounded-[2rem] bg-[#F9FBE7]/50 p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#D9F55C] transition-colors"
                >
                    <div className="mb-4 p-4 bg-white rounded-xl border shadow-sm">
                        <Upload size={32} />
                    </div>
                    <p className="text-lg font-medium">
                        <span className="underline decoration-2 underline-offset-4">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Maximum file size 10 MB</p>
                </div>

                <p className="text-sm font-medium text-gray-600 mt-4">File supported: .pdf</p>

                {/* File Upload Progress Display */}
                {file && (
                    <div className="mt-6 border border-gray-300 rounded-2xl p-5 flex flex-col gap-3 relative animate-in slide-in-from-top-2">
                        <button 
                            onClick={removeFile}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white border border-gray-200 rounded-xl">
                                <FileText size={24} className="text-gray-700" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 leading-tight">{file.name}</span>
                                <span className="text-xs text-gray-500">{file.size}</span>
                            </div>
                        </div>

                        { file.progress < 100 &&
                            <div className="flex items-center gap-4">
                                <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-black transition-all duration-300" 
                                        style={{ width: `${file.progress}%` }} 
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-600 w-8">{file.progress}%</span>
                            </div>
                        }
                    </div>
                )}

                {/* Footer Action */}
                <div className="mt-8 flex justify-end">
                    <LimeButton 
                        label="Attach File" 
                        variant="solid" 
                        className="min-w-[180px]" 
                        onClick={() => {
                            if (file && file.progress === 100) {
                                onUploadSuccess(file.file); 
                                onClose();
                            } else {
                                alert("Please select a file and wait for upload.");
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}