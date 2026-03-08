import { getClassById } from "@/controllers/classController";
import { getPlacementTestByClassId } from "@/controllers/assignmentController";
import { CreateTestClient } from "./CreateTestClient";
import { notFound } from "next/navigation";

export default async function CreateTestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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