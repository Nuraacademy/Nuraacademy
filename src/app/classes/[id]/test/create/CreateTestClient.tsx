"use client"

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { FeedbackModal } from "@/components/ui/modal/feedback_modal";
import { X, Plus, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import M3DateTimePicker from "@/components/ui/input/datetime_picker";
import { useRouter } from "next/navigation";
import { addAssignment, editAssignment, removeAssignment } from "@/app/actions/assignment";
import { NuraTextInput } from "@/components/ui/input/text_input";

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
    id: number;
    title: string;
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

// ─── Shared Helpers ────────────────────────────────────────────────────────
const isEmpty = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '').trim();
    const hasImage = html.includes('<img');
    return !text && !hasImage;
};

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
        isEmpty(question.content) ||
        !question.answers.some((a) => a.isCorrect) ||
        question.answers.some((a) => isEmpty(a.text)) ||
        question.score <= 0;

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

            {/* Score */}
            <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500 shrink-0">Score</label>
                <input
                    type="number"
                    min={1}
                    value={question.score || ""}
                    placeholder="e.g. 10"
                    onChange={(e) => onChange((prev) => ({ ...prev, score: Math.max(0, Number(e.target.value)) }))}
                    onWheel={(e) => e.currentTarget.blur()}
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
    const hasError = isEmpty(question.content) || question.score <= 0;

    return (
        <div className={`bg-[#F0F5D8] rounded-2xl p-5 mb-4 border-2 transition-colors ${hasError ? "border-orange-200" : "border-transparent"}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">{label} {index + 1}</span>
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
                    onWheel={(e) => e.currentTarget.blur()}
                    className={`w-28 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white ${question.score <= 0 ? "border-orange-200" : "border-gray-300"}`}
                />
                {question.score <= 0 && <span className="text-orange-500 text-xs">Required</span>}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function CreateTestClient({ classData, existingTest }: { classData: any, existingTest?: any }) {
    const router = useRouter();
    const idRef = useRef(1);

    // View
    const [view, setView] = useState<"overview" | "editor">("overview");
    const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

    // Overview form
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [durationMinutes, setDurationMinutes] = useState(120);
    const [overviewErrors, setOverviewErrors] = useState<{ startDate?: string; endTime?: string; durationMinutes?: string }>({});

    // Per-course saved questions
    const [courseData, setCourseData] = useState<Record<string, CourseQuestions>>({});

    // Per-course thresholds
    const [thresholds, setThresholds] = useState<Record<string, number>>({});

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

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingTest) {
            if (existingTest.duration) {
                setDurationMinutes(existingTest.duration);
            }
            if (existingTest.startDate) {
                setStartDate(new Date(existingTest.startDate));
            }
            if (existingTest.endDate) {
                setEndTime(new Date(existingTest.endDate));
            }

            const initialCourseData: Record<string, CourseQuestions> = {};
            const initialThresholds: Record<string, number> = {};

            if (existingTest.assignmentItems) {
                existingTest.assignmentItems.forEach((item: any) => {
                    const cid = item.courseId;
                    if (!cid) return;

                    // Initialize threshold from course if not set
                    if (item.course && item.course.threshold !== undefined && !initialThresholds[cid]) {
                        initialThresholds[cid] = item.course.threshold;
                    }

                    if (!initialCourseData[cid]) {
                        initialCourseData[cid] = { objective: [], essay: [], project: [], saved: true };
                    }
                    if (item.type === "OBJECTIVE") {
                        const options = item.options || [];
                        initialCourseData[cid].objective.push({
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
                        initialCourseData[cid].essay.push({
                            id: idRef.current++,
                            content: item.question,
                            score: item.maxScore || 20
                        });
                    } else if (item.type === "PROJECT") {
                        initialCourseData[cid].project.push({
                            id: idRef.current++,
                            content: item.question,
                            score: item.maxScore || 20
                        });
                    }
                });
            }
            setCourseData(initialCourseData);
            setThresholds(initialThresholds);
        }
    }, [existingTest]);

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
            if (isEmpty(q.content)) errors.push(`Objective Q${i + 1}: question text is required.`);
            if (!q.answers.some((a) => a.isCorrect)) errors.push(`Objective Q${i + 1}: mark one answer as correct.`);
            if (q.answers.some((a) => isEmpty(a.text))) errors.push(`Objective Q${i + 1}: all answer options must be filled.`);
            if (q.score <= 0) errors.push(`Objective Q${i + 1}: score must be > 0.`);
            const texts = q.answers.map(a => a.text.replace(/<[^>]*>/g, '').trim().toLowerCase()).filter(t => t !== "");
            if (new Set(texts).size !== texts.length) errors.push(`Objective Q${i + 1}: all answer options must be unique.`);
        });
        essayQuestions.forEach((q, i) => {
            if (isEmpty(q.content)) errors.push(`Essay Q${i + 1}: question text is required.`);
            if (q.score <= 0) errors.push(`Essay Q${i + 1}: score must be > 0.`);
        });
        projectQuestions.forEach((q, i) => {
            if (isEmpty(q.content)) errors.push(`Project Q${i + 1}: question text is required.`);
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

        // Calculate and set default threshold (80%) if not already set or if it was 0
        const currentMax = objectiveQuestions.reduce((a, b) => a + b.score, 0) +
            essayQuestions.reduce((a, b) => a + b.score, 0) +
            projectQuestions.reduce((a, b) => a + b.score, 0);

        setThresholds(prev => {
            const existing = prev[selectedCourse!.id];
            if (existing === undefined || existing === 0) {
                return { ...prev, [selectedCourse!.id]: Math.round(currentMax * 0.8) };
            }
            return prev;
        });

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
    const handleCreate = async () => {
        const errs: typeof overviewErrors = {};
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

        setIsSubmitting(true);

        const start = new Date(startDate!);
        if (endTime) {
            start.setHours(endTime.getHours(), endTime.getMinutes());
        }

        const payload = {
            classId: classData.id,
            type: "PLACEMENT",
            startDate: start,
            endDate: endTime || undefined,
            duration: durationMinutes,
        };

        const itemsPayload: any[] = [];

        Object.entries(courseData).forEach(([courseId, course]) => {
            if (!course.saved) return;

            course.objective.forEach(q => {
                if (!isEmpty(q.content)) {
                    itemsPayload.push({
                        courseId: parseInt(courseId),
                        type: "OBJECTIVE",
                        question: q.content,
                        options: q.answers.map(a => a.text) || [],
                        correctAnswer: q.answers.find(a => a.isCorrect)?.text || "",
                        maxScore: q.score || 10
                    });
                }
            });

            course.essay.forEach(q => {
                if (!isEmpty(q.content)) {
                    itemsPayload.push({
                        courseId: parseInt(courseId),
                        type: "ESSAY",
                        question: q.content,
                        maxScore: q.score || 20
                    });
                }
            });

            course.project.forEach(q => {
                if (!isEmpty(q.content)) {
                    itemsPayload.push({
                        courseId: parseInt(courseId),
                        type: "PROJECT",
                        question: q.content,
                        maxScore: q.score || 20
                    });
                }
            });
        });

        const thresholdsPayload = Object.entries(thresholds).map(([courseId, value]) => ({
            courseId: parseInt(courseId),
            threshold: value
        }));

        let res;
        if (existingTest) {
            res = await editAssignment(existingTest.id, payload, itemsPayload, thresholdsPayload);
        } else {
            res = await addAssignment(payload, itemsPayload, thresholdsPayload);
        }
        setIsSubmitting(false);

        if (res.success) {
            showModal({
                open: true,
                type: "success",
                title: existingTest ? "Test Updated! 🎉" : "Test Created! 🎉",
                message: existingTest ? "Your placement test has been updated successfully." : "Your placement test has been created successfully.",
                closeText: "Stay Here",
                onConfirm: () => { closeModal(); router.push(`/classes/${classData.id}/overview`); },
                confirmText: "Go to Overview",
            });
        } else {
            showModal({
                open: true,
                type: "error",
                title: "Creation Failed",
                message: res.error || "Failed to create placement test. Please try again.",
                closeText: "Close",
            });
        }
    };

    // ── Breadcrumbs ──────────────────────────────────────────────────────────
    const breadcrumbBase = [
        { label: "Home", href: "/classes" },
        { label: classData.title || "Class Overview", href: `/classes/${classData.id}/overview` },
        { label: "Placement Test", href: `/classes/${classData.id}/test` },
        { label: existingTest ? "Edit" : "Create", href: `/classes/${classData.id}/test/create` },
    ];

    const savedCount = Object.values(courseData).filter((d) => d.saved).length;
    const TOTAL_COURSES = classData.courses?.length || 0;

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800 overflow-hidden">
            {/* Background */}
            <Image
                src="/background/OvalBGLeft.svg"
                alt=""
                className="absolute top-0 left-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />
            <Image
                src="/background/OvalBGRight.svg"
                alt=""
                className="absolute bottom-0 right-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

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

            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 py-8">

                {/* ══ OVERVIEW VIEW ══════════════════════════════════════════ */}
                {view === "overview" && (
                    <>
                        <Breadcrumb items={breadcrumbBase} />
                        <h1 className="text-2xl font-medium mt-6 mb-6">{existingTest ? "Edit Test" : "Create Test"}</h1>

                        {/* ── Form Row ── */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_240px_240px] gap-4 items-start mb-8">

                            {/* Class Title — Read Only */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">
                                    Class Title
                                </label>
                                <NuraTextInput
                                    value={classData.title}
                                    disabled
                                />
                            </div>

                            {/* Duration — Number */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">
                                    Duration <span className="text-gray-400 font-normal">(minutes)</span>
                                </label>
                                <NuraTextInput
                                    variant="number"
                                    value={durationMinutes}
                                    onChange={(e) => setDurationMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                                    placeholder="120"
                                />
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
                                id="start-date-picker"
                            />

                            {/* End Time — M3 Time Picker */}
                            <M3DateTimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(v) => {
                                    setEndTime(v);
                                    setOverviewErrors((p) => ({ ...p, endTime: undefined }));
                                }}
                                error={overviewErrors.endTime}
                                required
                                id="end-time-picker"
                            />
                        </div>

                        {/* ── Course Questions ── */}
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-medium">Course Questions</h2>
                            {savedCount > 0 && (
                                <span className="text-xs text-gray-500 bg-[#F0F5D8] px-3 py-1 rounded-full">
                                    {savedCount} / {TOTAL_COURSES} courses configured
                                </span>
                            )}
                        </div>

                        <div className="bg-[#F2F5DC] rounded-[2rem] p-5 space-y-3 mb-10">
                            {classData.courses?.map((course: any) => {
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
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-800">{course.title}</span>
                                                {saved && (
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {totalQ} question{totalQ !== 1 ? "s" : ""} added
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <NuraButton
                                                label={saved ? "Edit" : "Add Item"}
                                                variant={saved ? "secondary" : "primary"}
                                                className={saved ? "!h-10 !min-w-[80px] !text-sm" : "!h-10 !min-w-[120px] !text-sm"}
                                                onClick={() => handleAddItem(course)}
                                                id={`add-item-course-${course.id}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end items-center gap-4">
                            <NuraButton label="Cancel" variant="secondary" onClick={() => router.back()} disabled={isSubmitting} />
                            <NuraButton
                                label={isSubmitting ? "Saving..." : (existingTest ? "Save Changes" : "Create")}
                                variant="primary"
                                onClick={handleCreate}
                                disabled={isSubmitting}
                                id="create-test-submit-btn"
                            />
                        </div>
                    </>
                )}

                {/* ══ EDITOR VIEW ════════════════════════════════════════════ */}
                {view === "editor" && selectedCourse && (
                    <>
                        <Breadcrumb items={[...breadcrumbBase, { label: selectedCourse.title, href: "#" }]} />
                        <h1 className="text-2xl font-medium mt-6 mb-6">{existingTest ? "Edit Test" : "Create Test"}</h1>

                        {/* Course Title & Passing Grade */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium mb-1">Course Title</label>
                                <div className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                                    {selectedCourse.title}
                                </div>
                            </div>

                            {(() => {
                                const currentMax = objectiveQuestions.reduce((a, b) => a + b.score, 0) +
                                    essayQuestions.reduce((a, b) => a + b.score, 0) +
                                    projectQuestions.reduce((a, b) => a + b.score, 0);
                                const threshold = thresholds[selectedCourse.id] ?? 0;
                                const isError = threshold < 0 || threshold > currentMax;

                                return (
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium mb-1">Passing Grade</label>
                                        <div className={`flex items-center gap-2 border-b-2 transition-colors pb-1.5 ${isError ? "border-red-500" : "border-gray-200 focus-within:border-[#D9F55C]"}`}>
                                            <input
                                                type="number"
                                                value={thresholds[selectedCourse.id] ?? ""}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    setThresholds(prev => ({ ...prev, [selectedCourse.id]: isNaN(val) ? 0 : val }));
                                                }}
                                                onWheel={(e) => e.currentTarget.blur()}
                                                className="flex-1 text-right text-base font-medium text-black outline-none bg-transparent"
                                                placeholder="e.g. 80"
                                            />
                                            <span className="text-gray-400 text-sm font-medium shrink-0">/ {currentMax}</span>
                                        </div>
                                        {threshold > currentMax && (
                                            <span className="text-[10px] text-red-500 font-medium mt-1 italic">Cannot exceed max score ({currentMax})</span>
                                        )}
                                        {threshold < 0 && (
                                            <span className="text-[10px] text-red-500 font-medium mt-1 italic">Cannot be negative</span>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* ── Objective Questions ── */}
                        <section className="mb-6">
                            <h2 className="text-sm font-medium mb-3">Objective Questions</h2>
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
                            <h2 className="text-sm font-medium mb-3">Essay Questions</h2>
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
                            <h2 className="text-sm font-medium mb-3">Project Questions</h2>
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
                            <NuraButton label="Cancel" variant="secondary" onClick={() => { setView("overview"); }} />
                            <NuraButton label="Save" variant="primary" onClick={handleSave} id="save-course-questions-btn" />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}