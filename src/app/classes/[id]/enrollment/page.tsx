"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { NuraTextInput } from "@/components/ui/input/text_input"
import Chip from "@/components/ui/chip/chip"
import CVUpload from "@/components/ui/upload/cv_upload"
import { NuraButton } from "@/components/ui/button/button"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { NuraTextArea } from "@/components/ui/input/text_area"
import WelcomingModal from "@/components/ui/modal/welcoming_modal"
import { enrollAction } from "./actions"
import { toast } from "sonner"

export default function EnrollmentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id: classId } = use(params)

    // In real app, this should be fetched from server component and passed as prop
    // But for this refactor, we'll keep it simple
    const [className, setClassName] = useState("Class")
    const [timeline, setTimeline] = useState<any[]>([])

    const [formData, setFormData] = useState({
        profession: "",
        yoe: "",
        workField: "",
        educationField: "",
        jobIndustry: "",
        finalExpectations: "",
    })

    const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [isWelcomingModalOpen, setIsWelcomingModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const learningObjectives = [
        "Career switch",
        "Job seeker",
        "Academic purpose",
        "Certification",
        "Upskilling"
    ]

    useEffect(() => {
        // Fetch class basic info for UI
        fetch(`/api/classes/${classId}`)
            .then(res => res.json())
            .then(data => {
                setClassName(data.title)
                setTimeline(data.classTimelines || [])
            })
            .catch(() => { })
    }, [classId])

    const toggleObjective = (objective: string) => {
        setSelectedObjectives(prev =>
            prev.includes(objective)
                ? prev.filter(o => o !== objective)
                : [...prev, objective]
        )
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Mock userId for now
            const userId = "temp-user-123"

            const result = await enrollAction({
                classId,
                userId,
                personalInfo: {
                    profession: formData.profession,
                    yoe: formData.yoe,
                    workField: formData.workField,
                    educationField: formData.educationField,
                    jobIndustry: formData.jobIndustry,
                },
                objectives: selectedObjectives,
                expectations: formData.finalExpectations,
                cvUrl: cvFile ? "unsupported_for_now" : undefined // CV Upload needs more infra
            })

            if (result.success) {
                setIsWelcomingModalOpen(true)
            } else {
                toast.error(result.error || "Failed to enroll")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        router.back()
    }

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-white">
            {/* Background Images */}
            <img
                src="/background/OvalBGLeft.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0"
            />
            <img
                src="/background/OvalBGRight.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0"
            />

            {/* Content */}
            <div className="relative mx-auto px-8 py-8">
                <div className="px-8 md:px-12">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: className, href: `/classes/${classId}/overview` },
                            { label: "Enroll Class", href: `/classes/${classId}/enrollment` },
                        ]}
                    />
                </div>

                {/* Form Card */}
                <div className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <NuraTextInput
                                    label="Profession"
                                    placeholder="Profession"
                                    value={formData.profession}
                                    onChange={(e) => handleInputChange("profession", e.target.value)}
                                    color="black"
                                />
                                <NuraTextInput
                                    label="YoE (Years of Experience)"
                                    placeholder="YoE (Years of Experience)"
                                    value={formData.yoe}
                                    onChange={(e) => handleInputChange("yoe", e.target.value)}
                                    color="black"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <NuraTextInput
                                    label="Work Field"
                                    placeholder="Work Field"
                                    value={formData.workField}
                                    onChange={(e) => handleInputChange("workField", e.target.value)}
                                    color="black"
                                />
                                <NuraTextInput
                                    label="Education Field"
                                    placeholder="Education Field"
                                    value={formData.educationField}
                                    onChange={(e) => handleInputChange("educationField", e.target.value)}
                                    color="black"
                                />
                                <NuraTextInput
                                    label="Job Industry"
                                    placeholder="Job Industry"
                                    value={formData.jobIndustry}
                                    onChange={(e) => handleInputChange("jobIndustry", e.target.value)}
                                    className="md:col-span-1"
                                    color="black"
                                />
                            </div>
                        </div>

                        {/* Learning Objectives Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Objectives</h2>
                            <div className="flex flex-wrap gap-3">
                                {learningObjectives.map((objective) => (
                                    <Chip
                                        key={objective}
                                        label={objective}
                                        variant="selectable"
                                        isSelected={selectedObjectives.includes(objective)}
                                        onClick={() => toggleObjective(objective)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Final Expectations Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Final Expectations</h2>
                            <div className="relative">
                                <NuraTextArea
                                    label="Final Expectations"
                                    placeholder="Final expectations"
                                    value={formData.finalExpectations}
                                    onChange={(e) => handleInputChange("finalExpectations", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Upload CV Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload CV</h2>
                            <CVUpload
                                onFileSelect={(file) => setCvFile(file)}
                                maxSizeMB={5}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-6">
                            <NuraButton
                                label="Cancel"
                                variant="secondary"
                                type="button"
                                onClick={handleCancel}
                                className="min-w-[120px]"
                            />
                            <NuraButton
                                label={isSubmitting ? "Enrolling..." : "Submit"}
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                                className="min-w-[120px]"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Welcoming Modal */}
            <WelcomingModal
                isOpen={isWelcomingModalOpen}
                classId={classId}
                steps={timeline.length > 0 ? timeline.map(t => ({
                    date: new Date(t.date).toLocaleDateString('en-GB'),
                    label: t.title
                })) : [
                    { date: "02/03/2026", label: "Placement Test" },
                    { date: "08/03/2026", label: "Course Mapping" },
                    { date: "15/03/2026", label: "Grouping" },
                    { date: "22/03/2026", label: "Learning" },
                    { date: "24/05/2026", label: "Final Project" },
                ]}
            />
        </main>
    )
}
