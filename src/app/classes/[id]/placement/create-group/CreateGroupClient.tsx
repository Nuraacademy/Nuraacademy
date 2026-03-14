"use client"

import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { assignGroupsAction } from "@/app/actions/placement";
import { User, Users, Trash2, ArrowRight } from "lucide-react";

interface LearnerData {
    enrollmentId: number;
    name: string;
    group: string;
}

export default function CreateGroupClient({
    classId,
    classTitle,
    learners: initialLearners
}: {
    classId: number;
    classTitle: string;
    learners: LearnerData[];
}) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [groupNameInput, setGroupNameInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleSelect = (id: number) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === initialLearners.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(initialLearners.map(l => l.enrollmentId)));
        }
    };

    const handleAction = async (assignments: { enrollmentId: number, groupName: string | null }[]) => {
        setIsSubmitting(true);
        const res = await assignGroupsAction(classId, assignments);
        setIsSubmitting(false);

        if (res.success) {
            toast.success("Groups updated successfully");
            setSelectedIds(new Set());
            setGroupNameInput("");
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update groups");
        }
    };

    const bulkAssign = () => {
        if (!groupNameInput.trim()) {
            toast.error("Please enter a group name");
            return;
        }
        const assignments = Array.from(selectedIds).map(id => ({
            enrollmentId: id,
            groupName: groupNameInput.trim()
        }));
        handleAction(assignments);
    };

    const bulkUngroup = () => {
        const assignments = Array.from(selectedIds).map(id => ({
            enrollmentId: id,
            groupName: null
        }));
        handleAction(assignments);
    };

    const ungroupOne = (id: number) => {
        handleAction([{ enrollmentId: id, groupName: null }]);
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans text-gray-800 pb-20">
            {/* Background Images */}
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Placement Test", href: `/classes/${classId}/test` },
                            { label: classTitle, href: `/classes/${classId}/overview` },
                            { label: "Learner Group", href: `/classes/${classId}/placement/learner-group` },
                            { label: "Create Group", href: "#" },
                        ]}
                    />
                </div>

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Manage Groups</h1>
                        <p className="text-emerald-100 text-sm mt-1">Organize your students into study groups</p>
                    </div>
                </div>

                {/* Bulk Action Bar */}
                <div className={`sticky top-4 z-20 mb-6 transition-all transform duration-300 ${selectedIds.size > 0 ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95 pointer-events-none"}`}>
                    <div className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 flex flex-col md:flex-row items-center gap-4 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 text-[#00524D] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                <Users size={16} />
                                {selectedIds.size} Selected
                            </div>
                            <span className="text-gray-400 text-sm">Assign them to:</span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 max-w-md w-full">
                            <input
                                type="text"
                                placeholder="Group Name (e.g. Squad A)"
                                value={groupNameInput}
                                onChange={(e) => setGroupNameInput(e.target.value)}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#00524D] outline-none transition-all"
                            />
                            <button
                                onClick={bulkAssign}
                                disabled={isSubmitting}
                                className="bg-[#00524D] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#003B38] disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? "wait..." : "Apply"} <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>

                        <button
                            onClick={bulkUngroup}
                            disabled={isSubmitting}
                            className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 size={16} /> Ungroup All
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-black flex items-center gap-2">
                            <User className="text-gray-400" /> Learner Management
                        </h2>
                        <button
                            onClick={toggleSelectAll}
                            className="text-sm font-bold text-[#00524D] hover:underline"
                        >
                            {selectedIds.size === initialLearners.length ? "Deselect All" : "Select All"}
                        </button>
                    </div>

                    <div className="w-full border border-gray-100 rounded-[2rem] overflow-hidden bg-[#fafafa]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="px-8 py-5 text-sm font-bold text-gray-500 w-16">Select</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-500">Learner Name</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-500">Current Group</th>
                                    <th className="px-8 py-4 text-sm font-bold text-gray-500 text-right w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialLearners.map((learner, idx) => (
                                    <tr
                                        key={learner.enrollmentId}
                                        className={`group border-b border-gray-50 transition-colors ${selectedIds.has(learner.enrollmentId) ? "bg-emerald-50/30" : "bg-white hover:bg-gray-50/30"}`}
                                    >
                                        <td className="px-8 py-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(learner.enrollmentId)}
                                                onChange={() => toggleSelect(learner.enrollmentId)}
                                                className="w-5 h-5 accent-[#00524D] cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-8 py-6 text-sm text-black font-semibold">
                                            {learner.name}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${learner.group !== "-"
                                                ? "bg-emerald-100 text-[#00524D] border border-emerald-200"
                                                : "bg-gray-100 text-gray-500 italic"
                                                }`}>
                                                {learner.group !== "-" ? learner.group : "Ungrouped"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {learner.group !== "-" && (
                                                <button
                                                    onClick={() => ungroupOne(learner.enrollmentId)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Remove from group"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <NuraButton
                            label="Back to Pass List"
                            onClick={() => router.push(`/classes/${classId}/placement/learner-group`)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
