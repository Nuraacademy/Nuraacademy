"use client"

import { NuraButton } from "@/components/ui/button/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import WelcomingModal from "@/components/ui/modal/welcoming_modal"
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal"
import { toast } from "sonner"
import { deleteCourseAction } from "@/app/actions/course"
import { removeAssignment } from "@/app/actions/assignment"

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
    return <NuraButton label="Add Course" variant="primary" onClick={() => router.push(`/classes/${classId}/course/add`)} />
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
                    <h3 className="text-black text-medium mb-1">{course.title}</h3>
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

export function ProjectCard({ classId, assignment, isAdmin }: { classId: string, assignment: any, isAdmin: boolean }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
            className="border border-gray-200 rounded-[1.5rem] p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer group relative"
            onClick={() => router.push(`/assignment/${assignment.id}`)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-black text-medium">{assignment.title}</h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${submissionColor}`}>
                            {submissionLabel}
                        </span>
                    </div>
                    {assignment.course && (
                        <p className="text-sm text-gray-500">{assignment.course.title}</p>
                    )}
                    {assignment.startDate && (
                        <p className="text-xs text-gray-400 mt-0.5">
                            Due: {new Date(assignment.startDate).toLocaleDateString()}
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

const ClientButton = {
    SuccessHandler,
    EnrollButton,
    AddTimelineButton,
    PlacementTestButton,
    AddCourseButton,
    CourseCard,
    ProjectCard
}

export default ClientButton
