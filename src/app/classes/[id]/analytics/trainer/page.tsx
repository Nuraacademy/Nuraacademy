import { getTrainerAnalytics } from "@/app/actions/analytics";
import TrainerAnalyticsClient from "./TrainerAnalyticsClient";
import { notFound } from "next/navigation";

export default async function TrainerAnalyticsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const classId = parseInt(id);

    if (isNaN(classId)) {
        notFound();
    }

    const response = await getTrainerAnalytics(classId);

    if (!response.success || !response.data) {
        // We could also show a friendly "No data yet" page, 
        // but for now we follow the pattern of other analytics
        return (
            <div className="min-h-screen bg-[#F9F9EE] flex items-center justify-center p-8">
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-black/5 max-w-lg">
                    <h2 className="text-2xl font-black text-[#1C3A37] mb-4">No Trainer Analytics Found</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        There is no feedback or forum activity data available for the trainer of this class yet.
                    </p>
                    <a href={`/classes/${classId}/overview`} className="text-sm font-medium text-[#1C3A37] underline decoration-[#DAEE49] underline-offset-4 decoration-2">
                        Back to Class Overview
                    </a>
                </div>
            </div>
        );
    }

    return <TrainerAnalyticsClient data={response.data} classId={classId} />;
}
