import { getClassDetails, getClassGroups } from "@/controllers/classController";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import Link from "next/link";

export default async function ViewGroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: classId } = await params;

    const [classInfo, groups] = await Promise.all([
        getClassDetails(classId),
        getClassGroups(classId)
    ]);

    if (!classInfo) {
        return <div className="p-10 text-center">Class not found</div>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classInfo.title, href: `/classes/${classId}/overview` },
        { label: "View Group", href: `/classes/${classId}/groups` },
    ];

    return (
        <main className="min-h-screen bg-[#F5F5EC] font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Banner */}
                <div className="bg-[#005954] rounded-2xl p-6 mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-white">View Group</h1>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-8 text-black">Group List</h2>

                    {/* Group Table */}
                    <div className="w-full border border-black rounded-[1.5rem] overflow-hidden">
                        <div className="grid grid-cols-12 border-b border-black bg-white px-8 py-4">
                            <div className="col-span-4 text-sm font-semibold text-black">Group Name</div>
                            <div className="col-span-4 text-sm font-semibold text-black text-center">Total Member</div>
                            <div className="col-span-4 text-sm font-semibold text-black">Member List</div>
                        </div>

                        {groups.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No groups found for this class.</div>
                        ) : (
                            groups.map((group, index) => (
                                <div
                                    key={group.id}
                                    className={`grid grid-cols-12 px-8 py-6 border-black ${index !== groups.length - 1 ? 'border-b' : ''} bg-white`}
                                >
                                    <div className="col-span-4 text-sm text-black self-center">{group.name}</div>
                                    <div className="col-span-4 text-sm text-black text-center self-center">{group.members.length}</div>
                                    <div className="col-span-4 text-sm text-black">
                                        <ul className="space-y-2">
                                            {group.members.map((member) => (
                                                <li key={member.id}>{member.user.name || "Anonymous"}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-12 flex justify-center">
                        <Link href={`/classes/${classId}/overview`}>
                            <NuraButton
                                label="Back to Course Overview"
                                variant="primary"
                                className="min-w-[200px]"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
