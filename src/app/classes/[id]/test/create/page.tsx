"use client"

import { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { M3DateTimePicker, M3TimePicker } from "@/components/ui/input/datetime_picker";
import { FeedbackModal } from "@/components/ui/modal/feedback_modal";
import { X, Plus, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface CourseQuestions {
    objective: ObjectiveQuestion[];
    essay: EssayQuestion[];
    project: ProjectQuestion[];
    saved: boolean;
}

interface CourseItem {
    id: string;
    title: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_COURSES: CourseItem[] = [
    { id: "1", title: "Introduction to Programming" },
    { id: "2", title: "Introduction to Programming – Part 2" },
    { id: "3", title: "Dasar Python & Variabel" },
    { id: "4", title: "Dasar Python & Variabel – Lanjutan" },
];

const MOCK_CLASS_TITLES = [
    "Foundation to Data Analytics",
    "Introduction to Programming",
    "Python for Data Science",
    "Web Development Basics",
];

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
    onChange: (q: ObjectiveQuestion) => void;
    onRemove: () => void;
    idRef: React.MutableRefObject<number>;
}) {
    const setCorrect = (answerId: number) => {
        onChange({ ...question, answers: question.answers.map((a) => ({ ...a, isCorrect: a.id === answerId })) });
    };
    const updateAnswerText = (answerId: number, text: string) => {
        onChange({ ...question, answers: question.answers.map((a) => (a.id === answerId ? { ...a, text } : a)) });
    };
    const addAnswer = () => {
        if (question.answers.length >= 6) return;
        onChange({ ...question, answers: [...question.answers, makeAnswer(idRef)] });
    };
    const removeAnswer = (answerId: number) => {
        if (question.answers.length <= 2) return;
        onChange({ ...question, answers: question.answers.filter((a) => a.id !== answerId) });
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

            <RichTextInput value={question.content} onChange={(val) => onChange({ ...question, content: val })} />

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
                {question.answers.map((ans) => (
                    <div key={ans.id} className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Answer option..."
                            value={ans.text}
                            onChange={(e) => updateAnswerText(ans.id, e.target.value)}
                            className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${!ans.text.trim() ? "border-orange-200" : "border-gray-300"}`}
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
                ))}
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
                    onChange={(e) => onChange({ ...question, score: Math.max(0, Number(e.target.value)) })}
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
    onChange: (q: EssayQuestion | ProjectQuestion) => void;
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
            <RichTextInput value={question.content} onChange={(val) => onChange({ ...question, content: val })} />
            <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500 shrink-0">Score</label>
                <input
                    type="number"
                    min={1}
                    value={question.score || ""}
                    placeholder="e.g. 20"
                    onChange={(e) => onChange({ ...question, score: Math.max(0, Number(e.target.value)) })}
                    className={`w-28 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${question.score <= 0 ? "border-orange-200" : "border-gray-300"}`}
                />
                {question.score <= 0 && <span className="text-orange-500 text-xs">Required</span>}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CreateTestPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const idRef = useRef(1);
    const [classId, setClassId] = useState("");
    useEffect(() => { params.then((p) => setClassId(p.id)).catch(() => { }); }, [params]);

    // View
    const [view, setView] = useState<"overview" | "editor">("overview");
    const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

    // Overview form
    const [classTitle, setClassTitle] = useState("");
    const [classTitleInput, setClassTitleInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState("");
    const [overviewErrors, setOverviewErrors] = useState<{ classTitle?: string; startDate?: string; endTime?: string }>({});

    // Per-course saved questions
    const [courseData, setCourseData] = useState<Record<string, CourseQuestions>>({});

    // Editor state
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

    // Autocomplete
    const suggestions = MOCK_CLASS_TITLES.filter(
        (t) => t.toLowerCase().includes(classTitleInput.toLowerCase()) && classTitleInput.length > 0
    );

    // ── Open course editor ───────────────────────────────────────────────────
    const handleAddItem = (course: CourseItem) => {
        setSelectedCourse(course);
        const existing = courseData[course.id];
        if (existing) {
            setObjectiveQuestions(existing.objective);
            setEssayQuestions(existing.essay);
            setProjectQuestions(existing.project);
        } else {
            setObjectiveQuestions([makeObjectiveQuestion(idRef)]);
            setEssayQuestions([makeEssayQuestion(idRef)]);
            setProjectQuestions([]);
        }
        setView("editor");
    };

    // ── Validate editor ──────────────────────────────────────────────────────
    const validateEditor = (): string[] => {
        const errors: string[] = [];
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

    // ── Save editor ──────────────────────────────────────────────────────────
    const handleSave = () => {
        const errors = validateEditor();
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
        setCourseData((prev) => ({
            ...prev,
            [selectedCourse!.id]: {
                objective: objectiveQuestions,
                essay: essayQuestions,
                project: projectQuestions,
                saved: true,
            },
        }));
        showModal({
            open: true,
            type: "success",
            title: "Questions Saved!",
            message: `Questions for "${selectedCourse!.title}" have been saved successfully.`,
            closeText: "Continue",
            onConfirm: () => { closeModal(); setView("overview"); },
            confirmText: "Back to Overview",
        });
    };

    // ── Submit overview ──────────────────────────────────────────────────────
    const handleCreate = () => {
        const errs: typeof overviewErrors = {};
        if (!classTitle) errs.classTitle = "Class title is required.";
        if (!startDate) errs.startDate = "Start date is required.";
        if (!endTime) errs.endTime = "End time is required.";
        setOverviewErrors(errs);
        if (Object.keys(errs).length > 0) {
            showModal({
                open: true,
                type: "error",
                title: "Incomplete Form",
                message: "Please fill in all required fields before creating the test.",
                closeText: "Back to Edit",
            });
            return;
        }
        showModal({
            open: true,
            type: "success",
            title: "Test Created! 🎉",
            message: "Your placement test has been created successfully.",
            closeText: "Stay Here",
            onConfirm: () => { closeModal(); router.push(`/classes/${classId}/overview`); },
            confirmText: "Go to Overview",
        });
    };

    // ── Breadcrumbs ──────────────────────────────────────────────────────────
    const breadcrumbBase = [
        { label: "Home", href: "/" },
        { label: "Class", href: "/classes" },
        { label: classTitle || "Class Overview", href: `/classes/${classId}/overview` },
        { label: "Create Placement Test", href: "#" },
    ];

    const savedCount = Object.values(courseData).filter((d) => d.saved).length;

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

                {/* ══ OVERVIEW VIEW ══════════════════════════════════════════ */}
                {view === "overview" && (
                    <>
                        <Breadcrumb items={breadcrumbBase} />
                        <h1 className="text-2xl font-bold mt-6 mb-6">Create Test</h1>

                        {/* ── Form Row ── */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px_180px] gap-4 items-start mb-8">

                            {/* Class Title — autocomplete */}
                            <div className="relative">
                                <label className="block text-sm font-semibold mb-1">
                                    Class Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Class (search/autocomplete)"
                                    value={classTitleInput}
                                    onChange={(e) => {
                                        setClassTitleInput(e.target.value);
                                        setClassTitle(e.target.value);
                                        setShowSuggestions(true);
                                        setOverviewErrors((p) => ({ ...p, classTitle: undefined }));
                                    }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                    onFocus={() => setShowSuggestions(true)}
                                    className={`w-full rounded-full border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${overviewErrors.classTitle ? "border-red-400" : "border-gray-300"}`}
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden text-sm">
                                        {suggestions.map((s) => (
                                            <li
                                                key={s}
                                                onMouseDown={() => {
                                                    setClassTitleInput(s);
                                                    setClassTitle(s);
                                                    setShowSuggestions(false);
                                                    setOverviewErrors((p) => ({ ...p, classTitle: undefined }));
                                                }}
                                                className="px-4 py-2.5 hover:bg-[#F0F5D8] cursor-pointer transition-colors"
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {overviewErrors.classTitle && (
                                    <p className="text-red-400 text-xs mt-1 pl-2">{overviewErrors.classTitle}</p>
                                )}
                            </div>

                            {/* Start Date — M3 DateTime Picker */}
                            <M3DateTimePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(d) => {
                                    setStartDate(d);
                                    setOverviewErrors((p) => ({ ...p, startDate: undefined }));
                                }}
                                error={overviewErrors.startDate}
                                required
                            />

                            {/* End Time — M3 Time Picker */}
                            <M3TimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(v) => {
                                    setEndTime(v);
                                    setOverviewErrors((p) => ({ ...p, endTime: undefined }));
                                }}
                                error={overviewErrors.endTime}
                                required
                            />
                        </div>

                        {/* ── Course Questions ── */}
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold">Course Questions</h2>
                            {savedCount > 0 && (
                                <span className="text-xs text-gray-500 bg-[#F0F5D8] px-3 py-1 rounded-full">
                                    {savedCount} / {MOCK_COURSES.length} courses configured
                                </span>
                            )}
                        </div>

                        <div className="bg-[#F2F5DC] rounded-[2rem] p-5 space-y-3 mb-10">
                            {MOCK_COURSES.map((course) => {
                                const saved = courseData[course.id]?.saved;
                                const totalQ = saved
                                    ? courseData[course.id].objective.length +
                                    courseData[course.id].essay.length +
                                    courseData[course.id].project.length
                                    : 0;
                                return (
                                    <div key={course.id} className={`bg-white rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-sm transition-all ${saved ? "ring-2 ring-[#D9F55C]/60" : ""}`}>
                                        <div className="flex items-center gap-3">
                                            {saved && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                                            <div>
                                                <span className="text-sm text-gray-800">{course.title}</span>
                                                {saved && (
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {totalQ} question{totalQ !== 1 ? "s" : ""} added
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <NuraButton
                                            label={saved ? "Edit" : "Add Item"}
                                            variant="primary"
                                            onClick={() => handleAddItem(course)}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end items-center gap-4">
                            <NuraButton label="Cancel" variant="secondary" onClick={() => router.back()} />
                            <NuraButton label="Create" variant="primary" onClick={handleCreate} />
                        </div>
                    </>
                )}

                {/* ══ EDITOR VIEW ════════════════════════════════════════════ */}
                {view === "editor" && selectedCourse && (
                    <>
                        <Breadcrumb items={[...breadcrumbBase, { label: selectedCourse.title, href: "#" }]} />
                        <h1 className="text-2xl font-bold mt-6 mb-6">Create Test</h1>

                        {/* Course Title (read-only) */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-1">Course Title</label>
                            <div className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                                {selectedCourse.title}
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
                                    onChange={(updated) =>
                                        setObjectiveQuestions((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
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
                                    onChange={(updated) =>
                                        setEssayQuestions((prev) => prev.map((item) => (item.id === updated.id ? updated as EssayQuestion : item)))
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
                                    onChange={(updated) =>
                                        setProjectQuestions((prev) => prev.map((item) => (item.id === updated.id ? updated as ProjectQuestion : item)))
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
                            <NuraButton label="Cancel" variant="secondary" onClick={() => { setView("overview"); }} />
                            <NuraButton label="Save" variant="primary" onClick={handleSave} />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}