"use client";

import React, { useState } from 'react';
import { NuraButton } from '../button/button';
import { NuraTextInput } from '../input/text_input';
import { NuraTextArea } from '../input/text_area';
import { NuraSelect } from '../input/nura_select';

interface DiscussionTopicDialogProp {
  isOpen: boolean;
  onConfirm: (data: { title: string; description: string; type?: string }) => void;
  onCancel: () => void;
  isReply?: boolean;
}

export const DiscussionTopicDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  isReply,
}: DiscussionTopicDialogProp) => {
  const [topicTitle, setTopicTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topicType, setTopicType] = useState("TECHNICAL_HELP");

  if (!isOpen) return null;

  const handlePost = () => {
    onConfirm({ title: topicTitle, description, type: topicType });
    // Reset fields after posting
    setTopicTitle("");
    setDescription("");
    setTopicType("TECHNICAL_HELP");
  };

  const topicOptions = [
    { label: "Technical Help", value: "TECHNICAL_HELP" },
    { label: "Learning Resource", value: "LEARNING_RESOURCE" },
    { label: "Learning Partner", value: "LEARNING_PARTNER" },
    { label: "Course Discussion", value: "COURSE_DISCUSSION" },
    { label: "Career & Portos", value: "CAREER_PORTOS" },
  ];

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
          {isReply ? "Add New Reply" : "Add New Topic"}
        </h2>

        <div className="space-y-6">
          {/* Topic Title Input */}
          {!isReply && (
            <NuraTextInput
              label="Topic Title"
              placeholder="A Beginner Journey to Python"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
            />
          )}

          {!isReply && (
            <NuraSelect
              label="Topic Type"
              options={topicOptions}
              value={topicType}
              onChange={setTopicType}
            />
          )}

          {/* Description Textarea */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1 px-1">Description</label>
            <NuraTextArea
              label="Description"
              placeholder={isReply ? "Write your reply here..." : "As a new student to software engineering..."}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <NuraButton
            label="Cancel"
            variant='secondary'
            onClick={onCancel}
            className="!w-auto px-8"
          />

          <NuraButton
            onClick={handlePost}
            label={isReply ? "Post Reply" : "Post to Forum"}
            variant="primary"
            className="!w-auto px-8"
          />
        </div>
      </div>
    </div>
  );
};