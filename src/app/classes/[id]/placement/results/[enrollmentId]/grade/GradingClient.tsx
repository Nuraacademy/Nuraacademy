"use client"

import { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { FileText, Download, Pencil } from "lucide-react";
import { submitGradingAction } from "@/app/actions/placement";
import { toast } from "sonner";

interface GradingData {
    id: number;
    objective: any[];
    essay: any[];
    project: any[];
    totalScore: number;
}

export default function GradingClient({
    classId,
    enrollmentId,
    learnerName,
    initialData
}: {
    classId: number;
    enrollmentId: number;
    learnerName: string;
    initialData: GradingData;
}) {
    const router = useRouter();
    const [scores, setScores] = useState<Record<number, number>>(() => {
        const initialScores: Record<number, number> = {};
        [...initialData.essay, ...initialData.project].forEach(item => {
            if (item.score !== null) initialScores[item.resultItemId] = item.score;
        });
        return initialScores;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleScoreChange = (resultItemId: number, value: string, maxScore: number) => {
        // Validation happens reactively based on the scores state
        if (value === "") {
            setScores(prev => {
                const next = { ...prev };
                delete next[resultItemId];
                return next;
            });
            return;
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        // Allow values for validation feedback (handled in UI via getValidationError)
        setScores(prev => ({ ...prev, [resultItemId]: numValue }));
    };

    const getValidationError = (score: number | undefined, maxScore: number) => {
        if (score === undefined || score === null) return "Score is required";
        if (score < 0) return "Cannot be negative";
        if (score > maxScore) return `Max is ${maxScore}`;
        return null;
    };

    const calculateCurrentTotal = () => {
        const objectiveTotal = initialData.objective.reduce((acc, item) => acc + (item.score || 0), 0);
        const essayTotal = Object.values(scores).reduce((acc, val) => acc + (val || 0), 0);
        // This is a bit simplified, we should only sum scores of current section types in a real app, 
        // but here it works because scores keys are unique resultItemIds.

        // Let's do it properly
        const essayCurrent = initialData.essay.reduce((acc, item) => acc + (scores[item.resultItemId] || 0), 0);
        const projectCurrent = initialData.project.reduce((acc, item) => acc + (scores[item.resultItemId] || 0), 0);

        return objectiveTotal + essayCurrent + projectCurrent;
    };

    const maxTestScore = [...initialData.objective, ...initialData.essay, ...initialData.project]
        .reduce((acc, item) => acc + (item.maxScore || 0), 0);

    const onSubmit = async () => {
        // Validation before submission
        const allScorableItems = [...initialData.essay, ...initialData.project];
        const hasErrors = allScorableItems.some(item =>
            getValidationError(scores[item.resultItemId], item.maxScore) !== null
        );

        if (hasErrors) {
            toast.error("Please correct all validation errors before submitting.");
            return;
        }

        setIsSubmitting(true);
        const res = await submitGradingAction(classId, initialData.id, scores);
        setIsSubmitting(false);

        if (res.success) {
            toast.success("Grading submitted successfully!");
            router.push(`/classes/${classId}/placement/results`);
        } else {
            toast.error(res.error || "Failed to submit grading");
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20">
            {/* Background Images */}
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Placement Test", href: `/classes/${classId}/test` },
                            { label: "Results", href: `/classes/${classId}/placement/results` },
                            { label: learnerName, href: "#" },
                        ]}
                    />
                </div>

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10">
                    <h1 className="text-2xl font-medium text-white">Placement Test</h1>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-10">
                        <h2 className="text-xl font-medium text-black">{learnerName}</h2>
                        <p className="text-gray-500 text-sm">Foundation to Data Analytics</p>
                    </div>

                    {/* Objective Section */}
                    <div className="mb-12">
                        <h3 className="text-lg font-medium text-black mb-6">Soal Objektif</h3>
                        <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 w-16">No</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500">Question</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500">Given Answer</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500">Correct Answer</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {initialData.objective.map((item, idx) => (
                                        <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                            <td className="px-6 py-5 text-sm text-gray-600 font-medium">{idx + 1}</td>
                                            <td className="px-6 py-5 text-sm text-black">{item.question}</td>
                                            <td className="px-6 py-5 text-sm text-gray-700">{item.givenAnswer || "-"}</td>
                                            <td className="px-6 py-5 text-sm text-green-700 font-medium">{item.correctAnswer}</td>
                                            <td className="px-6 py-5 text-right text-sm font-medium text-black">
                                                {item.score || 0}/{item.maxScore}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td colSpan={4} className="px-6 py-4 text-sm font-medium text-black text-right uppercase tracking-wider">Total Score</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-black">
                                            {initialData.objective.reduce((acc, i) => acc + (i.score || 0), 0)}/{initialData.objective.reduce((acc, i) => acc + (i.maxScore || 0), 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Essay Section */}
                    <div className="mb-12">
                        <h3 className="text-lg font-medium text-black mb-6">Soal Essay</h3>
                        <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 w-16">No</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 w-1/4">Question</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500">Given Answer</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right w-32">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {initialData.essay.map((item, idx) => (
                                        <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                            <td className="px-6 py-5 text-sm text-gray-600 font-medium align-top">{idx + 1}</td>
                                            <td className="px-6 py-5 text-sm text-black align-top" dangerouslySetInnerHTML={{ __html: item.question }} />
                                            <td className="px-6 py-5 text-sm text-gray-600 italic leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.givenAnswer || "-" }} />
                                            <td className="px-6 py-5 text-right align-top">
                                                <div className="flex items-center justify-end gap-2">
                                                    <input
                                                        type="number"
                                                        value={scores[item.resultItemId] ?? ""}
                                                        placeholder="Score"
                                                        onChange={(e) => handleScoreChange(item.resultItemId, e.target.value, item.maxScore)}
                                                        className={`w-16 border-b text-right text-sm focus:border-[#00524D] outline-none font-medium transition-colors ${getValidationError(scores[item.resultItemId], item.maxScore)
                                                            ? "border-red-500 text-red-600"
                                                            : "border-gray-300 text-black"
                                                            }`}
                                                    />
                                                    <span className="text-gray-400 text-sm font-medium">/{item.maxScore}</span>
                                                    <Pencil
                                                        size={14}
                                                        className={getValidationError(scores[item.resultItemId], item.maxScore) ? "text-red-400" : "text-gray-300"}
                                                    />
                                                </div>
                                                {getValidationError(scores[item.resultItemId], item.maxScore) && (
                                                    <p className="text-[10px] text-red-500 mt-1 font-medium italic">
                                                        {getValidationError(scores[item.resultItemId], item.maxScore)}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-black text-right uppercase tracking-wider">Total Score</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-black">
                                            {initialData.essay.reduce((acc, i) => acc + (scores[i.resultItemId] || 0), 0)}/{initialData.essay.reduce((acc, i) => acc + (i.maxScore || 0), 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Project Section */}
                    <div className="mb-12">
                        <h3 className="text-lg font-medium text-black mb-6">Soal Project</h3>
                        <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 w-16">No</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 w-1/4">Question</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500">File Submission</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right w-32">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {initialData.project.map((item, idx) => (
                                        <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                            <td className="px-6 py-5 text-sm text-gray-600 font-medium align-top">{idx + 1}</td>
                                            <td className="px-6 py-5 text-sm text-black align-top" dangerouslySetInnerHTML={{ __html: item.question }} />
                                            <td className="px-6 py-5 text-sm align-top">
                                                <div className="space-y-2">
                                                    {(item.answerFiles as string[] || []).map((file, fIdx) => (
                                                        <div key={fIdx} className="flex items-center gap-2 text-[#00524D] font-medium hover:underline cursor-pointer">
                                                            <FileText size={16} />
                                                            <span>{file.split('/').pop()}</span>
                                                            <Download size={14} className="ml-auto text-gray-400" />
                                                        </div>
                                                    ))}
                                                    {(!item.answerFiles || item.answerFiles.length === 0) && <span className="text-gray-400 italic">No files submitted.</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right align-top">
                                                <div className="flex items-center justify-end gap-2">
                                                    <input
                                                        type="number"
                                                        value={scores[item.resultItemId] ?? ""}
                                                        placeholder="Score"
                                                        onChange={(e) => handleScoreChange(item.resultItemId, e.target.value, item.maxScore)}
                                                        className="w-16 border-b border-gray-300 text-right text-sm focus:border-[#00524D] outline-none font-medium"
                                                    />
                                                    <span className="text-gray-400 text-sm font-medium">/{item.maxScore}</span>
                                                    <Pencil size={14} className="text-gray-300" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-black text-right uppercase tracking-wider">Total Score</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-black">
                                            {initialData.project.reduce((acc, i) => acc + (scores[i.resultItemId] || 0), 0)}/{initialData.project.reduce((acc, i) => acc + (i.maxScore || 0), 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Footer */}
                    <div className="mt-16 flex flex-col items-end border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-8 mb-10">
                            <span className="text-lg font-medium text-black uppercase tracking-wider">Final Score</span>
                            <span className="text-2xl font-black text-black">{calculateCurrentTotal().toFixed(1)} / {maxTestScore}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="px-8 py-3 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                            >
                                Cancel
                            </button>
                            <NuraButton
                                label={isSubmitting ? "Submitting..." : "Submit"}
                                onClick={onSubmit}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
