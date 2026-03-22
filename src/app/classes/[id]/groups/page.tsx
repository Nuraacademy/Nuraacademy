import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { getClassGroupsSummary } from "@/controllers/placementController";
import { getClassById } from "@/controllers/classController";
import { hasPermission } from "@/lib/rbac";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ViewGroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);
    const classData = await getClassById(classId);

    if (!classData) return notFound();

    const groups = await getClassGroupsSummary(classId);
    const canManageGroups = await hasPermission("GroupMapping", "CREATE");

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20">
            {/* Background Images */}
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: classData.title, href: `/classes/${classId}/overview` },
                            { label: "View Group", href: "#" },
                        ]}
                    />
                </div>

                {/* Banner */}
                <div className="bg-[#00524D] rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-xl md:text-2xl font-medium text-white">View Group</h1>
                        {canManageGroups && (
                            <Link href={`/classes/${classId}/placement/learner-group`}>
                                <button className="bg-white text-[#00524D] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors shadow-sm">
                                    Manage Groups
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 min-h-[500px]">
                    <h2 className="text-lg font-medium mb-8 text-black">Group List</h2>

                    {/* Group Table - Grid to match exactly */}
                    <div className="w-full border border-black rounded-[2rem] overflow-hidden bg-white">
                        <div className="grid grid-cols-12 border-b border-black bg-white px-8 py-5">
                            <div className="col-span-4 text-sm font-medium text-black uppercase tracking-tight">Group Name</div>
                            <div className="col-span-3 text-sm font-medium text-black text-center uppercase tracking-tight">Total Member</div>
                            <div className="col-span-5 text-sm font-medium text-black uppercase tracking-tight">Member List</div>
                        </div>

                        {groups.map((group, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-12 px-8 py-8 border-gray-200 ${index !== groups.length - 1 ? 'border-b' : ''} bg-white items-start`}
                            >
                                <div className="col-span-4 text-sm text-black font-medium">{group.name}</div>
                                <div className="col-span-3 text-sm text-black text-center font-medium">{group.members.length}</div>
                                <div className="col-span-5 text-sm text-black">
                                    <div className="flex flex-col gap-3">
                                        {group.members.map((member, i) => (
                                            <div key={i} className="text-sm font-medium text-gray-800">
                                                {member}
                                            </div>
                                        ))}
                                        {group.members.length === 0 && <span className="text-gray-400 italic">No members assigned yet.</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {groups.length === 0 && (
                            <div className="px-8 py-10 text-center text-gray-500 italic">
                                No groups have been created for this class yet.
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-12 flex justify-center">
                        <Link href={`/classes/${classId}/test?finished=true`}>
                            <button className="bg-[#D9F438] text-black px-10 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm">
                                Back to Test Result
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
