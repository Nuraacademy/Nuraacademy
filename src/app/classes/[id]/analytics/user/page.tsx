import { getClassAnalytics } from "@/app/actions/analytics";
import LearnerListClient from "@/app/classes/[id]/analytics/user/LearnerListClient";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac";

export default async function LearnerAnalyticsListPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    await requirePermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
    const { id } = await params;
    const classId = parseInt(id);

    if (isNaN(classId)) {
        notFound();
    }

    const response = await getClassAnalytics(classId);

    if (!response.success || !response.raw) {
        notFound();
    }

    const learners = response.raw.enrollments.map((e: any) => ({
        id: e.id,
        name: e.user.name || e.user.username,
        username: e.user.username,
        email: e.user.email
    }));

    return (
        <LearnerListClient
            classId={classId}
            classTitle={response.raw.title}
            learners={learners}
        />
    );
}
