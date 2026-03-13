"use client"

import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";

interface GroupData {
    name: string;
    members: string[];
}

export default function CreateGroupClient({
    classId,
    classTitle,
    groups
}: {
    classId: number;
    classTitle: string;
    groups: GroupData[];
}) {
    const router = useRouter();

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

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10">
                    <h1 className="text-2xl font-bold text-white">Create Group</h1>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-black">Group List</h2>
                    </div>

                    {/* Group Table */}
                    <div className="w-full border border-black rounded-[2rem] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-8 py-5 text-sm font-semibold text-black">Group Name</th>
                                    <th className="px-8 py-4 text-sm font-semibold text-black text-center">Total Member</th>
                                    <th className="px-8 py-4 text-sm font-semibold text-black">Member List</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((group, idx) => (
                                    <tr key={idx} className={idx !== groups.length - 1 ? "border-b border-gray-100" : ""}>
                                        <td className="px-8 py-6 text-sm text-black font-medium">{group.name}</td>
                                        <td className="px-8 py-6 text-sm text-black text-center font-medium">{group.members.length}</td>
                                        <td className="px-8 py-6 text-sm text-black space-y-2">
                                            {group.members.map((member, mIdx) => (
                                                <div key={mIdx}>{member}</div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 flex flex-col items-center gap-6">
                        <button className="text-sm font-bold text-black hover:underline">Ungroup</button>
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
