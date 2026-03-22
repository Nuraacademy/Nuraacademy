import { getAssignmentById } from "@/controllers/assignmentController";
import { getAssignmentLearners } from "@/app/actions/feedback";
import { requirePermission } from "@/lib/rbac";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Sidebar from "@/components/ui/sidebar/sidebar";
import Image from "next/image";

export default async function AssignmentFeedbackLearnerListPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const assignmentId = parseInt(id);

    await requirePermission('Feedback', 'VIEW_SEARCH_ASSIGNMENT_FEEDBACK');

    const [assignment, result] = await Promise.all([
        getAssignmentById(assignmentId),
        getAssignmentLearners(assignmentId)
    ]);

    if (!assignment) return notFound();
    const learners = result.success ? result.data : [];

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20 relative">
            <Sidebar />

            {/* Background Images */}
            <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <Image
                    src="/background/PolygonBGTop.svg"
                    alt=""
                    className="absolute top-0 left-0 w-auto h-[40rem]"
                    width={500}
                    height={500}
                    priority
                />
                <Image
                    src="/background/PolygonBGBot.svg"
                    alt=""
                    className="absolute bottom-0 right-0 w-auto h-[40rem]"
                    width={500}
                    height={500}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 transition-all duration-300 md:pl-80">
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/classes" },
                            { label: "Feedbacks", href: "/feedback" },
                            { label: assignment.title || "Assignment", href: "#" },
                        ]}
                    />
                </div>

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10 shadow-sm">
                    <h1 className="text-2xl font-medium text-white">{assignment.title} Feedback</h1>
                    <p className="text-white/80 text-sm mt-1">{assignment.class?.title || assignment.course?.title}</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-medium mb-6">Learners</h2>
                    <div className="w-full border border-gray-100 rounded-[1.5rem] overflow-hidden bg-white shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500">Name</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500">Submitted At</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {learners.map((res: any) => (
                                    <tr key={res.enrollmentId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5 text-sm text-black font-medium">{res.name}</td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider ${res.status === "Graded" ? "bg-green-100 text-green-700" :
                                                res.status === "To Grade" ? "bg-amber-100 text-amber-700" :
                                                    "bg-gray-100 text-gray-500"
                                                }`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            {res.submittedAt ? format(new Date(res.submittedAt), "dd MMM yyyy HH:mm") : "-"}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/feedback/assignment/${id}/learner/${res.enrollmentId}`}
                                                className="text-[#00524D] font-medium text-sm hover:underline"
                                            >
                                                Review Feedback
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {learners.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No learners found for this assignment.</td>
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
