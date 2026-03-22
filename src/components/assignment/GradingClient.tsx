"use client"

import { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { FileText, Download, Pencil } from "lucide-react";
import { toast } from "sonner";

interface GradingData {
    id: number;
    objective: any[];
    essay: any[];
    project: any[];
    totalScore: number;
}

interface GradingClientProps {
    assignmentId: number;
    enrollmentId: number | string;
    learnerName: string;
    groupMembers?: { id: number, name: string }[];
    initialData: GradingData;
    title?: string;
    subtitle?: string;
    breadcrumbItems: { label: string; href: string }[];
    backUrl: string;
    submitAction: (resultId: number, scores: Record<number, number>) => Promise<{ success: boolean; error?: string }>;
}

export default function GradingClient({
    assignmentId,
    enrollmentId,
    learnerName,
    groupMembers = [],
    initialData,
    title = "Grading",
    subtitle = "Assignment Grading",
    breadcrumbItems,
    backUrl,
    submitAction
}: GradingClientProps) {
    const router = useRouter();
    const [scores, setScores] = useState<Record<number, number>>(() => {
        const initialScores: Record<number, number> = {};
        [...initialData.essay, ...initialData.project].forEach(item => {
            if (item.score !== null && item.score !== undefined && item.resultItemId) {
                initialScores[item.resultItemId] = item.score;
            }
        });
        return initialScores;
    });

    const isEmptyAnswer = (val: string | undefined | null) => {
        if (!val) return true;
        const stripped = val.replace(/<[^>]*>/g, '').trim();
        return stripped === '';
    };
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleScoreChange = (resultItemId: number, value: string, maxScore: number) => {
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
        const essayCurrent = initialData.essay.reduce((acc, item) => acc + (scores[item.resultItemId] || 0), 0);
        const projectCurrent = initialData.project.reduce((acc, item) => acc + (scores[item.resultItemId] || 0), 0);

        return objectiveTotal + essayCurrent + projectCurrent;
    };

    const maxTestScore = [...initialData.objective, ...initialData.essay, ...initialData.project]
        .reduce((acc, item) => acc + (item.maxScore || 0), 0);

    const onSubmit = async () => {
        const allScorableItems = [...initialData.essay, ...initialData.project];
        const hasErrors = allScorableItems.some(item =>
            getValidationError(scores[item.resultItemId], item.maxScore) !== null
        );

        if (hasErrors) {
            toast.error("Please correct all validation errors before submitting.");
            return;
        }

        setIsSubmitting(true);
        const res = await submitAction(initialData.id, scores);
        setIsSubmitting(false);

        if (res.success) {
            toast.success("Grading submitted successfully!");
            router.push(backUrl);
        } else {
            toast.error(res.error || "Failed to submit grading");
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7]  text-gray-800 pb-20">
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10">
                    <h1 className="text-2xl font-medium text-white">{title}</h1>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-10">
                        <h2 className="text-xl font-medium text-black mb-4">{learnerName}</h2>
                        {groupMembers.length > 0 && (
                            <ol className="space-y-2 ml-1">
                                {groupMembers.map((m, idx) => (
                                    <li key={m.id} className="text-sm text-gray-700 flex items-center gap-3">
                                        <span className="text-gray-400 font-medium w-4">{idx + 1}.</span>
                                        <span>{m.name}</span>
                                    </li>
                                ))}
                            </ol>
                        )}
                        <div className="h-px bg-gray-100 w-full mt-10" />
                    </div>

                    {/* Objective Section */}
                    {initialData.objective.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-lg font-medium text-black mb-6">Objective Results</h3>
                            <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 w-16">No</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 w-1/3">Question</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500">Given Answer</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialData.objective.map((item, idx) => (
                                            <tr key={item.resultItemId} className="border-b border-gray-100 last:border-0 h-full">
                                                <td className="px-6 py-5 text-sm text-gray-600 font-medium">{idx + 1}</td>
                                                <td className="px-6 py-5 text-sm text-black border-l border-r border-gray-100" dangerouslySetInnerHTML={{ __html: item.question }} />
                                                <td className="px-6 py-5 text-sm text-gray-700">
                                                    <div dangerouslySetInnerHTML={{ __html: isEmptyAnswer(item.givenAnswer) ? "-" : item.givenAnswer }} />
                                                    <div className="text-[10px] text-green-600 font-medium mt-1 uppercase tracking-tighter">Correct: <span dangerouslySetInnerHTML={{ __html: item.correctAnswer }} /></div>
                                                </td>
                                                <td className="px-6 py-5 text-right text-sm font-medium text-black border-l border-gray-100">
                                                    {item.score || 0}/{item.maxScore}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Essay Section */}
                    {initialData.essay.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-lg font-medium text-black mb-6">Essay Evaluation</h3>
                            <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 w-16">No</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 w-1/3">Question</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500">Student Response</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right w-40">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialData.essay.map((item, idx) => (
                                            <tr key={item.resultItemId} className="border-b border-gray-100 last:border-0 h-full">
                                                <td className="px-6 py-5 text-sm text-gray-600 font-medium align-top">{idx + 1}</td>
                                                <td className="px-6 py-5 text-sm text-black align-top border-l border-r border-gray-100" dangerouslySetInnerHTML={{ __html: item.question }} />
                                                <td className="px-6 py-5 text-sm text-gray-600 italic leading-relaxed whitespace-pre-wrap">
                                                    <div dangerouslySetInnerHTML={{ __html: isEmptyAnswer(item.givenAnswer) ? "-" : item.givenAnswer }} />
                                                </td>
                                                <td className="px-6 py-5 text-right align-top border-l border-gray-100">
                                                    <div className="flex items-center justify-end gap-3 group">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-1 border-b border-gray-300 focus-within:border-[#00524D] transition-all pb-1">
                                                                <input
                                                                    type="number"
                                                                    value={scores[item.resultItemId] ?? ""}
                                                                    placeholder="__"
                                                                    onChange={(e) => handleScoreChange(item.resultItemId, e.target.value, item.maxScore)}
                                                                    className={`w-12 text-right text-base outline-none font-medium bg-transparent transition-colors ${getValidationError(scores[item.resultItemId], item.maxScore)
                                                                        ? "text-red-600"
                                                                        : "text-black"
                                                                        }`}
                                                                />
                                                                <span className="text-gray-400 text-sm font-medium">/{item.maxScore}</span>
                                                            </div>
                                                        </div>
                                                        <Pencil size={16} className={getValidationError(scores[item.resultItemId], item.maxScore) ? "text-red-400" : "text-gray-300 group-hover:text-gray-500 transition-colors"} />
                                                    </div>
                                                    {getValidationError(scores[item.resultItemId], item.maxScore) && (
                                                        <p className="text-[10px] text-red-500 mt-2 font-medium italic">
                                                            {getValidationError(scores[item.resultItemId], item.maxScore)}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Project Result Section (Mockup Design) */}
                    {initialData.project.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-lg font-medium text-black mb-6">Project Result</h3>
                            <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 w-16">No</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 w-2/3">Question</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500">File Submission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialData.project.map((item, idx) => (
                                            <tr key={item.resultItemId} className="border-b border-gray-100 last:border-0 border-r border-l border-gray-100 h-full">
                                                <td className="px-6 py-8 text-sm text-gray-600 font-medium align-top leading-relaxed">{idx + 1}</td>
                                                <td className="px-6 py-8 text-sm text-black align-top leading-relaxed border-l border-gray-100 border-r border-gray-100">
                                                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: item.question }} />
                                                    {!isEmptyAnswer(item.givenAnswer) && (
                                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl text-gray-600 italic border border-gray-100">
                                                            <div dangerouslySetInnerHTML={{ __html: item.givenAnswer }} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-8 text-sm align-top leading-relaxed">
                                                    <div className="space-y-3">
                                                        {(Array.isArray(item.answerFiles) ? item.answerFiles : []).map((file: any, fIdx: number) => (
                                                            <div key={fIdx} className="flex items-center gap-3 text-gray-700 font-medium hover:text-black transition-colors group cursor-pointer" onClick={() => window.open(file, '_blank')}>
                                                                <FileText size={18} className="text-gray-400 group-hover:text-[#00524D]" />
                                                                <span className="text-sm truncate max-w-[200px]">{typeof file === 'string' ? file.split('/').pop() : 'File'}</span>
                                                                <Download size={14} className="ml-auto text-gray-300 group-hover:text-gray-500" />
                                                            </div>
                                                        ))}
                                                        {(!item.answerFiles || (Array.isArray(item.answerFiles) && item.answerFiles.length === 0)) && <span className="text-gray-400 italic">No files submitted.</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Project Score Section (Mockup Design) */}
                    {initialData.project.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-lg font-medium text-black mb-6">Project Score</h3>
                            <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 w-16">No</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500">Parameter</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right w-40">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialData.project.map((item, idx) => (
                                            <tr key={item.resultItemId} className="border-b border-gray-100 last:border-0 h-full">
                                                <td className="px-6 py-5 text-sm text-gray-600 font-medium align-top leading-relaxed">{idx + 1}</td>
                                                <td className="px-6 py-5 text-sm text-black align-top leading-relaxed border-l border-gray-100 border-r border-gray-100">
                                                    <div className="font-medium text-gray-800" dangerouslySetInnerHTML={{ __html: item.question.replace(/<[^>]*>/g, '').split(':')[0] || "Parameter " + (idx + 1) }} />
                                                </td>
                                                <td className="px-6 py-5 text-right align-top">
                                                    <div className="flex items-center justify-end gap-3 group">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-1 border-b border-gray-300 focus-within:border-[#00524D] transition-all pb-1">
                                                                <input
                                                                    type="number"
                                                                    value={scores[item.resultItemId] ?? ""}
                                                                    placeholder="__"
                                                                    onChange={(e) => handleScoreChange(item.resultItemId, e.target.value, item.maxScore)}
                                                                    className={`w-12 text-right text-base outline-none font-medium bg-transparent transition-colors ${getValidationError(scores[item.resultItemId], item.maxScore)
                                                                        ? "text-red-600"
                                                                        : "text-black"
                                                                        }`}
                                                                />
                                                                <span className="text-gray-400 text-sm font-medium">/{item.maxScore}</span>
                                                            </div>
                                                        </div>
                                                        <Pencil
                                                            size={16}
                                                            className={getValidationError(scores[item.resultItemId], item.maxScore) ? "text-red-400" : "text-gray-300 group-hover:text-gray-500 transition-colors"}
                                                        />
                                                    </div>
                                                    {getValidationError(scores[item.resultItemId], item.maxScore) && (
                                                        <p className="text-[10px] text-red-500 mt-2 font-medium italic">
                                                            {getValidationError(scores[item.resultItemId], item.maxScore)}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}


                    {/* Final Footer */}
                    <div className="mt-8 flex flex-col items-end pt-8">
                        <div className="flex items-center gap-12 mb-6 pr-6">
                            <span className="text-sm font-medium text-black uppercase tracking-wider">Total Score</span>
                            <span className="text-sm font-medium text-gray-800">{calculateCurrentTotal().toFixed(1)} / {maxTestScore}</span>
                        </div>
                        <div className="flex items-center gap-8 pr-6 mt-4">
                            <button
                                onClick={() => router.push(backUrl)}
                                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSubmit}
                                disabled={isSubmitting}
                                className={`px-10 py-3 rounded-xl text-sm font-medium transition-all shadow-md ${isSubmitting
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[#D6E63A] text-black hover:bg-[#C5D42E] active:scale-95"
                                    }`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
