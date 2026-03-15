import { getClassById } from "@/controllers/classController"
import { notFound } from "next/navigation"
import { CourseFormClient } from "../components/CourseFormClient"

export default async function AddCoursePage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ type?: string }>
}) {
    const { id } = await params
    const { type } = await searchParams
    const classData = await getClassById(parseInt(id))

    if (!classData) {
        return notFound()
    }

    return <CourseFormClient classData={classData} initialType={type} />
}
