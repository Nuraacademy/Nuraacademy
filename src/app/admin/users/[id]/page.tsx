import { notFound } from "next/navigation";
import { getUserById } from "@/controllers/userController";
import { RoleController } from "@/controllers/roleController";
import UserDetailClient from "./UserDetailClient";
import { requirePermission } from "@/lib/rbac";

export default async function UserDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) return notFound();

    await requirePermission('User', 'VIEW_DETAIL_USER');

    const [user, roles] = await Promise.all([
        getUserById(userId),
        RoleController.getRoles()
    ]);

    if (!user) return notFound();

    return (
        <UserDetailClient user={user as any} roles={roles} />
    );
}
