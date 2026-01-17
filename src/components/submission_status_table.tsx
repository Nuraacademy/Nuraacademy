"use client";

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { PdfPreviewModal } from './pdf_preview_modal'; 

interface SubmissionStatusTableProps {
  grade: number | null;
  file: File | null; 
  review: string | null; 
  feedback: string | null;
}

export const SubmissionStatusTable = ({ grade, file, review, feedback }: SubmissionStatusTableProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="w-full mx-auto bg-white border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-sm">
        <DetailRow 
          label="Grade" 
          value={grade ? `${grade} / 10` : "Not Graded"}
        />
        <DetailRow 
          label="File Submission" 
          value={file ? (
            <button 
              type="button"
              className="flex items-center gap-2 text-gray-900 hover:underline cursor-pointer group text-left" 
              onClick={() => setIsPreviewOpen(true)}
            >
              <FileText size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              {file.name}
            </button>
          ) : (
            <span className="text-gray-400 italic">No file attached</span>
          )} 
        />
        <DetailRow 
          label="Submission Review" 
          value={review || "Not Reviewed"}
        />
        <DetailRow 
          label="Feedback Course" 
          value={feedback || "Fill Feedback"}
          isLast 
        />
      </div>

      {/* Render component only if file exists */}
      {file && (
        <PdfPreviewModal 
          file={file} 
          isOpen={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}
    </>
  );
};

// Helper internal component
const DetailRow = ({ label, value, isLast }: { label: string; value: React.ReactNode; isLast?: boolean }) => (
  <div className={`flex flex-col md:flex-row py-4 px-6 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <span className="w-full md:w-1/3 text-gray-900 font-semibold text-[15px]">{label}</span>
    <span className="w-full md:w-2/3 text-gray-700 text-[15px] mt-1 md:mt-0">{value}</span>
  </div>
);