"use client";

import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  title?: string;
}

export const ShareModal = ({
  isOpen,
  onClose,
  shareUrl,
  title = "Share Thread"
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct link sharing via URL parameters easily for web
    email: `mailto:?subject=Check out this thread topic&body=${encodeURIComponent(shareUrl)}`
  };

  return (
    <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 text-gray-400 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Section */}
        <p className="text-gray-700 text-lg mb-6">Share this link via</p>
        
        <div className="flex gap-4 mb-10 justify-start">
          <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <img src="/icons/media/Instagram.svg" alt="Instagram" className="w-14 h-14" />
          </a>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <img src="/icons/media/Facebook.svg" alt="Facebook" className="w-14 h-14" />
          </a>
          <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <img src="/icons/media/X.svg" alt="X" className="w-14 h-14" />
          </a>
          <a href={shareLinks.email} className="hover:scale-110 transition-transform">
            <img src="/icons/media/Gmail.svg" alt="Gmail" className="w-14 h-14" />
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-grow h-px bg-gray-100" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-100" />
        </div>

        {/* Link field */}
        <div className="relative group">
          <div className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 pr-14 text-gray-600 bg-white truncate text-base font-light">
            {shareUrl}
          </div>
          <button 
            onClick={handleCopy}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"
          >
            {copied ? <Check size={22} className="text-green-500" /> : <Copy size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};
