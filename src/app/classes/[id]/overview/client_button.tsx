"use client"

import { formatAppDate } from "@/lib/appDatetime"
import { NuraButton } from "@/components/ui/button/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import WelcomingModal from "@/components/ui/modal/welcoming_modal"
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal"
import { toast } from "sonner"
import { deleteCourseAction } from "@/app/actions/course"
import { removeAssignment } from "@/app/actions/assignment"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export function SuccessHandler({
    classId,
    timelines,
    startDate,
    endDate
}: {
    classId: string,
    timelines: any[],
    startDate?: Date,
    endDate?: Date
}) {
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (searchParams.get("enrolled") === "true") {
            setIsOpen(true)
        }
        if (searchParams.get("error") === "not_enrolled") {
            toast.error("You are not enrolled in this class")
        }
    }, [searchParams])

    const formatDate = (date: any) => formatAppDate(date, "TBA");

    // Filter and map timelines to specific labels
    const getStep = (search: string, label: string) => {
        const t = timelines.find(t => t.activity.toLowerCase().includes(search.toLowerCase()));
        if (!t) return null;
        return {
            date: `${formatDate(t.date)}`,
            label: label
        };
    };

    const steps = [
        getStep("Placement Test", "Placement Test"),
        getStep("Course Mapping", "Penilaian Placement Test"),
        getStep("Grouping", "Pembagian Grup Belajar"),
        getStep("Learning", "Kegiatan Belajar"),
        getStep("Final Project", "Final Project"),
    ].filter(Boolean) as { date: string, label: string }[];

    return (
        <WelcomingModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            classId={classId}
            steps={steps}
        />
    )
}


export function EnrollButton({ classId }: { classId: string }) {
    const router = useRouter()
    return (
        <NuraButton
            label="Enroll Now"
            variant="primary"
            onClick={() => router.push(`/classes/${classId}/enrollment`)}
            className="h-6 text-sm"
        />
    )
}

export function AddTimelineButton({ classId, isEdit }: { classId: string, isEdit: boolean }) {
    const router = useRouter()
    return <NuraButton 
        label={isEdit ? "Edit Timeline" : "Add Timeline"}
        variant="primary" 
        className="h-6 text-sm" 
        onClick={() => router.push(`/classes/${classId}/timeline/create`)} 
    />
}


export function PlacementTestButton({
    classId,
    isAdmin,
    isFinished,
    courseCount,
    startDate,
    endDate
}: {
    classId: string,
    isAdmin: boolean,
    isFinished: boolean,
    courseCount: number,
    startDate?: Date,
    endDate?: Date
}) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const isStarted = startDate ? new Date() >= new Date(startDate) : true;
    const isEnded = endDate ? new Date() > new Date(endDate) : false;

    const handleClick = () => {
        if (courseCount === 0) {
            setIsModalOpen(true)
            return
        }

        if (isAdmin) {
            router.push(`/classes/${classId}/test/create`)
        } else if (isFinished) {
            router.push(`/classes/${classId}/test?finished=true`)
        } else {
            router.push(`/classes/${classId}/test`)
        }
    }

    return (
        <div className="flex gap-4">
            <div className="relative group flex items-center justify-center">
                <NuraButton
                    label={isAdmin ? (courseCount > 0 ? "Edit Test" : "Create Test") : (isFinished ? "See Result" : "Start Test")}
                    variant="primary"
                    onClick={handleClick}
                    id="create-placement-test-btn"
                    disabled={!isAdmin && !isFinished && (isEnded || !isStarted)}
                />
                {!isAdmin && !isFinished && !isStarted && (
                    <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        placement test belum dimulai
                    </div>
                )}
            </div>
            {isAdmin && (
                <NuraButton
                    label="Mapping"
                    variant="primary"
                    onClick={() => router.push(`/classes/${classId}/placement/results`)}
                />
            )}

            <ConfirmModal
                isOpen={isModalOpen}
                title="Placement Test Unavailable"
                message={isAdmin
                    ? "You cannot create a placement test because there are no courses added to this class yet. Please add at least one course first."
                    : "The placement test is currently unavailable because no courses have been added to this class yet."
                }
                confirmText="Understood"
                onConfirm={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                cancelText="Close"
            />
        </div>
    )
}

export function AddAssignmentButton({ classId, courseId }: { classId: string, courseId?: string }) {
    const router = useRouter()
    return <NuraButton
        label="Add Assignment"
        variant="primary"
        onClick={() => router.push(`/assignment/add?classId=${classId}${courseId ? `&courseId=${courseId}` : ""}`)}
    />
}


export function AddCourseButton({ classId }: { classId: string }) {
    const router = useRouter()
    return <NuraButton label="Add Course" variant="primary" onClick={() => router.push(`/classes/${classId}/course/add`)} />
}

export function CourseCard({ classId, course, isAdmin, isLearner, isPriority }: { classId: string, course: any, isAdmin: boolean, isLearner: boolean, isPriority?: boolean }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteCourseAction(parseInt(classId), course.id)
        setIsDeleting(false)
        setIsConfirmOpen(false)

        if (result.success) {
            toast.success("Course deleted successfully")
        } else {
            toast.error(result.error || "Failed to delete course")
        }
    }

    return (
        <>
            <div
                className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer group relative"
                onClick={() => router.push(`/classes/${classId}/course/${course.id}/overview`)}
            >
                <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm">{course.title}</h3>
                        {isPriority && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                                Prioritas
                            </span>
                        )}
                    </div>
                    <div className="text-xs line-clamp-2" dangerouslySetInnerHTML={{ __html: course.description }} />
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsConfirmOpen(true);
                                }}
                                disabled={isDeleting}
                            >
                                <img src="/icons/Delete.svg" alt="Delete" className="w-5 h-5" />
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/classes/${classId}/course/${course.id}/edit`);
                                }}
                            >
                                <img src="/icons/Edit.svg" alt="Edit" className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Delete Course"
                message={`Are you sure you want to delete "${course.title}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </>
    )
}

export function ProjectCard({ classId, assignment, isAdmin, isLearner }: { classId: string, assignment: any, isAdmin: boolean, isLearner: boolean }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const submissionLabel = assignment.submissionType === "GROUP" ? "Group" : "Individual"
    const submissionColor = assignment.submissionType === "GROUP"
        ? "bg-purple-50 text-purple-700 border border-purple-200"
        : "bg-blue-50 text-blue-700 border border-blue-200"

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await removeAssignment(assignment.id, parseInt(classId), assignment.courseId);
        setIsDeleting(false);
        setIsConfirmOpen(false);

        if (result.success) {
            toast.success("Assignment deleted successfully");
        } else {
            toast.error(result.error || "Failed to delete assignment");
        }
    };

    return (
        <>
            <div
                className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer group relative"
                onClick={() => {
                    if (isLearner) {
                        router.push(`/assignment/${assignment.id}`)
                    } else {
                        router.push(`/assignment/${assignment.id}/results`)
                    }
                }}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm">{assignment.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${submissionColor}`}>
                                {submissionLabel}
                            </span>
                        </div>
                        {assignment.course && (
                            <p className="text-sm">{assignment.course.title}</p>
                        )}
                        {isMounted && assignment.startDate && (
                            <p className="text-xs mt-0.5">
                                Start: {formatAppDate(assignment.startDate)} - Due: {formatAppDate(assignment.endDate)}
                            </p>
                        )}
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsConfirmOpen(true);
                                }}
                                disabled={isDeleting}
                            >
                                <img src="/icons/Delete.svg" alt="Delete" className="w-5 h-5" />
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/assignment/add?id=${assignment.id}`);
                                }}
                            >
                                <img src="/icons/Edit.svg" alt="Edit" className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Delete Assignment"
                message={`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </>
    )
}

export function FeedbackButton({ 
    classId, 
    isLearner, 
    finalProjectStartDate 
}: { 
    classId: string, 
    isLearner: boolean, 
    finalProjectStartDate?: Date | null 
}) {
    const router = useRouter()
    
    // Cek apakah periode feedback sudah dimulai
    const isStarted = finalProjectStartDate ? new Date() >= new Date(finalProjectStartDate) : true;

    const handleClick = () => {
        // Jika learner dan belum mulai, button tidak melakukan apa-apa (atau bisa dicegah di onClick)
        if (isLearner && !isStarted) return;

        if (isLearner) {
            router.push(`/classes/${classId}/feedback`)
        } else {
            router.push(`/feedback/class/${classId}`)
        }
    }

    return (
        <div className="relative group flex items-center justify-center w-full">
            <NuraButton
                label="Feedback"
                variant="primary"
                leftIcon={<Image src="/icons/Feedback.svg" alt="Feedback" width={20} height={20} />}
                onClick={handleClick}
                // Menambahkan styling visual jika disabled
                className={`w-full ${isLearner && !isStarted ? "opacity-50 cursor-not-allowed" : ""}`}                disabled={isLearner && !isStarted}
            />
            
            {/* Tooltip: Hanya muncul jika isLearner dan periode belum dimulai */}
            {isLearner && !isStarted && (
                <div className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Feedback tersedia setelah final project dimulai
                </div>
            )}
        </div>
    )
}

export function AnalyticsButton({
    classId,
    isLearner,
    canViewClassAnalytics = false,
    canViewLearnerAnalytics = false
}: {
    classId: string,
    isLearner: boolean,
    canViewClassAnalytics?: boolean,
    canViewLearnerAnalytics?: boolean
}) {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // If it's a learner, it's just a direct link, no dropdown needed
    if (isLearner) {
        return (
            <NuraButton
                label="Analytics and Report"
                variant="primary"
                className="w-full"
                leftIcon={<Image src="/icons/Analytics.svg" alt="Analytics" width={20} height={20} />}
                onClick={() => {
                    router.push(`/classes/${classId}/analytics`)
                }}
            />
        )
    }

    return (
        <div className="relative w-full">
            <NuraButton
                label="Analytics and Report"
                variant="primary"
                className="w-full"
                leftIcon={<Image src="/icons/Analytics.svg" alt="Analytics" width={20} height={20} />}
                rightIcon={<ChevronDown/>}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />

            {isDropdownOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {canViewClassAnalytics && (
                            <button
                                onClick={() => {
                                    router.push(`/classes/${classId}/analytics`)
                                    setIsDropdownOpen(false)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#DAEE49]/20 hover:text-black transition-colors"
                            >
                                Class Analytics
                            </button>
                        )}
                        {canViewLearnerAnalytics && (
                            <button
                                onClick={() => {
                                    router.push(`/classes/${classId}/analytics/user`)
                                    setIsDropdownOpen(false)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#DAEE49]/20 hover:text-black transition-colors border-t border-gray-50"
                            >
                                Learner Analytics
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

const ClientButton = {
    SuccessHandler,
    EnrollButton,
    AddTimelineButton,
    PlacementTestButton,
    AddCourseButton,
    CourseCard,
    ProjectCard,
    FeedbackButton,
    AnalyticsButton
}

export default ClientButton
