"use client";

import { useState, useRef, useEffect } from "react";
import { useNuraRouter as useRouter } from "@/components/providers/navigation-provider";
import { CheckCircle } from "lucide-react";
import { addAssignment, editAssignment } from "@/app/actions/assignment";
import {
    fetchCoursesByClassIdAction,
    fetchSessionsByCourseIdAction,
    fetchExistingAssignmentAction
} from "@/app/actions/assignmentActions";
import { getClassesAction } from "@/app/actions/classes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import M3DateTimePicker from "@/components/ui/input/datetime_picker";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { NuraSelect } from "@/components/ui/input/nura_select";
import { FeedbackModal } from "@/components/ui/modal/feedback_modal";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import {
    TestEditor,
    makeObjectiveQuestion,
    makeEssayQuestion,
    validateQuestions,
    type ObjectiveQuestion,
    type EssayQuestion,
    type ProjectQuestion,
} from "@/components/assignment/test_editor";

import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";

// -- Types --

interface CourseQuestions {
    objective: ObjectiveQuestion[];
    essay: EssayQuestion[];
    project: ProjectQuestion[];
    saved: boolean;
}

// -- Main Client --

export function AddAssignmentClient({
    classes,
    initialAssignment,
    prefillData
}: {
    classes: any[],
    initialAssignment?: any,
    prefillData?: { classId?: number, courseId?: number, sessionId?: number, type?: string }
}) {
    const router = useRouter();
    const idRef = useRef(1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // View: "overview" | "editor" (PLACEMENT per-course) | "simple-editor" (other types)
    const [view, setView] = useState<"overview" | "editor" | "simple-editor">("overview");
    const [selectedCourseForEditor, setSelectedCourseForEditor] = useState<{ id: number; title: string } | null>(null);
    const [localClasses, setLocalClasses] = useState(classes);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshClassesList = async () => {
        setIsRefreshing(true);
        const res = await getClassesAction();
        if (res.success && res.classes) {
            setLocalClasses(res.classes);
        }
        setIsRefreshing(false);
    };

    useEffect(() => {
        const onFocus = () => {
            refreshClassesList();
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    // Overview fields
    const [title, setTitle] = useState("");
    const [assignmentType, setAssignmentType] = useState("");
    const [submissionType, setSubmissionType] = useState<"INDIVIDUAL" | "GROUP">("INDIVIDUAL");
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [duration, setDuration] = useState("");
    const [overviewErrors, setOverviewErrors] = useState<Record<string, string>>({});

    // Dynamic options
    const [courses, setCourses] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    // Existing test ID (if editing)
    const [existingTestId, setExistingTestId] = useState<number | null>(null);

    // PLACEMENT grouped data
    const [courseData, setCourseData] = useState<Record<string, CourseQuestions>>({});
    const [thresholds, setThresholds] = useState<Record<string, number>>({});

    // Editor state (PLACEMENT per-course)
    const [objectiveQuestions, setObjectiveQuestions] = useState<ObjectiveQuestion[]>([]);
    const [essayQuestions, setEssayQuestions] = useState<EssayQuestion[]>([]);
    const [projectQuestions, setProjectQuestions] = useState<ProjectQuestion[]>([]);

    // Simple questions (non-placement types)
    const [simpleObjective, setSimpleObjective] = useState<ObjectiveQuestion[]>([]);
    const [simpleEssay, setSimpleEssay] = useState<EssayQuestion[]>([]);
    const [simpleProject, setSimpleProject] = useState<ProjectQuestion[]>([]);

    // Modal & submitting
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDurationConfirm, setShowDurationConfirm] = useState(false);
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

    // ── Pre-fill from initialAssignment (when navigating from ProjectCard edit) ─
    useEffect(() => {
        if (initialAssignment) {
            const a = initialAssignment;

            // Set the dropdowns first
            setAssignmentType(a.type || "");
            if (a.classId) setSelectedClassId(a.classId);
            if (a.courseId) setSelectedCourseId(a.courseId);
            if (a.sessionId) setSelectedSessionId(a.sessionId);

            // Fetch courses for that class so session dropdowns work
            if (a.classId) {
                fetchCoursesByClassIdAction(a.classId).then(res => {
                    if (res.success && res.courses) setCourses(res.courses);
                });
            }

            // Load the question data and metadata (title, dates, submissionType, etc.)
            loadExistingTest(a, []);

            // Also fetch sessions if courseId is present
            if (a.courseId) {
                fetchSessionsByCourseIdAction(a.courseId).then(res => {
                    if (res.success && res.sessions) setSessions(res.sessions);
                });
            }
        } else if (prefillData) {
            if (prefillData.type) {
                setAssignmentType(prefillData.type);
                if (prefillData.type === "PRETEST") setTitle("Pre-Test");
                if (prefillData.type === "POSTTEST") setTitle("Post-Test");
                if (prefillData.type === "PRETEST" || prefillData.type === "POSTTEST") {
                    setSimpleObjective([makeObjectiveQuestion(idRef)]);
                }
            }
            if (prefillData.classId) setSelectedClassId(prefillData.classId);
            if (prefillData.courseId) setSelectedCourseId(prefillData.courseId);
            if (prefillData.sessionId) setSelectedSessionId(prefillData.sessionId);

            if (prefillData.classId) {
                fetchCoursesByClassIdAction(prefillData.classId).then(res => {
                    if (res.success && res.courses) setCourses(res.courses);
                });
            }
            if (prefillData.courseId) {
                fetchSessionsByCourseIdAction(prefillData.courseId).then(res => {
                    if (res.success && res.sessions) setSessions(res.sessions);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Type rules
    const isPlacement = assignmentType === "PLACEMENT";
    const currentClass = localClasses.find(c => c.id === selectedClassId);
    const isClassLevel = isPlacement || assignmentType === "PROJECT";
    const isCourseLevel = assignmentType === "EXERCISE" || assignmentType === "ASSIGNMENT";
    const isSessionLevel = assignmentType === "PRETEST" || assignmentType === "POSTTEST";
    const courseEnabled = isCourseLevel || isSessionLevel;
    const sessionEnabled = isSessionLevel;
    // ASSIGNMENT, EXERCISE and PROJECT support group/individual submission
    const hasSubmissionType = assignmentType === "ASSIGNMENT" || assignmentType === "PROJECT" || assignmentType === "EXERCISE";

    // ── Hierarchical handlers ────────────────────────────────────────────────

    useEffect(() => {
        if (currentClass && (assignmentType === "PLACEMENT" || assignmentType === "PROJECT")) {
            syncDatesFromTimeline(assignmentType, currentClass);
        }
    }, [currentClass, assignmentType]);

    const handleClassChange = async (val: string) => {
        const id = parseInt(val);
        if (id === selectedClassId) return;
        setSelectedClassId(id);
        setSelectedCourseId(null);
        setSelectedSessionId(null);
        setCourses([]);
        setSessions([]);
        setCourseData({});
        setThresholds({});
        setExistingTestId(null);
        setSimpleObjective([]);
        setSimpleEssay([]);
        setSimpleProject([]);
        setOverviewErrors(p => ({ ...p, classId: "" }));
        if (id) {
            const res = await fetchCoursesByClassIdAction(id);
            if (res.success && res.courses) {
                setCourses(res.courses);
                const cls = classes.find(c => c.id === id);
                if (cls) syncDatesFromTimeline(assignmentType, cls);
            }

            // Check for existing based on type
            triggerExistingCheck(assignmentType, id, null, null);
        }
    };

    const handleCourseChange = async (val: string) => {
        const id = parseInt(val);
        if (id === selectedCourseId) return;
        setSelectedCourseId(id);
        setSelectedSessionId(null);
        setSessions([]);
        setOverviewErrors(p => ({ ...p, courseId: "" }));
        if (id) {
            const res = await fetchSessionsByCourseIdAction(id);
            if (res.success) setSessions(res.sessions);

            triggerExistingCheck(assignmentType, selectedClassId, id, null);
        }
    };

    const handleTypeChange = async (val: string) => {
        if (val === assignmentType) return;
        setAssignmentType(val);
        setCourseData({});
        setThresholds({});
        setExistingTestId(null);
        setSimpleObjective([]);
        setSimpleEssay([]);
        setSimpleProject([]);
        setOverviewErrors({});

        // Reset submission type on type change
        setSubmissionType("INDIVIDUAL");

        // Auto-sync dates if type change involves Placement or Project
        if (currentClass) {
            syncDatesFromTimeline(val, currentClass);
        }

        if (selectedClassId) {
            triggerExistingCheck(val, selectedClassId, selectedCourseId, selectedSessionId);
        }
    };

    const syncDatesFromTimeline = (type: string, cls: any) => {
        if (!cls.timelines) return;
        if (type === "PLACEMENT") {
            const st = cls.timelines.find((t: any) => t.activity === "Placement Test Starts" || t.activity === "Placement test Starts");
            const et = cls.timelines.find((t: any) => t.activity === "Placement Test Ends" || t.activity === "Placement test Ends");
            if (st) setStartDate(new Date(st.date));
            if (et) setEndDate(new Date(et.date));
        } else if (type === "PROJECT") {
            const st = cls.timelines.find((t: any) => t.activity === "Project Starts" || t.activity === "project Starts" || t.activity === "Final Project Starts");
            const et = cls.timelines.find((t: any) => t.activity === "Project Ends" || t.activity === "project Ends" || t.activity === "Final Project Ends");
            if (st) setStartDate(new Date(st.date));
            if (et) setEndDate(new Date(et.date));
        }
    };

    const triggerExistingCheck = async (t: string, cid: number | null, coid: number | null, sid: number | null) => {
        if (!cid || !t) return;

        let shouldFetch = false;
        if (t === "PLACEMENT" || t === "PROJECT") shouldFetch = true;
        else if ((t === "ASSIGNMENT" || t === "EXERCISE") && coid) shouldFetch = true;
        else if ((t === "PRETEST" || t === "POSTTEST") && sid) shouldFetch = true;

        if (shouldFetch) {
            const res = await fetchExistingAssignmentAction({
                classId: cid,
                courseId: (t === "PLACEMENT" || t === "PROJECT") ? null : coid,
                sessionId: (t === "PRETEST" || t === "POSTTEST") ? sid : null,
                type: t as any
            });
            if (res.success && res.test) {
                loadExistingTest(res.test, courses);
            }
        }
    };

    const loadExistingTest = (test: any, classCourses: any[]) => {
        setExistingTestId(test.id);
        setTitle(test.title || "");
        setSubmissionType(test.submissionType === "GROUP" ? "GROUP" : "INDIVIDUAL");
        setStartDate(test.startDate ? new Date(test.startDate) : null);
        setEndDate(test.endDate ? new Date(test.endDate) : null);
        setDuration(test.duration?.toString() || "");

        if (test.type === "PLACEMENT") {
            const newData: Record<string, CourseQuestions> = {};
            const newThresholds: Record<string, number> = {};

            test.assignmentItems.forEach((item: any) => {
                if (!item.courseId) return;
                if (!newData[item.courseId]) {
                    newData[item.courseId] = { objective: [], essay: [], project: [], saved: true };
                }
                const q: any = {
                    id: item.id,
                    content: item.question,
                    score: item.maxScore || 10,
                    attachments: item.options?.attachments || [],
                    answers: (item.options || []).map((text: string) => ({
                        id: idRef.current++,
                        text: text,
                        isCorrect: text === item.correctAnswer
                    }))
                };
                if (item.type === "OBJECTIVE") newData[item.courseId].objective.push(q);
                else if (item.type === "ESSAY") newData[item.courseId].essay.push(q);
                else if (item.type === "PROJECT") newData[item.courseId].project.push(q);
            });

            classCourses.forEach(c => {
                if (c.threshold !== null) newThresholds[c.id] = c.threshold;
            });

            setCourseData(newData);
            setThresholds(newThresholds);
        } else {
            // Simple editor types
            const obj: ObjectiveQuestion[] = [];
            const ess: EssayQuestion[] = [];
            const pro: ProjectQuestion[] = [];

            test.assignmentItems.forEach((item: any) => {
                const q = {
                    id: item.id,
                    content: item.question,
                    score: item.maxScore || 10,
                    attachments: item.options?.attachments || []
                };
                if (item.type === "OBJECTIVE") {
                    (q as any).answers = (item.options || []).map((text: string) => ({
                        id: idRef.current++,
                        text: text,
                        isCorrect: text === item.correctAnswer
                    }));
                    obj.push(q as any);
                } else if (item.type === "ESSAY") ess.push(q as any);
                else if (item.type === "PROJECT") pro.push(q as any);
            });

            setSimpleObjective(obj);
            setSimpleEssay(ess);
            setSimpleProject(pro);
            if (test.passingGrade !== null) {
                setThresholds({ "-1": test.passingGrade });
            }
        }
    };

    // ── PLACEMENT editor handlers ────────────────────────────────────────────

    const handleAddItem = (course: any) => {
        setSelectedCourseForEditor({ id: course.id, title: course.title });
        const existing = courseData[course.id];
        if (existing && (existing.objective.length > 0 || existing.essay.length > 0 || existing.project.length > 0)) {
            // Clone arrays to ensure React detects a fresh reference for state update
            setObjectiveQuestions([...existing.objective]);
            setEssayQuestions([...existing.essay]);
            setProjectQuestions([...existing.project]);
        } else {
            setObjectiveQuestions([makeObjectiveQuestion(idRef)]);
            setEssayQuestions([makeEssayQuestion(idRef)]);
            setProjectQuestions([]);
        }
        setView("editor");
    };

    const handleEditorSave = (
        objective: ObjectiveQuestion[],
        essay: EssayQuestion[],
        project: ProjectQuestion[]
    ) => {
        const max =
            objective.reduce((a, b) => a + b.score, 0) +
            essay.reduce((a, b) => a + b.score, 0) +
            project.reduce((a, b) => a + b.score, 0);

        setCourseData(prev => ({
            ...prev,
            [selectedCourseForEditor!.id]: { objective, essay, project, saved: true },
        }));

        setThresholds(prev => {
            const existing = prev[selectedCourseForEditor!.id];
            if (existing === undefined || existing === 0) {
                return { ...prev, [selectedCourseForEditor!.id]: Math.round(max * 0.8) };
            }
            return prev;
        });

        showModal({
            open: true,
            type: "success",
            title: "Questions Saved!",
            message: `Questions for "${selectedCourseForEditor!.title}" have been saved successfully.`,
            closeText: "Continue",
            onConfirm: () => { closeModal(); setView("overview"); },
            confirmText: "Back to Overview",
        });
    };

    // ── Simple editor (non-placement) handlers ───────────────────────────────

    const handleOpenSimpleEditor = () => {
        // Find the title for the editor (either the selected session/course or the assignment type)
        let editorTitle = assignmentType.replace(/_/g, " ");
        if (sessionEnabled && selectedSessionId) {
            editorTitle = sessions.find(s => s.id === selectedSessionId)?.title || editorTitle;
        } else if (courseEnabled && selectedCourseId) {
            editorTitle = courses.find(c => c.id === selectedCourseId)?.title || editorTitle;
        }
        setSelectedCourseForEditor({ id: -1, title: editorTitle });

        // Initialize with default blocks if empty to match PLACEMENT journey
        if (simpleObjective.length === 0 && simpleEssay.length === 0 && simpleProject.length === 0) {
            setSimpleObjective([makeObjectiveQuestion(idRef)]);
            setSimpleEssay([makeEssayQuestion(idRef)]);
        }
        setView("simple-editor");
    };

    const handleSimpleEditorSave = (
        objective: ObjectiveQuestion[],
        essay: EssayQuestion[],
        project: ProjectQuestion[]
    ) => {
        setSimpleObjective(objective);
        setSimpleEssay(essay);
        setSimpleProject(project);

        const total = objective.length + essay.length + project.length;
        // The thresholds state is already updated inside TestEditor for both placement and simple types

        showModal({
            open: true,
            type: "success",
            title: "Questions Saved!",
            message: `${total} question${total !== 1 ? "s" : ""} saved successfully.`,
            closeText: "Continue",
            onConfirm: () => { closeModal(); setView("overview"); },
            confirmText: "Back to Overview",
        });
    };

    // Fake course for the simple editor (no per-course threshold needed)
    const simpleFakeCourse = { id: -1, title: assignmentType.replace("_", " ") };
    const [simpleThresholds, setSimpleThresholds] = useState<Record<string, number>>({});

    // ── Create handler ───────────────────────────────────────────────────────

    const handleCreate = async () => {
        const errs: Record<string, string> = {};
        if (!title) errs.title = "Title is required.";
        if (!assignmentType) errs.type = "Type is required.";
        if (!selectedClassId) errs.classId = "Class is required.";
        if (courseEnabled && !selectedCourseId) errs.courseId = "Course is required.";
        if (sessionEnabled && !selectedSessionId) errs.sessionId = "Session is required.";
        if (!startDate) errs.startDate = "Start date is required.";
        if (!endDate) errs.endDate = "End date is required.";
        if (startDate && endDate && endDate <= startDate) errs.endDate = "End date must be after start date.";

        const questionErrs: string[] = [];
        if (isPlacement) {
            if (Object.values(courseData).filter(d => d.saved).length === 0)
                questionErrs.push("Configure at least one course's questions.");
        } else if (assignmentType) {
            const total = simpleObjective.length + simpleEssay.length + simpleProject.length;
            if (total === 0) questionErrs.push("At least one question is required.");
            questionErrs.push(...validateQuestions(simpleObjective, simpleEssay, simpleProject));
        }

        setOverviewErrors(errs);

        const allErrs = [...Object.values(errs).filter(Boolean), ...questionErrs];

        if (allErrs.length > 0) {
            showModal({
                open: true,
                type: "error",
                title: "Incomplete Form",
                message: "Please fix the issues before creating.",
                errors: allErrs,
                closeText: "Back to Edit",
            });
            return;
        }

        // If duration is empty, show confirmation
        if (!duration) {
            setShowDurationConfirm(true);
            return;
        }

        executeCreate();
    };

    const executeCreate = async () => {
        setIsSubmitting(true);
        setShowDurationConfirm(false);

        const payload = {
            title,
            classId: selectedClassId,
            courseId: isClassLevel ? null : selectedCourseId,
            sessionId: sessionEnabled ? selectedSessionId : null,
            type: assignmentType,
            submissionType: hasSubmissionType ? submissionType : null,
            startDate: startDate,
            endDate: endDate,
            duration: duration ? parseInt(duration) : 0,
            passingGrade: thresholds["-1"] || 0,
        };

        const items: any[] = [];
        if (isPlacement) {
            Object.entries(courseData).forEach(([cid, data]) => {
                const cId = parseInt(cid);
                data.objective.forEach(q => items.push({ courseId: cId, type: "OBJECTIVE", question: q.content, maxScore: q.score, options: q.answers.map(a => a.text), correctAnswer: q.answers.find(a => a.isCorrect)?.text || "" }));
                data.essay.forEach(q => items.push({ courseId: cId, type: "ESSAY", question: q.content, maxScore: q.score }));
                data.project.forEach(q => items.push({ 
                    courseId: cId, 
                    type: "PROJECT", 
                    question: q.content, 
                    maxScore: q.score,
                    options: { attachments: q.attachments || [] }
                }));
            });
        } else {
            const baseCId = isClassLevel ? null : selectedCourseId;
            simpleObjective.forEach(q => items.push({ courseId: baseCId, type: "OBJECTIVE", question: q.content, maxScore: q.score, options: q.answers.map(a => a.text), correctAnswer: q.answers.find(a => a.isCorrect)?.text || "" }));
            simpleEssay.forEach(q => items.push({ courseId: baseCId, type: "ESSAY", question: q.content, maxScore: q.score }));
            simpleProject.forEach(q => items.push({ 
                courseId: baseCId, 
                type: "PROJECT", 
                question: q.content, 
                maxScore: q.score,
                options: { attachments: q.attachments || [] }
            }));
        }

        const thresholdsPayload = isPlacement
            ? Object.entries(thresholds).map(([cid, val]) => ({ courseId: parseInt(cid), threshold: val }))
            : [];

        const res = existingTestId
            ? await editAssignment(existingTestId, payload, items, thresholdsPayload)
            : await addAssignment(payload, items, thresholdsPayload);

        setIsSubmitting(false);

        if (res.success) {
            setExistingTestId(res.assignmentId); // Immediately switch to Edit mode
            showModal({
                open: true,
                type: "success",
                title: existingTestId ? "Assignment Updated! 🎉" : "Assignment Created! 🎉",
                message: existingTestId ? "Your assignment has been updated successfully." : "Your assignment has been created successfully.",
                closeText: "Stay Here",
                onConfirm: () => { closeModal(); router.push("/assignment"); },
                confirmText: "Go to Assignments",
            });
        } else {
            showModal({
                open: true,
                type: "error",
                title: existingTestId ? "Update Failed" : "Creation Failed",
                message: res.error || `Failed to ${existingTestId ? 'update' : 'create'} assignment. Please try again.`,
                closeText: "Close",
            });
        }
    };

    // ── Breadcrumbs ──────────────────────────────────────────────────────────

    const breadcrumbBase = [
        { label: "Home", href: "/classes" },
        { label: "Assignment", href: "/assignment" },
        { label: "Add Assignment", href: "#" },
    ];

    const savedCount = Object.values(courseData).filter(d => d.saved).length;
    const TOTAL_COURSES = currentClass?.courses?.length || 0;
    const simpleTotal = simpleObjective.length + simpleEssay.length + simpleProject.length;

    // ── Render ───────────────────────────────────────────────────────────────

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

            {/* Duration Confirmation Modal */}
            <ConfirmModal
                isOpen={showDurationConfirm}
                title="Unlimited Duration"
                message="Duration is empty, want to continue? Learners can do the assignment with unlimited time."
                onConfirm={executeCreate}
                onCancel={() => setShowDurationConfirm(false)}
                confirmText="Yes, Continue"
                cancelText="No, Go Back"
                isLoading={isSubmitting}
            />

            <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-10 py-8">

                {/* ══ OVERVIEW VIEW ══════════════════════════════════════════ */}
                {view === "overview" && (
                    <>
                        <Breadcrumb items={breadcrumbBase} />
                        <h1 className="text-2xl font-medium mt-6 mb-6">Add Assignment</h1>

                        {/* ── Row 1: Title, Duration and Dates ── */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start mb-6">
                            <NuraTextInput
                                label="Assignment Title"
                                required
                                value={title}
                                onChange={e => { setTitle(e.target.value); setOverviewErrors(p => ({ ...p, title: "" })); }}
                                placeholder="e.g. Week 1 Assignment"
                                className={overviewErrors.title ? "border-orange-400 ring-1 ring-orange-400" : ""}
                            />
                            
                            <NuraTextInput
                                label="Duration (minutes)"
                                value={duration}
                                onChange={e => { setDuration(e.target.value); setOverviewErrors(p => ({ ...p, duration: "" })); }}
                                placeholder="60"
                                variant="number"
                                className={overviewErrors.duration ? "border-orange-400 ring-1 ring-orange-400" : ""}
                            />

                            <M3DateTimePicker
                                label="Start Date"
                                required
                                value={startDate}
                                onChange={(d) => { setStartDate(d); setOverviewErrors(p => ({ ...p, startDate: "" })); }}
                                error={overviewErrors.startDate}
                                minDate={today}
                                disabled={isPlacement || assignmentType === "PROJECT"}
                            />

                            <M3DateTimePicker
                                label="End Date"
                                required
                                value={endDate}
                                onChange={(d) => { setEndDate(d); setOverviewErrors(p => ({ ...p, endDate: "" })); }}
                                error={overviewErrors.endDate}
                                minDate={startDate || today}
                                disabled={isPlacement || assignmentType === "PROJECT"}
                            />
                        </div>

                        {(isPlacement || assignmentType === "PROJECT") && selectedClassId && (
                            <div className="mb-8 flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <div className="flex items-center gap-2 px-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                    <p className="text-[11px] text-gray-500 italic">
                                        Dates follow "{isPlacement ? "Placement Test" : "Final Project"}" milestones.
                                        Edit in <Link href={`/classes/${selectedClassId}/timeline/create`} target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:underline px-1">class timeline</Link>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error messages for non-M3 picker inputs */}
                        {(overviewErrors.title || overviewErrors.duration) && (
                            <div className="grid grid-cols-4 gap-6 -mt-4 mb-6">
                                <div className="col-span-1">
                                    {overviewErrors.title && <p className="text-orange-500 text-xs mt-1">{overviewErrors.title}</p>}
                                </div>
                                <div className="col-span-1">
                                    {overviewErrors.duration && <p className="text-orange-500 text-xs mt-1">{overviewErrors.duration}</p>}
                                </div>
                            </div>
                        )}

                        {/* ── Row 2: Type + Submission ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
                            <NuraSelect
                                label="Assignment Type"
                                value={assignmentType}
                                onChange={handleTypeChange}
                                placeholder="Select type..."
                                options={[
                                    { label: "Placement Test", value: "PLACEMENT" },
                                    { label: "Pre Test", value: "PRETEST" },
                                    { label: "Post Test", value: "POSTTEST" },
                                    { label: "Assignment", value: "ASSIGNMENT" },
                                    { label: "Exercise", value: "EXERCISE" },
                                    { label: "Final Project", value: "PROJECT" },
                                ]}
                            />

                            {/* Submission Type — only for ASSIGNMENT / PROJECT */}
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${!hasSubmissionType ? "text-gray-300" : "text-black"}`}>
                                    Submission Method
                                </label>
                                <div className={`flex rounded-xl border overflow-hidden h-[42px] text-sm font-medium transition-all ${!hasSubmissionType ? "opacity-30 pointer-events-none border-gray-200" : "border-black shadow-sm"}`}>
                                    <button
                                        type="button"
                                        onClick={() => setSubmissionType("INDIVIDUAL")}
                                        className={`flex-1 px-4 transition-all ${submissionType === "INDIVIDUAL" ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                                    >
                                        Individual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSubmissionType("GROUP")}
                                        className={`flex-1 px-4 transition-all border-l border-gray-100 ${submissionType === "GROUP" ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                                    >
                                        Group
                                    </button>
                                </div>
                            </div>
                        </div>
                        {overviewErrors.type && <p className="text-orange-500 text-xs -mt-6 mb-6">{overviewErrors.type}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-8">
                            <NuraSelect
                                label="Target Class"
                                value={selectedClassId?.toString() || ""}
                                onChange={handleClassChange}
                                placeholder="Select class..."
                                options={classes.map(c => ({ label: c.title, value: c.id.toString() }))}
                                disabled={!assignmentType}
                            />

                            <NuraSelect
                                label="Core Course"
                                value={selectedCourseId?.toString() || ""}
                                onChange={handleCourseChange}
                                placeholder="Select course..."
                                options={courses.map(c => ({ label: c.title, value: c.id.toString() }))}
                                disabled={!courseEnabled || !selectedClassId}
                            />

                            <NuraSelect
                                label="Linked Session"
                                value={selectedSessionId?.toString() || ""}
                                onChange={v => {
                                    const sid = parseInt(v);
                                    setSelectedSessionId(sid);
                                    setOverviewErrors(p => ({ ...p, sessionId: "" }));
                                    triggerExistingCheck(assignmentType, selectedClassId, selectedCourseId, sid);
                                }}
                                placeholder="Select session..."
                                options={sessions.map(s => ({ label: s.title, value: s.id.toString() }))}
                                disabled={!sessionEnabled || !selectedCourseId}
                            />
                        </div>
                        {/* More Error Messages */}
                        {(overviewErrors.classId || overviewErrors.courseId || overviewErrors.sessionId) && (
                            <div className="grid grid-cols-3 gap-6 -mt-6 mb-8">
                                <div className="col-span-1">
                                    {overviewErrors.classId && <p className="text-orange-500 text-xs mt-1">{overviewErrors.classId}</p>}
                                </div>
                                <div className="col-span-1">
                                    {overviewErrors.courseId && <p className="text-orange-500 text-xs mt-1">{overviewErrors.courseId}</p>}
                                </div>
                                <div className="col-span-1">
                                    {overviewErrors.sessionId && <p className="text-orange-500 text-xs mt-1">{overviewErrors.sessionId}</p>}
                                </div>
                            </div>
                        )}

                        {/* ── Question Section ── */}
                        {selectedClassId && assignmentType && (
                            <>
                                {isPlacement ? (
                                    /* ── PLACEMENT: per-course question cards ── */
                                    <>
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="text-sm font-medium">Course Questions</h2>
                                            {savedCount > 0 && (
                                                <span className="text-xs text-gray-500 bg-[#F0F5D8] px-3 py-1 rounded-full">
                                                    {savedCount} / {TOTAL_COURSES} courses configured
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-[#F2F5DC] rounded-[2rem] p-5 space-y-3 mb-10">
                                            {(currentClass?.courses || []).map((course: any) => {
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
                                                        <NuraButton
                                                            label={saved ? "Edit" : "Add Item"}
                                                            variant={saved ? "secondary" : "primary"}
                                                            className={saved ? "!h-10 !min-w-[80px] !text-sm" : "!h-10 !min-w-[120px] !text-sm"}
                                                            onClick={() => handleAddItem(course)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                            {(!currentClass?.courses || currentClass.courses.length === 0) && (
                                                <p className="text-sm text-gray-400 text-center py-4">No courses found for this class.</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    /* ── Non-PLACEMENT: single question set card ── */
                                    <>
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="text-sm font-semibold">Questions</h2>
                                            {simpleTotal > 0 && (
                                                <span className="text-xs text-gray-500 bg-[#F0F5D8] px-3 py-1 rounded-full">
                                                    {simpleTotal} question{simpleTotal !== 1 ? "s" : ""} added
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-[#F2F5DC] rounded-xl p-5 mb-10">
                                            <div className={`bg-white rounded-xl px-5 py-3.5 flex items-center justify-between shadow-sm transition-all ${simpleTotal > 0 ? "ring-2 ring-[#D9F55C]/60" : ""}`}>
                                                <div className="flex items-center gap-3">
                                                    {simpleTotal > 0 && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-800">
                                                            {assignmentType.replace(/_/g, " ")}
                                                        </span>
                                                        {simpleTotal > 0 && (
                                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                                {simpleTotal} question{simpleTotal !== 1 ? "s" : ""} added
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <NuraButton
                                                    label={simpleTotal > 0 ? "Edit" : "Add Questions"}
                                                    variant={simpleTotal > 0 ? "secondary" : "primary"}
                                                    className={simpleTotal > 0 ? "!h-10 !min-w-[80px] !text-sm" : "!h-10 !min-w-[160px] !text-sm"}
                                                    onClick={handleOpenSimpleEditor}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* Footer */}
                        <div className="flex justify-end items-center gap-4">
                            <NuraButton label="Cancel" variant="secondary" onClick={() => router.back()} disabled={isSubmitting} />
                            <NuraButton
                                label={isSubmitting ? "Saving..." : (existingTestId ? "Update Assignment" : "Create Assignment")}
                                variant="primary"
                                onClick={handleCreate}
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                            />
                        </div>
                    </>
                )}

                {/* ══ PLACEMENT EDITOR VIEW ══════════════════════════════════ */}
                {view === "editor" && selectedCourseForEditor && (
                    <>
                        <Breadcrumb items={[...breadcrumbBase, { label: selectedCourseForEditor.title, href: "#" }]} />
                        <h1 className="text-2xl font-medium mt-6 mb-6">Add Assignment</h1>

                        <TestEditor
                            selectedCourse={selectedCourseForEditor}
                            objectiveQuestions={objectiveQuestions}
                            setObjectiveQuestions={setObjectiveQuestions}
                            essayQuestions={essayQuestions}
                            setEssayQuestions={setEssayQuestions}
                            projectQuestions={projectQuestions}
                            setProjectQuestions={setProjectQuestions}
                            thresholds={thresholds}
                            setThresholds={setThresholds}
                            idRef={idRef}
                            onSave={handleEditorSave}
                            onCancel={() => setView("overview")}
                            showModal={showModal}
                        />
                    </>
                )}

                {/* ══ SIMPLE EDITOR VIEW (non-placement) ═════════════════════ */}
                {view === "simple-editor" && selectedCourseForEditor && (
                    <>
                        <Breadcrumb items={[...breadcrumbBase, { label: selectedCourseForEditor.title, href: "#" }]} />
                        <h1 className="text-2xl font-medium mt-6 mb-6">Add Assignment</h1>

                        <TestEditor
                            selectedCourse={selectedCourseForEditor}
                            objectiveQuestions={simpleObjective}
                            setObjectiveQuestions={setSimpleObjective}
                            essayQuestions={simpleEssay}
                            setEssayQuestions={setSimpleEssay}
                            projectQuestions={simpleProject}
                            setProjectQuestions={setSimpleProject}
                            thresholds={simpleThresholds}
                            setThresholds={setSimpleThresholds}
                            idRef={idRef}
                            onSave={handleSimpleEditorSave}
                            onCancel={() => setView("overview")}
                            showModal={showModal}
                        />
                    </>
                )}
            </div>
        </main>
    );
}
