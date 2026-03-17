"use server"

import { createUser, updateUser, deleteUser, getUserById } from "@/controllers/userController";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/rbac";

export async function adminCreateUserAction(data: { email: string; name?: string; username: string; password?: string; whatsapp?: string }) {
    try {
        await requirePermission('User', 'CREATE_EDIT_USER');
        const user = await createUser(data);
        revalidatePath("/admin/users");
        return { success: true, data: user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function adminUpdateUserAction(id: number, data: { name?: string; email?: string; username?: string; password?: string; roleId?: number | null }) {
    try {
        await requirePermission('User', 'CREATE_EDIT_USER');
        const user = await updateUser(id, data);
        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${id}`);
        return { success: true, data: user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function adminDeleteUserAction(id: number) {
    try {
        await requirePermission('User', 'DELETE_USER');
        await deleteUser(id);
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function adminGetUserByIdAction(id: number) {
    try {
        await requirePermission('User', 'VIEW_DETAIL_USER');
        const user = await getUserById(id);
        return { success: true, data: user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
