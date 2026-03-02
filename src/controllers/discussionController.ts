import { prisma } from '@/lib/prisma';
import { DiscussionTopicType } from '@prisma/client';

export async function getTopics(classId?: string) {
    return prisma.discussionTopic.findMany({
        where: classId ? { classId } : {},
        include: {
            author: {
                select: { name: true, email: true },
            },
            _count: {
                select: { replies: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createTopic(data: {
    classId: string;
    authorId: string;
    title: string;
    content: string;
    preview?: string;
    type: DiscussionTopicType;
}) {
    return prisma.discussionTopic.create({
        data,
    });
}

export async function getTopicWithReplies(topicId: string) {
    return prisma.discussionTopic.findUnique({
        where: { id: topicId },
        include: {
            author: {
                select: { name: true, email: true },
            },
            replies: {
                include: {
                    author: {
                        select: { name: true, email: true },
                    },
                },
                orderBy: { createdAt: 'asc' },
            },
        },
    });
}

export async function createReply(data: {
    topicId: string;
    authorId: string;
    content: string;
}) {
    return prisma.discussionReply.create({
        data,
    });
}

export async function likeTopic(topicId: string) {
    return prisma.discussionTopic.update({
        where: { id: topicId },
        data: {
            likeCount: {
                increment: 1,
            },
        },
    });
}
