import { getClassGroupsSummary, getLearnerCourseStatus } from "@/controllers/placementController";
import { getClassById } from "@/controllers/classController";
import CreateGroupClient from "@/app/classes/[id]/placement/create-group/CreateGroupClient";
import { notFound } from "next/navigation";

export default async function CreateGroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);
    const classData = await getClassById(classId);

    if (!classData) return notFound();

    // Use getLearnerCourseStatus to get identifying details (enrollmentId) and current groupings
    const statusData = await getLearnerCourseStatus(classId);

    return (
        <CreateGroupClient
            classId={classId}
            classTitle={classData.title}
            learners={statusData.learners}
        />
    );
}
