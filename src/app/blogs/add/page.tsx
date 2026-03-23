"use client"

import { useState } from "react";
import { createBlogAction } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlogFormClient } from "@/components/ui/blog/blog_form_client";

export default function AddBlogPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleCreate = async ({ title, description, bannerUrl, content }: {
        title: string; description: string; bannerUrl: string; content: string;
    }) => {
        if (!title.trim()) {
            toast.error("Please enter a blog title");
            return;
        }
        setIsSubmitting(true);
        const result = await createBlogAction({ title, description, bannerUrl, content });
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Blog created successfully!");
            router.push(`/blogs/${result.data.id}`);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <BlogFormClient
            mode="create"
            isSubmitting={isSubmitting}
            onSubmit={handleCreate}
        />
    );
}
