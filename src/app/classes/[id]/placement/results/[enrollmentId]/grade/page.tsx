import GradingClient from "@/components/assignment/GradingClient";
import { submitGradingAction } from "@/app/actions/assignment";
import { getGradingData } from "@/controllers/assignmentController";
import { getClassById } from "@/controllers/classController";
import { getEnrollmentById } from "@/controllers/enrollmentController";
import { getPlacementTestByClassId } from "@/controllers/assignmentController";
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
            assignmentId={placementTest.id}
            enrollmentId={eid}
            learnerName={enrollment.user.name || enrollment.user.username}
            initialData={gradingData}
            title="Placement Test"
            subtitle="Foundation to Data Analytics"
            breadcrumbItems={[
                { label: "Home", href: "/classes" },
                { label: "Placement Test", href: `/classes/${classId}/test` },
                { label: "Results", href: `/classes/${classId}/placement/results` },
                { label: enrollment.user.name || enrollment.user.username, href: "#" },
            ]}
            backUrl={`/classes/${classId}/placement/results`}
            submitAction={submitGradingAction.bind(null, placementTest.id)}
        />
    );
}
