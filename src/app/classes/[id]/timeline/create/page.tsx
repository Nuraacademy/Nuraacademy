import { getClassById } from "@/controllers/classController"
import { notFound } from "next/navigation"
import { CreateTimelineClient } from "@/app/classes/[id]/timeline/create/CreateTimelineClient"

export default async function CreateTimelinePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const classData = await getClassById(parseInt(id))

    if (!classData) {
        return notFound()
    }

    return <CreateTimelineClient classData={classData} />
}
