"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NuraTextInput } from "@/components/ui/input/text_input"
import Chip from "@/components/ui/chip/chip"
import CVUpload from "@/components/ui/upload/cv_upload"
import { NuraButton } from "@/components/ui/button/button"
import Breadcrumb from "@/components/breadcrumb/breadcrumb"
import { NuraTextArea } from "@/components/ui/input/text_area"
import WelcomingModal from "@/components/ui/modal/welcoming_modal"

export default function EnrollmentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [classId, setClassId] = useState<string>("")
    
    // Resolve params
    useEffect(() => {
        params.then(p => setClassId(p.id)).catch(() => {})
    }, [params])

    const [formData, setFormData] = useState({
        profession: "",
        yoe: "",
        workField: "",
        educationField: "",
        jobIndustry: "",
        finalExpectations: "",
    })

    const [selectedObjectives, setSelectedObjectives] = useState<string[]>(["Job seeker", "Upskilling"])
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [isWelcomingModalOpen, setIsWelcomingModalOpen] = useState(false)

    const learningObjectives = [
        "Career switch",
        "Job seeker",
        "Academic purpose",
        "Certification",
        "Upskilling"
    ]

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Enrollment data:", { ...formData, selectedObjectives, cvFile })
        // Handle submission logic here
        // Open welcoming modal after successful submission
        setIsWelcomingModalOpen(true)
    }

    const handleCancel = () => {
        router.back()
    }

    // Mock class name - in real app, fetch from API
    const className = "Foundation to Data Analytics"

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
                            { label: className, href: `/classes/overview/${classId}` },
                            { label: "Enroll Class", href: `/classes/enrollment/${classId}` },
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
                                />
                                <NuraTextInput
                                    label="YoE (Years of Experience)"
                                    placeholder="YoE (Years of Experience)"
                                    value={formData.yoe}
                                    onChange={(e) => handleInputChange("yoe", e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <NuraTextInput
                                    label="Work Field"
                                    placeholder="Work Field"
                                    value={formData.workField}
                                    onChange={(e) => handleInputChange("workField", e.target.value)}
                                />
                                <NuraTextInput
                                    label="Education Field"
                                    placeholder="Education Field"
                                    value={formData.educationField}
                                    onChange={(e) => handleInputChange("educationField", e.target.value)}
                                />
                                <NuraTextInput
                                    label="Job Industry"
                                    placeholder="Job Industry"
                                    value={formData.jobIndustry}
                                    onChange={(e) => handleInputChange("jobIndustry", e.target.value)}
                                    className="md:col-span-2"
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
                                label="Submit"
                                variant="primary"
                                type="submit"
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
                steps={[
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
