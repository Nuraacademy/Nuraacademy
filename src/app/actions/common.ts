"use server"

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getCurrentUserId } from '@/lib/auth';
import { requirePermission } from '@/lib/rbac';

export async function uploadFileAction(formData: FormData) {
    try {
        await requirePermission('File', 'UPLOAD_FILE');
        const userId = await getCurrentUserId();
        if (!userId) return { success: false, error: "Unauthorized" };

        const file = formData.get("file") as File;
        if (!file) return { success: false, error: "No file provided" };

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'feedback');
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(uploadDir, fileName);
        await writeFile(path, buffer);

        const url = `/uploads/feedback/${fileName}`;
        return { 
            success: true, 
            url, 
            name: file.name,
            size: file.size
        };
    } catch (error: any) {
        console.error("Upload error:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
}
