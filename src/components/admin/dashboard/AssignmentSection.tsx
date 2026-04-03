"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { AssignmentCard } from '@/components/ui/card/assignment_card';
import { mapPrismaAssignmentType } from '@/utils/assignment';

interface AssignmentSectionProps {
    assignments: any[];
}

export default function AssignmentSection({ assignments }: AssignmentSectionProps) {
    const router = useRouter();

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Assignments</h2>
                <button onClick={() => router.push('/assignment')} className="text-sm font-medium text-gray-400 hover:text-[#1C3A37] transition-colors flex items-center gap-1">
                    See All <ChevronRight size={16} />
                </button>
            </div>

            <div className="space-y-4">
                {assignments.slice(0, 4).map((assignment) => (
                    <AssignmentCard
                        key={assignment.id}
                        id={assignment.id}
                        title={assignment.title}
                        tag={assignment.submissionType === 'Group' ? 'Group' : 'Individual'}
                        classId={String(assignment.classId)}
                        courseId={String(assignment.courseId)}
                        sessionId={String(assignment.sessionId)}
                        type={mapPrismaAssignmentType(assignment.type)}
                        classTitle={assignment.className}
                        canGrade={false}
                        isAdmin={true}
                        showActions={false}
                    />
                ))}
            </div>
        </section>
    );
}
