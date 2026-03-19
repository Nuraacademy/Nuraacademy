import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import ClassFeedbackList from "../components/ClassFeedbackList";

export default async function ClassFeedbackStaffPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id: classId } = await params;
    const userId = await getCurrentUserId();

    // Check if user has privilege to view feedbacks
    try {
        await requirePermission('Feedback', 'VIEW_DETAIL_REFLECTION');
    } catch (e) {
        return redirect("/");
    }

    const classData = await prisma.class.findUnique({
        where: { id: parseInt(classId) }
    });

    if (!classData) return notFound();

    const feedbacks = await prisma.classFeedback.findMany({
        where: {
            classId: parseInt(classId),
            deletedAt: null
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <ClassFeedbackList 
            classId={classId}
            data={{ class: classData }}
            feedbacks={feedbacks}
        />
    );
}
