import { getCourseById } from "@/controllers/courseController"
import { notFound } from "next/navigation"
import { CourseFormClient } from "../../components/CourseFormClient"

export default async function EditCoursePage({
    params
}: {
    params: Promise<{ id: string, course_id: string }>
}) {
    const { id, course_id } = await params
    const courseData = await getCourseById(parseInt(course_id))

    if (!courseData || courseData.classId !== parseInt(id)) {
        return notFound()
    }

    return <CourseFormClient classData={courseData.class} courseData={courseData} />
}
