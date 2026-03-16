"use client"

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";
import { assignRoleToUserAction } from "@/app/actions/role";
import { User, Role } from "@prisma/client";

type UserWithRole = User & { role: Role | null };

export default function UsersClient({
    initialUsers,
    roles,
}: {
    initialUsers: UserWithRole[];
    roles: Role[];
}) {
    const searchParams = useSearchParams();
    const roleFilter = searchParams.get('role');
    const staffFilter = searchParams.get('filter') === 'staff';
    const learnerFilter = searchParams.get('filter') === 'learner';

    const [users, setUsers] = useState(initialUsers);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    const filteredUsers = useMemo(() => {
        if (staffFilter) {
            return users.filter(u => u.role?.name !== 'Learner');
        }
        if (learnerFilter) {
            return users.filter(u => u.role?.name === 'Learner');
        }
        if (!roleFilter) return users;
        return users.filter(u => u.role?.name.toLowerCase() === roleFilter.toLowerCase());
    }, [users, roleFilter, staffFilter, learnerFilter]);

    const handleEditClick = (user: UserWithRole) => {
        setEditingUserId(user.id);
        setSelectedRoleId(user.roleId?.toString() || "");
    };

    const handleCancelClick = () => {
        setEditingUserId(null);
        setSelectedRoleId("");
    };

    const handleSaveRole = async (userId: number) => {
        setIsSaving(true);
        const newRoleId = selectedRoleId ? parseInt(selectedRoleId) : null;
        const res = await assignRoleToUserAction(userId, newRoleId);

        if (res.success) {
            setUsers(users.map(u => {
                if (u.id === userId) {
                    return {
                        ...u,
                        roleId: newRoleId,
                        role: newRoleId ? roles.find(r => r.id === newRoleId) || null : null
                    };
                }
                return u;
            }));
            setEditingUserId(null);
        } else {
            alert("Failed to assign role: " + res.error);
        }
        setIsSaving(false);
    };

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 text-gray-500 text-sm">
                            <th className="py-3 px-6 font-medium">Name</th>
                            <th className="py-3 px-6 font-medium">Email</th>
                            <th className="py-3 px-6 font-medium">Current Role</th>
                            <th className="py-3 px-6 font-medium">Joined Date</th>
                            <th className="py-3 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-6">
                                    <div className="font-medium text-gray-900">{user.name || "-"}</div>
                                    <div className="text-xs text-gray-400">@{user.username}</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    {user.email}
                                </td>
                                <td className="py-4 px-6">
                                    {editingUserId === user.id ? (
                                        <select
                                            className="border rounded px-2 py-1 bg-white text-sm outline-none focus:ring-2 focus:ring-[#D9F55C]"
                                            value={selectedRoleId}
                                            onChange={(e) => setSelectedRoleId(e.target.value)}
                                            disabled={isSaving}
                                        >
                                            <option value="">No Role</option>
                                            {roles.map((r) => (
                                                <option key={r.id} value={r.id.toString()}>
                                                    {r.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role?.isSystem ? 'bg-blue-100 text-blue-800' :
                                                user.role ? 'bg-[#D9F55C]/30 text-emerald-900' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role?.name || "No Role"}
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    {editingUserId === user.id ? (
                                        <div className="flex gap-2 justify-end">
                                            <NuraButton
                                                label="Cancel"
                                                variant="secondary"
                                                className="w-auto h-7 px-3 text-xs"
                                                onClick={handleCancelClick}
                                                disabled={isSaving}
                                            />
                                            <NuraButton
                                                label="Save"
                                                variant="primary"
                                                className="w-auto h-7 px-3 text-xs"
                                                onClick={() => handleSaveRole(user.id)}
                                                isLoading={isSaving}
                                            />
                                        </div>
                                    ) : (
                                        <NuraButton
                                            label="Edit Role"
                                            variant="navigate"
                                            onClick={() => handleEditClick(user)}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    No {staffFilter ? "staff members" : roleFilter ? roleFilter.toLowerCase() + "s" : "users"} found in the system.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
