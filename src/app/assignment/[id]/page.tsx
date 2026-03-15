import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { TestRunner } from "@/components/test/test_runner";
import { getAssignmentById, getAssignmentResult } from "@/controllers/assignmentController";
import { getEnrollment } from "@/controllers/enrollmentController";
import { mapAssignmentToTestRunner } from "@/utils/test_mapper";
import { NotFoundState } from "@/components/ui/status/not_found_state";
import { AssignmentIntroCard } from "./components/assignment_intro";
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
        PROJECT: "Project",
    };
    pageText.bannerTitle = typeLabel[assignment.type] ?? pageText.bannerTitle;
    pageText.breadcrumbTest = typeLabel[assignment.type] ?? "Assignment";

    const isAssignmentOrProject = assignment.type === "ASSIGNMENT" || assignment.type === "PROJECT";
    const classTitle = (assignment as any).class?.title;
    const courseTitle = (assignment as any).course?.title;

    const breadcrumbs = [
        { label: "Home", href: "/" },
        ...(classTitle ? [{ label: classTitle, href: `/classes/${classId}/overview` }] : []),
        ...(courseTitle ? [{ label: courseTitle, href: `/classes/${classId}/course/${assignment.courseId}/overview` }] : []),
        { label: (assignment as any).title || typeLabel[assignment.type] || "Assignment", href: "#" },
    ];

    return (
        <main className="min-h-screen w-full bg-[#F9F9F0]">
            <div className="px-6 pt-6">
                <Breadcrumb items={breadcrumbs} />
            </div>

            {isAssignmentOrProject && skipIntro !== "1" ? (
                <AssignmentIntroCard
                    assignmentId={assignment.id}
                    title={(assignment as any).title || typeLabel[assignment.type]}
                    description={assignment.description || ""}
                    startDate={(assignment as any).startDate || null}
                    endDate={assignment.endDate || null}
                    isSubmitted={isFinished}
                    classTitle={classTitle}
                    courseTitle={courseTitle}
                    type={assignment.type}
                    isGroup={(assignment as any).submissionType === "GROUP"}
                />
            ) : (
                <TestRunner
                    classId={classId ?? ""}
                    assignmentId={assignment.id}
                    enrollmentId={enrollment.id}
                    objectiveQuestions={objectiveQuestions}
                    essayQuestions={essayQuestions}
                    projectQuestions={projectQuestions}
                    testData={testData}
                    pageText={pageText}
                    autoStart={skipIntro === "1" || (!isAssignmentOrProject)}
                    finished={isFinished}
                    initialScore={initialScore}
                />
            )}
        </main>
    );
}
