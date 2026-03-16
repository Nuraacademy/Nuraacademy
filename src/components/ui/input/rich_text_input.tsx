"use client"

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Underline as UnderlineIcon, Code, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'

const extensions = [
    StarterKit,
    Underline,
    Link.configure({
        openOnClick: false,
    }),
    Image,
];

export const RichTextInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions,
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!isMounted || !editor) {
        return <div className="min-h-[140px] bg-white rounded-xl animate-pulse border border-gray-100" />;
    }

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }

    const setLink = () => {
        const url = window.prompt('URL');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }

    return (
        <div className="w-full bg-white transition-all">
            <div className="flex flex-wrap gap-1 mb-2 border-b border-gray-100 pb-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                    <Bold size={15} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                    <Italic size={15} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('underline') ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                    <UnderlineIcon size={15} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('code') ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                    <Code size={15} strokeWidth={2.5} />
                </button>
                <button
                    onClick={addImage}
                    className="p-1.5 rounded-md text-gray-400 hover:bg-gray-50 transition-colors"
                >
                    <ImageIcon size={15} strokeWidth={2.5} />
                </button>
                <button
                    onClick={setLink}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                    <LinkIcon size={15} strokeWidth={2.5} />
                </button>
            </div>
            <EditorContent 
                editor={editor} 
                className="prose prose-sm max-w-none focus:outline-none min-h-[100px] text-gray-700 placeholder:text-gray-300" 
                placeholder="Add comment"
            />
        </div>
    );
};