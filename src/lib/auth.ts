import { cookies } from 'next/headers';

/**
 * Get the current user ID from the 'user_id' cookie.
 * Returns null if the cookie is not set or invalid.
 */
export async function getCurrentUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;

    if (!userIdStr) {
        return null;
    }

    const userId = parseInt(userIdStr);
    return isNaN(userId) ? null : userId;
}
