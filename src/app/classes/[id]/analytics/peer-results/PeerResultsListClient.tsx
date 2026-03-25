"use client"

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import Link from 'next/link';
import TitleCard from '@/components/ui/card/title_card';

interface PeerResultsListClientProps {
    classData: any;
    groupMembers: any[];
    myEnrollmentId?: number;
}

export default function PeerResultsListClient({ classData, groupMembers, myEnrollmentId }: PeerResultsListClientProps) {
    const list = groupMembers.filter(m => m.id !== myEnrollmentId);

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Feedback', href: '/feedback' },
                    { label: 'Final Project Peer Feedback', href: '#' },
                ]}
            />

            {/* Header */}
            <TitleCard
                title="Final Project Peer Feedback"
                description={`${classData.title}`}
            />

            <div className="bg-white rounded-xl max-w-7xl mx-auto p-8 md:p-12 shadow-sm border border-white/50 space-y-8">
                <h2 className="text-lg font-medium text-[#1C3A37]">Hasil Peer Feedback Learners</h2>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-medium text-gray-800">Name</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-800 text-right">Feedback</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {list.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-xs text-[#1C3A37]">
                                        {member.user.name || member.user.username}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link
                                            href={`/classes/${classData.id}/analytics/peer-results/${member.id}`}
                                            className="px-6 py-1.5 bg-[#DAEE49] hover:bg-[#C9D942] text-[#1C3A37] text-xs uppercase rounded-full transition-all inline-flex items-center"
                                        >
                                            Feedback
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {list.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-400 italic">
                                        No group members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
