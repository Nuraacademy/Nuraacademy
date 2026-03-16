import { getAssignmentResultsByAssignmentId, getAssignmentById } from "@/controllers/assignmentController";
import { requirePermission } from "@/lib/rbac";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";

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
        <main className="min-h-screen bg-[#FDFDF7] font-sans text-gray-800 pb-20">
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Assignments", href: "/assignment" },
                            { label: assignment.title || "Assignment", href: `/assignment/${id}` },
                            { label: "Results", href: "#" },
                        ]}
                    />
                </div>

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10">
                    <h1 className="text-2xl font-bold text-white">Results: {assignment.title}</h1>
                    <p className="text-white/80 text-sm mt-1">{assignment.class?.title || assignment.course?.title}</p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500">Learner Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500">Submitted At</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 text-right">Score / Max</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((res) => (
                                    <tr key={res.enrollmentId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5 text-sm text-black font-medium">{res.name}</td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                                res.status === "Graded" ? "bg-green-100 text-green-700" :
                                                res.status === "To Grade" ? "bg-amber-100 text-amber-700" :
                                                "bg-gray-100 text-gray-500"
                                            }`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            {res.submittedAt ? format(new Date(res.submittedAt), "dd MMM yyyy HH:mm") : "-"}
                                        </td>
                                        <td className="px-6 py-5 text-right text-sm font-bold text-black">
                                            {res.totalScore} / {res.maxScore}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {res.status !== "Not Started" ? (
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={`/assignment/${id}/results/${res.enrollmentId}/grade`}
                                                        className="text-[#00524D] font-bold text-sm hover:underline"
                                                    >
                                                        Grade
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        href={`/assignment/${id}/results/${res.enrollmentId}/feedback`}
                                                        className="text-amber-600 font-bold text-sm hover:underline"
                                                    >
                                                        Feedback
                                                    </Link>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-sm font-medium">Grade</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">No learners enrolled in this class.</td>
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
