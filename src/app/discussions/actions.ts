"use server"

import { createTopic, createReply, likeTopic } from "@/controllers/discussionController"
import { revalidatePath } from "next/cache"

export async function createTopicAction(data: {
    classId: string,
    authorId: string,
    title: string,
    content: string,
    type: any
}) {
    try {
        const topic = await createTopic({
            ...data,
            preview: data.content.substring(0, 150)
        });
        revalidatePath("/discussions");
        return { success: true, topic };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createReplyAction(data: {
    topicId: string,
    authorId: string,
    content: string
}) {
    try {
        const reply = await createReply(data);
        revalidatePath(`/discussions/topic?id=${data.topicId}`);
        return { success: true, reply };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function likeTopicAction(topicId: string) {
    try {
        await likeTopic(topicId);
        revalidatePath("/discussions");
        revalidatePath(`/discussions/topic?id=${topicId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
