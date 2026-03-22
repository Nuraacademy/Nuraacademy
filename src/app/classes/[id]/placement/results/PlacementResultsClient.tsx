"use client"

import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface Result {
    enrollmentId: number;
    name: string;
    status: string; // Not Started, To Grade, Graded
    totalScore: number;
    maxScore: number;
    objectiveScore: number;
    submittedAt?: Date | null;
}

export default function PlacementResultsClient({
    classId,
    classTitle,
    results
}: {
    classId: number;
    classTitle: string;
    results: Result[];
}) {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-16">
            {/* Background Images */}
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: classTitle, href: `/classes/${classId}/overview` },
                            { label: "Results", href: "#" },
                        ]}
                    />
                </div>

                {/* Banner */}
                <div className="bg-[#00524D] rounded-2xl p-6 mb-10">
                    <h1 className="text-2xl font-medium text-white">Placement Test Results</h1>
                    <p className="text-white/80 text-sm mt-1">Review and grade placement tests for all enrolled learners.</p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-medium text-black">Learner Submissions</h2>
                        <NuraButton
                            label="View Pass List"
                            variant="secondary"
                            onClick={() => router.push(`/classes/${classId}/placement/learner-group`)}
                        />
                    </div>

                    {/* Table */}
                    <div className="w-full border border-black rounded-[1.5rem] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="px-8 py-4 text-sm font-semibold text-black bg-white">Learner Name</th>
                                    <th className="px-8 py-4 text-sm font-semibold text-black bg-white">Submission Date</th>
                                    <th className="px-8 py-4 text-sm font-semibold text-black bg-white text-center">Status</th>
                                    <th className="px-8 py-4 text-sm font-semibold text-black bg-white text-center">Score / Max</th>
                                    <th className="px-8 py-4 text-sm font-semibold text-black bg-white text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((res, idx) => (
                                    <tr
                                        key={res.enrollmentId}
                                        className={`${idx !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <td className="px-8 py-6 text-sm text-black font-medium">{res.name}</td>
                                        <td className="px-8 py-6 text-sm text-gray-600">
                                            {res.submittedAt ? new Date(res.submittedAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase ${res.status === "Graded" ? "bg-green-100 text-green-700" :
                                                res.status === "To Grade" ? "bg-amber-100 text-amber-700" :
                                                    "bg-gray-100 text-gray-500"
                                                }`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-black">{res.totalScore.toFixed(1)} / {res.maxScore}</span>
                                                <span className="text-[10px] text-gray-400">Obj: {res.objectiveScore.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                disabled={res.status === "Not Started"}
                                                onClick={() => router.push(`/classes/${classId}/placement/results/${res.enrollmentId}/grade`)}
                                                className={`inline-flex items-center gap-1 text-sm font-medium ${res.status === "Not Started" ? "text-gray-300 cursor-not-allowed" : "text-[#00524D] hover:underline"
                                                    }`}
                                            >
                                                {res.status === "Graded" ? "Review" : "Grade"}
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-10 text-center text-gray-400 italic">No learners enrolled yet.</td>
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
