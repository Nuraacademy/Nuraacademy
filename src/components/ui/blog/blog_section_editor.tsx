"use client"

import { useState } from "react";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { X, Plus, Image as ImageIcon, Type } from "lucide-react";

export type BlogSection = {
    id: string;
    type: "text" | "image";
    content: string;
};

interface BlogSectionEditorProps {
    sections: BlogSection[];
    onChange: (sections: BlogSection[]) => void;
}

export const BlogSectionEditor = ({ sections, onChange }: BlogSectionEditorProps) => {

    const addTextSection = () => {
        const newSection: BlogSection = {
            id: crypto.randomUUID(),
            type: "text",
            content: ""
        };
        onChange([...sections, newSection]);
    };

    const addImageSection = () => {
        const newSection: BlogSection = {
            id: crypto.randomUUID(),
            type: "image",
            content: ""
        };
        onChange([...sections, newSection]);
    };

    const removeSection = (id: string) => {
        onChange(sections.filter(s => s.id !== id));
    };

    const updateSectionContent = (id: string, content: string) => {
        onChange(sections.map(s => s.id === id ? { ...s, content } : s));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Content Section</h3>

            <div className="space-y-6">
                {sections.map((section, index) => (
                    <div key={section.id} className="relative group bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                {section.type} Section {index + 1}
                            </span>
                            <button
                                onClick={() => removeSection(section.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {section.type === "text" ? (
                            <RichTextInput
                                value={section.content}
                                onChange={(val) => updateSectionContent(section.id, val)}
                            />
                        ) : (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Paste image URL here..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all font-medium text-gray-700"
                                    value={section.content}
                                    onChange={(e) => updateSectionContent(section.id, e.target.value)}
                                />
                                {section.content && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
                                        <img src={section.content} alt="Preview" className="w-full max-h-96 object-contain bg-gray-50" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={addImageSection}
                    className="flex-1 py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-lime-400 hover:text-lime-600 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus size={20} /> Add Image Block
                </button>
                <button
                    onClick={addTextSection}
                    className="flex-1 py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-lime-400 hover:text-lime-600 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus size={20} /> Add Text Block
                </button>
            </div>
        </div>
    );
};
