import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import ReflectionFeedbackList from "../../components/ReflectionFeedbackList";

export default async function FeedbackCourseListPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id: courseId } = await params;
    const userId = await getCurrentUserId();

    // Check if user has privilege to view all reflections (feedback role)
    try {
        await requirePermission('Feedback', 'VIEW_SEARCH_ASSIGNMENT_FEEDBACK');
    } catch (e) {
        return redirect("/");
    }

    const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) },
        include: { class: true }
    });

    if (!course) return notFound();

    const reflections = await prisma.reflection.findMany({
        where: {
            courseId: parseInt(courseId),
            deletedAt: null,
            user: {
                role: {
                    name: 'Learner'
                }
            }
        },
        include: {
            user: true,
            feedback: true
        }
    });

    const data = {
        course,
        class: course.class
    };

    return (
        <ReflectionFeedbackList 
            classId={course.classId.toString()}
            courseId={courseId}
            data={data}
            reflections={reflections}
        />
    );
}
