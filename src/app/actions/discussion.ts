"use server"

import { getSession } from "@/app/actions/auth";
import {
    getDiscussions,
    getDiscussionById,
    createDiscussion,
    createReply,
    toggleLikeDiscussion
} from "@/controllers/discussionController";
import { revalidatePath } from "next/cache";
import { DiscussionType } from "@prisma/client";

export async function getDiscussionsAction(skip?: number, take?: number) {
    try {
        const discussions = await getDiscussions({ skip, take });
        return { success: true, data: discussions };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch discussions" };
    }
}

export async function getDiscussionByIdAction(id: number) {
    try {
        const userId = await getSession();
        const discussion = await getDiscussionById(id, userId || undefined);
        return { success: true, data: discussion };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch discussion details" };
    }
}

export async function createDiscussionAction(title: string, content: string, type: DiscussionType) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in to post" };
        }

        const discussion = await createDiscussion({ title, content, type, userId });
        revalidatePath("/discussions");
        return { success: true, data: discussion };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to create discussion" };
    }
}

export async function createReplyAction(discussionId: number, text: string) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in to reply" };
        }

        const reply = await createReply({ discussionId, text, userId });
        revalidatePath(`/discussions/topic`);
        return { success: true, data: reply };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to post reply" };
    }
}

export async function toggleLikeDiscussionAction(discussionId: number) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in to like a post" };
        }

        const result = await toggleLikeDiscussion(discussionId, userId);
        revalidatePath(`/discussions/topic`);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to toggle like" };
    }
}
