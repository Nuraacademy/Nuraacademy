"use client"

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { LimeButton } from './lime_button';

const DetailRow = ({ label, value, isLast }: { label: string, value: React.ReactNode, isLast?: boolean }) => (
  <div className={`grid grid-cols-3 py-5 px-8 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <span className="text-gray-900 font-semibold text-[15px]">{label}</span>
    <span className="col-span-2 text-gray-700 text-[15px]">{value}</span>
  </div>
);

export const UploadFile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* 1. Status Table */}
      <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
        <DetailRow label="Grade" value="Not graded" />
        <DetailRow 
          label="File Submission" 
          value={<button onClick={() => setIsModalOpen(true)} className="text-gray-900 hover:underline text-left">Attach your file</button>} 
        />
        <DetailRow label="Submission Review" value="Comment from trainer" />
        <DetailRow label="Feedback Course" value="Comment from learner" isLast />
      </div>

      {/* 2. Action Buttons */}
      <div className="flex gap-4">
        <LimeButton label="Upload File" variant="outline" onClick={() => setIsModalOpen(true)} />
        <LimeButton label="Submit" variant="solid" />
      </div>

      {/* 3. Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Attach File</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 border-2 border-black rounded-full hover:bg-gray-100">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-gray-400 rounded-[2rem] bg-[#F9FBE7]/50 p-12 flex flex-col items-center justify-center text-center group hover:border-[#D9F55C] transition-colors cursor-pointer">
              <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Upload size={32} className="text-gray-800" />
              </div>
              <p className="text-lg font-medium text-gray-900">
                <span className="underline decoration-2 underline-offset-4">Click to upload</span> or drag and drop
              </p>
              <p className="text-gray-500 mt-1">Maximum file size 10 MB</p>
            </div>

            <div className="mt-4 flex justify-between items-end">
              <p className="text-sm font-medium text-gray-600">File supported: .pdf</p>
              <LimeButton label="Attach File" variant="solid" className="min-w-[180px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};