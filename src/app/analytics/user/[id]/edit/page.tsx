import { getLearnerAnalytics } from "@/app/actions/analytics";
import FeedbackFormClient from "./FeedbackFormClient";
import { notFound } from "next/navigation";

export default async function EditFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const enrollmentId = parseInt(id);

    if (isNaN(enrollmentId)) {
        notFound();
    }

    const response = await getLearnerAnalytics(enrollmentId);

    if (!response.success || !response.data) {
        notFound();
    }

    return <FeedbackFormClient data={response.data} />;
}
