import { getAssignmentBySessionAndType } from "@/controllers/assignmentController";
import { getEnrollment } from "@/controllers/enrollmentController";
import { mapAssignmentToTestRunner } from "@/utils/test_mapper";
import { NotFoundState } from "@/components/ui/status/not_found_state";
import TestPageClient from "../components/test_page_client";

export default async function PostTestPage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const assignment = await getAssignmentBySessionAndType(parseInt(moduleId), 'POSTTEST');

    // For now, we assume userId = 1 if not authenticated
    const enrollment = await getEnrollment(1, parseInt(classId));

    if (!assignment || !enrollment) {
        return (
            <main className="min-h-screen bg-[#FDFDF7] flex items-center justify-center">
                <NotFoundState
                    title={!assignment ? "Post-Test Not Available" : "Enrollment Not Found"}
                    message={!assignment
                        ? "The post-test for this session is not available at the moment. Please check back later."
                        : "You must be enrolled in this class to take the post-test."
                    }
                />
            </main>
        )
    }

    const assignmentData = mapAssignmentToTestRunner(assignment);
    const sessionTitle = assignment.session?.title || "Session";
    const classTitle = assignment.session?.course?.class?.title || "Class";
    const courseTitle = assignment.session?.course?.title || "Course";

    return (
        <TestPageClient
            classId={classId}
            courseId={courseId}
            moduleId={moduleId}
            assignmentId={assignment.id}
            enrollmentId={enrollment.id}
            sessionTitle={sessionTitle}
            classTitle={classTitle}
            courseTitle={courseTitle}
            testTitle="Post-Test"
            assignmentData={assignmentData}
        />
    );
}
