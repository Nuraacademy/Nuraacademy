import { notFound, redirect } from "next/navigation";
import { getSessionById } from "@/controllers/sessionController";
import ReflectionClient from "./ReflectionClient";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export default async function ReflectionPage({
    params
}: {
    params: Promise<{ id: string; course_id: string; module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const session = await getSessionById(parseInt(moduleId));
    if (!session) {
        return notFound();
    }

    // Check if user is enrolled in this class
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId,
                classId: parseInt(classId)
            }
        }
    });

    if (!enrollment) {
        // If not enrolled, they shouldn't see this (or maybe they're admin?)
        // For now, let's allow it if they are admin, but let's check roles if needed.
        // But the prompt implies learners.
        return notFound();
    }

    // Fetch existing reflection
    const existingReflection = await prisma.reflection.findUnique({
        where: {
            userId_sessionId: {
                userId,
                sessionId: parseInt(moduleId)
            }
        }
    });

    const data = {
        class: session.course?.class,
        course: session.course,
        session: session,
        enrollmentId: enrollment.id
    };

    return (
        <ReflectionClient 
            classId={classId}
            courseId={courseId}
            moduleId={moduleId}
            data={data}
            initialReflection={existingReflection?.deletedAt ? null : existingReflection}
        />
    );
}
