import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import ClassFeedbackDetail from "../../components/ClassFeedbackDetail";

export default async function FeedbackDetailPage({
    params
}: {
    params: Promise<{ id: string; feedbackId: string }>
}) {
    const { id: classId, feedbackId } = await params;

    try {
        await requirePermission('Feedback', 'VIEW_DETAIL_REFLECTION');
    } catch (e) {
        return redirect("/");
    }

    const feedback = await prisma.classFeedback.findUnique({
        where: { id: parseInt(feedbackId) },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            },
            class: {
                select: {
                    title: true
                }
            }
        }
    });

    if (!feedback || feedback.classId !== parseInt(classId)) return notFound();

    return (
        <ClassFeedbackDetail 
            classId={classId}
            classTitle={feedback.class.title}
            feedback={feedback}
        />
    );
}
