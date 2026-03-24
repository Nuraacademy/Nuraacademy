"use server"

import { getSession } from "@/app/actions/auth";
import * as blogController from "@/controllers/blogController";
import { hasPermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function getBlogsAction(options: { skip?: number, take?: number, search?: string }) {
    try {
        const blogs = await blogController.getBlogs(options);
        return { success: true, data: blogs };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch blogs" };
    }
}

export async function getBlogByIdAction(id: number) {
    try {
        const userId = await getSession();
        const blog = await blogController.getBlogById(id, userId || undefined);
        return { success: true, data: blog };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch post" };
    }
}

export async function createBlogAction(data: { 
    title: string, 
    bannerUrl?: string, 
    description?: string, 
    content: any 
}) {
    try {
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const canCreate = await hasPermission('Blogs', 'POST_CREATE');
        if (!canCreate) return { success: false, error: "You don't have permission to create blogs" };

        const blog = await blogController.createBlog({ ...data, author: userId });
        revalidatePath("/blogs");
        return { success: true, data: blog };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to create post" };
    }
}

export async function updateBlogAction(id: number, data: { 
    title?: string, 
    bannerUrl?: string, 
    description?: string, 
    content?: any 
}) {
    try {
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const isAdmin = await hasPermission('Blogs', 'POST_EDIT');
        const blog = await blogController.updateBlog(id, data, userId, isAdmin);
        
        revalidatePath("/blogs");
        revalidatePath(`/blogs/${id}`);
        return { success: true, data: blog };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to update post" };
    }
}

export async function deleteBlogAction(id: number) {
    try {
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const isAdmin = await hasPermission('Blogs', 'POST_DELETE');
        await blogController.deleteBlog(id, userId, isAdmin);
        
        revalidatePath("/blogs");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete post" };
    }
}

export async function toggleLikeBlogAction(blogId: number) {
    try {
        const userId = await getSession();
        if (!userId) return { success: false, error: "Log in to like this post" };

        const result = await blogController.toggleLikeBlog(blogId, userId);
        revalidatePath(`/blogs/${blogId}`);
        return { success: true, ...result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to like post" };
    }
}

export async function addCommentAction(blogId: number, text: string) {
    try {
        const userId = await getSession();
        if (!userId) return { success: false, error: "Log in to comment" };

        const comment = await blogController.addComment(blogId, userId, text);
        revalidatePath(`/blogs/${blogId}`);
        return { success: true, data: comment };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to add comment" };
    }
}

export async function deleteCommentAction(commentId: number, blogId: number) {
    try {
        const userId = await getSession();
        if (!userId) return { success: false, error: "Unauthorized" };

        const isAdmin = await hasPermission('Blogs', 'POST_DELETE');
        await blogController.deleteComment(commentId, userId, isAdmin);
        
        revalidatePath(`/blogs/${blogId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete comment" };
    }
}

export async function trackBlogViewAction(blogId: number, options: { userId?: number, ip?: string, userAgent?: string }) {
    try {
        await blogController.trackBlogView(blogId, options.userId, options.ip, options.userAgent);
        return { success: true };
    } catch (error: any) {
        console.error("View tracking failed", error);
        return { success: false };
    }
}
