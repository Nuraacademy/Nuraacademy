import React from 'react';
import { getClassAnalytics } from '@/app/actions/analytics';
import PeerResultsListClient from './PeerResultsListClient';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function PeerResultsListPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);
    const result = await getClassAnalytics(classId);

    if (!result.success || !result.data) {
        return notFound();
    }

    return (
        <PeerResultsListClient 
            classData={result.raw} 
            groupMembers={result.groupMembers} 
            myEnrollmentId={result.myEnrollment?.id}
        />
    );
}
