import { getClassAnalytics } from "@/app/actions/analytics";
import ClassReportClient from "./ClassReportClient";
import { notFound } from "next/navigation";

export default async function ClassReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);

    if (isNaN(classId)) {
        notFound();
    }

    const response = await getClassAnalytics(classId);

    if (!response.success || !response.data) {
        notFound();
    }

    return <ClassReportClient data={response} />;
}
