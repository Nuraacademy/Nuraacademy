import { getLearnerCourseStatus } from "@/controllers/placementController";
import { getClassById } from "@/controllers/classController";
import LearnerGroupClient from "@/app/classes/[id]/placement/learner-group/LearnerGroupClient";
import { notFound } from "next/navigation";

export default async function LearnerGroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);
    const classData = await getClassById(classId);

    if (!classData) return notFound();

    const statusData = await getLearnerCourseStatus(classId);

    return (
        <LearnerGroupClient
            classId={classId}
            classTitle={classData.title}
            initialData={statusData}
        />
    );
}
