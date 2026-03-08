"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { NuraButton } from "@/components/ui/button/button"
import { NuraTextInput } from "@/components/ui/input/text_input"
import { RichTextInput } from "@/components/ui/input/rich_text_input"
import { upsertCourse } from "@/app/actions/course"
import { FeedbackModal } from "@/components/ui/modal/feedback_modal"

type Props = {
    classData: any
    courseData?: any
}

export function CourseFormClient({ classData, courseData }: Props) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        title: courseData?.title || "",
        description: courseData?.description || "",
        learningObjectives: courseData?.learningObjectives || "",
        entrySkills: courseData?.entrySkills || "",
        tools: courseData?.tools || ""
    })

    const [modal, setModal] = useState<{ open: boolean, type: "success" | "error", title: string, message: string }>({
        open: false,
        type: "success",
        title: "",
        message: ""
    })

    const handleFieldChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            setModal({
                open: true,
                type: "error",
                title: "Validation Error",
                message: "Course title is required."
            });
            return;
        }

        setIsSubmitting(true)
        const res = await upsertCourse(classData.id, courseData?.id || null, form);
        setIsSubmitting(false);

        if (res.success) {
            setModal({
                open: true,
                type: "success",
                title: courseData ? "Course Updated! 🎉" : "Course Created! 🎉",
                message: courseData ? "The course has been updated successfully." : "The new course has been added to the class.",
            });
        } else {
            setModal({
                open: true,
                type: "error",
                title: "Save Failed",
                message: res.error || "Failed to save course.",
            });
        }
    }

    const closeSuccessModal = () => {
        setModal(m => ({ ...m, open: false }))
        router.push(`/classes/${classData.id}/overview`)
    }
    const closeErrorModal = () => {
        setModal(m => ({ ...m, open: false }))
    }

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: classData.title, href: `/classes/${classData.id}/overview` },
        { label: courseData ? "Edit Course" : "Add Course", href: "#" },
    ];

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800 overflow-hidden">
            {/* Background */}
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none select-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none select-none z-0" />

            <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 relative z-10 flex flex-col">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-2xl font-bold mt-6 mb-8">{courseData ? "Edit Course" : "Add Course"}</h1>

                <div className="space-y-8 max-w-4xl mx-auto w-full">
                    {/* Course Title */}
                    <div>
                        <NuraTextInput
                            label="Course Title"
                            placeholder="Course title"
                            value={form.title}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <RichTextInput
                            value={form.description}
                            onChange={(val) => handleFieldChange("description", val)}
                        />
                    </div>

                    {/* Learning Objective */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Learning Objective</label>
                        <RichTextInput
                            value={form.learningObjectives}
                            onChange={(val) => handleFieldChange("learningObjectives", val)}
                        />
                    </div>

                    {/* Entry Skill */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Entry Skill</label>
                        <RichTextInput
                            value={form.entrySkills}
                            onChange={(val) => handleFieldChange("entrySkills", val)}
                        />
                    </div>

                    {/* Tools */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tools</label>
                        <RichTextInput
                            value={form.tools}
                            onChange={(val) => handleFieldChange("tools", val)}
                        />
                    </div>
                </div>

                <div className="mt-12 flex justify-end gap-4 max-w-4xl mx-auto border-t border-gray-100 pt-6 w-full">
                    <NuraButton label="Cancel" variant="secondary" onClick={() => router.back()} disabled={isSubmitting} />
                    <NuraButton label={isSubmitting ? "Saving..." : (courseData ? "Save Changes" : "Create")} variant="primary" onClick={handleSubmit} disabled={isSubmitting} />
                </div>
            </div>

            <FeedbackModal
                isOpen={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={modal.type === "success" ? closeSuccessModal : closeErrorModal}
                onConfirm={modal.type === "success" ? closeSuccessModal : closeErrorModal}
                confirmText={modal.type === "success" ? "Go to Overview" : "Close"}
                closeText={modal.type === "success" ? "Stay Here" : undefined}
            />
        </main>
    )
}
