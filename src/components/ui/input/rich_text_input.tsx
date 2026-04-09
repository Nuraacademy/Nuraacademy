"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image'; // Renamed to avoid conflict with 'next/image'
import { Bold, Italic, Underline as UnderlineIcon, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import { cn } from "@/lib/utils";

export const RichTextInput = ({ 
    value, 
    onChange, 
    className,
    label,
    required,
    minHeight = "150px",
    hideToolbar = false
}: { 
    value: string, 
    onChange: (val: string) => void, 
    label?: string,
    required?: boolean,
    className?: string,
    minHeight?: string,
    hideToolbar?: boolean
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lastValueRef = useRef(value);

    useEffect(() => { setIsMounted(true); }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
                },
            }),
            ImageExtension.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-xl max-w-[200px] h-auto my-2 shadow-sm border border-gray-100 block mx-auto',
                },
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            lastValueRef.current = html;
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none min-w-0 max-w-full break-words [overflow-wrap:anywhere] focus:outline-none px-4 py-2.5 text-black leading-relaxed',
                    `min-h-[${minHeight}]`
                ),
                style: `min-height: ${minHeight}`,
            },
        },
    });

    // Content Synchronization
    useEffect(() => {
        if (editor && value !== lastValueRef.current) {
            editor.commands.setContent(value);
            lastValueRef.current = value;
        }
    }, [value, editor]);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target;
            const file = input.files?.[0];
            if (!file || !editor) {
                input.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const url = reader.result as string;
                editor.chain().focus().setImage({ src: url }).run();
                input.value = '';
            };
            reader.onerror = () => {
                input.value = '';
            };
            reader.readAsDataURL(file);
        },
        [editor]
    );

    if (!isMounted || !editor) return <div className="bg-gray-50 rounded-xl animate-pulse border border-gray-200" style={{ height: minHeight }} />;

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
        <>
        {label && (
            <label className="block text-sm mb-2">{label}{required && <span className="text-red-500">*</span>}</label>
        )}
        <div className={cn(
            "group min-w-0 w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all focus-within:border-black focus-within:ring-1 focus-within:ring-black",
            className
        )}>
            {/* Toolbar Area */}
            {!hideToolbar && (
                <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-1.5 border-b border-gray-100 bg-gray-50/30 px-3 py-2">
                    <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
                        <Bold size={14} strokeWidth={3} />
                    </MenuButton>
                    
                    <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
                        <Italic size={14} strokeWidth={3} />
                    </MenuButton>

                    <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
                        <UnderlineIcon size={14} strokeWidth={3} />
                    </MenuButton>

                    <div className="w-[1.5px] h-5 bg-gray-200 mx-1" />

                    <MenuButton onClick={toggleLink} active={editor.isActive('link')}>
                        <LinkIcon size={14} strokeWidth={3} />
                    </MenuButton>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                        tabIndex={-1}
                        aria-hidden
                    />
                    <MenuButton onClick={() => fileInputRef.current?.click()} active={editor.isActive('image')}>
                        <ImageIcon size={14} strokeWidth={3} />
                    </MenuButton>
                </div>
            )}

            {/* Editable: wrap long unbroken strings; optional x-scroll for unusually wide embeds */}
            <div className="min-w-0 max-w-full cursor-text overflow-x-auto [&_.tiptap]:min-w-0 [&_.tiptap]:max-w-full [&_.ProseMirror]:min-w-0 [&_.ProseMirror]:max-w-full">
                <EditorContent editor={editor} />
            </div>
        </div>
        </>
    );
};