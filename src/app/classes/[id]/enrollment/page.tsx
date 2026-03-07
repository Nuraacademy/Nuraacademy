"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NuraTextInput } from "@/components/ui/input/text_input"
import Chip from "@/components/ui/chip/chip"
import CVUpload from "@/components/ui/upload/cv_upload"
import { NuraButton } from "@/components/ui/button/button"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { NuraTextArea } from "@/components/ui/input/text_area"
import WelcomingModal from "@/components/ui/modal/welcoming_modal"
import { handleEnrollment, checkEnrollment } from "@/app/actions/enrollment"
import { getClassDetails } from "@/app/actions/classes"

export default function EnrollmentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [classId, setClassId] = useState<string>("")

    useEffect(() => {
        params.then(p => {
            const id = p.id;
            setClassId(id);
            const classIdInt = parseInt(id);

            // Check if user is already enrolled
            checkEnrollment(classIdInt).then(isEnrolled => {
                if (isEnrolled) {
                    alert("You are already enrolled in this class.");
                    router.replace(`/classes/${id}/overview`);
                }
            }).catch(() => { });

            // Fetch class details
            getClassDetails(classIdInt).then(result => {
                if (result.success && result.class) {
                    setClassData(result.class);
                }
            }).catch(() => { });
        }).catch(() => { })
    }, [params])

    const [classData, setClassData] = useState<any>(null)

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

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validate all fields are filled
        if (!formData.profession.trim() ||
            !formData.yoe.trim() ||
            !formData.workField.trim() ||
            !formData.educationField.trim() ||
            !formData.jobIndustry.trim() ||
            !formData.finalExpectations.trim()) {
            setError("Please fill in all required fields.")
            return
        }

        if (selectedObjectives.length === 0) {
            setError("Please select at least one learning objective.")
            return
        }

        if (!cvFile) {
            setError("Please upload your CV.")
            return
        }

        setIsLoading(true)

        try {
            const result = await handleEnrollment(parseInt(classId), {
                ...formData,
                selectedObjectives,
            })

            if (result.success) {
                setIsWelcomingModalOpen(true)
            } else {
                setError(result.error || "Failed to enroll")
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        router.back()
    }

    const className = classData?.title || "Class"

    const timelines = classData?.timelines?.map((t: any) => ({
        date: new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        label: t.activity
    })) || []

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
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                            {error}
                        </div>
                    )}
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
                                label={isLoading ? "Submitting..." : "Submit"}
                                variant="primary"
                                type="submit"
                                className="min-w-[120px]"
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Welcoming Modal */}
            <WelcomingModal
                isOpen={isWelcomingModalOpen}
                classId={classId}
                steps={timelines}
            />
        </main>
    )
}
