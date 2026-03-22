"use client";

import React from 'react';
import { NuraButton } from '../button/button';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
  isLoading = false
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-medium text-gray-900 mb-4">
          {title}
        </h2>

        <div className="text-lg text-gray-700 mb-8 leading-relaxed">
          {message}
        </div>

        <div className="flex gap-4 w-full justify-center">
          {/* Cancel Button (Dark) */}
          <NuraButton
            label={cancelText}
            onClick={onCancel}
            variant='secondary'
            disabled={isLoading}
          />

          {/* Confirm Button (Lime) */}
          <NuraButton
            label={confirmText}
            onClick={onConfirm}
            variant='primary'
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};