"use client"

import { useState, useEffect, use } from "react";
import { getBlogByIdAction, updateBlogAction } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlogFormClient } from "@/components/ui/blog/blog_form_client";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [initialData, setInitialData] = useState<{
        title: string;
        description: string;
        bannerUrl: string;
        content: string;
    } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            const result = await getBlogByIdAction(parseInt(id));
            if (result.success && result.data) {
                const blog = result.data;
                // Support both old block-array format and new HTML string format
                const contentStr = typeof blog.content === "string"
                    ? blog.content
                    : Array.isArray(blog.content)
                        ? (blog.content as any[]).map((s: any) => s.type === "text" ? s.content : "").join("\n")
                        : "";
                setInitialData({
                    title: blog.title,
                    description: blog.description || "",
                    bannerUrl: blog.bannerUrl || "",
                    content: contentStr,
                });
            } else {
                toast.error("Failed to load blog");
                router.push("/blogs");
            }
        };
        fetchBlog();
    }, [id, router]);

    const handleUpdate = async ({ title, description, bannerUrl, content }: {
        title: string; description: string; bannerUrl: string; content: string;
    }) => {
        if (!title.trim()) {
            toast.error("Please enter a blog title");
            return;
        }
        setIsSubmitting(true);
        const result = await updateBlogAction(parseInt(id), { title, description, bannerUrl, content });
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Blog updated successfully!");
            router.push(`/blogs/${id}`);
        } else {
            toast.error(result.error);
        }
    };

    if (!initialData) return <div className="min-h-screen bg-white" />;

    return (
        <BlogFormClient
            mode="edit"
            initialTitle={initialData.title}
            initialDescription={initialData.description}
            initialBannerUrl={initialData.bannerUrl}
            initialContent={initialData.content}
            isSubmitting={isSubmitting}
            onSubmit={handleUpdate}
        />
    );
}
