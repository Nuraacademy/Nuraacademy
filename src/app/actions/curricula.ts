"use server"

import {
    getAllCurricula,
    getCurriculaById,
    createCurricula,
    updateCurricula,
    deleteCurricula
} from "@/controllers/curriculaController"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/lib/rbac"
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function getCurriculaList(search?: string, status?: string) {
    try {
        await requirePermission('Curricula', 'SEARCH_VIEW_CURRICULA');
        const curricula = await getAllCurricula(search, status);
        return { success: true, curricula };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch curricula" };
    }
}

export async function getCurriculaDetail(id: number) {
    try {
        await requirePermission('Curricula', 'VIEW_DETAIL_CURRICULA');
        const curricula = await getCurriculaById(id);
        if (!curricula) return { success: false, error: "Curricula not found" };
        return { success: true, curricula };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch curricula detail" };
    }
}

export async function createCurriculaAction(data: any) {
    try {
        await requirePermission('Curricula', 'UPLOAD_CURRICULA');
        const userId = await getSession();
        const newCurricula = await createCurricula({ ...data, createdBy: userId });
        revalidatePath('/curricula');
        return { success: true, curricula: newCurricula };
    } catch (error: any) {
        console.error("Failed to create curricula:", error);
        return { success: false, error: error.message || "Failed to create curricula" };
    }
}

export async function updateCurriculaAction(id: number, data: any) {
    try {
        await requirePermission('Curricula', 'UPDATE_CURRICULA');
        await updateCurricula(id, data);
        revalidatePath('/curricula');
        revalidatePath(`/curricula/${id}/edit`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update curricula:", error);
        return { success: false, error: error.message || "Failed to update curricula" };
    }
}

export async function deleteCurriculaAction(id: number) {
    try {
        await requirePermission('Curricula', 'DELETE_CURRICULA');
        await deleteCurricula(id);
        revalidatePath('/curricula');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete curricula:", error);
        return { success: false, error: error.message || "Failed to delete curricula" };
    }
}

export async function uploadCurriculaFile(formData: FormData) {
    try {
        await requirePermission('Curricula', 'UPLOAD_CURRICULA');
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file uploaded" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'curricula');
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(uploadDir, fileName);
        await writeFile(path, buffer);

        const url = `/uploads/curricula/${fileName}`;
        return { success: true, url };
    } catch (error: any) {
        console.error("Upload error:", error);
        return { success: false, error: error.message || "Failed to upload file" };
    }
}
