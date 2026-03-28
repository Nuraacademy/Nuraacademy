"use client"

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import Link from 'next/link';
import TitleCard from '@/components/ui/card/title_card';
import { NuraSearchInput } from '@/components/ui/input/nura_search_input';
import Image from 'next/image';

interface LearnerListClientProps {
    classId: number;
    classTitle: string;
    learners: {
        id: number;
        name: string;
        username: string;
        email?: string;
        profilePicture?: string;
    }[];
}

export default function LearnerListClient({ classId, classTitle, learners }: LearnerListClientProps) {
    const [searchValue, setSearchValue] = useState("");

    const filteredLearners = learners.filter(learner =>
        learner.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        learner.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        (learner.email?.toLowerCase().includes(searchValue.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-[#F9F9EE] text-[#1C3A37]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 px-1">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: classTitle, href: `/classes/${classId}/overview` },
                            { label: 'Report & Analytics', href: `/classes/${classId}/analytics` },
                            { label: 'Learner Analytics', href: '#' },
                        ]}
                    />
                </div>

                {/* Header */}
                <TitleCard
                    title="Report & Analytics"
                    description={`${classTitle} | Learner Analytics`}
                />

                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-[#1C3A37]/5 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-lg font-medium text-[#1C3A37] tracking-tight border-l-4 border-[#DAEE49] pl-4 uppercase">Enrolled Learners</h2>
                        <NuraSearchInput
                            className="w-full md:w-72"
                            placeholder="Search learner..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#FDFDF7] border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-[#1C3A37] uppercase tracking-widest">Learner</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#1C3A37] uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLearners.map((learner) => (
                                    <tr key={learner.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                                    <Image
                                                        src={learner.profilePicture || `/example/human.png`}
                                                        alt={learner.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#1C3A37]">{learner.name}</p>
                                                    <p className="text-[10px] text-gray-400">@{learner.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/analytics/user/${learner.id}`}
                                                className="px-6 py-2 bg-[#DAEE49] hover:bg-[#C9D942] text-[#1C3A37] text-[10px] font-black uppercase rounded-xl transition-all inline-flex items-center shadow-sm"
                                            >
                                                View Report
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLearners.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-12 text-center text-gray-400 italic">
                                            {searchValue ? "No matching learners found." : "No enrolled learners found for this class."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
