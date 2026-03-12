import { prisma } from "@/lib/prisma";
import UsersClient from "./client";
import { RoleController } from "@/controllers/roleController";

export const metadata = {
    title: "User Management - Admin",
};

export default async function UsersPage() {
    const [users, roles] = await Promise.all([
        prisma.user.findMany({
            include: {
                role: true,
            },
            orderBy: { id: "desc" }
        }),
        RoleController.getRoles(),
    ]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">User Management</h1>
                <p className="text-gray-600">
                    Manage user accounts and their assigned roles in the platform.
                </p>
            </div>

            <UsersClient initialUsers={users} roles={roles} />
        </div>
    );
}
