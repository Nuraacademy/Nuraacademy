import { getAllLearners } from "@/app/actions/analytics";
import GlobalLearnerListClient from "@/app/analytics/user/GlobalLearnerListClient";
import { requirePermission } from "@/lib/rbac";
import { notFound } from "next/navigation";

export default async function GlobalLearnerAnalyticsPage() {
    await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
    const response = await getAllLearners();

    if (!response.success || !response.data) {
        return notFound();
    }

    const learners = response.data.map((e: any) => ({
        id: e.id,
        name: e.user.name || e.user.username,
        username: e.user.username,
        email: e.user.email,
        classTitle: e.class.title,
        classId: e.class.id
    }));

    return (
        <GlobalLearnerListClient learners={learners} />
    );
}
