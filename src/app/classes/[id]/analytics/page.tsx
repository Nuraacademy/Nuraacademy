import { getClassAnalytics } from "@/app/actions/analytics";
import ClassReportClient from "./ClassReportClient";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac";

export default async function ClassReportPage({ params }: { params: Promise<{ id: string }> }) {
    await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
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
