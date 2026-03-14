"use client"

import { useEffect, useState, useTransition } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { Check, Plus, Save, Users } from "lucide-react";
import { hasPermission } from "@/lib/rbac";
import { assignGroupsAction } from "@/app/actions/placement";
import { toast } from "sonner";

interface Course {
    id: number;
    title: string;
}

interface LearnerStatus {
    enrollmentId: number;
    name: string;
    group: string;
    courses: {
        courseId: number;
        isPassed: boolean;
    }[];
}

interface StatusData {
    learners: LearnerStatus[];
    courses: Course[];
    groups: string[];
}

export default function LearnerGroupClient({
    classId,
    classTitle,
    initialData
}: {
    classId: number;
    classTitle: string;
    initialData: StatusData;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [canManage, setCanManage] = useState(false);

    // State for local group edits
    const [assignments, setAssignments] = useState<Record<number, string>>(
        Object.fromEntries(initialData.learners.map(l => [l.enrollmentId, l.group]))
    );

    const [allGroups, setAllGroups] = useState<string[]>(initialData.groups);
    const [newGroupName, setNewGroupName] = useState("");

    useEffect(() => {
        hasPermission("GroupMapping", "CREATE").then(setCanManage);
    }, []);

    const handleGroupChange = (enrollmentId: number, value: string) => {
        setAssignments(prev => ({ ...prev, [enrollmentId]: value }));
    };

    const handleCreateGroup = () => {
        const trimmed = newGroupName.trim();
        if (!trimmed) return;
        if (allGroups.includes(trimmed)) {
            toast.error("Group already exists");
            return;
        }
        setAllGroups(prev => [...prev, trimmed]);
        setNewGroupName("");
        toast.success(`Group "${trimmed}" added to list`);
    };

    const handleSave = async () => {
        startTransition(async () => {
            const assignmentList = Object.entries(assignments).map(([id, name]) => ({
                enrollmentId: parseInt(id),
                groupName: name === "-" || name === "Ungrouped" ? null : name
            }));

            const result = await assignGroupsAction(classId, assignmentList);
            if (result.success) {
                toast.success("Groups assigned successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to assign groups");
            }
        });
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
                            { label: classTitle, href: `/classes/${classId}/overview` },
                            { label: "Learner Group", href: "#" },
                        ]}
                    />
                </div>

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Learner Group</h1>
                        <p className="text-emerald-100 text-sm mt-1">Status matrix and group assignment</p>
                    </div>
                    {canManage && (
                        <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                            <input
                                type="text"
                                placeholder="New group name..."
                                className="bg-transparent text-white placeholder:text-white/50 px-4 py-2 outline-none text-sm w-48"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
                            />
                            <button
                                onClick={handleCreateGroup}
                                className="bg-white text-[#00524D] p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                title="Create Group"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-black">Student Course Pass List</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users size={16} />
                            <span>{initialData.learners.length} Students</span>
                        </div>
                    </div>

                    {/* Matrix Table */}
                    <div className="w-full border border-black rounded-[2rem] overflow-hidden bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="px-8 py-5 text-xs font-bold text-black uppercase tracking-tight">Name</th>
                                    {initialData.courses.map(course => (
                                        <th key={course.id} className="px-4 py-5 text-xs font-bold text-black text-center uppercase tracking-tight">
                                            {course.title}
                                        </th>
                                    ))}
                                    <th className="px-8 py-5 text-xs font-bold text-black text-center uppercase tracking-tight w-48">Group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialData.learners.map((learner, idx) => (
                                    <tr
                                        key={learner.enrollmentId}
                                        className={`${idx !== initialData.learners.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50/50 transition-colors`}
                                    >
                                        <td className="px-8 py-6 text-sm text-black font-semibold">{learner.name}</td>
                                        {initialData.courses.map(course => {
                                            const status = learner.courses.find(c => c.courseId === course.id);
                                            return (
                                                <td key={course.id} className="px-4 py-6 text-center">
                                                    {status?.isPassed ? (
                                                        <div className="inline-flex items-center justify-center w-6 h-6 bg-black rounded-md">
                                                            <Check size={16} className="text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-md border border-gray-200 mx-auto opacity-30" />
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-8 py-6 text-center">
                                            {canManage ? (
                                                <select
                                                    value={assignments[learner.enrollmentId] || "-"}
                                                    onChange={(e) => handleGroupChange(learner.enrollmentId, e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00524D] outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="-">Ungrouped</option>
                                                    {allGroups.map(name => (
                                                        <option key={name} value={name}>{name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${learner.group !== "-" ? "bg-emerald-100 text-[#00524D]" : "bg-gray-100 text-gray-500"}`}>
                                                    {learner.group === "-" ? "Ungrouped" : learner.group}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 flex justify-center gap-4">
                        <NuraButton
                            label="Back to Overview"
                            variant="secondary"
                            onClick={() => router.push(`/classes/${classId}/overview`)}
                        />
                        <NuraButton
                            label="See All Groups"
                            variant="secondary"
                            onClick={() => router.push(`/classes/${classId}/groups`)}
                        />
                        {canManage && (
                            <NuraButton
                                label="Save Assignments"
                                variant="primary"
                                onClick={handleSave}
                                disabled={isPending}
                            />
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}
