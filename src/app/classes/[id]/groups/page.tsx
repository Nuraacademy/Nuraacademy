"use client"

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter, useParams } from "next/navigation";

export default function ViewGroupPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [courseTitle, setCourseTitle] = useState("Foundation to Data Analytics");

    const groups = [
        {
            name: "Group 1",
            totalMember: 4,
            members: ["Learner A", "Learner B", "Learner C"]
        },
        {
            name: "Group 2",
            totalMember: 4,
            members: ["Learner D", "Learner E", "Learner F"]
        },
        {
            name: "Group 3",
            totalMember: 4,
            members: ["Learner G", "Learner H", "Learner I"]
        }
    ];

    return (
        <main className="min-h-screen bg-[#F5F5EC] font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: courseTitle, href: `/classes/${id}/overview` },
                            { label: "Placement Test", href: `/classes/${id}/test` },
                            { label: "Placement Test Result", href: `/classes/${id}/test/result` },
                            { label: "View Group", href: `/classes/${id}/groups` },
                        ]}
                    />
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

                        {groups.map((group, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-12 px-8 py-6 border-black ${index !== groups.length - 1 ? 'border-b' : ''} bg-white`}
                            >
                                <div className="col-span-4 text-sm text-black self-center">{group.name}</div>
                                <div className="col-span-4 text-sm text-black text-center self-center">{group.totalMember}</div>
                                <div className="col-span-4 text-sm text-black">
                                    <ul className="space-y-2">
                                        {group.members.map((member, i) => (
                                            <li key={i}>{member}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Back Button */}
                    <div className="mt-12 flex justify-center">
                        <NuraButton
                            label="Back to Test Result"
                            variant="primary"
                            className="min-w-[200px]"
                            onClick={() => router.push(`/classes/${id}/overview`)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
