"use server"

import { RoleController } from "@/controllers/roleController";
import { revalidatePath } from "next/cache";

export async function getRolesAction() {
    try {
        const roles = await RoleController.getRoles();
        return { success: true, data: roles };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getRoleByIdAction(id: number) {
    try {
        const role = await RoleController.getRoleById(id);
        return { success: true, data: role };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createRoleAction(data: { name: string; description?: string }) {
    try {
        const role = await RoleController.createRole(data);
        revalidatePath("/admin/roles");
        return { success: true, data: role };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateRoleAction(id: number, data: { name?: string; description?: string }) {
    try {
        const role = await RoleController.updateRole(id, data);
        revalidatePath("/admin/roles");
        return { success: true, data: role };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteRoleAction(id: number) {
    try {
        await RoleController.deleteRole(id);
        revalidatePath("/admin/roles");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getPermissionsAction() {
    try {
        const permissions = await RoleController.getPermissions();
        return { success: true, data: permissions };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function setRolePermissionsAction(roleId: number, permissionIds: number[]) {
    try {
        const role = await RoleController.setRolePermissions(roleId, permissionIds);
        revalidatePath("/admin/roles");
        return { success: true, data: role };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function assignRoleToUserAction(userId: number, roleId: number | null) {
    try {
        const user = await RoleController.assignRoleToUser(userId, roleId);
        revalidatePath("/admin/users"); // Assuming we have user management page
        return { success: true, data: user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
