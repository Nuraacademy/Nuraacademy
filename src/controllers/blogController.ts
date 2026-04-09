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
                    comments: true,
                    shares: true
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
    const blog = await prisma.blog.findUnique({
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
                    },
                    likes: true,
                    shares: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            likes: true,
            shares: true,
            _count: {
                select: {
                    likes: true,
                    comments: true,
                    shares: true
                }
            }
        }
    });

    if (!blog) return null;

    // Check if liked/shared by current user
    const isLikedByCurrentUser = currentUserId ? blog.likes.some(l => l.userId === currentUserId) : false;
    const isSharedByCurrentUser = currentUserId ? blog.shares.some(s => s.userId === currentUserId) : false;

    return {
        ...blog,
        isLikedByCurrentUser,
        isSharedByCurrentUser,
        comments: blog.comments.map(comment => ({
            ...comment,
            isLikedByCurrentUser: currentUserId ? (comment as any).likes.some((l: any) => l.userId === currentUserId) : false,
            _count: {
                likes: (comment as any).likes.length,
                shares: (comment as any).shares.length
            }
        }))
    };
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
    if (!blog) throw new Error("Post not found");

    if (blog.author !== author && !isAdmin) {
        throw new Error("You are not authorized to update this post");
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
    if (!blog) throw new Error("Post not found");

    if (blog.author !== author && !isAdmin) {
        throw new Error("You are not authorized to delete this post");
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
        return await prisma.blogView.create({
            data: { blogId, userId, ip, userAgent }
        });
    } catch {
        // Silently ignore if table doesn't exist yet (migration pending)
    }
};

export const recordBlogShare = async (blogId: number, userId?: number, platform?: string) => {
    return await prisma.blogShare.create({
        data: { blogId, userId, platform }
    });
};

export const toggleLikeComment = async (commentId: number, userId: number) => {
    const existingLike = await (prisma as any).commentLike.findUnique({
        where: { commentId_userId: { commentId, userId } }
    });

    if (existingLike) {
        await prisma.commentLike.delete({
            where: { commentId_userId: { commentId, userId } }
        });
        return { liked: false };
    } else {
        await prisma.commentLike.create({
            data: { commentId, userId }
        });
        return { liked: true };
    }
};

export const recordCommentShare = async (commentId: number, userId?: number, platform?: string) => {
    return await prisma.commentShare.create({
        data: { commentId, userId, platform }
    });
};
