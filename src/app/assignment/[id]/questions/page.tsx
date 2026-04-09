import { getAssignmentById } from "@/controllers/assignmentController";
import { requirePermission } from "@/lib/rbac";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import QuestionPreviewClient from "./QuestionPreviewClient";
import { mapAssignmentToTestRunner } from "@/utils/test_mapper";
import Image from "next/image";
import TitleCard from "@/components/ui/card/title_card";

export default async function AssignmentQuestionsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const assignmentId = parseInt(id);
    if (isNaN(assignmentId)) return notFound();

    await requirePermission('Assignment', 'START_ASSIGNMENT_INSTRUCTOR');

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) return notFound();

    const { objectiveQuestions, essayQuestions, projectQuestions } = mapAssignmentToTestRunner(assignment);

    const classTitle = (assignment as any).class?.title || "Unknown Class";
    const courseTitle = (assignment as any).course?.title;

    const breadcrumbs = [
        { label: "Home", href: "/admin" },
        { label: "Assignments", href: "/assignment" },
        { label: assignment.title || "Assignment", href: `/assignment/${id}` },
        { label: "Questions", href: "#" },
    ];

    const formatDate = (date: Date | null) => {
        if (!date) return "-";
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return (
        <main className="min-h-screen bg-[#F9F9F0] pb-20">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <Breadcrumb items={breadcrumbs} />

                {/* Header Card */}
                <div className="mt-8">
                    <TitleCard
                        title={assignment.title || "Assignment"}
                        description={classTitle}
                    />
                </div>

                {/* Schedule Info */}
                <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4">
                    <div className="grid grid-cols-[120px_1fr] items-center text-sm">
                        <span className="font-semibold text-gray-900">Start Date:</span>
                        <span className="text-gray-700">{formatDate(assignment.startDate)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center text-sm">
                        <span className="font-semibold text-gray-900">End Date:</span>
                        <span className="text-gray-700">{formatDate(assignment.endDate)}</span>
                    </div>
                

                    {/* Questions Section */}
                    <div className="mt-12 space-y-16">
                        {/* Objective Questions */}
                        {objectiveQuestions.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">Objective Questions</h2>
                                <div className="space-y-4">
                                    {objectiveQuestions.map((q, idx) => (
                                        <div key={q.id} className="bg-[#FFFDF3] border border-[#F2F2D9] rounded-2xl p-8 shadow-sm relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-sm font-semibold text-gray-900">Question {idx + 1}</span>
                                                <span className="text-xs font-medium text-gray-500">{q.points} points</span>
                                            </div>
                                            <p className="text-sm text-gray-800 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: q.question }} />
                                            <div className="space-y-3">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Answer</p>
                                                {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex items-center gap-3 text-sm text-gray-700">
                                                        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                                                            <div className="w-2 h-2 rounded-full bg-transparent" />
                                                        </div>
                                                        <span dangerouslySetInnerHTML={{ __html: opt }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Essay Questions */}
                        {essayQuestions.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">Essay Questions</h2>
                                <div className="space-y-4">
                                    {essayQuestions.map((q, idx) => (
                                        <div key={q.id} className="bg-[#FFFDF3] border border-[#F2F2D9] rounded-2xl p-8 shadow-sm relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-sm font-semibold text-gray-900">Question {idx + 1}</span>
                                                <span className="text-xs font-medium text-gray-500">{q.points} points</span>
                                            </div>
                                            <p className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.question }} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Project Questions */}
                        {projectQuestions.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">Project Questions</h2>
                                <div className="space-y-4">
                                    {projectQuestions.map((q, idx) => (
                                        <div key={q.id} className="bg-[#FFFDF3] border border-[#F2F2D9] rounded-2xl p-8 shadow-sm relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-sm font-semibold text-gray-900">Question {idx + 1}</span>
                                                <span className="text-xs font-medium text-gray-500">{q.points} points</span>
                                            </div>
                                            <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: q.question }} />
                                            
                                            {q.requirements.length > 0 && (
                                                <div className="mt-6 space-y-2">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Requirements</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                        {q.requirements.map((req, rIdx) => (
                                                            <li key={rIdx}>{req}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {q.attachments.length > 0 && (
                                                <div className="mt-6 space-y-2">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attachments</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {q.attachments.map((at, aIdx) => (
                                                            <a 
                                                                key={aIdx} 
                                                                href={at} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded-full border border-blue-100"
                                                            >
                                                                Attachment {aIdx + 1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
                {/* Actions */}
                <QuestionPreviewClient 
                    assignmentId={assignment.id} 
                    resultsUrl={`/assignment/${assignment.id}/results`} 
                    startDate={assignment.startDate}
                />
            </div>
        </main>
    );
}
