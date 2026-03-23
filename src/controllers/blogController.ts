import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getBlogs = async (options: { skip?: number, take?: number, search?: string } = {}) => {
    const { skip, take, search } = options;
    
    return await prisma.blog.findMany({
        where: {
            deletedAt: null,
            OR: search ? [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ] : undefined
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip,
        take
    });
};

export const getBlogById = async (id: number, currentUserId?: number) => {
    return await prisma.blog.findUnique({
        where: { id, deletedAt: null },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            },
            comments: {
                where: { deletedAt: null },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            likes: true,
            _count: {
                select: {
                    likes: true,
                    comments: true
                }
            }
        }
    });
};

export const createBlog = async (data: { 
    title: string, 
    bannerUrl?: string, 
    description?: string, 
    content: any, 
    author: number 
}) => {
    return await prisma.blog.create({
        data: {
            ...data,
            content: data.content as Prisma.InputJsonValue
        }
    });
};

export const updateBlog = async (id: number, data: { 
    title?: string, 
    bannerUrl?: string, 
    description?: string, 
    content?: any 
}, author: number, isAdmin: boolean) => {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new Error("Blog not found");
    
    if (blog.author !== author && !isAdmin) {
        throw new Error("You are not authorized to update this blog");
    }

    return await prisma.blog.update({
        where: { id },
        data: {
            ...data,
            content: data.content ? (data.content as Prisma.InputJsonValue) : undefined
        }
    });
};

export const deleteBlog = async (id: number, author: number, isAdmin: boolean) => {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new Error("Blog not found");

    if (blog.author !== author && !isAdmin) {
        throw new Error("You are not authorized to delete this blog");
    }

    return await prisma.blog.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
};

export const toggleLikeBlog = async (blogId: number, userId: number) => {
    const existingLike = await prisma.blogLike.findUnique({
        where: { blogId_userId: { blogId, userId } }
    });

    if (existingLike) {
        await prisma.blogLike.delete({
            where: { blogId_userId: { blogId, userId } }
        });
        return { liked: false };
    } else {
        await prisma.blogLike.create({
            data: { blogId, userId }
        });
        return { liked: true };
    }
};

export const addComment = async (blogId: number, userId: number, text: string) => {
    return await prisma.blogComment.create({
        data: { blogId, userId, text }
    });
};

export const deleteComment = async (commentId: number, userId: number, isAdmin: boolean) => {
    const comment = await prisma.blogComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId && !isAdmin) {
        throw new Error("You are not authorized to delete this comment");
    }

    return await prisma.blogComment.update({
        where: { id: commentId },
        data: { deletedAt: new Date() }
    });
};

export const trackBlogView = async (blogId: number, userId?: number, ip?: string, userAgent?: string) => {
    try {
        return await (prisma as any).blogView.create({
            data: { blogId, userId, ip, userAgent }
        });
    } catch {
        // Silently ignore if table doesn't exist yet (migration pending)
    }
};
