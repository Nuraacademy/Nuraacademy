"use client"

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { NuraTextArea } from "@/components/ui/input/text_area";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import SidebarWrapper from "@/app/classes/sidebar_wrapper";
import Image from "next/image";
import Breadcrumb from "../breadcrumb/breadcrumb";

interface BlogFormClientProps {
    mode: "create" | "edit";
    initialTitle?: string;
    initialDescription?: string;
    initialBannerUrl?: string;
    initialContent?: string;
    isSubmitting: boolean;
    onSubmit: (data: { title: string; description: string; bannerUrl: string; content: string }) => void;
}

export function BlogFormClient({
    mode,
    initialTitle = "",
    initialDescription = "",
    initialBannerUrl = "",
    initialContent = "",
    isSubmitting,
    onSubmit,
}: BlogFormClientProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [bannerUrl, setBannerUrl] = useState(initialBannerUrl);
    const [content, setContent] = useState(initialContent);

    const isEdit = mode === "edit";

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            <SidebarWrapper />

            {/* Background Images */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 -z-10 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
                priority
            />
            <Image
                src="/background/PolygonBGBot.svg"
                alt=""
                className="absolute bottom-0 right-0 -z-10 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            <div className="max-w-5xl mx-auto px-6 pt-12 md:pl-16 relative z-10 gap-4">
                {/* Back */}
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Blogs", href: "/blogs" },
                        { label: isEdit ? "Edit" : "Add", href: "#" }
                    ]}
                />

                {/* Header */}
                <div className="flex justify-between items-center my-6">
                    <h1 className="text-2xl font-medium tracking-tight text-black">
                        {isEdit ? "Edit Blog" : "Add Blog"}
                    </h1>
                </div>

                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-3 ml-1">Blog Title</label>
                            <NuraTextInput
                                placeholder="Enter blog title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-3 ml-1">Picture Banner (URL)</label>
                            <NuraTextInput
                                placeholder="Paste image URL here..."
                                value={bannerUrl}
                                onChange={(e) => setBannerUrl(e.target.value)}
                            />
                            {bannerUrl && (
                                <div className="mt-4 rounded-3xl overflow-hidden border border-gray-100 h-64 shadow-inner bg-gray-50">
                                    <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-3 ml-1">Short Description</label>
                            <NuraTextArea
                                placeholder="Enter brief summary..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                label=""
                            />
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3 ml-1">Content</label>
                        <RichTextInput
                            value={content}
                            onChange={(val) => setContent(val)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-end">
                        <NuraButton
                            label="Cancel"
                            variant="secondary"
                            onClick={() => router.back()}
                        />
                        <NuraButton
                            label={isEdit ? "Save Changes" : "Create"}
                            variant="primary"
                            onClick={() => onSubmit({ title, description, bannerUrl, content })}
                            isLoading={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
