import { FileText, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

interface SubmissionDetailProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

const DetailRow = ({ label, value, isLast }: SubmissionDetailProps) => (
  <div className={`flex flex-col md:flex-row py-4 px-6 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <span className="w-full md:w-1/3 text-gray-900 font-semibold text-[15px]">
      {label}
    </span>
    <span className="w-full md:w-2/3 text-gray-700 text-[15px] mt-1 md:mt-0">
      {value}
    </span>
  </div>
);

interface SubmissionStatusTableProps {
    grade: number | null,
    file: string | null, 
    review: string | null, 
    feedback: string | null
}

export const SubmissionStatusTable = ({
    grade, file, review, feedback
} : SubmissionStatusTableProps ) => {
  return (
    <div className="w-full  mx-auto bg-white border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-sm">
      <DetailRow 
        label="Grade" 
        value={grade ? `${grade} / 10` : "Not Graded"}
      />
      <DetailRow 
        label="File Submission" 
        value={file ? 
          <span 
            className="flex items-center gap-2 text-gray-900 hover:underline cursor-pointer" 
          >
            <FileText size={18} className="text-gray-400" />{file}
          </span>
          : 
          <span 
            className="text-gray-900 hover:underline cursor-pointer"
          >
            Attach your file
          </span>
        } 
      />
      <DetailRow 
        label="Submission Review" 
        value={review ? review : "Not Reviewed"}
      />
      <DetailRow 
        label="Feedback Course" 
        value={feedback ? feedback : "Fill Feedback"}
        isLast 
      />
    </div>
  );
};