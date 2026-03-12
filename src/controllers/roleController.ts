import { prisma } from "../lib/prisma";

export class RoleController {
    // Get all roles, including user counts and permissions
    static async getRoles() {
        return prisma.role.findMany({
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                },
                _count: {
                    select: { users: true }
                }
            },
            orderBy: { id: "asc" }
        });
    }

    // Get single role details
    static async getRoleById(id: number) {
        return prisma.role.findUnique({
            where: { id },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
    }

    // Create a new role
    static async createRole(data: { name: string; description?: string }) {
        return prisma.role.create({
            data: {
                name: data.name,
                description: data.description,
            }
        });
    }

    // Update a role
    static async updateRole(id: number, data: { name?: string; description?: string }) {
        return prisma.role.update({
            where: { id },
            data
        });
    }

    // Delete a role
    static async deleteRole(id: number) {
        const role = await prisma.role.findUnique({ where: { id } });
        if (!role) throw new Error("Role not found");
        if (role.isSystem) throw new Error("System roles cannot be deleted");

        return prisma.role.delete({ where: { id } });
    }

    // Get all permissions
    static async getPermissions() {
        return prisma.permission.findMany({
            orderBy: [
                { resource: 'asc' },
                { action: 'asc' }
            ]
        });
    }

    // Set permissions for a role (overwrites existing)
    static async setRolePermissions(roleId: number, permissionIds: number[]) {
        return prisma.$transaction(async (tx) => {
            // 1. Delete all existing permissions
            await tx.rolePermission.deleteMany({
                where: { roleId }
            });

            // 2. Add new permissions
            if (permissionIds.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissionIds.map(pid => ({
                        roleId,
                        permissionId: pid
                    }))
                });
            }

            // 3. Return updated role
            return tx.role.findUnique({
                where: { id: roleId },
                include: {
                    permissions: {
                        include: { permission: true }
                    }
                }
            });
        });
    }

    // Assign user to a role
    static async assignRoleToUser(userId: number, roleId: number | null) {
        return prisma.user.update({
            where: { id: userId },
            data: { roleId }
        });
    }
}
