import { getClassById } from "@/controllers/classController";
import { getPlacementTestByClassId } from "@/controllers/assignmentController";
import { CreateTestClient } from "./CreateTestClient";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac";

export default async function CreateTestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await requirePermission('Class', 'PLACEMENT_TEST_CREATE');
    const classId = parseInt(id);

    if (isNaN(classId)) {
        notFound();
    }

    const classData = await getClassById(classId);

    if (!classData) {
        notFound();
    }

    const existingTest = await getPlacementTestByClassId(classId);

    return <CreateTestClient classData={classData} existingTest={existingTest} />;
}