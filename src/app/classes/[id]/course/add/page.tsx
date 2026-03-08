import { getClassById } from "@/controllers/classController"
import { notFound } from "next/navigation"
import { CourseFormClient } from "../components/CourseFormClient"

export default async function AddCoursePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const classData = await getClassById(parseInt(id))

    if (!classData) {
        return notFound()
    }

    return <CourseFormClient classData={classData} />
}
