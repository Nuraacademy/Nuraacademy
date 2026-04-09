"use server"

import { getSession } from "@/app/actions/auth";
import {
    getDiscussions,
    getDiscussionById,
    createDiscussion,
    createReply,
    toggleLikeDiscussion,
    toggleLikeReply,
    deleteDiscussion,
    editDiscussion,
    editReply,
    deleteReply,
    recordDiscussionShare,
    recordReplyShare
} from "@/controllers/discussionController";
import { revalidatePath } from "next/cache";
import { DiscussionType } from "@prisma/client";
import { hasPermission, requirePermission } from "@/lib/rbac";

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
        await requirePermission('Forums', 'CREATE_EDIT_TOPIC');

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
        
        const discussion = await getDiscussionById(discussionId, userId);
        const isAuthor = discussion?.userId === userId;
        
        const hasSelfPerm = await hasPermission('Forums', 'REPLY_SELF_TOPIC');
        const hasOthersPerm = await hasPermission('Forums', 'REPLY_OTHERS_TOPIC');

        if ((isAuthor && !hasSelfPerm) || (!isAuthor && !hasOthersPerm)) {
            return { success: false, error: "You don't have permission to reply to this topic" };
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

export async function toggleLikeReplyAction(replyId: number) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in to like a reply" };
        }

        const result = await toggleLikeReply(replyId, userId);
        revalidatePath(`/discussions/topic`);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to toggle like on reply" };
    }
}

export async function deleteDiscussionAction(id: number) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in" };
        }
        
        const discussion = await getDiscussionById(id, userId);
        if (!discussion) return { success: false, error: "Discussion not found" };
        
        const isAuthor = discussion.userId === userId;
        const hasSelfPerm = await hasPermission('Forums', 'DELETE_SELF_TOPIC');
        const hasOthersPerm = await hasPermission('Forums', 'DELETE_OTHERS_TOPIC');

        if ((isAuthor && !hasSelfPerm) || (!isAuthor && !hasOthersPerm)) {
            return { success: false, error: "You don't have permission to delete this topic" };
        }
        
        await deleteDiscussion(id, userId, !isAuthor); // Use isAdmin bypass if OTHERS
        revalidatePath("/discussions");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete discussion" };
    }
}

export async function editDiscussionAction(id: number, title: string, content: string, type: DiscussionType) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in" };
        }
        
        const discussion = await getDiscussionById(id, userId);
        if (!discussion) return { success: false, error: "Discussion not found" };

        const isAuthor = discussion.userId === userId;
        const canCreateOrEditOwnTopic = await hasPermission('Forums', 'CREATE_EDIT_TOPIC');
        const canModerateOthersTopic = await hasPermission('Forums', 'DELETE_OTHERS_TOPIC');

        if (isAuthor && !canCreateOrEditOwnTopic) {
            return { success: false, error: "You don't have permission to edit this topic" };
        }
        if (!isAuthor && !canModerateOthersTopic) {
            return { success: false, error: "You don't have permission to edit this topic" };
        }

        const updated = await editDiscussion(id, { title, content, type }, userId, !isAuthor);
        revalidatePath("/discussions");
        revalidatePath(`/discussions/topic`);
        return { success: true, data: updated };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to edit discussion" };
    }
}

export async function editReplyAction(id: number, text: string) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in" };
        }
        
        const hasSelfPerm = await hasPermission('Forums', 'EDIT_SELF_REPLY');
        const hasOthersPerm = await hasPermission('Forums', 'EDIT_OTHERS_REPLY');
        
        const result = await editReply(id, text, userId, hasOthersPerm);
        revalidatePath(`/discussions/topic`);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to edit reply" };
    }
}

export async function deleteReplyAction(id: number) {
    try {
        const userId = await getSession();
        if (!userId) {
            return { success: false, error: "You must be logged in" };
        }
        
        const hasSelfPerm = await hasPermission('Forums', 'DELETE_SELF_REPLY');
        const hasOthersPerm = await hasPermission('Forums', 'DELETE_OTHERS_REPLY');
        
        await deleteReply(id, userId, hasOthersPerm);
        revalidatePath(`/discussions/topic`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete reply" };
    }
}

export async function recordDiscussionShareAction(discussionId: number, platform?: string) {
    try {
        const userId = await getSession();
        await recordDiscussionShare(discussionId, userId || undefined, platform);
        revalidatePath(`/discussions/topic`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to record share" };
    }
}

export async function recordReplyShareAction(replyId: number, platform?: string) {
    try {
        const userId = await getSession();
        await recordReplyShare(replyId, userId || undefined, platform);
        revalidatePath(`/discussions/topic`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to record share" };
    }
}
