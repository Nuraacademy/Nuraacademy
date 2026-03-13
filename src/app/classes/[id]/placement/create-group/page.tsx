import { getClassGroupsSummary, getLearnerCourseStatus } from "@/controllers/placementController";
import { getClassById } from "@/controllers/classController";
import CreateGroupClient from "@/app/classes/[id]/placement/create-group/CreateGroupClient";
import { notFound } from "next/navigation";

export default async function CreateGroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);
    const classData = await getClassById(classId);

    if (!classData) return notFound();

    // We need both the group summary and the individual learner status (to allow re-assigning)
    const groupsMap = await getClassGroupsSummary(classId);

    return (
        <CreateGroupClient
            classId={classId}
            classTitle={classData.title}
            groups={groupsMap}
        />
    );
}
