"use client";

import React, { useEffect, useState } from 'react';
import { X, FileText, Download } from 'lucide-react';

interface PdfPreviewModalProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfPreviewModal = ({ file, isOpen, onClose }: PdfPreviewModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Cleanup URL to prevent memory leaks
      return () => URL.revokeObjectURL(url);
    }
  }, [isOpen, file]);

  if (!isOpen || !previewUrl) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full h-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl">
              <FileText size={20} className="text-gray-600" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-900 truncate max-w-[200px] md:max-w-md leading-none">
                {file.name}
              </h2>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1">
                Document Preview
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-grow bg-gray-50">
          <iframe 
            src={`${previewUrl}#view=FitH`} 
            className="w-full h-full border-none"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
};