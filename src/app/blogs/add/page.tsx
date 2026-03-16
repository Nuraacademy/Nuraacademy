"use client"

import { useState } from "react";
import { BlogSectionEditor, BlogSection } from "@/components/ui/blog/blog_section_editor";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { NuraTextArea } from "@/components/ui/input/text_area";
import { createBlogAction } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import SidebarWrapper from "@/app/classes/sidebar_wrapper";

export default function AddBlogPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [sections, setSections] = useState<BlogSection[]>([
        { id: crypto.randomUUID(), type: "text", content: "" }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {
        if (!title.trim()) {
            toast.error("Please enter a blog title");
            return;
        }

        setIsSubmitting(true);
        const result = await createBlogAction({
            title,
            description,
            bannerUrl,
            content: sections
        });
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Blog created successfully!");
            router.push(`/blogs/${result.data.id}`);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            <SidebarWrapper />

            {/* Background Image */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none opacity-60"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none opacity-60"
            />

            <div className="max-w-5xl mx-auto px-6 pt-12 md:pl-16 relative z-10">
                {/* Back Link */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8"
                >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                    Back
                </button>

                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-950">Add Blog</h1>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="px-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <NuraButton 
                            label="Create" 
                            variant="primary" 
                            onClick={handleCreate}
                            isLoading={isSubmitting}
                            className="!w-auto px-12"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Basic Info Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3 ml-1">Blog Title</label>
                            <NuraTextInput 
                                placeholder="Enter blog title..." 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3 ml-1">Picture Banner (URL)</label>
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
                            <label className="block text-sm font-bold text-gray-900 mb-3 ml-1">Short Description</label>
                            <NuraTextArea 
                                placeholder="Enter brief summary..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                label=""
                            />
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                        <BlogSectionEditor 
                            sections={sections}
                            onChange={setSections}
                        />
                    </div>

                    {/* Bottom Save Button */}
                    <div className="flex justify-end pt-12">
                        <NuraButton 
                            label="Create Blog" 
                            variant="primary" 
                            onClick={handleCreate}
                            isLoading={isSubmitting}
                            className="!w-auto px-16 py-4 text-lg shadow-xl shadow-lime-100"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
