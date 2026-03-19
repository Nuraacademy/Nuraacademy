import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import { notFound, redirect } from "next/navigation";
import PeerFeedbackFormClient from "./PeerFeedbackFormClient";
import { getPeerFeedback } from "@/app/actions/peer_feedback";

export default async function PeerFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
    await requirePermission('Feedback', 'CREATE_EDIT_PEER_FEEDBACK');
    
    const { id } = await params;
    const evaluateeEnrollmentId = parseInt(id);

    if (isNaN(evaluateeEnrollmentId)) {
        notFound();
    }

    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        redirect("/login");
    }

    // 1. Fetch evaluatee enrollment to get the class
    const evaluatee = await prisma.enrollment.findUnique({
        where: { id: evaluateeEnrollmentId, deletedAt: null },
        include: {
            user: { select: { name: true, username: true } },
            class: { select: { id: true, title: true } }
        }
    });

    if (!evaluatee) {
        notFound();
    }

    // 2. Fetch current user's enrollment for this class
    const evaluator = await prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId: currentUserId,
                classId: evaluatee.classId
            }
        }
    });

    if (!evaluator) {
        // User is not enrolled in this class, they shouldn't be giving feedback
        notFound();
    }

    if (evaluator.id === evaluatee.id) {
        // Cannot give feedback to self
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F9EE] p-8 text-center">
                 <h1 className="text-2xl font-bold text-[#1C3A37] mb-4">Self-Feedback Not Required</h1>
                 <p className="text-gray-600 mb-8">You cannot provide peer feedback to yourself.</p>
                 <button onClick={() => redirect(`/classes/${evaluatee.classId}/analytics`)} className="bg-[#DAEE49] text-[#1C3A37] px-8 py-3 rounded-full font-bold">Back to Report</button>
            </div>
        );
    }

    const feedbackResponse = await getPeerFeedback(evaluator.id, evaluatee.id, evaluatee.classId);
    const initialFeedback = feedbackResponse.success ? feedbackResponse.data : null;

    return (
        <PeerFeedbackFormClient 
            data={evaluatee} 
            evaluatorEnrollmentId={evaluator.id}
            classId={evaluatee.classId}
            initialFeedback={initialFeedback}
        />
    );
}
