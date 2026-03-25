import { getClassAnalytics, getClassFeedbackAnalytics } from "@/app/actions/analytics";
import ClassReportClient from "./ClassReportClient";
import ClassFeedbackAnalyticsClient from "./ClassFeedbackAnalyticsClient";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/rbac";
import { getFullSession } from "@/app/actions/auth";

export default async function ClassReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);

    if (isNaN(classId)) {
        notFound();
    }

    const session = await getFullSession();
    if (!session) return redirect('/login');

    const isLearner = session.role === 'Learner';

    if (isLearner) {
        await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
        const response = await getClassAnalytics(classId);
        if (!response.success || !response.data) {
            notFound();
        }
        return <ClassReportClient data={response} />;
    } else {
        // Staff/Admin view: Class Feedback Analytic Dashboard
        await requirePermission('Analytics', 'ANALYTICS_REPORT_TRAINER');
        const response = await getClassFeedbackAnalytics(classId);
        if (!response.success || !response.data) {
            if (response.error === "Class not found") {
                notFound();
            }
            // For other errors (like no feedbacks yet), we can still show the empty dashboard
            return <ClassFeedbackAnalyticsClient
                data={{
                    className: "Class",
                    metrics: { courseStructure: 0, learningEnvironment: 0, materialQuality: 0, practicalRelevance: 0, technicalSupport: 0 },
                    details: { courseStructure: [], learningEnvironment: [], materialQuality: [], practicalRelevance: [], technicalSupport: [] },
                    totalFeedbacks: 0
                }}
                classId={classId}
            />;
        }
        return <ClassFeedbackAnalyticsClient data={response.data} classId={classId} />;
    }
}
