"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { addAssignment } from "@/app/actions/assignment";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import { M3DateTimePicker, M3TimePicker } from "@/components/ui/input/datetime_picker";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { NuraSelect } from "@/components/ui/input/nura_select";
import { NuraTextArea } from "@/components/ui/input/text_area";

export function AddAssignmentClient({ classes }: { classes: any[] }) {
    const router = useRouter();

    // Step 1 State: Test Config
    const [classTitleSearch, setClassTitleSearch] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<string>("");

    // Step 1: Courses
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [courseQuestions, setCourseQuestions] = useState<any[]>([]);

    const handleClassSelect = (classIdStr: string) => {
        const id = parseInt(classIdStr);
        setSelectedClassId(id);

        const selectedClass = classes.find((c: any) => c.id === id);
        if (selectedClass && selectedClass.courses) {
            setCourseQuestions(selectedClass.courses);
        } else {
            setCourseQuestions([]);
        }
    };

    // UI Step Control
    // 1 = Test Config Overview
    // 2 = Question Config (Detail view for a specific course)
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

    // Step 2 State: Questions
    const [objectiveQuestions, setObjectiveQuestions] = useState<any[]>([{ id: 1 }]);
    const [essayQuestions, setEssayQuestions] = useState<any[]>([{ id: 1 }, { id: 2 }]);
    const [projectQuestions, setProjectQuestions] = useState<any[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateClick = async () => {
        if (!selectedClassId || !startDate || !endTime) {
            alert("Please complete the Test Configuration (Class, Start Date, End Time).");
            return;
        }

        setIsSubmitting(true);

        // Combine startDate and endTime into a proper UTC date object
        const start = new Date(startDate);
        const [hours, minutes] = endTime.split(":");
        start.setHours(parseInt(hours, 10), parseInt(minutes, 10));

        // Create the base assignment payload
        const payload = {
            classId: selectedClassId,
            type: "PLACEMENT", // Default based on page title
            startDate: start,
        };

        const itemsPayload: any[] = [];

        // In a complete implementation, these states would be tracked *per course*. 
        // For the sake of the wizard, we dump the current global tracking into the placement test items.
        objectiveQuestions.forEach((q) => {
            if (q.question) {
                itemsPayload.push({
                    type: "OBJECTIVE",
                    question: q.question,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer || "",
                    maxScore: parseFloat(q.score || "20")
                });
            }
        });

        essayQuestions.forEach((q) => {
            if (q.question) {
                itemsPayload.push({
                    type: "ESSAY",
                    question: q.question,
                    maxScore: parseFloat(q.score || "20")
                });
            }
        });

        projectQuestions.forEach((q) => {
            if (q.question) {
                itemsPayload.push({
                    type: "PROJECT",
                    question: q.question,
                    maxScore: parseFloat(q.score || "20")
                });
            }
        });

        const res = await addAssignment(payload, itemsPayload);
        setIsSubmitting(false);

        if (res.success) {
            router.push(`/classes/${selectedClassId}/overview`);
        } else {
            alert(res.error || "Failed to create test");
        }
    };

    const handleSaveCourseQuestions = () => {
        // Validation could go here
        setCurrentStep(1);
    }

    if (currentStep === 2) {
        const activeCourse = courseQuestions.find(c => c.id === activeCourseId);

        return (
            <div className="flex flex-col gap-8 w-full mt-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1">Objective Questions</h2>

                    {objectiveQuestions.map((oq, index) => (
                        <div key={oq.id} className="bg-[#FCFCF2] rounded-[1.5rem] p-6 border border-[#EBF2D5] flex flex-col gap-4 relative">
                            <div className="flex justify-between items-center bg-transparent border-b border-[#EBF2D5] pb-3 mb-2">
                                <span className="text-sm font-semibold text-gray-800">Question {index + 1}</span>
                                <button className="text-gray-500 hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <NuraTextArea
                                label=""
                                value=""
                                placeholder="Objective questions"
                                className="w-full bg-white min-h-[100px]"
                            />

                            <span className="text-sm font-semibold text-gray-800 mt-2">Answer</span>
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4].map((ansIndex) => (
                                    <div key={ansIndex} className="grid grid-cols-[1fr_140px] gap-4">
                                        <NuraTextInput placeholder="Answer" className="w-full h-10 border-gray-200" />
                                        <div className="relative">
                                            <NuraSelect
                                                options={[{ label: "True", value: "true" }, { label: "False", value: "false" }]}
                                                placeholder="True / False"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <span className="text-sm font-semibold text-gray-800 mt-2">Score</span>
                            <NuraTextInput placeholder="20" className="w-full h-10 border-gray-200" />
                        </div>
                    ))}

                    <button
                        className="w-full py-3 bg-white border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        onClick={() => setObjectiveQuestions([...objectiveQuestions, { id: Date.now() }])}
                    >
                        <Plus size={16} /> Add Question Block
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1">Essay Questions</h2>

                    {essayQuestions.map((eq, index) => (
                        <div key={eq.id} className="bg-[#FCFCF2] rounded-[1.5rem] p-6 border border-[#EBF2D5] flex flex-col gap-4 relative">
                            <div className="flex justify-between items-center bg-transparent border-b border-[#EBF2D5] pb-3 mb-2">
                                <span className="text-sm font-semibold text-gray-800">Question {index + 1}</span>
                                <button className="text-gray-500 hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <NuraTextArea
                                label=""
                                value=""
                                placeholder="Essay questions"
                                className="w-full bg-white min-h-[100px]"
                            />

                            <span className="text-sm font-semibold text-gray-800 mt-2">Score</span>
                            <NuraTextInput placeholder="20" className="w-full h-10 border-gray-200" />
                        </div>
                    ))}

                    <button
                        className="w-full py-3 bg-white border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        onClick={() => setEssayQuestions([...essayQuestions, { id: Date.now() }])}
                    >
                        <Plus size={16} /> Add Question Block
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1">Project Questions</h2>

                    {projectQuestions.map((pq, index) => (
                        <div key={pq.id} className="bg-[#FCFCF2] rounded-[1.5rem] p-6 border border-[#EBF2D5] flex flex-col gap-4 relative">
                            <div className="flex justify-between items-center bg-transparent border-b border-[#EBF2D5] pb-3 mb-2">
                                <span className="text-sm font-semibold text-gray-800">Question {index + 1}</span>
                                <button className="text-gray-500 hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <NuraTextArea
                                label=""
                                value=""
                                placeholder="Project questions/requirements"
                                className="w-full bg-white min-h-[100px]"
                            />

                            <span className="text-sm font-semibold text-gray-800 mt-2">Score</span>
                            <NuraTextInput placeholder="20" className="w-full h-10 border-gray-200" />
                        </div>
                    ))}

                    <button
                        className="w-full py-3 bg-white border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        onClick={() => setProjectQuestions([...projectQuestions, { id: Date.now() }])}
                    >
                        <Plus size={16} /> Add Question Block
                    </button>
                </div>

                {/* Final Action Buttons for Step 2 */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        Cancel
                    </button>
                    <NuraButton
                        label="Save"
                        variant="primary"
                        className="min-w-[140px]"
                        onClick={handleSaveCourseQuestions}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Top Config Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900">Class Title</label>
                    <div className="relative isolate flex items-center">
                        <select
                            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm font-medium shadow-sm transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                            value={selectedClassId?.toString() || ""}
                            onChange={(e) => handleClassSelect(e.target.value)}
                        >
                            <option value="" disabled>Select a class</option>
                            {classes.map((c: any) => (
                                <option key={c.id} value={c.id.toString()}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900">Start Date</label>
                    <M3DateTimePicker
                        value={startDate}
                        onChange={(d) => setStartDate(d)}
                        error=""
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900">End Time</label>
                    <M3TimePicker
                        value={endTime}
                        onChange={(val) => setEndTime(val)}
                        error=""
                    />
                </div>
            </div>

            {/* Course Questions List */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-gray-900 mt-4">Course Questions</h2>

                <div className="bg-[#FCFCF2] rounded-[2rem] p-6 border border-[#EBF2D5] flex flex-col gap-4">
                    {courseQuestions.map((cq) => (
                        <div key={cq.id} className="bg-white border text-sm font-medium border-gray-200 rounded-full py-3 px-6 flex justify-between items-center shadow-sm hover:shadow transition-shadow">
                            <span className="text-gray-900">{cq.title}</span>
                            <NuraButton
                                label="Add Item"
                                variant="primary"
                                className="h-8 text-xs px-6"
                                onClick={() => {
                                    setActiveCourseId(cq.id);
                                    setCurrentStep(2);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                    Cancel
                </button>
                <NuraButton
                    label="Create"
                    variant="primary"
                    className="min-w-[140px]"
                    onClick={handleCreateClick}
                />
            </div>
        </div>
    );
}
