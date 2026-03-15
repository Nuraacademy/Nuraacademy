import { getLearnerPlacementResults } from "@/controllers/placementController";
import { getClassById } from "@/controllers/classController";
import PlacementResultsClient from "@/app/classes/[id]/placement/results/PlacementResultsClient";
import { notFound } from "next/navigation";

export default async function PlacementResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);
    const classData = await getClassById(classId);

    if (!classData) return notFound();

    const results = await getLearnerPlacementResults(classId);

    return (
        <PlacementResultsClient
            classId={classId}
            classTitle={classData.title}
            results={results}
        />
    );
}
