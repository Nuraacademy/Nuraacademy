import { notFound, redirect } from "next/navigation";
import { getFullSession } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { hasPermission, requirePermission } from "@/lib/rbac";
import ClassFeedbackClient from "./ClassFeedbackClient";

export default async function ClassFeedbackPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id: classId } = await params;
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const sessionDetail = await getFullSession();
    const isLearner = sessionDetail?.role === 'Learner';

    // Staff/Admin view: we might want to redirect to a general list or a class-specific list
    // For now, if they are not a learner, they only see this if they have permission, 
    // but the input is mainly for learners.
    const canViewAll = await hasPermission('Feedback', 'VIEW_DETAIL_REFLECTION');
    
    // Check if user is enrolled in this class
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId,
                classId: parseInt(classId)
            }
        },
        include: {
            class: {
                select: {
                    title: true
                }
            }
        }
    });

    if (!enrollment && !canViewAll) {
        return notFound();
    }

    // Fetch existing feedback
    const existingFeedback = await prisma.classFeedback.findUnique({
        where: {
            userId_classId: {
                userId,
                classId: parseInt(classId)
            }
        }
    });

    // If no enrollment but can view all (admin/staff), we need a different handling 
    // for what to show. But the user specifically asked for "learner can give feedback".
    // So for staff, we might want to redirect them to a viewing page.
    if (!isLearner && canViewAll) {
        // Redirect to staff view (to be implemented)
        // return redirect(`/feedback/class/${classId}`);
    }

    if (!enrollment) return notFound();

    const data = {
        classTitle: enrollment.class.title,
        enrollmentId: enrollment.id
    };

    return (
        <ClassFeedbackClient 
            classId={classId}
            data={data}
            initialFeedback={existingFeedback && !existingFeedback.deletedAt ? existingFeedback : null}
        />
    );
}
