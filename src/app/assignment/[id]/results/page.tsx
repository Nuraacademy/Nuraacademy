import React from "react";
import { getAssignmentResultsByAssignmentId, getAssignmentById } from "@/controllers/assignmentController";
import { requirePermission } from "@/lib/rbac";
import Image from 'next/image';
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import TitleCard from "@/components/ui/card/title_card";

export default async function AssignmentResultsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const assignmentId = parseInt(id);

    await requirePermission('Assignment', 'GRADE_ASSIGNMENT');

    const [assignment, results] = await Promise.all([
        getAssignmentById(assignmentId),
        getAssignmentResultsByAssignmentId(assignmentId)
    ]);

    if (!assignment) return notFound();

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20">
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
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/classes" },
                            { label: "Assignments", href: "/assignment" },
                            { label: assignment.title || "Assignment", href: `/assignment/${id}` },
                            { label: "Results", href: "#" },
                        ]}
                    />
                </div>
                
                <TitleCard
                    title={assignment.title}
                    description={`${assignment.class?.title} | ${assignment.course?.title} ${(assignment as any).session ? `| ${(assignment as any).session.title}` : ""}`}
                />

                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">Start Date:</span>
                            <span className="text-gray-600">{assignment.startDate ? format(new Date(assignment.startDate), "EEEE, dd MMM yyyy, HH:mm") : "-"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">End Date:</span>
                            <span className="text-gray-600">{assignment.endDate ? format(new Date(assignment.endDate), "EEEE, dd MMM yyyy, HH:mm") : "-"}</span>
                        </div>
                    </div>

                    <h2 className="text-lg font-medium mb-6 text-gray-900">Hasil Tugas Learners</h2>

                    <div className="w-full border border-gray-100 rounded-xl overflow-visible bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-sm font-medium text-gray-500 tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-500 tracking-wider text-center">Total Grade</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-500 tracking-wider text-right">Grade</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-500 tracking-wider text-right">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(results as any[]).map((res) => (
                                    <React.Fragment key={res.id || res.enrollmentId}>
                                        <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <Link
                                                        href={`/assignment/${id}/results/${res.isGroup ? encodeURIComponent(res.name) : (res.id || res.enrollmentId)}/grade`}
                                                        className="text-xs text-[#00524D] font-medium hover:underline"
                                                    >
                                                        {res.name}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-xs text-gray-900">
                                                        {res.totalScore || 0} / {res.maxScore || 100}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter ${res.status === "Graded" ? "bg-green-100 text-green-700" :
                                                        res.status === "To Grade" || res.status === "Submitted" ? "bg-amber-100 text-amber-700" :
                                                            "bg-gray-100 text-gray-400"
                                                        }`}>
                                                        {res.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/assignment/${id}/results/${res.isGroup ? encodeURIComponent(res.name) : (res.id || res.enrollmentId)}/grade`}
                                                    className="text-sm font-medium underline text-[#00524D] hover:underline"
                                                >
                                                    Grade
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {!res.isGroup ? (
                                                    <Link
                                                        href={`/feedback/assignment/${id}/learner/${res.enrollmentId}`}
                                                        className="text-sm font-medium underline text-[#00524D] hover:underline"
                                                    >
                                                        Feedback
                                                    </Link>
                                                ) : (
                                                    res.members && (
                                                        <div className="flex justify-end">
                                                            <details className="cursor-pointer group/details relative w-full max-w-[200px]">
                                                                <summary className="text-[10px] text-gray-500 font-medium z-10 hover:text-gray-900 transition-colors list-none flex items-center justify-end gap-1.5 focus:outline-none">
                                                                    <span>Member Feedback</span>
                                                                    <span className="text-[8px] transform transition-transform group-open/details:rotate-180 bg-gray-100 px-1 rounded">▼</span>
                                                                </summary>
                                                                <div className="absolute z-10 right-0 top-full mt-2 w-max min-w-[180px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-3 transform transition-all animate-in fade-in slide-in-from-top-1">
                                                                    <ul className="space-y-2.5">
                                                                        {res.members.map((member: { id: number, name: string }, idx: number) => (
                                                                            <li key={idx} className="flex items-center justify-between gap-6 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                                                                <span className="text-[11px] text-gray-600 font-medium truncate max-w-[100px]">{member.name}</span>
                                                                                <Link
                                                                                    href={`/feedback/assignment/${id}/learner/${member.id}`}
                                                                                    className="text-[9px] text-[#00524D] font-medium bg-[#DAEE49] px-2.5 py-1 rounded-lg hover:bg-[#C9D942] transition-colors uppercase tracking-tight shadow-sm"
                                                                                >
                                                                                    Feedback
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </details>
                                                        </div>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic text-sm">No submissions yet for this assignment.</td>
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
