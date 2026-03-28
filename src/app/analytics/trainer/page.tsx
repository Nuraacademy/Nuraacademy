import { getAllTrainers } from "@/app/actions/analytics";
import TrainerListClient from "@/app/analytics/trainer/TrainerListClient";
import { requirePermission } from "@/lib/rbac";

export default async function TrainerAnalyticsPage() {
    await requirePermission('Analytics', 'ANALYTICS_REPORT_TRAINER');
    const response = await getAllTrainers();

    if (!response.success || !response.data) {
        // Fallback: If no trainers found with specific role, maybe we show all staff (non-Learners)
        // But for now, just show the empty list
        return <TrainerListClient trainers={[]} />;
    }

    return (
        <TrainerListClient trainers={response.data} />
    );
}
