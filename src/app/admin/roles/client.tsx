"use client"

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import { setRolePermissionsAction, createRoleAction, deleteRoleAction } from "@/app/actions/role";
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";
import { toast } from "sonner";

type RoleWithCounts = {
    id: number;
    name: string;
    description: string | null;
    isSystem: boolean;
    _count: { users: number };
    permissions: { permissionId: number }[];
};

type Permission = {
    id: number;
    resource: string;
    action: string;
    description: string | null;
};

export default function RolesClient({
    initialRoles,
    permissions
}: {
    initialRoles: RoleWithCounts[],
    permissions: Permission[]
}) {
    const [roles, setRoles] = useState(initialRoles);
    const [selectedRole, setSelectedRole] = useState<RoleWithCounts | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempPermissions, setTempPermissions] = useState<Set<number>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    // Create New Role state
    const [isCreating, setIsCreating] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const handleSelectRole = (role: RoleWithCounts) => {
        setSelectedRole(role);
        setTempPermissions(new Set(role.permissions.map(p => p.permissionId)));
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleTogglePermission = (permId: number) => {
        if (!isEditing) return;
        const next = new Set(tempPermissions);
        if (next.has(permId)) next.delete(permId);
        else next.add(permId);
        setTempPermissions(next);
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;
        setIsSaving(true);
        const res = await setRolePermissionsAction(selectedRole.id, Array.from(tempPermissions));
        if (res.success && res.data) {
            setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, permissions: res.data.permissions } : r));
            setIsEditing(false);
            toast.success("Permissions saved successfully");
        } else {
            toast.error("Failed to save permissions: " + res.error);
        }
        setIsSaving(false);
    };

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const res = await createRoleAction({ name: newRoleName, description: newRoleDesc });
        if (res.success && res.data) {
            setRoles([...roles, { ...res.data, _count: { users: 0 }, permissions: [] }]);
            setIsCreating(false);
            setNewRoleName("");
            setNewRoleDesc("");
            toast.success("Role created successfully");
        } else {
            toast.error("Failed to create role: " + res.error);
        }
        setIsSaving(false);
    };

    const handleDeleteClick = (roleId: number) => {
        setRoleToDelete(roleId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (roleToDelete === null) return;
        setIsSaving(true);
        const res = await deleteRoleAction(roleToDelete);
        if (res.success) {
            setRoles(roles.filter(r => r.id !== roleToDelete));
            if (selectedRole?.id === roleToDelete) setSelectedRole(null);
            toast.success("Role deleted successfully");
        } else {
            toast.error("Failed to delete role: " + res.error);
        }
        setIsSaving(false);
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
    };

    // Group permissions by resource for easier rendering
    const permsByResource = permissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) acc[perm.resource] = [];
        acc[perm.resource].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="flex gap-8 items-start">
            {/* LEFT: Roles Table */}
            <div className="flex-1 bg-white rounded-xl shadow border border-gray-100 p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Roles</h2>
                    <NuraButton
                        label="Create Role"
                        variant="primary"
                        className="w-auto h-10 px-6 text-sm"
                        onClick={() => { setIsCreating(true); setSelectedRole(null); }}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b text-gray-500 text-sm">
                                <th className="pb-3 pt-2 px-4 font-medium">Name</th>
                                <th className="pb-3 pt-2 px-4 font-medium">Users</th>
                                <th className="pb-3 pt-2 px-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr
                                    key={role.id}
                                    className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${selectedRole?.id === role.id ? 'bg-[#D9F55C]/10 border-l-4 border-l-[#D9F55C]' : 'border-l-4 border-l-transparent'}`}
                                    onClick={() => handleSelectRole(role)}
                                >
                                    <td className="py-4 px-4">
                                        <div className="font-medium flex items-center gap-2">
                                            {role.name}
                                            {role.isSystem && <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider">System</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{role.description}</div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{role._count.users}</td>
                                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                                        {!role.isSystem && (
                                            <button
                                                onClick={() => handleDeleteClick(role.id)}
                                                className="text-red-500 hover:text-red-700 text-sm p-2"
                                                disabled={isSaving}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500">No roles found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RIGHT: Role Details / Editor / Creator */}
            <div className="w-[500px] shrink-0">
                {isCreating ? (
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold mb-6">Create New Role</h2>
                        <form onSubmit={handleCreateRole} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                <input
                                    type="text"
                                    autoFocus
                                    required
                                    value={newRoleName}
                                    onChange={e => setNewRoleName(e.target.value)}
                                    className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-[#D9F55C] focus:border-transparent outline-none"
                                    placeholder="e.g. Guest Instructor"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newRoleDesc}
                                    onChange={e => setNewRoleDesc(e.target.value)}
                                    className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-[#D9F55C] focus:border-transparent outline-none m-0 resize-none h-24"
                                    placeholder="Brief description of this role"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <NuraButton label="Cancel" variant="secondary" onClick={() => setIsCreating(false)} className="w-1/2" />
                                <NuraButton label="Create" type="submit" variant="primary" isLoading={isSaving} className="w-1/2" />
                            </div>
                        </form>
                    </div>
                ) : selectedRole ? (
                    <div className="bg-white rounded-xl shadow border border-gray-100 flex flex-col max-h-[calc(100vh-120px)]">
                        <div className="p-6 border-b shrink-0 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold">{selectedRole.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">{selectedRole.description}</p>
                            </div>
                            <NuraButton
                                label={isEditing ? "Cancel" : "Edit Privileges"}
                                variant={isEditing ? "secondary" : "navigate"}
                                className="w-auto h-8 px-4 text-xs font-semibold"
                                onClick={() => {
                                    if (isEditing) setTempPermissions(new Set(selectedRole.permissions.map(p => p.permissionId)));
                                    setIsEditing(!isEditing);
                                }}
                            />
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <h3 className="font-medium text-lg mb-4">Permissions</h3>

                            <div className="space-y-6">
                                {Object.entries(permsByResource).map(([resource, perms]) => (
                                    <div key={resource} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">{resource}</h4>
                                        <div className="space-y-3">
                                            {perms.map(perm => (
                                                <label
                                                    key={perm.id}
                                                    className={`flex items-start gap-3 ${isEditing ? 'cursor-pointer hover:bg-gray-50 p-1 -m-1 rounded' : 'opacity-80'}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="mt-1 w-4 h-4 text-[#D9F55C] rounded border-gray-300 focus:ring-[#D9F55C] disabled:opacity-50"
                                                        checked={tempPermissions.has(perm.id)}
                                                        onChange={() => handleTogglePermission(perm.id)}
                                                        disabled={!isEditing}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{perm.description}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-0.5">{perm.action}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="p-4 border-t bg-white shrink-0">
                                <NuraButton
                                    label="Save Permissions"
                                    variant="primary"
                                    onClick={handleSavePermissions}
                                    isLoading={isSaving}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-8 text-center text-gray-500 flex flex-col items-center justify-center h-64">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <p>Select a role to view or edit its permissions</p>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Role"
                message="Are you sure you want to delete this role? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => { setIsDeleteModalOpen(false); setRoleToDelete(null); }}
                isLoading={isSaving}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
}
