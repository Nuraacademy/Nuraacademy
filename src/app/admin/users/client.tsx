"use client"

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";
import { assignRoleToUserAction } from "@/app/actions/role";
import { adminDeleteUserAction, adminCreateUserAction } from "@/app/actions/user";
import { User, Role } from "@prisma/client";
import { Search, UserPlus, Trash2, Shield, User as UserIcon, X, Check } from "lucide-react";
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";
import { toast } from "sonner";

type UserWithRole = User & { role: Role | null };

export default function UsersClient({
    initialUsers,
    roles,
}: {
    initialUsers: UserWithRole[];
    roles: Role[];
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roleFilter = searchParams.get('role');
    const staffFilter = searchParams.get('filter') === 'staff';
    const learnerFilter = searchParams.get('filter') === 'learner';

    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    // Deletion state
    const [userToDelete, setUserToDelete] = useState<UserWithRole | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Creation state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        roleId: ""
    });

    const filteredUsers = useMemo(() => {
        let result = users;

        // Apply URL filters
        if (staffFilter) {
            result = result.filter(u => u.role?.name !== 'Learner');
        } else if (learnerFilter) {
            result = result.filter(u => u.role?.name === 'Learner');
        } else if (roleFilter) {
            result = result.filter(u => u.role?.name.toLowerCase() === roleFilter.toLowerCase());
        }

        // Apply Search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.name?.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.username.toLowerCase().includes(query)
            );
        }

        return result;
    }, [users, roleFilter, staffFilter, learnerFilter, searchQuery]);

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
            toast.success("User role updated successfully");
        } else {
            toast.error("Failed to assign role: " + res.error);
        }
        setIsSaving(false);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        const res = await adminDeleteUserAction(userToDelete.id);
        if (res.success) {
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
            toast.success("User deleted successfully");
        } else {
            toast.error("Failed to delete user: " + res.error);
        }
        setIsDeleting(false);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const res = await adminCreateUserAction({
            ...newUser,
            roleId: newUser.roleId ? parseInt(newUser.roleId) : undefined
        } as any);

        if (res.success) {
            setUsers([res.data as any, ...users]);
            setIsCreateModalOpen(false);
            setNewUser({ name: "", email: "", username: "", password: "", roleId: "" });
            toast.success("User created successfully");
        } else {
            toast.error("Failed to create user: " + res.error);
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            {/* Header / Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or username..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#D9F55C] transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <NuraButton
                    label="Add New User"
                    variant="primary"
                    leftIcon={<UserPlus className="w-4 h-4" />}
                    onClick={() => setIsCreateModalOpen(true)}
                />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-medium">
                                <th className="py-4 px-8">User Profile</th>
                                <th className="py-4 px-8">Permission / Role</th>
                                <th className="py-4 px-8">Engagement</th>
                                <th className="py-4 px-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-[#FDFDF7] transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#005954] to-[#00897B] flex items-center justify-center text-white font-medium text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 group-hover:text-[#005954] transition-colors">{user.name || "Unnamed User"}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <span className="opacity-70">@{user.username}</span>
                                                    <span>•</span>
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        {editingUserId === user.id ? (
                                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                <select
                                                    className="border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-xs outline-none focus:ring-2 focus:ring-[#D9F55C] min-w-[140px]"
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
                                                <button
                                                    onClick={() => handleSaveRole(user.id)}
                                                    disabled={isSaving}
                                                    className="p-1.5 bg-[#D9F55C] text-emerald-900 rounded-lg hover:bg-[#c6e14b] transition-colors disabled:opacity-50"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancelClick}
                                                    className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${user.role?.name === 'Admin' ? 'bg-[#1C3A37] text-white' :
                                                        user.role?.name === 'Learner' ? 'bg-[#D9F55C]/20 text-[#005954]' :
                                                            'bg-orange-50 text-orange-700'
                                                    }`}>
                                                    <Shield className="w-3 h-3" />
                                                    {user.role?.name || "Unassigned"}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="text-xs text-gray-500">
                                            <div className="font-medium text-gray-700">Joined</div>
                                            <div>{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <NuraButton
                                                label="Profile"
                                                variant="secondary"
                                                className="w-auto h-8 px-3 text-[10px]"
                                                onClick={() => router.push(`/admin/users/${user.id}`)}
                                            />
                                            <NuraButton
                                                label="Role"
                                                variant="secondary"
                                                className="w-auto h-8 px-3 text-[10px]"
                                                onClick={() => handleEditClick(user)}
                                            />
                                            <button
                                                onClick={() => setUserToDelete(user)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <UserIcon className="w-12 h-12 opacity-20" />
                                            <div className="text-sm font-medium">No users found matching your criteria.</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={!!userToDelete}
                title="Delete User?"
                message={
                    <span>
                        Are you sure you want to delete <b>{userToDelete?.name || userToDelete?.username}</b>?
                        This action will soft-delete the user and they will no longer be able to log in.
                    </span>
                }
                onConfirm={handleDeleteUser}
                onCancel={() => setUserToDelete(null)}
                confirmText="Delete"
                isLoading={isDeleting}
            />

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !isSaving && setIsCreateModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-medium text-[#1C3A37]">Add New User</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] transition-all text-sm"
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Username</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] transition-all text-sm"
                                        value={newUser.username}
                                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                        placeholder="johndoe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] transition-all text-sm"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Initial Password</label>
                                    <input
                                        required
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] transition-all text-sm"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Assign Role</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] transition-all text-sm appearance-none"
                                        value={newUser.roleId}
                                        onChange={e => setNewUser({ ...newUser, roleId: e.target.value })}
                                    >
                                        <option value="">Select a role...</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id.toString()}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <NuraButton
                                    label="Cancel"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    disabled={isSaving}
                                />
                                <NuraButton
                                    label="Create Account"
                                    variant="primary"
                                    className="flex-1 text-emerald-900"
                                    type="submit"
                                    isLoading={isSaving}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
