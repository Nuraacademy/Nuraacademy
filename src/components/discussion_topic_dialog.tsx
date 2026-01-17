"use client";

import React, { useState } from 'react';
import { LimeButton } from './lime_button';

interface DiscussionTopicDialogProp {
  isOpen: boolean;
  onConfirm: (data: { title: string; description: string }) => void;
  onCancel: () => void;
  isReply ?: boolean;
}

export const DiscussionTopicDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  isReply,
}: DiscussionTopicDialogProp) => {
  const [topicTitle, setTopicTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handlePost = () => {
    onConfirm({ title: topicTitle, description });
    // Reset fields after posting
    setTopicTitle("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 px-2">
          Add New Topic
        </h2>
        
        <div className="space-y-6">
          {/* Topic Title Input */}
          {!isReply && (<div>
              <label className="block text-xl text-gray-800 mb-3 px-2">Topic Title</label>
              <input
                type="text"
                placeholder="A Beginner Journey to Python"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-lime-400 transition-colors placeholder:text-gray-300"
              />
            </div>
          )}

          {/* Description Textarea */}
          <div>
            <label className="block text-xl text-gray-800 mb-3 px-2">Description</label>
            <textarea
              rows={6}
              placeholder="As a new student to software engineering..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-lime-400 transition-colors placeholder:text-gray-300 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-10">
          <LimeButton
            label="Cancel"
            variant='outline'
            onClick={onCancel}
          />

          <LimeButton
            onClick={handlePost}
            label="Post to Forum"
          />
        </div>
      </div>
    </div>
  );
};