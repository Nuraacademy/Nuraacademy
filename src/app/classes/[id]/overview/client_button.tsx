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

export function AddTimelineButton() {
    return <NuraButton label="Add Timeline" variant="primary" className="h-6 text-sm" />
}

export function PlacementTestButton({
    classId,
    isAdmin,
    isFinished
}: {
    classId: string,
    isAdmin: boolean,
    isFinished: boolean
}) {
    const router = useRouter()
    if (isAdmin) {
        return <NuraButton label="Create Test" variant="primary" onClick={() => router.push(`/classes/${classId}/test/create`)} />
    }
    if (isFinished) {
        return <NuraButton label="See Result" variant="primary" onClick={() => router.push(`/classes/${classId}/test?finished=true`)} />
    }
    return <NuraButton label="Start Test" variant="primary" onClick={() => router.push(`/classes/${classId}/test`)} />
}

export function AddCourseButton() {
    return <NuraButton label="Add Course" variant="primary" />
}

export function CourseCard({ classId, course }: { classId: string, course: any }) {
    const router = useRouter()
    return (
        <div
            className="border border-gray-200 rounded-[1.5rem] p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => router.push(`/classes/${classId}/course/${course.id}/overview`)}
        >
            <h3 className="text-black text-medium mb-1">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>
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
