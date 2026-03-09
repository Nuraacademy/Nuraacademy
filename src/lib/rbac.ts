"use server";

import { getSession } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";

/**
 * Checks if the currently logged-in user has the specified permission.
 * Uses Prisma caching / memoization internally where possible, but recommended
 * to call once per server request and pass down if checking many things.
 */
export async function hasPermission(resource: string, action: string): Promise<boolean> {
    const userId = await getSession();
    if (!userId) return false;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: {
                include: {
                    permissions: {
                        include: { permission: true }
                    }
                }
            }
        }
    });

    if (!user || !user.role) return false;

    // Admin role check (optional, but Admin usually has all)
    if (user.role.name === 'Admin') return true;

    return user.role.permissions.some(
        (p: any) => p.permission.resource === resource && p.permission.action === action
    );
}

/**
 * Helper to check multiple permissions at once.
 * Returns an object mapping "RESOURCE_ACTION" to boolean.
 */
export async function getPermissions(requests: { resource: string, action: string }[]): Promise<Record<string, boolean>> {
    const userId = await getSession();
    const results: Record<string, boolean> = {};

    // Initialize all to false
    requests.forEach(req => results[`${req.resource}_${req.action}`] = false);

    if (!userId) return results;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: {
                include: {
                    permissions: {
                        include: { permission: true }
                    }
                }
            }
        }
    });

    if (!user || !user.role) return results;

    const isAdmin = user.role.name === 'Admin';

    requests.forEach(req => {
        const key = `${req.resource}_${req.action}`;
        if (isAdmin) {
            results[key] = true;
        } else {
            results[key] = user.role!.permissions.some(
                (p: any) => p.permission.resource === req.resource && p.permission.action === req.action
            );
        }
    });

    return results;
}

/**
 * Throws an error if the user lacks the permission. 
 * Useful for securing server actions.
 */
export async function requirePermission(resource: string, action: string) {
    const allowed = await hasPermission(resource, action);
    if (!allowed) {
        throw new Error(`Unauthorized: Missing ${resource}:${action} permission.`);
    }
}
