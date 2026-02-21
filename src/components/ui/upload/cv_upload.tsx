"use client"

import { useState, useRef } from "react"
import { Upload, FileText, X } from "lucide-react"

interface CVUploadProps {
    onFileSelect?: (file: File) => void
    maxSizeMB?: number
}

export default function CVUpload({ onFileSelect, maxSizeMB = 5 }: CVUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = 2
        const sizes = ["Bytes", "KB", "MB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            const maxSizeBytes = maxSizeMB * 1024 * 1024
            if (selectedFile.size > maxSizeBytes) {
                alert(`File size exceeds ${maxSizeMB} MB limit`)
                return
            }
            setFile(selectedFile)
            onFileSelect?.(selectedFile)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            const maxSizeBytes = maxSizeMB * 1024 * 1024
            if (droppedFile.size > maxSizeBytes) {
                alert(`File size exceeds ${maxSizeMB} MB limit`)
                return
            }
            setFile(droppedFile)
            onFileSelect?.(droppedFile)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const removeFile = () => {
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
            />
            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-xl bg-[#F9FBE7] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#D9F55C] transition-colors"
                >
                    <div className="mb-4 p-4 bg-white rounded-xl border shadow-sm">
                        <Upload size={32} className="text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        Maximum file size {maxSizeMB} MB
                    </p>
                </div>
            ) : (
                <div className="border-2 border-gray-300 rounded-xl bg-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                        </div>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>
            )}
            <p className="text-xs text-gray-500 mt-2">File supported: .pdf</p>
        </div>
    )
}
