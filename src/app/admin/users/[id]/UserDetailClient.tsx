"use client"

import { useState } from "react";
import { User, Role } from "@prisma/client";
import { NuraButton } from "@/components/ui/button/button";
import { adminUpdateUserAction } from "@/app/actions/user";
import { toast } from "sonner";
import { ChevronLeft, Save, Mail, User as UserIcon, Shield, Calendar, Phone, AtSign, Key } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type UserWithRole = User & { role: Role | null };

export default function UserDetailClient({
    user,
    roles
}: {
    user: UserWithRole;
    roles: Role[];
}) {
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email,
        username: user.username,
        roleId: user.roleId?.toString() || "",
        password: "" // Only if they want to reset it
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const res = await adminUpdateUserAction(user.id, {
            ...formData,
            roleId: formData.roleId ? parseInt(formData.roleId) : null,
            password: formData.password || undefined
        });

        if (res.success) {
            toast.success("User updated successfully");
            setFormData(prev => ({ ...prev, password: "" }));
        } else {
            toast.error("Failed to update user: " + res.error);
        }
        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-[#F9F9EE] relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full md:w-[60%] h-[40rem] pointer-events-none opacity-40">
                <Image
                    src="/background/PolygonBGTop.svg"
                    alt="Background Top"
                    fill
                    className="object-cover object-left-top"
                    priority
                />
            </div>

            <div className="relative z-10 px-4 md:px-16 py-12 max-w-7xl mx-auto">
                {/* Breadcrumb & Navigation */}
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-[#005954] font-medium text-sm mb-8 hover:translate-x-[-4px] transition-transform"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to User List
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Information Card */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/5 border border-white">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#005954] to-[#00897B] flex items-center justify-center text-white font-medium text-4xl mb-6 shadow-lg border-4 border-[#D9F55C]/20">
                                    {formData.name ? formData.name[0].toUpperCase() : formData.username[0].toUpperCase()}
                                </div>
                                <h1 className="text-2xl font-black text-[#1C3A37] mb-2">{formData.name || "Unnamed User"}</h1>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D9F55C]/20 border border-[#D9F55C]/30 rounded-full text-xs font-medium text-[#005954] uppercase tracking-wider mb-6">
                                    <Shield className="w-3 h-3" />
                                    {roles.find(r => r.id.toString() === formData.roleId)?.name || "Unassigned"}
                                </div>

                                <div className="w-full h-[1px] bg-gray-100 mb-8" />

                                <div className="w-full space-y-4 text-left">
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <AtSign className="w-4 h-4 text-[#D9F55C]" />
                                        <span className="font-medium">@{formData.username}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Mail className="w-4 h-4 text-[#D9F55C]" />
                                        <span>{formData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 text-[#D9F55C]" />
                                        <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form Section */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-black/5 border border-white">
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-[#1C3A37] mb-2">Edit Profile Details</h2>
                                <p className="text-gray-400 font-medium italic">Update administrative information and security settings.</p>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-[#005954] uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                            <UserIcon className="w-3 h-3" /> Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-6 py-4 bg-[#FDFDF7] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] focus:shadow-inner transition-all text-sm font-medium"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-[#005954] uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                            <AtSign className="w-3 h-3" /> Username
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-6 py-4 bg-[#FDFDF7] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] focus:shadow-inner transition-all text-sm font-medium"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-[#005954] uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                            <Mail className="w-3 h-3" /> Email Address
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-6 py-4 bg-[#FDFDF7] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] focus:shadow-inner transition-all text-sm font-medium"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-[#005954] uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                            <Shield className="w-3 h-3" /> System Role
                                        </label>
                                        <select
                                            required
                                            className="w-full px-6 py-4 bg-[#FDFDF7] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] focus:shadow-inner transition-all text-sm font-medium appearance-none"
                                            value={formData.roleId}
                                            onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                                        >
                                            <option value="">Select a role...</option>
                                            {roles.map(r => (
                                                <option key={r.id} value={r.id.toString()}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-xs font-black text-[#005954] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Key className="w-3 h-3" /> Reset Password
                                            </label>
                                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded">Optional</span>
                                        </div>
                                        <input
                                            type="password"
                                            className="w-full px-6 py-4 bg-[#FDFDF7] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D9F55C] focus:shadow-inner transition-all text-sm font-medium"
                                            placeholder="Leave blank to keep current password"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-50 flex justify-end">
                                    <NuraButton
                                        label="Save Changes"
                                        variant="primary"
                                        leftIcon={<Save className="w-5 h-5" />}
                                        className="min-w-[240px] text-emerald-900"
                                        type="submit"
                                        isLoading={isSaving}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
