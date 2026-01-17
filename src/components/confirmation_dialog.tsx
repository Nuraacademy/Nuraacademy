"use client";

import React from 'react';
import { LimeButton } from './lime_button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No"
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4 w-full justify-center">
          {/* Cancel Button (Dark) */}
          <LimeButton 
            label={cancelText}
            onClick={onCancel}
            variant='outline'
          />

          {/* Confirm Button (Lime) */}
          <LimeButton 
            label={confirmText}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};