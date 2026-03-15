"use client"

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { RichTextInput } from "@/components/ui/input/rich_text_input";
import { M3DateTimePicker, M3TimePicker } from "@/components/ui/input/datetime_picker";
import { FeedbackModal } from "@/components/ui/modal/feedback_modal";
import { SubmissionType } from "@prisma/client";
import { upsertCourse } from "@/app/actions/course";

interface ProjectFormClientProps {
    classData: any;
    courseData?: any;
    initialType?: string;
}

interface TaskItem {
    id: number;
    content: string;
    score: number;
}

export function ProjectFormClient({ classData, courseData, initialType }: ProjectFormClientProps) {
    const router = useRouter();
    const idRef = useRef(1);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: courseData?.title || "",
        description: courseData?.description || "",
        learningObjectives: courseData?.learningObjectives || "",
        entrySkills: courseData?.entrySkills || "",
        tools: courseData?.tools || "",
        type: courseData?.type || initialType || "FINAL_PROJECT",
        // Project specific (Assignment mapping)
        submissionType: (courseData?.assignments?.[0]?.submissionType as SubmissionType) || "INDIVIDUAL",
        startDate: courseData?.assignments?.[0]?.startDate ? new Date(courseData.assignments[0].startDate) : null,
        deadlineDate: courseData?.assignments?.[0]?.endDate ? new Date(courseData.assignments[0].endDate) : null,
        deadlineTime: courseData?.assignments?.[0]?.endDate 
            ? new Date(courseData.assignments[0].endDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) 
            : "",
        passingGrade: courseData?.assignments?.[0]?.passingGrade || 0,
    });

    const [taskItems, setTaskItems] = useState<TaskItem[]>(() => {
        const existingItems = courseData?.assignments?.[0]?.assignmentItems || [];
        if (existingItems.length > 0) {
            return existingItems.map((item: any) => ({
                id: idRef.current++,
                content: item.question,
                score: item.maxScore || 0
            }));
        }
        return [{ id: idRef.current++, content: "", score: 0 }];
    });

    const [modal, setModal] = useState<{ open: boolean, type: "success" | "error", title: string, message: string }>({
        open: false,
        type: "success",
        title: "",
        message: ""
    });

    const handleFieldChange = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleAddTask = () => {
        setTaskItems(prev => [...prev, { id: idRef.current++, content: "", score: 0 }]);
    };

    const handleRemoveTask = (id: number) => {
        if (taskItems.length <= 1) return;
        setTaskItems(prev => prev.filter(t => t.id !== id));
    };

    const handleTaskChange = (id: number, field: keyof TaskItem, value: any) => {
        setTaskItems(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            setModal({ open: true, type: "error", title: "Missing Title", message: "Please enter a project title." });
            return;
        }

        if (!form.deadlineDate || !form.deadlineTime) {
            setModal({ open: true, type: "error", title: "Missing Deadline", message: "Please set a deadline date and time." });
            return;
        }

        setIsSubmitting(true);

        const deadline = new Date(form.deadlineDate);
        const [hours, minutes] = form.deadlineTime.split(":");
        deadline.setHours(parseInt(hours), parseInt(minutes));

        const payload = {
            ...form,
            deadline,
            taskItems: taskItems.map(t => ({
                question: t.content,
                maxScore: t.score,
                type: "PROJECT"
            }))
        };

        const res = await upsertCourse(classData.id, courseData?.id || null, payload);
        setIsSubmitting(false);

        if (res.success) {
            setModal({
                open: true,
                type: "success",
                title: courseData ? "Project Updated! 🎉" : "Project Created! 🎉",
                message: courseData ? "Your project has been updated." : "Your project has been added to the class.",
            });
        } else {
            setModal({
                open: true,
                type: "error",
                title: "Save Failed",
                message: res.error || "Failed to save project.",
            });
        }
    };

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: classData.title, href: `/classes/${classData.id}/overview` },
        { label: courseData ? "Edit Project" : "Add Project", href: "#" },
    ];

    const currentMaxScore = taskItems.reduce((acc, t) => acc + t.score, 0);

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800 overflow-hidden">
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none select-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none select-none z-0" />

            <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 relative z-10 flex flex-col">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-2xl font-bold mt-6 mb-8">{courseData ? "Edit Project" : "Add Project"}</h1>

                {/* Assignment Style Config */}
                <div className="bg-[#F2F5DC] rounded-[2rem] p-8 mb-8 space-y-6 shadow-sm border border-[#EBF2D5]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Submission Type</label>
                            <div className="flex gap-2 p-1 bg-white/50 rounded-xl border border-gray-100">
                                <button
                                    onClick={() => handleFieldChange("submissionType", "INDIVIDUAL")}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${form.submissionType === "INDIVIDUAL" ? "bg-[#005954] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                    Individual
                                </button>
                                <button
                                    onClick={() => handleFieldChange("submissionType", "GROUP")}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${form.submissionType === "GROUP" ? "bg-[#005954] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                    Group
                                </button>
                            </div>
                        </div>
                        <M3DateTimePicker
                            label="Start Date (Optional)"
                            value={form.startDate}
                            onChange={(val) => handleFieldChange("startDate", val)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <M3DateTimePicker
                                label="Deadline Date"
                                value={form.deadlineDate}
                                onChange={(val) => handleFieldChange("deadlineDate", val)}
                                required
                            />
                            <M3TimePicker
                                label="Deadline Time"
                                value={form.deadlineTime}
                                onChange={(val) => handleFieldChange("deadlineTime", val)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Passing Grade (out of {currentMaxScore})</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white"
                                value={form.passingGrade}
                                onChange={(e) => handleFieldChange("passingGrade", Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div>
                        <NuraTextInput
                            label="Project Title"
                            placeholder="Enter project title"
                            value={form.title}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-gray-700">Project Description</label>
                        <RichTextInput
                            value={form.description}
                            onChange={(val) => handleFieldChange("description", val)}
                        />
                    </div>
                </div>

                {/* Task Items Section */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                        Task Items
                        <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Manual Review</span>
                    </h2>
                    
                    {taskItems.map((item, index) => (
                        <div key={item.id} className="bg-[#F0F5D8] rounded-2xl p-5 mb-4 border border-transparent">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700">Task Item {index + 1}</span>
                                <button 
                                    onClick={() => handleRemoveTask(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-white"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                            <RichTextInput 
                                value={item.content} 
                                onChange={(val) => handleTaskChange(item.id, "content", val)} 
                            />
                            <div className="mt-4 flex items-center gap-3">
                                <label className="text-xs font-medium text-gray-500 shrink-0">Score</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={item.score || ""}
                                    placeholder="e.g. 50"
                                    onChange={(e) => handleTaskChange(item.id, "score", Number(e.target.value))}
                                    className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F55C] bg-white"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddTask}
                        className="w-full py-3.5 text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50"
                    >
                        <Plus size={16} /> Add Task Item
                    </button>
                </div>

                {/* Hidden Fields for Compatibility */}
                <div className="hidden">
                    <RichTextInput value={form.learningObjectives} onChange={v => handleFieldChange("learningObjectives", v)} />
                    <RichTextInput value={form.entrySkills} onChange={v => handleFieldChange("entrySkills", v)} />
                    <RichTextInput value={form.tools} onChange={v => handleFieldChange("tools", v)} />
                </div>

                <div className="mt-12 flex justify-end gap-4 border-t border-gray-100 pt-6 w-full">
                    <NuraButton label="Cancel" variant="secondary" onClick={() => router.back()} disabled={isSubmitting} />
                    <NuraButton 
                        label={isSubmitting ? "Saving..." : (courseData ? "Save Changes" : "Create Project")} 
                        variant="primary" 
                        onClick={handleSubmit} 
                        disabled={isSubmitting} 
                    />
                </div>
            </div>

            <FeedbackModal
                isOpen={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => modal.type === "success" ? router.push(`/classes/${classData.id}/overview`) : setModal(m => ({ ...m, open: false }))}
                onConfirm={() => modal.type === "success" ? router.push(`/classes/${classData.id}/overview`) : setModal(m => ({ ...m, open: false }))}
                confirmText={modal.type === "success" ? "Go to Overview" : "Close"}
            />
        </main>
    );
}
