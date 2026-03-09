import { RoleController } from "@/controllers/roleController";
import RolesClient from "./client";

export const metadata = {
    title: "Role Management - Admin",
};

export default async function RolesPage() {
    const [roles, permissions] = await Promise.all([
        RoleController.getRoles(),
        RoleController.getPermissions(),
    ]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">IAM & Admin</h1>
                <p className="text-gray-600">
                    Manage roles, view permissions, and configure access control for the platform.
                </p>
            </div>

            <RolesClient initialRoles={roles} permissions={permissions} />
        </div>
    );
}
