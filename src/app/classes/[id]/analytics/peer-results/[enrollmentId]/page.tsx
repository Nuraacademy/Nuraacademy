import React from 'react';
import { getClassAnalytics, getLearnerAnalytics } from '@/app/actions/analytics';
import { getPeerFeedback } from '@/app/actions/peer_feedback';
import PeerResultsDetailClient from './PeerResultsDetailClient';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/rbac';

interface PageProps {
    params: {
        id: string;
        enrollmentId: string;
    };
}

export default async function PeerResultsDetailPage({ params }: { params: Promise<{ id: string, enrollmentId: string }> }) {
    await requirePermission('Feedback', 'VIEW_DETAIL_PEER_FEEDBACK');
    const { id, enrollmentId } = await params;
    const classId = parseInt(id);
    const enrollmentIntId = parseInt(enrollmentId);

    // Fetch MY enrollment (the evaluatee)
    const myAnalytics = await getClassAnalytics(classId);
    if (!myAnalytics.success || !myAnalytics.myEnrollment) {
        return notFound();
    }

    // Fetch the PEER's enrollment (the evaluator)
    const peerResult = await getLearnerAnalytics(enrollmentIntId);
    if (!peerResult.success || !peerResult.data) {
        return notFound();
    }

    // Fetch the specific feedback from PEER to ME
    const feedbackResult = await getPeerFeedback(enrollmentIntId, myAnalytics.myEnrollment.id, classId);
    
    return (
        <PeerResultsDetailClient 
            classData={{ id: classId, title: peerResult.data.class.title }} 
            learnerName={peerResult.data.user.name || peerResult.data.user.username}
            feedback={feedbackResult.success ? feedbackResult.data : null}
            isFromMe={false}
        />
    );
}
