"use client"

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { FeedbackModal } from "@/components/ui/modal/feedback_modal";
import { X, Plus, CheckCircle, Upload, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import M3DateTimePicker from "@/components/ui/input/datetime_picker";
import FileUpload from "@/components/ui/upload/file_upload";
import FileUploadModal from "@/components/ui/modal/file_upload_modal";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { addAssignment, editAssignment, removeAssignment } from "@/app/actions/assignment";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { getClassDetails, uploadClassFile } from "@/app/actions/classes";
import { toast } from "sonner";
import {
    buildAssignmentItemsPayload,
    DEFAULT_SECTION_WEIGHTS,
    inferSectionWeightsFromQuestions,
    validateAssignmentQuestions,
    type SectionWeights,
} from "@/components/assignment/test_editor";

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
    attachments?: string[];
}

interface CourseQuestions {
    objective: ObjectiveQuestion[];
    essay: EssayQuestion[];
    project: ProjectQuestion[];
    saved: boolean;
    sectionWeights?: SectionWeights;
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

function OpenEndedBlock({
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
        const res = await uploadClassFile(formData);
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
            <RichTextInput value={question.content} onChange={(val) => onChange((prev) => ({ ...prev, content: val }))} />

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

            {/* List of attachments for Projects if and only if label was originally Project in the editor */}
            {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                    {attachments.map((url: string, idx: number) => {
                        const filename = url.split("/").pop() || `Document ${idx + 1}`;
                        return (
                            <div key={idx} className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText size={16} className="text-emerald-600" />
                                    <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{filename}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => removeAttachment(url)} className="p-1.5 text-gray-400 hover:text-red-500">
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
                maxSizeMB={5}
            />
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

    // Dynamic Class Data refresh
    const [localClassData, setLocalClassData] = useState(classData);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshTimeline = async () => {
        setIsRefreshing(true);
        const res = await getClassDetails(classData.id);
        if (res.success && res.class) {
            setLocalClassData(res.class);
        }
        setIsRefreshing(false);
    };

    // Auto-refresh when tab gets focus
    useEffect(() => {
        const onFocus = () => {
            refreshTimeline();
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    // Sync dates from localClassData when it updates (since it's a Placement Test, it's always synced)
    useEffect(() => {
        if (!existingTest && localClassData.timelines) {
            const st = localClassData.timelines.find((t: any) =>
                t.activity.toLowerCase().includes("placement test") && t.activity.toLowerCase().includes("start")
            );
            const et = localClassData.timelines.find((t: any) =>
                t.activity.toLowerCase().includes("placement test") && t.activity.toLowerCase().includes("end")
            );
            if (st) setStartDate(new Date(st.date));
            if (et) setEndTime(new Date(et.date));
        }
    }, [localClassData.timelines]);

    // Overview form
    const [startDate, setStartDate] = useState<Date | null>(() => {
        if (existingTest?.startDate) return new Date(existingTest.startDate);
        const st = classData.timelines?.find((t: any) => t.activity === "Placement Test Starts" || t.activity === "Placement test Starts");
        return st ? new Date(st.date) : null;
    });
    const [endTime, setEndTime] = useState<Date | null>(() => {
        if (existingTest?.endDate) return new Date(existingTest.endDate);
        const et = classData.timelines?.find((t: any) => t.activity === "Placement Test Ends" || t.activity === "Placement test Ends");
        return et ? new Date(et.date) : null;
    });
    const [durationMinutes, setDurationMinutes] = useState(120);
    const [testTitle, setTestTitle] = useState(existingTest?.title || `Placement Test - ${classData.title}`);
    const [overviewErrors, setOverviewErrors] = useState<{ startDate?: string; endTime?: string; durationMinutes?: string; title?: string }>({});

    // Per-course saved questions
    const [courseData, setCourseData] = useState<Record<string, CourseQuestions>>({});

    // Per-course thresholds
    const [thresholds, setThresholds] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        if (classData.courses) {
            classData.courses.forEach((c: any) => {
                // Prioritize existing test data if we have it, else course default
                initial[c.id] = c.threshold ?? 80;
            });
        }
        return initial;
    });

    // Editor state
    const [objectiveQuestions, setObjectiveQuestions] = useState<ObjectiveQuestion[]>([]);
    const [essayQuestions, setEssayQuestions] = useState<EssayQuestion[]>([]);
    const [projectQuestions, setProjectQuestions] = useState<ProjectQuestion[]>([]);
    const [sectionWeights, setSectionWeights] = useState<SectionWeights>({ ...DEFAULT_SECTION_WEIGHTS });
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const SCORE_TOTAL = 100;

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
                const score = parseInt(qData["score"]) || 10;
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
                        score: score
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
            setTestTitle(existingTest.title || `Placement Test - ${classData.title}`);

            const initialCourseData: Record<string, CourseQuestions> = {};
            const initialThresholds: Record<string, number> = {};

            if (existingTest.assignmentItems) {
                existingTest.assignmentItems.forEach((item: any) => {
                    const cid = item.courseId;
                    if (!cid) return;

                    // Initialize threshold from assignment context if available
                    if (existingTest.thresholds) {
                        const t = existingTest.thresholds.find((th: any) => th.courseId === cid);
                        if (t) initialThresholds[cid] = t.threshold;
                    } else if (item.course && item.course.threshold !== undefined && !initialThresholds[cid]) {
                        initialThresholds[cid] = item.course.threshold;
                    }

                    if (!initialCourseData[cid]) {
                        initialCourseData[cid] = { objective: [], essay: [], project: [], saved: true };
                    }
                    if (item.type === "OBJECTIVE") {
                        const optionsArray = Array.isArray(item.options) ? item.options : [];
                        initialCourseData[cid].objective.push({
                            id: idRef.current++,
                            content: item.question,
                            answers: optionsArray.map((opt: string) => ({
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
                        const opts = item.options as any;
                        initialCourseData[cid].project.push({
                            id: idRef.current++,
                            content: item.question,
                            score: item.maxScore || 20,
                            attachments: Array.isArray(opts?.attachments) ? opts.attachments : (opts?.attachmentUrl ? [opts.attachmentUrl] : [])
                        });
                    }
                });
            }
            Object.keys(initialCourseData).forEach((cid) => {
                const d = initialCourseData[cid];
                d.sectionWeights = inferSectionWeightsFromQuestions(d.objective, d.essay, d.project);
            });
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
            setSectionWeights(
                existing.sectionWeights ??
                    inferSectionWeightsFromQuestions(existing.objective, existing.essay, existing.project),
            );
        } else {
            setObjectiveQuestions([makeObjectiveQuestion(idRef)]);
            setEssayQuestions([makeEssayQuestion(idRef)]);
            setProjectQuestions([]);
            setSectionWeights({ objective: 50, essay: 50, project: 0 });
        }

        // Initialize threshold if not set
        setThresholds(prev => {
            if (prev[course.id] === undefined) {
                return { ...prev, [course.id]: (course as any).threshold ?? 80 };
            }
            return prev;
        });

        setView("editor");
    };

    // ── Save editor ──────────────────────────────────────────────────────────
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
        setCourseData((prev) => ({
            ...prev,
            [selectedCourse!.id]: {
                objective: objectiveQuestions,
                essay: essayQuestions,
                project: projectQuestions,
                saved: true,
                sectionWeights: { ...sectionWeights },
            },
        }));

        setThresholds(prev => {
            const existing = prev[selectedCourse!.id];
            if (existing === undefined || existing === 0) {
                return { ...prev, [selectedCourse!.id]: Math.round(SCORE_TOTAL * 0.8) };
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

    const setWeight = (key: keyof SectionWeights, raw: string) => {
        const n = parseFloat(raw);
        const v = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
        setSectionWeights((prev) => ({ ...prev, [key]: v }));
    };

    const weightSum = sectionWeights.objective + sectionWeights.essay + sectionWeights.project;
    const weightSumError = Math.abs(weightSum - 100) > 0.01;

    // ── Submit overview ──────────────────────────────────────────────────────
    const handleCreate = async () => {
        const errs: typeof overviewErrors = {};
        if (!startDate) errs.startDate = "Start date is required.";
        if (!endTime) errs.endTime = "End time is required.";
        if (!testTitle.trim()) errs.title = "Title is required.";
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
            title: testTitle,
            classId: classData.id,
            type: "PLACEMENT",
            startDate: start,
            endDate: endTime || undefined,
            duration: durationMinutes,
        };

        const itemsPayload: any[] = [];

        Object.entries(courseData).forEach(([courseId, course]) => {
            if (!course.saved) return;

            const obj = course.objective.filter((q) => !isEmpty(q.content));
            const ess = course.essay.filter((q) => !isEmpty(q.content));
            const proj = course.project.filter((q) => !isEmpty(q.content));
            const w =
                course.sectionWeights ?? inferSectionWeightsFromQuestions(obj, ess, proj);

            itemsPayload.push(
                ...buildAssignmentItemsPayload(obj, ess, proj, w, parseInt(courseId, 10)),
            );
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
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_240px_240px] gap-4 items-start mb-2">

                            {/* Test Title — Editable */}
                            <div className="relative">
                                <NuraTextInput
                                    label="Test Title"
                                    value={testTitle}
                                    onChange={(e) => setTestTitle(e.target.value)}
                                    placeholder="Enter test title..."
                                    className={cn(overviewErrors.title ? "border-red-500" : "")}
                                    required
                                />
                                {overviewErrors.title && <p className="text-red-500 text-[10px] absolute mt-0.5">{overviewErrors.title}</p>}
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
                                onChange={(d) => { }} // Disabled for PLACEMENT
                                required
                                disabled
                                id="start-date-picker"
                            />

                            {/* End Time — M3 Time Picker */}
                            <M3DateTimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(v) => { }} // Disabled for PLACEMENT
                                required
                                disabled
                                id="end-time-picker"
                            />
                        </div>

                        <div className="mb-8 flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                <p className="text-[11px] text-gray-500 italic">
                                    Dates follow "Placement Test" milestones. Edit in <Link href={`/classes/${classData.id}/timeline/create`} target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:underline">class timeline</Link>.
                                </p>
                            </div>
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
                                const threshold = thresholds[selectedCourse.id] ?? 0;
                                const isError = threshold < 0 || threshold > SCORE_TOTAL;

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
                                            <span className="text-gray-400 text-sm font-medium shrink-0">/ {SCORE_TOTAL}</span>
                                        </div>
                                        {threshold > SCORE_TOTAL && (
                                            <span className="text-[10px] text-red-500 font-medium mt-1 italic">Cannot exceed max score ({SCORE_TOTAL})</span>
                                        )}
                                        {threshold < 0 && (
                                            <span className="text-[10px] text-red-500 font-medium mt-1 italic">Cannot be negative</span>
                                        )}
                                    </div>
                                );
                            })()}
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
                            <NuraButton label="Cancel" variant="secondary" onClick={() => { setView("overview"); }} />
                            <NuraButton label="Save" variant="primary" onClick={handleSave} id="save-course-questions-btn" />
                        </div>
                    </>
                )}

                <FileUploadModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onUploadSuccess={handleImportCSV}
                    title="Import Objective Questions"
                    accept=".csv"
                    supportedFileType=".csv"
                />
            </div>
        </main>
    );
}