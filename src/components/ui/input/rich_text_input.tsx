"use client"

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image'; // Renamed to avoid conflict with 'next/image'
import { Bold, Italic, Underline as UnderlineIcon, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import { cn } from "@/lib/utils";

export const RichTextInput = ({ value, onChange, className }: { value: string, onChange: (val: string) => void, className?: string }) => {
    const [isMounted, setIsMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    // This ensures links are blue and underlined in the editor
                    class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto my-4 shadow-sm border border-gray-100',
                },
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                // 'prose' ensures bold/italic/underline are visible while typing
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-5 text-black leading-relaxed',
            },
        },
    });

    if (!isMounted || !editor) return <div className="h-[200px] bg-gray-50 rounded-xl animate-pulse border border-gray-200" />;

    // Local Image Upload Logic
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                editor.chain().focus().setImage({ src: url }).run();
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter Link URL:', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const MenuButton = ({ onClick, active, children }: any) => (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
                active 
                    ? "bg-[#D9F55C] text-black shadow-sm" 
                    : "text-gray-400 hover:bg-gray-100 hover:text-black"
            )}
        >
            {children}
        </button>
    );

    return (
        <div className={cn(
            "group w-full bg-white border border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-black focus-within:ring-1 focus-within:ring-black",
            className
        )}>
            {/* Toolbar Area */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 bg-gray-50/30">
                <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
                    <Bold size={16} strokeWidth={3} />
                </MenuButton>
                
                <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
                    <Italic size={16} strokeWidth={3} />
                </MenuButton>

                <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
                    <UnderlineIcon size={16} strokeWidth={3} />
                </MenuButton>

                <div className="w-[1.5px] h-5 bg-gray-200 mx-1" />

                <MenuButton onClick={toggleLink} active={editor.isActive('link')}>
                    <LinkIcon size={16} strokeWidth={3} />
                </MenuButton>

                {/* Keeping the ImageIcon as requested, but linking it to the file uploader */}
                <MenuButton onClick={() => fileInputRef.current?.click()} active={editor.isActive('image')}>
                    <ImageIcon size={16} strokeWidth={3} />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                </MenuButton>
            </div>

            {/* Editable Content */}
            <div className="cursor-text">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};