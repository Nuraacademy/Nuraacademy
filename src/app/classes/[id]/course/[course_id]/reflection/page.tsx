import { notFound, redirect } from "next/navigation";
import { getCourseById } from "@/controllers/courseController";
import ReflectionClient from "../session/[module_id]/reflection/ReflectionClient";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export default async function CourseReflectionPage({
    params
}: {
    params: Promise<{ id: string; course_id: string }>
}) {
    const { id: classId, course_id: courseId } = await params;
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const course = await getCourseById(parseInt(courseId));
    if (!course) {
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
        return notFound();
    }

    // Fetch existing reflection for this course
    const existingReflection = await prisma.reflection.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: parseInt(courseId)
            }
        }
    });

    const data = {
        class: course.class,
        course: course,
        enrollmentId: enrollment.id
    };

    return (
        <ReflectionClient 
            classId={classId}
            courseId={courseId}
            moduleId="" // Empty for course reflections
            data={data}
            initialReflection={existingReflection?.deletedAt ? null : existingReflection}
        />
    );
}
