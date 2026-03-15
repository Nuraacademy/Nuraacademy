import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { TestRunner } from "@/components/test/test_runner";
import { getAssignmentById, getAssignmentResult } from "@/controllers/assignmentController";
import { getEnrollment } from "@/controllers/enrollmentController";
import { mapAssignmentToTestRunner } from "@/utils/test_mapper";
import { NotFoundState } from "@/components/ui/status/not_found_state";
import { getSession } from "@/app/actions/auth";
import { NuraButton } from "@/components/ui/button/button";
import { notFound } from "next/navigation";

export default async function AssignmentRunnerPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ skipIntro?: string; finished?: string }>;
}) {
    const { id } = await params;
    const { skipIntro, finished } = await searchParams;

    const assignmentId = parseInt(id);
    if (isNaN(assignmentId)) return notFound();

    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) return notFound();

    const currentUserId = await getSession();
    // Derive classId from assignment
    const classId = assignment.classId
        ? String(assignment.classId)
        : null;

    const enrollment = currentUserId && classId
        ? await getEnrollment(currentUserId, parseInt(classId))
        : null;

    if (!enrollment) {
        return (
            <main className="min-h-screen w-full bg-[#F9F9F0] flex items-center justify-center">
                <NotFoundState
                    title="Enrollment Not Found"
                    message="You must be enrolled in this class to take this assignment."
                />
            </main>
        );
    }

    // Check if already submitted
    const testResult = await getAssignmentResult(assignment.id, enrollment.id) as any;
    const isFinished = finished === "true" || !!testResult?.finishedAt;
    const initialScore: number | undefined = testResult?.totalScore ?? undefined;

    const { objectiveQuestions, essayQuestions, projectQuestions, testData, pageText } =
        mapAssignmentToTestRunner(assignment);

    // Override banner/labels based on assignment type
    const typeLabel: Record<string, string> = {
        PRETEST: "Pre-Test",
        POSTTEST: "Post-Test",
        ASSIGNMENT: "Assignment",
        EXERCISE: "Exercise",
        PROJECT: "Final Project",
    };
    pageText.bannerTitle = typeLabel[assignment.type] ?? pageText.bannerTitle;
    pageText.breadcrumbTest = typeLabel[assignment.type] ?? "Assignment";

    return (
        <main className="min-h-screen w-full bg-[#F9F9F0]">
            <div className="px-6 pt-6">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Assignments", href: "/assignment" },
                        { label: (assignment as any).title || "Assignment", href: "#" },
                    ]}
                />
            </div>

            <TestRunner
                classId={classId ?? ""}
                assignmentId={assignment.id}
                enrollmentId={enrollment.id}
                objectiveQuestions={objectiveQuestions}
                essayQuestions={essayQuestions}
                projectQuestions={projectQuestions}
                testData={testData}
                pageText={pageText}
                autoStart={skipIntro === "1"}
                finished={isFinished}
                initialScore={initialScore}
            />
        </main>
    );
}
