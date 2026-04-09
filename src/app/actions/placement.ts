"use server"

import { revalidatePath } from 'next/cache';
import { updateCourseThresholds, assignLearnerGroups, submitManualScores } from '@/controllers/placementController';
import { requirePermission } from '@/lib/rbac';

export async function updateThresholdsAction(classId: number, thresholds: { courseId: number, threshold: number }[]) {
    try {
        await requirePermission('CourseMapping', 'MANAGE');
        await updateCourseThresholds(thresholds);
        revalidatePath(`/classes/${classId}/placement/learner-group`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function assignGroupsAction(classId: number, assignments: { enrollmentId: number, groupName: string | null }[]) {
    try {
        await requirePermission('Enrollment', 'CREATE_GROUP_MAPPING');
        await assignLearnerGroups(classId, assignments);
        revalidatePath(`/classes/${classId}/placement/learner-group`);
        revalidatePath(`/classes/${classId}/placement/create-group`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function submitGradingAction(classId: number, resultId: number, scores: Record<number, number>) {
    try {
        await requirePermission('CourseMapping', 'MANAGE'); // Assuming manage allows grading
        await submitManualScores(resultId, scores);
        revalidatePath(`/classes/${classId}/placement/results`);
        revalidatePath(`/classes/${classId}/placement/learner-group`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
