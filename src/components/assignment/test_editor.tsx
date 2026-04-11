"use client"

import { useRef, useState } from "react";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { NuraButton } from "@/components/ui/button/button";
import { X, Plus, FileText, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import FileUploadModal from "@/components/ui/modal/file_upload_modal";
import { uploadAssignmentFile } from "@/app/actions/assignment";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Answer {
    id: number;
    text: string;
    isCorrect: boolean;
}

export interface ObjectiveQuestion {
    id: number;
    content: string;
    answers: Answer[];
    score: number;
}

export interface EssayQuestion {
    id: number;
    content: string;
    score: number;
}

export interface ProjectQuestion {
    id: number;
    content: string;
    score: number;
    attachments?: string[];
}

/** Persentase bobot per jenis soal; total harus 100. */
export interface SectionWeights {
    objective: number;
    essay: number;
    project: number;
}

export const DEFAULT_SECTION_WEIGHTS: SectionWeights = {
    objective: 34,
    essay: 33,
    project: 33,
};

/** Bagi `weightPercent` secara merata ke `count` butir; jumlah elemen = `weightPercent` (2 desimal). */
export function splitWeightAcrossItems(weightPercent: number, count: number): number[] {
    if (count <= 0) return [];
    const total = Math.max(0, weightPercent);
    const raw = total / count;
    const parts: number[] = [];
    let allocated = 0;
    for (let i = 0; i < count - 1; i++) {
        const v = Math.round(raw * 100) / 100;
        parts.push(v);
        allocated += v;
    }
    parts.push(Math.round((total - allocated) * 100) / 100);
    return parts;
}

/** Estimasi bobot dari data lama (jumlah maxScore per jenis), untuk mode edit. */
export function inferSectionWeightsFromQuestions(
    objective: { score?: number }[],
    essay: { score?: number }[],
    project: { score?: number }[],
): SectionWeights {
    const sumObj = objective.reduce((a, q) => a + (q.score || 0), 0);
    const sumEss = essay.reduce((a, q) => a + (q.score || 0), 0);
    const sumProj = project.reduce((a, q) => a + (q.score || 0), 0);
    const t = sumObj + sumEss + sumProj;
    if (t <= 0) return { ...DEFAULT_SECTION_WEIGHTS };
    let o = Math.round((sumObj / t) * 100);
    let e = Math.round((sumEss / t) * 100);
    let p = 100 - o - e;
    if (p < 0) {
        p = 0;
        e = Math.max(0, 100 - o);
    }
    return { objective: o, essay: e, project: p };
}

/** Siapkan item untuk API dari soal + bobot persentase (maxScore terbagi rata per jenis). */
export function buildAssignmentItemsPayload(
    objective: ObjectiveQuestion[],
    essay: EssayQuestion[],
    project: ProjectQuestion[],
    weights: SectionWeights,
    courseId: number | null,
): any[] {
    const items: any[] = [];
    const objScores = splitWeightAcrossItems(weights.objective, objective.length);
    objective.forEach((q, i) => {
        items.push({
            courseId,
            type: "OBJECTIVE",
            question: q.content,
            maxScore: objScores[i] ?? 0,
            options: q.answers.map((a) => a.text),
            correctAnswer: q.answers.find((a) => a.isCorrect)?.text || "",
        });
    });
    const essScores = splitWeightAcrossItems(weights.essay, essay.length);
    essay.forEach((q, i) => {
        items.push({
            courseId,
            type: "ESSAY",
            question: q.content,
            maxScore: essScores[i] ?? 0,
        });
    });
    const proScores = splitWeightAcrossItems(weights.project, project.length);
    project.forEach((q, i) => {
        items.push({
            courseId,
            type: "PROJECT",
            question: q.content,
            maxScore: proScores[i] ?? 0,
            options: { attachments: q.attachments || [] },
        });
    });
    return items;
}

// ─── ID helpers ───────────────────────────────────────────────────────────────

export function makeAnswer(idRef: React.MutableRefObject<number>): Answer {
    return { id: idRef.current++, text: "", isCorrect: false };
}
export function makeObjectiveQuestion(idRef: React.MutableRefObject<number>): ObjectiveQuestion {
    return {
        id: idRef.current++,
        content: "",
        answers: [makeAnswer(idRef), makeAnswer(idRef), makeAnswer(idRef), makeAnswer(idRef)],
        score: 0,
    };
}
export function makeEssayQuestion(idRef: React.MutableRefObject<number>): EssayQuestion {
    return { id: idRef.current++, content: "", score: 0 };
}
export function makeProjectQuestion(idRef: React.MutableRefObject<number>): ProjectQuestion {
    return { id: idRef.current++, content: "", score: 0 };
}

// ─── Shared Helpers ────────────────────────────────────────────────────────
const isEmpty = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '').trim();
    const hasImage = html.includes('<img');
    return !text && !hasImage;
};

// ─── Objective Block ──────────────────────────────────────────────────────────

export function ObjectiveBlock({
    question, index, onChange, onRemove, idRef,
}: {
    question: ObjectiveQuestion;
    index: number;
    onChange: (updater: (prev: ObjectiveQuestion) => ObjectiveQuestion) => void;
    onRemove: () => void;
    idRef: React.MutableRefObject<number>;
}) {
    const setCorrect = (answerId: number) => {
        onChange((prev) => ({ ...prev, answers: prev.answers.map((a) => ({ ...a, isCorrect: a.id === answerId })) }));
    };
    const updateAnswerText = (answerId: number, text: string) => {
        onChange((prev) => ({ ...prev, answers: prev.answers.map((a) => (a.id === answerId ? { ...a, text } : a)) }));
    };
    const addAnswer = () => {
        if (question.answers.length >= 6) return;
        onChange((prev) => ({ ...prev, answers: [...prev.answers, makeAnswer(idRef)] }));
    };
    const removeAnswer = (answerId: number) => {
        if (question.answers.length <= 2) return;
        onChange((prev) => ({ ...prev, answers: prev.answers.filter((a) => a.id !== answerId) }));
    };

    const hasError =
        isEmpty(question.content) ||
        !question.answers.some((a) => a.isCorrect) ||
        question.answers.some((a) => isEmpty(a.text));

    return (
        <div className={`bg-[#F0F5D8] rounded-2xl p-5 mb-4 border-2 transition-colors ${hasError ? "border-orange-200" : "border-transparent"}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-white">
                    <X size={15} />
                </button>
            </div>

            <RichTextInput value={question.content} onChange={(val) => onChange((prev) => ({ ...prev, content: val }))} />

            {/* Answers */}
            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-500">
                        Answers <span className="text-gray-400">(click to mark correct)</span>
                    </label>
                    {question.answers.length < 6 && (
                        <button onClick={addAnswer} className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors">
                            <Plus size={11} /> Add option
                        </button>
                    )}
                </div>
                {question.answers.map((ans) => {
                    const isDuplicate = question.answers.filter(a => a.text.trim().toLowerCase() === ans.text.trim().toLowerCase() && a.text.trim() !== "").length > 1;
                    return (
                        <div key={ans.id} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <RichTextInput 
                                    value={ans.text} 
                                    onChange={(val) => updateAnswerText(ans.id, val)}
                                    minHeight="45px"
                                    className={cn(
                                        "bg-white",
                                        (isEmpty(ans.text) || isDuplicate) ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-200"
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setCorrect(ans.id)}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all shrink-0 ${ans.isCorrect
                                        ? "bg-[#D9F55C] border-[#D9F55C] text-black shadow-sm"
                                        : "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                                        }`}
                                >
                                    {ans.isCorrect ? "✓ Correct" : "Incorrect"}
                                </button>
                                <button
                                    onClick={() => removeAnswer(ans.id)}
                                    disabled={question.answers.length <= 2}
                                    className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {(() => {
                    const texts = question.answers.map(a => a.text.replace(/<[^>]*>/g, '').trim().toLowerCase()).filter(t => t !== "");
                    const hasDuplicates = new Set(texts).size !== texts.length;
                    return hasDuplicates && <p className="text-orange-500 text-xs">All answer options must be unique.</p>;
                })()}
                {!question.answers.some((a) => a.isCorrect) && (
                    <p className="text-orange-500 text-xs">Mark one answer as correct.</p>
                )}
            </div>
        </div>
    );
}

// ─── Open-ended Block (Essay / Project) ──────────────────────────────────────

export function OpenEndedBlock({
    question, index, onChange, onRemove, label,
}: {
    question: EssayQuestion | ProjectQuestion;
    index: number;
    onChange: (updater: (prev: any) => any) => void;
    onRemove: () => void;
    label: string;
}) {
    const hasError = isEmpty(question.content);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const attachments = (question as any).attachments || [];

    const handleUploadComplete = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadAssignmentFile(formData);
        if (res.success) {
            onChange(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), res.url]
            }));
            toast.success("Document attached successfully");
        } else {
            toast.error(res.error || "Failed to upload document");
        }
    };

    const removeAttachment = (url: string) => {
        onChange(prev => ({
            ...prev,
            attachments: prev.attachments?.filter((a: string) => a !== url)
        }));
    };

    return (
        <div className={`bg-[#F0F5D8] rounded-2xl p-5 mb-4 border-2 transition-colors ${hasError ? "border-orange-200" : "border-transparent"}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">{label} {index + 1}</span>
                <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-white">
                    <X size={15} />
                </button>
            </div>
            <RichTextInput value={question.content} onChange={(val) => onChange((prev: any) => ({ ...prev, content: val }))} />

            {label === "Project Question" && (
                <div className="mt-4 flex items-center justify-end gap-2">
                    {attachments.length > 0 && (
                        <div className="flex -space-x-1 pr-2 border-r border-gray-200">
                            {attachments.map((_: any, idx: number) => (
                                <div key={idx} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                    <FileText size={10} className="text-emerald-600" />
                                </div>
                            ))}
                        </div>
                    )}
                    <NuraButton
                        label={attachments.length > 0 ? `${attachments.length} Attachments` : "Add Attachments"}
                        variant="secondary"
                        className="!h-9 !text-xs !px-4"
                        onClick={() => setIsUploadModalOpen(true)}
                    />
                </div>
            )}

            {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                    {attachments.map((url: string, idx: number) => {
                        const filename = url.split("/").pop() || `Document ${idx + 1}`;
                        return (
                            <div key={idx} className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText size={16} className="text-emerald-600 shrink-0" />
                                    <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{filename}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => removeAttachment(url)}
                                        className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-gray-400 hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <FileUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadComplete}
                title="Attach Document"
                accept="Any"
                maxSizeMB={10}
            />
        </div>
    );
}

// ─── Validation helper ────────────────────────────────────────────────────────

export function validateSectionWeights(
    weights: SectionWeights,
    counts: { objective: number; essay: number; project: number },
): string[] {
    const errors: string[] = [];
    const sum = weights.objective + weights.essay + weights.project;
    if (Math.abs(sum - 100) > 0.01) {
        errors.push(`Section weights must total 100% (currently ${sum.toFixed(1)}%).`);
    }
    if (counts.objective > 0 && weights.objective <= 0) {
        errors.push("Objective has questions but its weight is 0%.");
    }
    if (counts.essay > 0 && weights.essay <= 0) {
        errors.push("Essay has questions but its weight is 0%.");
    }
    if (counts.project > 0 && weights.project <= 0) {
        errors.push("Project has questions but its weight is 0%.");
    }
    if (counts.objective === 0 && weights.objective > 0) {
        errors.push("Objective weight is set but there are no objective questions.");
    }
    if (counts.essay === 0 && weights.essay > 0) {
        errors.push("Essay weight is set but there are no essay questions.");
    }
    if (counts.project === 0 && weights.project > 0) {
        errors.push("Project weight is set but there are no project questions.");
    }
    return errors;
}

export function validateAssignmentQuestions(
    objectiveQuestions: ObjectiveQuestion[],
    essayQuestions: EssayQuestion[],
    projectQuestions: ProjectQuestion[],
    sectionWeights: SectionWeights,
): string[] {
    const errors: string[] = [];
    errors.push(
        ...validateSectionWeights(sectionWeights, {
            objective: objectiveQuestions.length,
            essay: essayQuestions.length,
            project: projectQuestions.length,
        }),
    );
    objectiveQuestions.forEach((q, i) => {
        if (isEmpty(q.content)) errors.push(`Objective Q${i + 1}: question text is required.`);
        if (!q.answers.some((a) => a.isCorrect)) errors.push(`Objective Q${i + 1}: mark one answer as correct.`);
        if (q.answers.some((a) => isEmpty(a.text))) errors.push(`Objective Q${i + 1}: all answer options must be filled.`);
        const texts = q.answers.map(a => a.text.replace(/<[^>]*>/g, '').trim().toLowerCase()).filter(t => t !== "");
        if (new Set(texts).size !== texts.length) errors.push(`Objective Q${i + 1}: all answer options must be unique.`);
    });
    essayQuestions.forEach((q, i) => {
        if (isEmpty(q.content)) errors.push(`Essay Q${i + 1}: question text is required.`);
    });
    projectQuestions.forEach((q, i) => {
        if (isEmpty(q.content)) errors.push(`Project Q${i + 1}: question text is required.`);
    });
    return errors;
}

// ─── TestEditor Component ─────────────────────────────────────────────────────

const SCORE_TOTAL = 100;

interface TestEditorProps {
    selectedCourse: { id: number; title: string };
    objectiveQuestions: ObjectiveQuestion[];
    setObjectiveQuestions: React.Dispatch<React.SetStateAction<ObjectiveQuestion[]>>;
    essayQuestions: EssayQuestion[];
    setEssayQuestions: React.Dispatch<React.SetStateAction<EssayQuestion[]>>;
    projectQuestions: ProjectQuestion[];
    setProjectQuestions: React.Dispatch<React.SetStateAction<ProjectQuestion[]>>;
    thresholds: Record<string, number>;
    setThresholds: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    idRef: React.MutableRefObject<number>;
    /** Nilai awal bobot; induk biasanya me-remount editor (key) saat membuka ulang. */
    initialSectionWeights?: SectionWeights;
    onSave: (
        objective: ObjectiveQuestion[],
        essay: EssayQuestion[],
        project: ProjectQuestion[],
        sectionWeights: SectionWeights,
    ) => void;
    onCancel: () => void;
    showModal: (opts: {
        open: boolean;
        type: "success" | "error";
        title: string;
        message: string;
        errors?: string[];
        onConfirm?: () => void;
        confirmText?: string;
        closeText?: string;
    }) => void;
}

export function TestEditor({
    selectedCourse,
    objectiveQuestions,
    setObjectiveQuestions,
    essayQuestions,
    setEssayQuestions,
    projectQuestions,
    setProjectQuestions,
    thresholds,
    setThresholds,
    idRef,
    initialSectionWeights,
    onSave,
    onCancel,
    showModal,
}: TestEditorProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [sectionWeights, setSectionWeights] = useState<SectionWeights>(
        () => initialSectionWeights ?? DEFAULT_SECTION_WEIGHTS,
    );

    const handleImportCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
            if (lines.length < 2) {
                toast.error("CSV file is empty or missing headers");
                return;
            }

            // Simple CSV parser that handles quotes
            const parseCSVLine = (line: string) => {
                const result = [];
                let current = "";
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        result.push(current.trim());
                        current = "";
                    } else {
                        current += char;
                    }
                }
                result.push(current.trim());
                return result;
            };

            const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
            const newQuestions: ObjectiveQuestion[] = [];

            for (let i = 1; i < lines.length; i++) {
                const values = parseCSVLine(lines[i]);
                if (values.length < 2) continue;

                const qData: any = {};
                headers.forEach((h, idx) => {
                    qData[h] = values[idx] || "";
                });

                const questionContent = qData["question"] || values[0];
                const correctRef = (qData["correct answer"] || "").trim().toUpperCase();

                const answers: Answer[] = [];
                const optionCols = ["option a", "option b", "option c", "option d", "option e", "option f"];
                
                optionCols.forEach((col, idx) => {
                    const text = qData[col];
                    if (text && text.trim() !== "") {
                        const letter = String.fromCharCode(65 + idx); // A, B, C...
                        answers.push({
                            id: idRef.current++,
                            text: text,
                            isCorrect: correctRef === letter
                        });
                    }
                });

                if (questionContent && answers.length >= 2) {
                    newQuestions.push({
                        id: idRef.current++,
                        content: questionContent,
                        answers: answers,
                        score: 0,
                    });
                }
            }

            if (newQuestions.length > 0) {
                setObjectiveQuestions(prev => {
                    // If we only have one empty question, replace it
                    if (prev.length === 1 && isEmpty(prev[0].content) && prev[0].answers.every(a => isEmpty(a.text))) {
                        return newQuestions;
                    }
                    return [...prev, ...newQuestions];
                });
                toast.success(`Imported ${newQuestions.length} questions successfully`);
            } else {
                toast.error("No valid questions found in CSV. Please use the template.");
            }
        };
        reader.readAsText(file);
    };

    const threshold = thresholds[selectedCourse.id] ?? 0;
    const isThresholdError = threshold < 0 || threshold > SCORE_TOTAL;

    const weightSum = sectionWeights.objective + sectionWeights.essay + sectionWeights.project;
    const weightSumError = Math.abs(weightSum - 100) > 0.01;

    const handleSave = () => {
        const errors = validateAssignmentQuestions(
            objectiveQuestions,
            essayQuestions,
            projectQuestions,
            sectionWeights,
        );
        if (errors.length > 0) {
            showModal({
                open: true,
                type: "error",
                title: "Fix These Issues",
                message: `Please correct the ${errors.length} issue${errors.length > 1 ? "s" : ""} below before saving.`,
                errors,
                closeText: "Back to Edit",
            });
            return;
        }
        onSave(objectiveQuestions, essayQuestions, projectQuestions, sectionWeights);
    };

    const setWeight = (key: keyof SectionWeights, raw: string) => {
        const n = parseFloat(raw);
        const v = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
        setSectionWeights((prev) => ({ ...prev, [key]: v }));
    };

    return (
        <>
            {/* Course Title & Passing Grade */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 mb-8">
                <div>
                    <label className="block text-sm font-semibold mb-1">Course Title</label>
                    <div className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                        {selectedCourse.title}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="block text-sm font-semibold mb-1">Passing Grade</label>
                    <div className={`flex items-center gap-2 border-b-2 transition-colors pb-1.5 ${isThresholdError ? "border-red-500" : "border-gray-200 focus-within:border-[#D9F55C]"}`}>
                        <input
                            type="number"
                            value={thresholds[selectedCourse.id] ?? ""}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setThresholds(prev => ({ ...prev, [selectedCourse.id]: isNaN(val) ? 0 : val }));
                            }}
                            className="flex-1 text-right text-base font-medium text-black outline-none bg-transparent"
                            placeholder="e.g. 80"
                        />
                        <span className="text-gray-400 text-sm font-medium shrink-0">/ {SCORE_TOTAL}</span>
                    </div>
                    {threshold > SCORE_TOTAL && (
                        <span className="text-[10px] text-red-500 font-medium mt-1 italic">Cannot exceed max score ({SCORE_TOTAL})</span>
                    )}
                    {threshold < 0 && (
                        <span className="text-[10px] text-red-500 font-medium mt-1 italic">Cannot be negative</span>
                    )}
                </div>
            </div>

            {/* Bobot per jenis (total 100%) */}
            <div
                className={`mb-8 rounded-2xl border-2 p-5 bg-[#F7FAEE] ${
                    weightSumError ? "border-orange-300" : "border-transparent"
                }`}
            >
                <h2 className="text-sm font-semibold mb-1">Score weights by section</h2>
                <p className="text-xs text-gray-500 mb-4">
                    Set the percentage for each question type. Total must equal 100%. Points are split evenly among questions in each section.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Objective (%)</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={sectionWeights.objective}
                            onChange={(e) => setWeight("objective", e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D9F55C]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Essay (%)</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={sectionWeights.essay}
                            onChange={(e) => setWeight("essay", e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D9F55C]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Project (%)</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={sectionWeights.project}
                            onChange={(e) => setWeight("project", e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D9F55C]"
                        />
                    </div>
                </div>
                <p
                    className={`mt-3 text-xs font-medium ${
                        weightSumError ? "text-orange-600" : "text-gray-600"
                    }`}
                >
                    Total: {weightSum.toFixed(1)}% {weightSumError ? "(must be 100%)" : ""}
                </p>
            </div>

            {/* ── Objective Questions ── */}
            <section className="mb-6">
                <h2 className="text-sm font-semibold mb-3">Objective Questions</h2>
                {objectiveQuestions.length === 0 && (
                    <p className="text-xs text-gray-400 italic mb-3">No objective questions yet.</p>
                )}
                {objectiveQuestions.map((q, i) => (
                    <ObjectiveBlock
                        key={q.id}
                        question={q}
                        index={i}
                        idRef={idRef}
                        onChange={(updater) =>
                            setObjectiveQuestions((prev) => prev.map((item) => (item.id === q.id ? updater(item) : item)))
                        }
                        onRemove={() =>
                            setObjectiveQuestions((prev) => prev.filter((item) => item.id !== q.id))
                        }
                    />
                ))}
                <div className="flex gap-3 mb-3">
                    <button
                        onClick={() => setObjectiveQuestions((prev) => [...prev, makeObjectiveQuestion(idRef)])}
                        className="flex-1 py-2.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                    >
                        <Plus size={14} /> Add Question Block
                    </button>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-6 py-2.5 text-sm text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors border-2 border-dashed border-emerald-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50"
                    >
                        <Upload size={14} /> Import CSV
                    </button>
                    <a
                        href="/templates/objective_questions_template.csv"
                        download
                        className="px-6 py-2.5 text-sm font-medium text-blue-700 hover:text-blue-900 flex items-center justify-center gap-1.5 transition-colors border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50"
                    >
                        <Download size={14} /> Template
                    </a>
                </div>
            </section>

            {/* ── Essay Questions ── */}
            <section className="mb-6">
                <h2 className="text-sm font-semibold mb-3">Essay Questions</h2>
                {essayQuestions.length === 0 && (
                    <p className="text-xs text-gray-400 italic mb-3">No essay questions yet.</p>
                )}
                {essayQuestions.map((q, i) => (
                    <OpenEndedBlock
                        key={q.id}
                        question={q}
                        index={i}
                        label="Question"
                        onChange={(updater) =>
                            setEssayQuestions((prev) => prev.map((item) => (item.id === q.id ? updater(item) : item)))
                        }
                        onRemove={() =>
                            setEssayQuestions((prev) => prev.filter((item) => item.id !== q.id))
                        }
                    />
                ))}
                <button
                    onClick={() => setEssayQuestions((prev) => [...prev, makeEssayQuestion(idRef)])}
                    className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                >
                    <Plus size={14} /> Add Question Block
                </button>
            </section>

            {/* ── Project Questions ── */}
            <section className="mb-8">
                <h2 className="text-sm font-semibold mb-3">Project Questions</h2>
                {projectQuestions.length === 0 && (
                    <p className="text-xs text-gray-400 italic mb-3">No project questions yet.</p>
                )}
                {projectQuestions.map((q, i) => (
                    <OpenEndedBlock
                        key={q.id}
                        question={q}
                        index={i}
                        label="Project Question"
                        onChange={(updater) =>
                            setProjectQuestions((prev) => prev.map((item) => (item.id === q.id ? updater(item) : item)))
                        }
                        onRemove={() =>
                            setProjectQuestions((prev) => prev.filter((item) => item.id !== q.id))
                        }
                    />
                ))}
                <button
                    onClick={() => setProjectQuestions((prev) => [...prev, makeProjectQuestion(idRef)])}
                    className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                >
                    <Plus size={14} /> Add Question Block
                </button>
            </section>

            {/* Footer */}
            <div className="flex justify-end items-center gap-4">
                <NuraButton label="Cancel" variant="secondary" onClick={onCancel} />
                <NuraButton label="Save" variant="primary" onClick={handleSave} />
            </div>

            <FileUploadModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onUploadSuccess={handleImportCSV}
                title="Import Objective Questions"
                accept=".csv"
                supportedFileType=".csv"
            />
        </>
    );
}
