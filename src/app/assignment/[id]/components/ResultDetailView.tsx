"use client"

import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { useRouter } from "next/navigation";
import { FileText, Download, CheckCircle2, XCircle } from "lucide-react";
import TitleCard from "@/components/ui/card/title_card";
import { NuraButton } from "@/components/ui/button/button";
import Image from "next/image";

interface GradingData {
    id: number;
    objective: any[];
    essay: any[];
    project: any[];
    totalScore: number;
}

interface ResultDetailViewProps {
    assignmentId: number;
    enrollmentId: number | string;
    learnerName: string;
    groupMembers?: { id: number, name: string }[];
    initialData: GradingData;
    title?: string;
    subtitle?: string;
    breadcrumbItems: { label: string; href: string }[];
    backUrl: string;
}

export default function ResultDetailView({
    assignmentId,
    enrollmentId,
    learnerName,
    groupMembers = [],
    initialData,
    title = "Result Details",
    subtitle = "Per-Question Breakdown",
    breadcrumbItems,
    backUrl
}: ResultDetailViewProps) {
    const router = useRouter();

    const isEmptyAnswer = (val: string | undefined | null) => {
        if (!val) return true;
        const stripped = val.replace(/<[^>]*>/g, '').trim();
        return stripped === '';
    };

    const calculateTotalScore = () => {
        const objectiveTotal = initialData.objective.reduce((acc, item) => acc + (item.score || 0), 0);
        const essayTotal = initialData.essay.reduce((acc, item) => acc + (item.score || 0), 0);
        const projectTotal = initialData.project.reduce((acc, item) => acc + (item.score || 0), 0);
        return objectiveTotal + essayTotal + projectTotal;
    };

    const maxTestScore = [...initialData.objective, ...initialData.essay, ...initialData.project]
        .reduce((acc, item) => acc + (item.maxScore || 0), 0);

    return (
        <main className="min-h-screen bg-[#FDFDF7] text-gray-800 pb-20 relative overflow-hidden">
            {/* Background elements */}
            <img 
                src="/background/OvalBGLeft.svg" 
                alt="" 
                className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none opacity-40" 
            />
            <img 
                src="/background/OvalBGRight.svg" 
                alt="" 
                className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none opacity-40" 
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <TitleCard
                    title={title}
                    description={subtitle}
                />

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 mt-8">
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-medium text-black mb-1">{learnerName}</h2>
                                {groupMembers.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {groupMembers.map((m, idx) => (
                                            <span key={m.id} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bg-[#DAEE49]/10 border border-[#DAEE49]/30 rounded-2xl px-6 py-4 flex items-center gap-4">
                                <span className="text-sm font-medium text-[#1C3A37]">Total Score</span>
                                <span className="text-2xl font-bold text-[#1C3A37]">{calculateTotalScore().toFixed(1)} <span className="text-sm font-medium text-gray-400">/ {maxTestScore}</span></span>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />
                    </div>

                    {/* Objective Section */}
                    {initialData.objective.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-md font-medium text-black mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#DAEE49]"></span>
                                Objective Questions
                            </h3>
                            <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/50">
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 w-16">No</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 w-1/3">Question</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500">Your Answer</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500">Correct Answer</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialData.objective.map((item, idx) => {
                                            const isCorrect = item.score > 0;
                                            return (
                                                <tr key={item.resultItemId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                                                    <td className="px-6 py-5 text-xs text-gray-500">{idx + 1}</td>
                                                    <td className="px-6 py-5 text-xs text-black font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: item.question }} />
                                                    <td className="px-6 py-5 text-xs border-l border-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            {isCorrect ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <XCircle size={14} className="text-red-400 shrink-0" />}
                                                            <div dangerouslySetInnerHTML={{ __html: isEmptyAnswer(item.givenAnswer) ? "-" : item.givenAnswer }} />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-xs text-emerald-600 font-medium border-l border-gray-50">
                                                        <div dangerouslySetInnerHTML={{ __html: isEmptyAnswer(item.correctAnswer) ? "-" : item.correctAnswer }} />
                                                    </td>
                                                    <td className="px-6 py-5 text-right text-xs font-bold text-[#1C3A37] border-l border-gray-50 bg-gray-50/50">
                                                        {item.score || 0} / {item.maxScore}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Essay Section */}
                    {initialData.essay.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-md font-medium text-black mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#1C3A37]"></span>
                                Essay Questions
                            </h3>
                            <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/50">
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 w-16">No</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 w-1/4">Question</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500">Your Response</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500">Files</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 text-right w-32">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialData.essay.map((item, idx) => (
                                            <tr key={item.resultItemId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                                                <td className="px-6 py-5 text-xs text-gray-500 align-top">{idx + 1}</td>
                                                <td className="px-6 py-5 text-xs text-black font-medium align-top leading-relaxed border-l border-gray-50" dangerouslySetInnerHTML={{ __html: item.question }} />
                                                <td className="px-6 py-5 text-xs text-gray-700 align-top leading-relaxed border-l border-gray-50">
                                                    <div dangerouslySetInnerHTML={{ __html: isEmptyAnswer(item.givenAnswer) ? "-" : item.givenAnswer }} className="max-h-32 overflow-y-auto" />
                                                </td>
                                                <td className="px-6 py-5 text-xs align-top border-l border-gray-50">
                                                    <div className="space-y-2">
                                                        {(Array.isArray(item.answerFiles) ? item.answerFiles : []).map((file: string, fIdx: number) => (
                                                            <div key={fIdx} className="flex items-center gap-2 text-[#075546] hover:text-[#005954] transition-colors group cursor-pointer" onClick={() => window.open(file, '_blank')}>
                                                                <FileText size={14} className="text-emerald-500 shrink-0" />
                                                                <span className="text-[10px] truncate max-w-[100px] font-medium">{file.split('/').pop()}</span>
                                                                <Download size={12} className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100" />
                                                            </div>
                                                        ))}
                                                        {(!item.answerFiles || item.answerFiles.length === 0) && <span className="text-gray-400 italic text-[10px]">No files</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right align-top border-l border-gray-50 bg-gray-50/50">
                                                    <span className="text-xs font-bold text-[#1C3A37]">{item.score ?? "-"} / {item.maxScore}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Project Section */}
                    {initialData.project.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-md font-medium text-black mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#8BB730]"></span>
                                Project Tasks
                            </h3>
                            <div className="w-full border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/50">
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 w-16">No</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 w-1/4">Task</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 w-1/4">Your Answer</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500">Submitted Files</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 text-right w-32">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialData.project.map((item, idx) => (
                                            <tr key={item.resultItemId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                                                <td className="px-6 py-5 text-xs text-gray-500 align-top">{idx + 1}</td>
                                                <td className="px-6 py-5 text-xs text-black font-medium align-top leading-relaxed border-l border-gray-50" dangerouslySetInnerHTML={{ __html: item.question }} />
                                                <td className="px-6 py-5 text-xs text-gray-700 align-top leading-relaxed border-l border-gray-50">
                                                    <div dangerouslySetInnerHTML={{ __html: isEmptyAnswer(item.givenAnswer) ? "-" : item.givenAnswer }} className="max-h-32 overflow-y-auto" />
                                                </td>
                                                <td className="px-6 py-5 text-xs align-top border-l border-gray-50">
                                                    <div className="space-y-2">
                                                        {(Array.isArray(item.answerFiles) ? item.answerFiles : []).map((file: string, fIdx: number) => (
                                                            <div key={fIdx} className="flex items-center gap-2 text-[#075546] hover:text-[#005954] transition-colors group cursor-pointer" onClick={() => window.open(file, '_blank')}>
                                                                <FileText size={14} className="text-emerald-500 shrink-0" />
                                                                <span className="text-[10px] truncate max-w-[100px] font-medium">{file.split('/').pop()}</span>
                                                                <Download size={12} className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100" />
                                                            </div>
                                                        ))}
                                                        {(!item.answerFiles || item.answerFiles.length === 0) && <span className="text-gray-400 italic text-[10px]">No files</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right align-top border-l border-gray-50 bg-gray-50/50">
                                                    <span className="text-xs font-bold text-[#1C3A37]">{item.score ?? "-"} / {item.maxScore}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex justify-center">
                        <NuraButton
                            label="Back to Overview"
                            variant="secondary"
                            className="min-w-[200px]"
                            onClick={() => router.push(backUrl)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
