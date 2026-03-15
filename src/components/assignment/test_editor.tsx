"use client"

import { useRef } from "react";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { NuraButton } from "@/components/ui/button/button";
import { X, Plus } from "lucide-react";

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
        !question.content.replace(/<[^>]+>/g, "").trim() ||
        !question.answers.some((a) => a.isCorrect) ||
        question.answers.some((a) => !a.text.trim()) ||
        question.score <= 0;

    return (
        <div className={`bg-[#F0F5D8] rounded-2xl p-5 mb-4 border-2 transition-colors ${hasError ? "border-orange-200" : "border-transparent"}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Question {index + 1}</span>
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
                        <div key={ans.id} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Answer option..."
                                value={ans.text}
                                onChange={(e) => updateAnswerText(ans.id, e.target.value)}
                                className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${(!ans.text.trim() || isDuplicate) ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-300"}`}
                            />
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
                    );
                })}
                {(() => {
                    const texts = question.answers.map(a => a.text.trim().toLowerCase()).filter(t => t !== "");
                    const hasDuplicates = new Set(texts).size !== texts.length;
                    return hasDuplicates && <p className="text-orange-500 text-xs">All answer options must be unique.</p>;
                })()}
                {!question.answers.some((a) => a.isCorrect) && (
                    <p className="text-orange-500 text-xs">Mark one answer as correct.</p>
                )}
            </div>

            {/* Score */}
            <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500 shrink-0">Score</label>
                <input
                    type="number"
                    min={1}
                    value={question.score || ""}
                    placeholder="e.g. 10"
                    onChange={(e) => onChange((prev) => ({ ...prev, score: Math.max(0, Number(e.target.value)) }))}
                    className={`w-28 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${question.score <= 0 ? "border-orange-200" : "border-gray-300"}`}
                />
                {question.score <= 0 && <span className="text-orange-500 text-xs">Required</span>}
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
    const hasError = !question.content.replace(/<[^>]+>/g, "").trim() || question.score <= 0;

    return (
        <div className={`bg-[#F0F5D8] rounded-2xl p-5 mb-4 border-2 transition-colors ${hasError ? "border-orange-200" : "border-transparent"}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">{label} {index + 1}</span>
                <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-white">
                    <X size={15} />
                </button>
            </div>
            <RichTextInput value={question.content} onChange={(val) => onChange((prev: any) => ({ ...prev, content: val }))} />
            <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500 shrink-0">Score</label>
                <input
                    type="number"
                    min={1}
                    value={question.score || ""}
                    placeholder="e.g. 20"
                    onChange={(e) => onChange((prev: any) => ({ ...prev, score: Math.max(0, Number(e.target.value)) }))}
                    className={`w-28 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${question.score <= 0 ? "border-orange-200" : "border-gray-300"}`}
                />
                {question.score <= 0 && <span className="text-orange-500 text-xs">Required</span>}
            </div>
        </div>
    );
}

// ─── Validation helper ────────────────────────────────────────────────────────

export function validateQuestions(
    objectiveQuestions: ObjectiveQuestion[],
    essayQuestions: EssayQuestion[],
    projectQuestions: ProjectQuestion[]
): string[] {
    const errors: string[] = [];
    objectiveQuestions.forEach((q, i) => {
        if (!q.content.replace(/<[^>]+>/g, "").trim()) errors.push(`Objective Q${i + 1}: question text is required.`);
        if (!q.answers.some((a) => a.isCorrect)) errors.push(`Objective Q${i + 1}: mark one answer as correct.`);
        if (q.answers.some((a) => !a.text.trim())) errors.push(`Objective Q${i + 1}: all answer options must be filled.`);
        if (q.score <= 0) errors.push(`Objective Q${i + 1}: score must be > 0.`);
        const texts = q.answers.map(a => a.text.trim().toLowerCase()).filter(t => t !== "");
        if (new Set(texts).size !== texts.length) errors.push(`Objective Q${i + 1}: all answer options must be unique.`);
    });
    essayQuestions.forEach((q, i) => {
        if (!q.content.replace(/<[^>]+>/g, "").trim()) errors.push(`Essay Q${i + 1}: question text is required.`);
        if (q.score <= 0) errors.push(`Essay Q${i + 1}: score must be > 0.`);
    });
    projectQuestions.forEach((q, i) => {
        if (!q.content.replace(/<[^>]+>/g, "").trim()) errors.push(`Project Q${i + 1}: question text is required.`);
        if (q.score <= 0) errors.push(`Project Q${i + 1}: score must be > 0.`);
    });
    return errors;
}

// ─── TestEditor Component ─────────────────────────────────────────────────────

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
    onSave: (
        objective: ObjectiveQuestion[],
        essay: EssayQuestion[],
        project: ProjectQuestion[]
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
    onSave,
    onCancel,
    showModal,
}: TestEditorProps) {
    const currentMax =
        objectiveQuestions.reduce((a, b) => a + b.score, 0) +
        essayQuestions.reduce((a, b) => a + b.score, 0) +
        projectQuestions.reduce((a, b) => a + b.score, 0);

    const threshold = thresholds[selectedCourse.id] ?? 0;
    const isThresholdError = threshold < 0 || threshold > currentMax;

    const handleSave = () => {
        const errors = validateQuestions(objectiveQuestions, essayQuestions, projectQuestions);
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
        onSave(objectiveQuestions, essayQuestions, projectQuestions);
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
                            className="flex-1 text-right text-base font-bold text-black outline-none bg-transparent"
                            placeholder="e.g. 80"
                        />
                        <span className="text-gray-400 text-sm font-medium shrink-0">/ {currentMax}</span>
                    </div>
                    {threshold > currentMax && (
                        <span className="text-[10px] text-red-500 font-bold mt-1 italic">Cannot exceed max score ({currentMax})</span>
                    )}
                    {threshold < 0 && (
                        <span className="text-[10px] text-red-500 font-bold mt-1 italic">Cannot be negative</span>
                    )}
                </div>
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
                <button
                    onClick={() => setObjectiveQuestions((prev) => [...prev, makeObjectiveQuestion(idRef)])}
                    className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                >
                    <Plus size={14} /> Add Question Block
                </button>
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
                        label="Question"
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
        </>
    );
}
