import { prisma } from '@/lib/prisma';
import { DiscussionType } from '@prisma/client';

// Get all discussions with pagination and counts
export async function getDiscussions({ skip = 0, take = 10 }: { skip?: number; take?: number } = {}) {
    const discussions = await prisma.discussion.findMany({
        skip,
        take,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    name: true,
                    username: true,
                },
            },
            _count: {
                select: {
                    replies: true,
                    likes: true,
                },
            },
        },
    });

    return discussions.map(discussion => ({
        ...discussion,
        likeCount: discussion._count.likes,
        repliesCount: discussion._count.replies,
        authorName: discussion.user.name || discussion.user.username,
    }));
}

// Get a single discussion by ID, including replies and its authors
export async function getDiscussionById(id: number, currentUserId?: number) {
    const discussion = await prisma.discussion.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    username: true,
                },
            },
            replies: {
                orderBy: {
                    createdAt: 'asc',
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            username: true,
                        },
                    },
                    likes: true,
                    _count: {
                        select: {
                            likes: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    likes: true,
                    replies: true,
                },
            },
        },
    });

    if (!discussion) return null;

    let isLikedByCurrentUser = false;
    if (currentUserId) {
        const like = await prisma.discussionLike.findUnique({
            where: {
                discussionId_userId: {
                    discussionId: id,
                    userId: currentUserId,
                },
            },
        });
        isLikedByCurrentUser = !!like;
    }

    return {
        ...discussion,
        likeCount: discussion._count.likes,
        repliesCount: discussion._count.replies,
        authorName: discussion.user.name || discussion.user.username,
        isLikedByCurrentUser,
        replies: discussion.replies.map(reply => ({
            ...reply,
            authorName: reply.user.name || reply.user.username,
            likeCount: reply._count.likes,
            isLikedByCurrentUser: currentUserId ? reply.likes.some(like => like.userId === currentUserId) : false,
        })),
    };
}

// Create a new discussion
export async function createDiscussion(data: { title: string; content: string; type: DiscussionType; userId: number }) {
    return prisma.discussion.create({
        data,
    });
}

// Create a new reply to a discussion
export async function createReply(data: { discussionId: number; text: string; userId: number }) {
    return prisma.discussionReply.create({
        data,
    });
}

// Toggle like on a discussion
export async function toggleLikeDiscussion(discussionId: number, userId: number) {
    const existingLike = await prisma.discussionLike.findUnique({
        where: {
            discussionId_userId: {
                discussionId,
                userId,
            },
        },
    });

    if (existingLike) {
        // User already liked it, so unlike
        await prisma.discussionLike.delete({
            where: {
                discussionId_userId: {
                    discussionId,
                    userId,
                },
            },
        });
        return { liked: false };
    } else {
        // User hasn't liked it, so like
        await prisma.discussionLike.create({
            data: {
                discussionId,
                userId,
            },
        });
        return { liked: true };
    }
}
// Toggle like on a reply
export async function toggleLikeReply(replyId: number, userId: number) {
    const existingLike = await prisma.discussionReplyLike.findUnique({
        where: {
            replyId_userId: {
                replyId,
                userId,
            },
        },
    });

    if (existingLike) {
        await prisma.discussionReplyLike.delete({
            where: {
                replyId_userId: {
                    replyId,
                    userId,
                },
            },
        });
        return { liked: false };
    } else {
        await prisma.discussionReplyLike.create({
            data: {
                replyId,
                userId,
            },
        });
        return { liked: true };
    }
}

// Delete a discussion
export async function deleteDiscussion(id: number, userId: number, isAdmin: boolean) {
    const discussion = await prisma.discussion.findUnique({ where: { id } });
    if (!discussion) throw new Error("Discussion not found");

    if (!isAdmin && discussion.userId !== userId) {
        throw new Error("Unauthorized to delete this discussion");
    }

    return prisma.discussion.delete({
        where: { id },
    });
}

// Edit a discussion
export async function editDiscussion(id: number, data: { title: string; content: string; type: DiscussionType }, userId: number, isAdmin: boolean) {
    const discussion = await prisma.discussion.findUnique({ where: { id } });
    if (!discussion) throw new Error("Discussion not found");

    if (!isAdmin && discussion.userId !== userId) {
        throw new Error("Unauthorized to edit this discussion");
    }

    return prisma.discussion.update({
        where: { id },
        data,
    });
}

// Edit a reply
export async function editReply(id: number, text: string, userId: number, isAdmin: boolean) {
    const reply = await prisma.discussionReply.findUnique({ where: { id } });
    if (!reply) throw new Error("Reply not found");

    if (reply.userId !== userId) {
        throw new Error("Unauthorized to edit this reply");
    }

    return prisma.discussionReply.update({
        where: { id },
        data: { text },
    });
}

// Delete a reply
export async function deleteReply(id: number, userId: number, isAdmin: boolean) {
    const reply = await prisma.discussionReply.findUnique({ 
        where: { id },
        include: { discussion: true }
    });
    if (!reply) throw new Error("Reply not found");

    const isDiscussionAuthor = reply.discussion.userId === userId;

    if (!isAdmin && reply.userId !== userId && !isDiscussionAuthor) {
        throw new Error("Unauthorized to delete this reply");
    }

    return prisma.discussionReply.delete({
        where: { id },
    });
}
