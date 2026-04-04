"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Mail, Phone, ExternalLink, Activity, Award, Briefcase, GraduationCap, Target, ChevronRight, X } from "lucide-react";
import { CVViewerModal } from "@/components/ui/modal/cv_viewer_modal";

interface User {
    id: number;
    name: string | null;
    username: string;
    email: string;
    whatsapp: string | null;
    avatarUrl?: string;
}

interface Enrollment {
    id: number;
    userId: number;
    classId: number;
    status: string;
    createdAt: string | Date;
    cvUrl: string | null;
    profession: string | null;
    yoe: string | null;
    workField: string | null;
    jobIndustry: string | null;
    educationField: string | null;
    objectives: string[];
    finalExpectations: string | null;
    user: User;
}

export default function EnrollmentTableClient({ 
    enrollments 
}: { 
    enrollments: Enrollment[] 
}) {
    const [selectedCV, setSelectedCV] = useState<{ url: string, name: string } | null>(null);

    return (
        <>
            <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50/90 backdrop-blur-md text-gray-400 text-sm border-b border-gray-100/50">
                            <th className="px-8 py-6">Name (Email)</th>
                            <th className="px-6 py-6">Profession</th>
                            <th className="px-6 py-6">YOE</th>
                            <th className="px-6 py-6">Work Field</th>
                            <th className="px-6 py-6">Education</th>
                            <th className="px-6 py-6">Job Industry</th>
                            <th className="px-6 py-6">Learning Objective</th>
                            <th className="px-6 py-6">Final Expectation</th>
                            <th className="px-6 py-6">CV</th>
                            <th className="px-10 py-6 text-right">Enrollment Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                        {enrollments.map((en) => (
                            <tr key={en.id} className="hover:bg-[#F5F5EC]/40 transition-[background] duration-500 group align-top">
                                <td className="px-8 py-7">
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1C3A37] text-sm truncate max-w-[150px]">{en.user.name || "N/A"}</span>
                                            <span className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{en.user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-7">
                                    <span className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">{en.profession || "—"}</span>
                                </td>
                                <td className="px-6 py-7">
                                    <div className="inline-flex px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 text-[11px] font-bold text-gray-500">
                                        {en.yoe ? `${en.yoe}y` : "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-7">
                                    <span className="text-[12px] text-gray-600 font-medium">{en.workField || "—"}</span>
                                </td>
                                <td className="px-6 py-7">
                                    <span className="text-[12px] text-gray-500 italic">{en.educationField || "—"}</span>
                                </td>
                                <td className="px-6 py-7">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] text-gray-600 font-bold leading-tight">{en.jobIndustry || "—"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-7">
                                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                                        {en.objectives?.length > 0 ? (
                                            en.objectives.map((obj, idx) => (
                                                <span key={idx} className="text-[9px] bg-white border border-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase tracking-tighter">
                                                    {obj}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-300 italic">No objectives</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-7">
                                    <p className="text-[11px] text-gray-400 italic line-clamp-2 leading-relaxed max-w-[200px]">
                                        {en.finalExpectations ? `"${en.finalExpectations}"` : "—"}
                                    </p>
                                </td>
                                <td className="px-6 py-7">
                                    {en.cvUrl ? (
                                        <button 
                                            onClick={() => setSelectedCV({ url: en.cvUrl!, name: en.user.name || en.user.username })}
                                            className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all text-red-500 group/cv shadow-sm"
                                            title="Preview CV"
                                        >
                                            <FileText size={16} className="group-hover/cv:scale-110 transition-transform" />
                                        </button>
                                    ) : (
                                        <div className="w-8 h-8 flex items-center justify-center text-gray-200">
                                            <X size={14} />
                                        </div>
                                    )}
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <div className="flex flex-col items-end gap-0.5">
                                        <span className="text-[13px] font-bold text-[#1C3A37]">
                                            {new Date(en.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50/50 px-1 rounded-md">
                                            {new Date(en.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {enrollments.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-inner animate-pulse">
                        <X className="text-gray-200" size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No enrollments yet</h3>
                    <p className="text-gray-500 max-w-sm font-medium italic">This class is waiting for its first learners. Check back once registrations open.</p>
                </div>
            )}

            {/* CV Modal */}
            {selectedCV && (
                <CVViewerModal
                    isOpen={!!selectedCV}
                    url={selectedCV.url}
                    name={selectedCV.name}
                    onClose={() => setSelectedCV(null)}
                />
            )}

            <style jsx>{`
                .pulse {
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                    animation: pulse-ring 2s infinite cubic-bezier(0.66, 0, 0, 1);
                }
                @keyframes pulse-ring {
                    to {
                        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
                    }
                }
            `}</style>
        </>
    );
}
