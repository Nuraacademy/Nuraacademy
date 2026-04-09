import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    endpoint: process.env.NEXT_S3_ENDPOINT, // User provided endpoint
    region: 'ap-southeast-1', // You can also make this an env var if needed
    credentials: {
        accessKeyId: process.env.NEXT_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true, // Required for some S3-compatible providers like Supabase/MinIO
});

export type StorageBucket = 'classes' | 'curricula' | 'assignments' | 'feedback' | 'sessions' | 'users';

export interface UploadResult {
    success: boolean;
    url: string | null;
    path: string | null;
    name: string | null;
    size: number | null;
    error: string | null;
}

export async function uploadToSupabase(file: File | Blob, bucket: StorageBucket, fileName?: string): Promise<UploadResult> {
    try {
        // Sanitize filename: remove special characters except dots, dashes and alphanumeric
        const originalName = (file as File).name || 'uploaded-file';
        const sanitizedName = originalName
            .replace(/\s+/g, '-')              // Replace spaces with -
            .replace(/[^a-zA-Z0-9.\-_]/g, '-') // Replace any other non-safe chars with -
            .replace(/-+/g, '-')               // Remove double dashes
            .replace(/^-+|-+$/g, '');          // Trim dashes from ends
            
        const name = fileName || `${Date.now()}-${sanitizedName}`;
        const key = `${bucket}/${name}`;
        
        console.log(`[S3 Upload] Starting: Bucket=nura-bucket, Key=${key}, Endpoint=${process.env.NEXT_S3_ENDPOINT}`);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
            Bucket: 'nura-bucket',
            Key: key,
            Body: buffer,
            ContentType: (file as File).type || 'application/octet-stream',
            ACL: 'public-read',
        });

        const response = await s3Client.send(command);
        console.log(`[S3 Upload] Success:`, response);

        // Construct public URL
        const endpoint = process.env.NEXT_S3_ENDPOINT || 'https://is3.cloudhost.id';
        const publicUrl = `${endpoint}/nura-bucket/${key}`;

        return { 
            success: true, 
            url: publicUrl,
            path: key,
            name,
            size: file.size,
            error: null
        };
    } catch (error: any) {
        console.error(`[S3 Upload] Error (${bucket}):`, {
            message: error.message,
            code: error.code,
            requestId: error.$metadata?.requestId,
            stack: error.stack
        });
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