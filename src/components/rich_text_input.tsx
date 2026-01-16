import { useState, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

import { Bold, Italic, UnderlineIcon, Code } from 'lucide-react'

// --- Rich Text Section Component ---
export const RichTextInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline, 
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync editor content if data is reverted externally
    useMemo(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!isMounted || !editor) {
        return <div className="min-h-[140px] bg-gray-50 rounded-xl animate-pulse border border-gray-100" />;
    }

    return (
        <div className="w-full bg-gray-50 p-3 rounded-xl border border-transparent focus-within:border-gray-200 transition-all">
            <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-200 pb-2">
                <button 
                    onClick={() => editor.chain().focus().toggleBold().run()} 
                    className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                    <Bold size={14}/>
                </button>
                <button 
                    onClick={() => editor.chain().focus().toggleItalic().run()} 
                    className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                    <Italic size={14}/>
                </button>
                <button 
                    onClick={() => editor.chain().focus().toggleUnderline().run()} 
                    className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                    <UnderlineIcon size={14}/>
                </button>            
                <button 
                    onClick={() => editor.chain().focus().toggleCode().run()} 
                    className={`p-1.5 rounded transition-colors ${editor.isActive('code') ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                    <Code size={14}/></button>                     
            </div>
            <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none min-h-[100px] px-1" />
        </div>
    );
};