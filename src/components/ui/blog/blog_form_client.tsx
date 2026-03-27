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
import FileUpload from "@/components/ui/upload/file_upload";
import { uploadFileAction } from "@/app/actions/common";
import { toast } from "sonner";

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
    const [isUploading, setIsUploading] = useState(false);

    const isEdit = mode === "edit";

    const handleBannerUpload = async (file: File) => {
        if (!file) {
            setBannerUrl("");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading banner...");
        
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await uploadFileAction(formData);
            
            if (res.success && res.url) {
                setBannerUrl(res.url);
                toast.success("Banner uploaded successfully!", { id: toastId });
            } else {
                toast.error(res.error || "Failed to upload banner", { id: toastId });
                setBannerUrl("");
            }
        } catch (error: any) {
            toast.error(error.message || "Upload failed", { id: toastId });
            setBannerUrl("");
        } finally {
            setIsUploading(false);
        }
    };

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
                        { label: "Posts", href: "/blogs" },
                        { label: isEdit ? "Edit" : "Add", href: "#" }
                    ]}
                />

                {/* Header */}
                <div className="flex justify-between items-center my-6">
                    <h1 className="text-2xl font-medium tracking-tight text-black">
                        {isEdit ? "Edit Post" : "Write Post"}
                    </h1>
                </div>

                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-3 ml-1">Post Title</label>
                            <NuraTextInput
                                placeholder="Enter post title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-3 ml-1">Picture Banner</label>
                            
                            {bannerUrl ? (
                                <div className="space-y-4">
                                    <div className="rounded-3xl overflow-hidden border border-gray-100 h-64 shadow-inner bg-gray-50 relative group">
                                        <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <NuraButton
                                                label="Change Image"
                                                variant="secondary"
                                                onClick={() => setBannerUrl("")}
                                                className="!w-auto px-6 h-10 border-white/20 hover:bg-white hover:text-black transition-all bg-black/50 text-white"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-gray-400 font-medium">To change the banner, click "Change Image" to remove the current one.</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <FileUpload
                                        onFileSelect={handleBannerUpload}
                                        maxSizeMB={5}
                                        accept="image/png, image/jpeg, image/webp"
                                        supportedFileType="PNG, JPG, WEBP"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
                                            <div className="w-8 h-8 border-3 border-gray-200 border-t-[#005954] rounded-full animate-spin" />
                                            <p className="text-sm font-medium text-[#005954] animate-pulse">Uploading image...</p>
                                        </div>
                                    )}
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
