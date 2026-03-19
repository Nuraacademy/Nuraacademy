import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getFeedbacks, getFeedbackHubData } from "@/app/actions/feedback";
import FeedbackList from "./feedback_list";
import FeedbackHubClient from "./FeedbackHubClient";

export const metadata = {
    title: "Feedbacks | Nura Academy",
    description: "View all your reflections and assignment feedbacks in one place.",
};

export default async function FeedbackPage() {
    const userId = await getCurrentUserId();
    
    // Check role
    const user = userId ? await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    }) : null;

    if (user?.role?.name === 'Learner') {
        const hubRes = await getFeedbackHubData();
        return <FeedbackHubClient data={hubRes.success ? hubRes.data : []} />;
    }

    // For non-learners, show the existing list
    const result = await getFeedbacks();
    const feedbacks = result.success ? result.data : [];

    return <FeedbackList initialFeedbacks={feedbacks || []} />;
}
