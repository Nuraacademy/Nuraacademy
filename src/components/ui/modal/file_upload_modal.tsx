"use client"

import { useState, useRef } from "react"
import { X, Upload, FileText } from "lucide-react"
import { NuraButton } from "../button/button"

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (file: File) => void
  accept?: string
  maxSizeMB?: number
  supportedFileType?: string
  title?: string
}

export default function FileUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  accept = ".pdf",
  maxSizeMB = 5,
  supportedFileType,
  title = "Attach File",
}: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayFileType = supportedFileType ?? accept

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
    }
  }

  const handleAttach = () => {
    if (file) {
      onUploadSuccess(file)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      onClose()
    } else {
      alert("Please select a file first.")
    }
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} strokeWidth={2} className="text-gray-600" />
          </button>
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {/* Dropzone Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-[2rem] bg-[#F9FBE7] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#D9F55C] transition-colors"
        >
          <div className="mb-4 p-4 bg-white rounded-xl border shadow-sm">
            <Upload size={32} className="text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            <span className="underline decoration-2 underline-offset-4">Click to upload</span> or
            drag and drop
          </p>
          <p className="text-xs text-gray-500">Maximum file size {maxSizeMB} MB</p>
        </div>

        <p className="text-sm text-gray-600 mt-4">File supported: {displayFileType}</p>

        {/* File Preview */}
        {file && (
          <div className="mt-6 border border-gray-300 rounded-2xl p-5 flex flex-col gap-3 relative">
            <button
              onClick={removeFile}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <FileText size={24} className="text-gray-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{file.name}</span>
                <span className="text-xs text-gray-500">{formatSize(file.size)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-8 flex justify-end">
          <NuraButton
            label="Attach File"
            variant="primary"
            type="button"
            className="min-w-[160px]"
            onClick={handleAttach}
          />
        </div>
      </div>
    </div>
  )
}
