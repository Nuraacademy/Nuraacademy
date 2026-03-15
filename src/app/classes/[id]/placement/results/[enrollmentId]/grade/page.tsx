import { getGradingData } from "@/controllers/placementController";
import { getClassById } from "@/controllers/classController";
import { getEnrollmentById } from "@/controllers/enrollmentController";
import { getPlacementTestByClassId } from "@/controllers/assignmentController";
import GradingClient from "@/app/classes/[id]/placement/results/[enrollmentId]/grade/GradingClient";
import { notFound } from "next/navigation";

export default async function GradingPage({
    params
}: {
    params: Promise<{ id: string, enrollmentId: string }>
}) {
    const { id, enrollmentId } = await params;
    const classId = parseInt(id);
    const eid = parseInt(enrollmentId);

    const [classData, enrollment] = await Promise.all([
        getClassById(classId),
        getEnrollmentById(eid)
    ]);

    if (!classData || !enrollment) return notFound();

    const placementTest = await getPlacementTestByClassId(classId);

    if (!placementTest) return notFound();

    const gradingData = await getGradingData(placementTest.id, eid);

    if (!gradingData) return notFound();

    return (
        <GradingClient
            classId={classId}
            enrollmentId={eid}
            learnerName={enrollment.user.name || enrollment.user.username}
            initialData={gradingData}
        />
    );
}
