"use client"

import { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { M3DateTimePicker, M3TimePicker } from "@/components/ui/input/datetime_picker";
import { FeedbackModal } from "@/components/ui/modal/feedback_modal";
import { X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addAssignment, editAssignment } from "@/app/actions/assignment";
import { AssignmentType } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Answer {
    id: number;
    text: string;
    isCorrect: boolean;
}

interface ObjectiveQuestion {
    id: number;
    content: string;
    answers: Answer[];
    score: number;
}

interface EssayQuestion {
    id: number;
    content: string;
    score: number;
}

interface ProjectQuestion {
    id: number;
    content: string;
    score: number;
}

// ─── ID helpers ───────────────────────────────────────────────────────────────

function makeAnswer(idRef: React.MutableRefObject<number>): Answer {
    return { id: idRef.current++, text: "", isCorrect: false };
}
function makeObjectiveQuestion(idRef: React.MutableRefObject<number>): ObjectiveQuestion {
    return {
        id: idRef.current++,
        content: "",
        answers: [makeAnswer(idRef), makeAnswer(idRef), makeAnswer(idRef), makeAnswer(idRef)],
        score: 0,
    };
}
function makeEssayQuestion(idRef: React.MutableRefObject<number>): EssayQuestion {
    return { id: idRef.current++, content: "", score: 0 };
}
function makeProjectQuestion(idRef: React.MutableRefObject<number>): ProjectQuestion {
    return { id: idRef.current++, content: "", score: 0 };
}

// ─── Objective Block ──────────────────────────────────────────────────────────

function ObjectiveBlock({
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

function OpenEndedBlock({
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
            <RichTextInput value={question.content} onChange={(val) => onChange((prev) => ({ ...prev, content: val }))} />
            <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500 shrink-0">Score</label>
                <input
                    type="number"
                    min={1}
                    value={question.score || ""}
                    placeholder="e.g. 20"
                    onChange={(e) => onChange((prev) => ({ ...prev, score: Math.max(0, Number(e.target.value)) }))}
                    className={`w-28 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${question.score <= 0 ? "border-orange-200" : "border-gray-300"}`}
                />
                {question.score <= 0 && <span className="text-orange-500 text-xs">Required</span>}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface CreateSessionTestClientProps {
    classId: number;
    courseId: number;
    sessionId: number;
    sessionTitle: string;
    type: AssignmentType;
    existingTest?: any;
}

export function CreateSessionTestClient({
    classId,
    courseId,
    sessionId,
    sessionTitle,
    type,
    existingTest
}: CreateSessionTestClientProps) {
    const router = useRouter();
    const idRef = useRef(1);

    // Form state
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [deadLineDate, setDeadLineDate] = useState<Date | null>(null);
    const [deadLineTime, setDeadLineTime] = useState("");
    const [passingGrade, setPassingGrade] = useState<number>(0);
    const [duration, setDuration] = useState<number>(120);
    const [description, setDescription] = useState("");
    const [instruction, setInstruction] = useState("");

    // Questions state
    const [objectiveQuestions, setObjectiveQuestions] = useState<ObjectiveQuestion[]>([]);
    const [essayQuestions, setEssayQuestions] = useState<EssayQuestion[]>([]);
    const [projectQuestions, setProjectQuestions] = useState<ProjectQuestion[]>([]);

    // Modal state
    const [modal, setModal] = useState<{
        open: boolean;
        type: "success" | "error";
        title: string;
        message: string;
        errors?: string[];
        onConfirm?: () => void;
        confirmText?: string;
        closeText?: string;
    }>({ open: false, type: "success", title: "", message: "" });

    const showModal = (opts: typeof modal) => setModal({ ...opts, open: true });
    const closeModal = () => setModal((m) => ({ ...m, open: false }));

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingTest) {
            if (existingTest.startDate) setStartDate(new Date(existingTest.startDate));
            if (existingTest.endDate) {
                const end = new Date(existingTest.endDate);
                setDeadLineDate(end);
                const hrs = end.getHours().toString().padStart(2, "0");
                const mins = end.getMinutes().toString().padStart(2, "0");
                setDeadLineTime(`${hrs}:${mins}`);
            }
            setPassingGrade(existingTest.passingGrade || 0);
            setDuration(existingTest.duration || 120);
            setDescription(existingTest.description || "");
            setInstruction(existingTest.instruction || "");

            const items = existingTest.assignmentItems || [];
            const obj: ObjectiveQuestion[] = [];
            const ess: EssayQuestion[] = [];
            const prj: ProjectQuestion[] = [];

            items.forEach((item: any) => {
                if (item.type === "OBJECTIVE") {
                    const options = Array.isArray(item.options) ? item.options : [];
                    obj.push({
                        id: idRef.current++,
                        content: item.question,
                        answers: options.map((opt: string) => ({
                            id: idRef.current++,
                            text: opt,
                            isCorrect: opt === item.correctAnswer
                        })),
                        score: item.maxScore || 10
                    });
                } else if (item.type === "ESSAY") {
                    ess.push({
                        id: idRef.current++,
                        content: item.question,
                        score: item.maxScore || 20
                    });
                } else if (item.type === "PROJECT") {
                    prj.push({
                        id: idRef.current++,
                        content: item.question,
                        score: item.maxScore || 50
                    });
                }
            });

            setObjectiveQuestions(obj);
            setEssayQuestions(ess);
            setProjectQuestions(prj);
        } else {
            // Defaults for new test
            setObjectiveQuestions([makeObjectiveQuestion(idRef)]);
            setEssayQuestions([makeEssayQuestion(idRef)]);
        }
    }, [existingTest]);

    const validate = (): string[] => {
        const errors: string[] = [];
        if (!deadLineDate) errors.push("Deadline Date is required.");
        if (!deadLineTime) errors.push("Deadline Time is required.");

        const currentMax = objectiveQuestions.reduce((a, b) => a + b.score, 0) +
            essayQuestions.reduce((a, b) => a + b.score, 0) +
            projectQuestions.reduce((a, b) => a + b.score, 0);

        if (passingGrade > currentMax) errors.push(`Passing grade (${passingGrade}) cannot exceed max score (${currentMax}).`);

        objectiveQuestions.forEach((q, i) => {
            if (!q.content.replace(/<[^>]+>/g, "").trim()) errors.push(`Objective Q${i + 1}: question text is required.`);
            if (!q.answers.some((a) => a.isCorrect)) errors.push(`Objective Q${i + 1}: mark one answer as correct.`);
            if (q.answers.some((a) => !a.text.trim())) errors.push(`Objective Q${i + 1}: all answer options must be filled.`);
            if (q.score <= 0) errors.push(`Objective Q${i + 1}: score must be > 0.`);
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
    };

    const handleSubmit = async () => {
        const errors = validate();
        if (errors.length > 0) {
            showModal({
                open: true,
                type: "error",
                title: "Fix These Issues",
                message: "Please correct the issues below before saving.",
                errors,
                closeText: "Back to Edit",
            });
            return;
        }

        setIsSubmitting(true);

        const end = new Date(deadLineDate!);
        const [hours, minutes] = deadLineTime.split(":");
        end.setHours(parseInt(hours, 10), parseInt(minutes, 10));

        const payload = {
            sessionId,
            courseId,
            classId,
            type,
            startDate: startDate || new Date(),
            endDate: end,
            duration,
            passingGrade,
            description,
            instruction,
        };

        const itemsPayload: any[] = [];
        objectiveQuestions.forEach(q => {
            itemsPayload.push({
                type: "OBJECTIVE",
                question: q.content,
                options: q.answers.map(a => a.text),
                correctAnswer: q.answers.find(a => a.isCorrect)?.text || "",
                maxScore: q.score
            });
        });
        essayQuestions.forEach(q => {
            itemsPayload.push({
                type: "ESSAY",
                question: q.content,
                maxScore: q.score
            });
        });
        projectQuestions.forEach(q => {
            itemsPayload.push({
                type: "PROJECT",
                question: q.content,
                maxScore: q.score
            });
        });

        let res;
        if (existingTest) {
            res = await editAssignment(existingTest.id, payload, itemsPayload);
        } else {
            res = await addAssignment(payload, itemsPayload);
        }

        setIsSubmitting(false);

        if (res.success) {
            showModal({
                open: true,
                type: "success",
                title: existingTest ? "Test Updated!" : "Test Created!",
                message: "The test questions have been saved successfully.",
                confirmText: "Go to Session",
                onConfirm: () => {
                    closeModal();
                    router.push(`/classes/${classId}/course/${courseId}/session/${sessionId}`);
                },
            });
        } else {
            showModal({
                open: true,
                type: "error",
                title: "Failed to Save",
                message: res.error || "Something went wrong. Please try again.",
                closeText: "Close",
            });
        }
    };

    const testTypeName = type === "PRETEST" ? "Pre-test" : "Post-test";
    const currentMaxScore = objectiveQuestions.reduce((a, b) => a + b.score, 0) +
        essayQuestions.reduce((a, b) => a + b.score, 0) +
        projectQuestions.reduce((a, b) => a + b.score, 0);

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800 overflow-hidden">
            {/* Background */}
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none select-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none select-none" />

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                errors={modal.errors}
                onClose={closeModal}
                onConfirm={modal.onConfirm}
                confirmText={modal.confirmText}
                closeText={modal.closeText}
            />

            <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-10 py-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Class Overview", href: `/classes/${classId}/overview` },
                        { label: sessionTitle, href: `/classes/${classId}/course/${courseId}/session/${sessionId}` },
                        { label: `${existingTest ? "Edit" : "Create"} ${testTypeName}`, href: "#" },
                    ]}
                />

                <h1 className="text-2xl font-bold mt-6 mb-8">{existingTest ? "Edit" : "Create"} {testTypeName}</h1>

                {/* ── Test Config ── */}
                <div className="bg-[#F2F5DC] rounded-[2rem] p-8 mb-8 space-y-6 shadow-sm border border-[#EBF2D5]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <M3DateTimePicker
                            label="Start Date (Optional)"
                            value={startDate}
                            onChange={setStartDate}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <M3DateTimePicker
                                label="Deadline Date"
                                value={deadLineDate}
                                onChange={setDeadLineDate}
                                required
                            />
                            <M3TimePicker
                                label="Deadline Time"
                                value={deadLineTime}
                                onChange={setDeadLineTime}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Duration (Minutes)</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C]"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Passing Grade (out of {currentMaxScore})</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C]"
                                value={passingGrade}
                                onChange={(e) => setPassingGrade(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] min-h-[100px]"
                            placeholder="Briefly describe what this test covers..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Instructions</label>
                        <textarea
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] min-h-[100px]"
                            placeholder="Enter test instructions, one per line..."
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Questions ── */}
                <div className="space-y-12">
                    {/* Objective */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            Objective Questions
                            <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Automated Scoring</span>
                        </h2>
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
                            className="w-full py-3.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                        >
                            <Plus size={16} /> Add Objective Question
                        </button>
                    </section>

                    {/* Essay */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            Essay Questions
                            <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Manual Review</span>
                        </h2>
                        {essayQuestions.map((q, i) => (
                            <OpenEndedBlock
                                key={q.id}
                                question={q}
                                index={i}
                                label="Essay Question"
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
                            className="w-full py-3.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                        >
                            <Plus size={16} /> Add Essay Question
                        </button>
                    </section>

                    {/* Project */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            Project Questions
                            <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Manual Review</span>
                        </h2>
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
                            className="w-full py-3.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                        >
                            <Plus size={16} /> Add Project Question
                        </button>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <NuraButton
                        label={isSubmitting ? "Saving..." : (existingTest ? "Save Changes" : "Create Test")}
                        variant="primary"
                        className="min-w-[180px] !rounded-full py-3 text-sm font-bold shadow-lg shadow-[#cdff2b33]"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    />
                </div>
            </div>
        </main>
    );
}

