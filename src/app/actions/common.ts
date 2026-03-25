"use server"

import { uploadToSupabase, UploadResult } from '@/lib/storage';
import { getCurrentUserId } from '@/lib/auth';

export async function uploadFileAction(formData: FormData): Promise<UploadResult> {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return { 
            success: false, 
            error: "Unauthorized",
            url: null,
            path: null,
            name: null,
            size: null
        };

        const file = formData.get("file") as File;
        if (file) {
            const result = await uploadToSupabase(file, 'feedback');
            return result;
        }
        return { 
            success: false, 
            error: "No file provided",
            url: null,
            path: null,
            name: null,
            size: null
        };
    } catch (error: any) {
        console.error("Upload error:", error);
        return { 
            success: false, 
            error: error.message || "Upload failed",
            url: null,
            path: null,
            name: null,
            size: null
        };
    }
}
