import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import ReflectionFeedbackDetail from "../../components/ReflectionFeedbackDetail";

export default async function ReflectionDetailFeedbackPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const userId = await getCurrentUserId();

    try {
        await requirePermission('Feedback', 'VIEW_DETAIL_REFLECTION');
    } catch (e) {
        return redirect("/");
    }

    const reflection = await prisma.reflection.findUnique({
        where: { id: parseInt(id) },
        include: {
            user: true,
            course: true,
            session: true,
            feedback: {
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            }
        }
    });

    if (!reflection) return notFound();

    let hasPrivilege = false;
    try {
        await requirePermission('Feedback', 'CREATE_EDIT_ASSIGNMENT_FEEDBACK');
        hasPrivilege = true;
    } catch (e) {}

    return (
        <ReflectionFeedbackDetail 
            reflection={reflection}
            hasPrivilege={hasPrivilege}
        />
    );
}
