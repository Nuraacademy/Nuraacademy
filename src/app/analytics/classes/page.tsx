import { getAllClassesAnalytics } from "@/app/actions/analytics";
import ClassListClient from "@/app/analytics/classes/ClassListClient";
import { requirePermission } from "@/lib/rbac";

export default async function ClassAnalyticsListPage() {
    await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
    const response = await getAllClassesAnalytics();

    if (!response.success || !response.data) {
        return <ClassListClient classes={[]} />;
    }

    return (
        <ClassListClient classes={response.data} />
    );
}
