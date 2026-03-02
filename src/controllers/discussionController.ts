import { prisma } from '@/lib/prisma';
import { DiscussionTopicType } from '@prisma/client';
import { redis } from '@/lib/redis';

const TOPICS_CACHE_KEY = 'topics:all';
const CACHE_TTL = 3600;

export async function getTopics(classId?: string) {
    const cacheKey = classId ? `topics:class:${classId}` : TOPICS_CACHE_KEY;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached, (key, value) =>
            (key === 'createdAt' || key === 'updatedAt')
                ? new Date(value) : value
        );
    }

    const topics = await prisma.discussionTopic.findMany({
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

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(topics));
    return topics;
}

export async function createTopic(data: {
    classId: string;
    authorId: string;
    title: string;
    content: string;
    preview?: string;
    type: DiscussionTopicType;
}) {
    const topic = await prisma.discussionTopic.create({
        data,
    });

    // Invalidate caches
    await redis.del(TOPICS_CACHE_KEY);
    await redis.del(`topics:class:${data.classId}`);

    return topic;
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
