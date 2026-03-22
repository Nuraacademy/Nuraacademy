"use client"

import React from 'react';
import { RichTextInput } from '@/components/ui/input/rich_text_input';

interface FeedbackCriteriaFieldProps {
    label: string;
    description: string;
    score: number;
    feedback: string;
    onScoreChange: (val: number) => void;
    onFeedbackChange: (val: string) => void;
    className?: string;
}

export const FeedbackCriteriaField: React.FC<FeedbackCriteriaFieldProps> = ({
    label,
    description,
    score,
    feedback,
    onScoreChange,
    onFeedbackChange,
    className = ""
}) => {
    return (
        <div className={`space-y-6 ${className}`}>
            <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">{label}</h2>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="bg-[#FFFFF0] rounded-xl p-6 md:p-8 space-y-8 border border-[#F0F0D8]">
                {/* Score Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium uppercase tracking-wider text-[#1C3A37]">Score</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#1C3A37] transition-all duration-300"
                                style={{ width: `${(score / 10) * 100}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="1"
                                value={score}
                                onChange={(e) => onScoreChange(parseInt(e.target.value))}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-6">{score}</span>
                    </div>
                </div>

                {/* Feedback Editor */}
                <div className="space-y-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#1C3A37]">Feedback</span>
                    <div className="bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
                        <RichTextInput
                            value={feedback}
                            onChange={onFeedbackChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
