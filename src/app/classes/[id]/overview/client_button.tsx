"use client"

import { NuraButton } from "@/components/ui/button/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import WelcomingModal from "@/components/ui/modal/welcoming_modal"

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

import { ConfirmModal } from "@/components/ui/modal/confirmation_modal"

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
        <>
            <NuraButton
                label={isAdmin ? "Create Test" : (isFinished ? "See Result" : "Start Test")}
                variant="primary"
                onClick={handleClick}
            />
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
        </>
    )
}

export function AddCourseButton({ classId }: { classId: string }) {
    const router = useRouter()
    return <NuraButton label="Add Course" variant="primary" onClick={() => router.push(`/classes/${classId}/course/add`)} />
}

export function CourseCard({ classId, course, isAdmin }: { classId: string, course: any, isAdmin: boolean }) {
    const router = useRouter()
    return (
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
                    <button
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/classes/${classId}/course/${course.id}/edit`);
                        }}
                    >
                        <img src="/icons/Edit.svg" alt="Edit" className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
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
