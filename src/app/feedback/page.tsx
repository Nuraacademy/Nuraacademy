import { requirePermission } from "@/lib/rbac";
import { getFeedbacks } from "@/app/actions/feedback";
import FeedbackList from "./feedback_list";

export const metadata = {
    title: "Feedbacks | Nura Academy",
    description: "View all your reflections and assignment feedbacks in one place.",
};

export default async function FeedbackPage() {
    await requirePermission('Feedback', 'VIEW_SEARCH_ASSIGNMENT_FEEDBACK');
    
    const result = await getFeedbacks();
    const feedbacks = result.success ? result.data : [];

    return <FeedbackList initialFeedbacks={feedbacks || []} />;
}
