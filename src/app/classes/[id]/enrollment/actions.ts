"use server"

import { createEnrollment } from "@/controllers/enrollmentController"
import { revalidatePath } from "next/cache"
import { LearningObjective } from "@prisma/client"

const OBJECTIVE_MAP: Record<string, LearningObjective> = {
    "Career switch": "CAREER_SWITCH",
    "Job seeker": "JOB_SEEKER",
    "Academic purpose": "ACADEMIC_PURPOSE",
    "Certification": "CERTIFICATION",
    "Upskilling": "UPSKILLING"
};

export async function enrollAction(data: {
    classId: string,
    userId: string,
    personalInfo: any,
    objectives: string[],
    expectations: string,
    cvUrl?: string
}) {
    try {
        const enrollment = await createEnrollment({
            userId: data.userId,
            classId: data.classId,
            profession: data.personalInfo.profession,
            yearsOfExperience: parseInt(data.personalInfo.yoe) || 0,
            workField: data.personalInfo.workField,
            educationField: data.personalInfo.educationField,
            jobIndustry: data.personalInfo.jobIndustry,
            finalExpectations: data.expectations,
            cvFileUrl: data.cvUrl,
            learningObjectives: data.objectives.map(obj => OBJECTIVE_MAP[obj]).filter(Boolean) as LearningObjective[]
        });

        revalidatePath(`/classes/${data.classId}/overview`);
        return { success: true, enrollment };
    } catch (error: any) {
        console.error("Enrollment error:", error);
        return { success: false, error: error.message || "Failed to enroll" };
    }
}
