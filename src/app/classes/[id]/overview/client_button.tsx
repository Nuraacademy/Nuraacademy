"use client"

import { NuraButton } from "@/components/ui/button/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import WelcomingModal from "@/components/ui/modal/welcoming_modal"
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal"
import { toast } from "sonner"
import { deleteCourseAction } from "@/app/actions/course"

export function SuccessHandler({ classId, timelines }: { classId: string, timelines: any[] }) {
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (searchParams.get("enrolled") === "true") {
            setIsOpen(true)
        }
    }, [searchParams])

    return (
        <WelcomingModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            classId={classId}
            steps={timelines.map(t => ({
                date: new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                label: t.activity
            }))}
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

export function AddTimelineButton({ classId }: { classId: string }) {
    const router = useRouter()
    return <NuraButton label="Add Timeline" variant="primary" className="h-6 text-sm" onClick={() => router.push(`/classes/${classId}/timeline/create`)} />
}


export function PlacementTestButton({
    classId,
    isAdmin,
    isFinished,
    courseCount
}: {
    classId: string,
    isAdmin: boolean,
    isFinished: boolean,
    courseCount: number
}) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)

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
            <NuraButton
                label={isAdmin ? (courseCount > 0 ? "Edit Test" : "Create Test") : (isFinished ? "See Result" : "Start Test")}
                variant="primary"
                onClick={handleClick}
            />
            {isAdmin && (
                <NuraButton
                    label="Mapping"
                    variant="secondary"
                    className="!bg-transparent !text-white !border-white/50 !border !font-semibold"
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

export function AddCourseButton({ classId }: { classId: string }) {
    const router = useRouter()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showDropdown])

    return (
        <div className="relative" ref={dropdownRef}>
            <NuraButton
                label="Add Course"
                variant="primary"
                onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        onClick={() => {
                            setShowDropdown(false)
                            router.push(`/classes/${classId}/course/add?type=COURSE`)
                        }}
                    >
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Course
                    </button>
                    <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        onClick={() => {
                            setShowDropdown(false)
                            router.push(`/classes/${classId}/course/add?type=FINAL_PROJECT`)
                        }}
                    >
                        <div className="w-2 h-2 rounded-full bg-[#005954]"></div>
                        Project
                    </button>
                </div>
            )}
        </div>
    )
}

export function CourseCard({ classId, course, isAdmin }: { classId: string, course: any, isAdmin: boolean }) {
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
                className="border border-gray-200 rounded-[1.5rem] p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer group relative"
                onClick={() => router.push(`/classes/${classId}/course/${course.id}/overview`)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-black text-medium">{course.title}</h3>
                            {course.type === 'FINAL_PROJECT' && (
                                <span className="px-2 py-0.5 text-[10px] bg-[#005954] text-white rounded-full font-bold uppercase tracking-wider">
                                    Final Project
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: course.description }} />
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

const ClientButton = {
    SuccessHandler,
    EnrollButton,
    AddTimelineButton,
    PlacementTestButton,
    AddCourseButton,
    CourseCard
}

export default ClientButton
