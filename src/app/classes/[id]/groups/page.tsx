import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import Image from "next/image";
import { getClassGroupsSummary } from "@/controllers/placementController";
import { getClassById } from "@/controllers/classController";
import { hasPermission } from "@/lib/rbac";
import { notFound } from "next/navigation";
import Link from "next/link";
import TitleCard from "@/components/ui/card/title_card";

export default async function ViewGroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);
    const classData = await getClassById(classId);

    if (!classData) return notFound();

    const groups = await getClassGroupsSummary(classId);
    const canManageGroups = await hasPermission("Enrollment", "CREATE_GROUP_MAPPING");

    return (
        <main className="min-h-screen bg-[#FDFDF7] max-w-7xl mx-auto text-gray-800 pb-20">
            {/* Background Images */}
            {/* Background */}
            <Image
                src="/background/OvalBGLeft.svg"
                alt=""
                className="absolute top-0 left-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />
            <Image
                src="/background/OvalBGRight.svg"
                alt=""
                className="absolute bottom-0 right-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/classes" },
                            { label: classData.title, href: `/classes/${classId}/overview` },
                            { label: "Group", href: "#" },
                        ]}
                    />
                </div>

                <TitleCard
                    title="View Group"
                    description="Foundation to Data Analytics"
                    actions={canManageGroups &&
                        <Link href={`/classes/${classId}/placement/learner-group`}>
                            <button className="bg-white text-[#00524D] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors shadow-sm">
                                Manage Groups
                            </button>
                        </Link>
                    }
                />

                {/* Content Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 min-h-[500px]">
                    <h2 className="text-md font-medium mb-8 text-black">Group List</h2>

                    {/* Group Table - Grid to match exactly */}
                    <div className="w-full border border-black rounded-[2rem] overflow-hidden bg-white">
                        <div className="grid grid-cols-12 border-b border-black bg-white px-8 py-5">
                            <div className="col-span-4 text-sm font-medium text-gray-800 tracking-tight">Group Name</div>
                            <div className="col-span-3 text-sm font-medium text-gray-800 text-center tracking-tight">Total Member</div>
                            <div className="col-span-5 text-sm font-medium text-gray-800 tracking-tight">Member List</div>
                        </div>

                        {groups.map((group, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-12 px-8 py-8 border-gray-200 ${index !== groups.length - 1 ? 'border-b' : ''} bg-white items-start`}
                            >
                                <div className="col-span-4 text-xs text-gray-600">{group.name}</div>
                                <div className="col-span-3 text-xs text-gray-600 text-center">{group.members.length}</div>
                                <div className="col-span-5 text-xs text-gray-600">
                                    <div className="flex flex-col gap-3">
                                        {group.members.map((member, i) => (
                                            <div key={i} className="text-xs text-gray-600">
                                                {member}
                                            </div>
                                        ))}
                                        {group.members.length === 0 && <span className="text-gray-400 italic">No members assigned yet.</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {groups.length === 0 && (
                            <div className="px-8 py-10 text-center text-gray-800 italic">
                                No groups have been created for this class yet.
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    {!canManageGroups ? <div className="mt-12 flex justify-center">
                        <Link
                            href={`/classes/${classId}/test?finished=true`}
                            className="bg-[#D9F55C] text-black hover:bg-[#c8e44a] px-10 py-3 rounded-xl text-sm font-medium transition-all shadow-md active:scale-95 inline-flex items-center justify-center min-w-[120px]"
                        >
                            Back to Test Result
                        </Link>
                    </div> : <div className="mt-12 flex justify-center">
                        <Link
                            href={`/classes/${classId}/overview`}
                            className="bg-[#D9F55C] text-black hover:bg-[#c8e44a] px-10 py-3 rounded-xl text-sm font-medium transition-all shadow-md active:scale-95 inline-flex items-center justify-center min-w-[120px]"
                        >
                            Back to Overview
                        </Link>
                    </div>}
                </div>
            </div>
        </main>
    );
}
