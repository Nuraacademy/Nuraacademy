import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import TrainerFeedbackFormClient from "./TrainerFeedbackFormClient";
import { getTrainerFeedback } from "@/app/actions/trainer_feedback";

export default async function TrainerFeedbackPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ classId: string }>
}) {
    const { id: trainerIdStr } = await params;
    const { classId: classIdStr } = await searchParams;
    
    const trainerId = parseInt(trainerIdStr);
    const classId = parseInt(classIdStr);

    if (isNaN(trainerId) || isNaN(classId)) {
        return notFound();
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        redirect("/login");
    }

    // 1. Verify class exists
    const classData = await prisma.class.findUnique({
        where: { id: classId },
        select: { title: true }
    });
    if (!classData) return notFound();

    // 2. Verify evaluator (current user) is enrolled in this class
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId,
                classId
            }
        }
    });
    if (!enrollment) return notFound();

    // 3. Verify trainer exists and has a staff role (optional but good)
    const trainer = await prisma.user.findUnique({
        where: { id: trainerId, deletedAt: null },
        select: { id: true, name: true, username: true, role: { select: { name: true } } }
    });
    if (!trainer) return notFound();

    // 4. Fetch existing feedback if any
    const feedbackRes = await getTrainerFeedback(enrollment.id, trainerId, classId);
    const initialFeedback = feedbackRes.success ? feedbackRes.data : null;

    return (
        <TrainerFeedbackFormClient 
            trainer={trainer}
            evaluatorEnrollmentId={enrollment.id}
            classId={classId}
            initialFeedback={initialFeedback}
            classTitle={classData.title}
        />
    );
}
