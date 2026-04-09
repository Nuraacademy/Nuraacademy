import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { TestRunner } from "@/components/test/test_runner";
import { getAssignmentById, getAssignmentResult } from "@/controllers/assignmentController";
import { getEnrollment } from "@/controllers/enrollmentController";
import { mapAssignmentToTestRunner } from "@/utils/test_mapper";
import { NotFoundState } from "@/components/ui/status/not_found_state";
import { AssignmentIntroCard } from "./components/assignment_intro";
import { getSession, getFullSession } from "@/app/actions/auth";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/date";

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

    const session = await getFullSession();
    const isLearner = session?.role === "Learner";

    if (!isLearner && session) {
        const { redirect } = await import("next/navigation");
        redirect(`/assignment/${assignmentId}/results`);
    }

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

    // Check availability
    const now = new Date();
    if (assignment.startDate && now < new Date(assignment.startDate)) {
        return (
            <main className="min-h-screen w-full bg-[#F9F9F0] flex items-center justify-center">
                <NotFoundState
                    title="Assignment Not Yet Available"
                    message={`This assignment will be available on ${formatDate(assignment.startDate)}.`}
                    buttonLabel="Back to Overview"
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

    const descriptionLabel: Record<string, string> = {
        PRETEST: "This Pre-Test is designed to assess your current knowledge and skills in the subject matter. Please answer all questions to the best of your ability.",
        POSTTEST: "This Post-Test is designed to assess your current knowledge and skills in the subject matter. Please answer all questions to the best of your ability.",
        ASSIGNMENT: "This Assignment is designed to assess your current knowledge and skills in the subject matter. Please answer all questions to the best of your ability.",
        EXERCISE: "This Exercise is designed to assess your current knowledge and skills in the subject matter. Please answer all questions to the best of your ability.",
        PROJECT: "This Project is designed to assess your current knowledge and skills in the subject matter. Please answer all questions to the best of your ability.",
    };
    pageText.bannerTitle = typeLabel[assignment.type] ?? pageText.bannerTitle;
    pageText.breadcrumbTest = typeLabel[assignment.type] ?? "Assignment";

    const classTitle = (assignment as any).class?.title;
    const courseTitle = (assignment as any).course?.title;

    const breadcrumbs = [
        { label: "Home", href: "/classes" },
        ...(classTitle ? [{ label: classTitle, href: `/classes/${classId}/overview` }] : []),
        ...(courseTitle ? [{ label: courseTitle, href: `/classes/${classId}/course/${assignment.courseId}/overview` }] : []),
        { label: (assignment as any).title || typeLabel[assignment.type] || "Assignment", href: "#" },
    ];

    // Calculate detailed scores for the breakdown modal
    let objectiveScore = 0;
    let maxObjectiveScore = 0;
    let essayScore = 0;
    let maxEssayScore = 0;
    let projectScore = 0;
    let maxProjectScore = 0;

    if (testResult?.assignmentItemResults) {
        testResult.assignmentItemResults.forEach((ir: any) => {
            const score = ir.score || 0;
            const max = ir.assignmentItem?.maxScore || 10;
            const type = ir.assignmentItem?.type;

            if (type === "OBJECTIVE") {
                objectiveScore += score;
                maxObjectiveScore += max;
            } else if (type === "ESSAY") {
                essayScore += score;
                maxEssayScore += max;
            } else if (type === "PROJECT") {
                projectScore += score;
                maxProjectScore += max;
            }
        });
    }

    return (
        <main className="min-h-screen p-6 bg-[#F9F9F0]">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb items={breadcrumbs} />
            </div>

            {skipIntro !== "1" ? (
                <AssignmentIntroCard
                    assignmentId={assignment.id}
                    title={(assignment as any).title || typeLabel[assignment.type]}
                    description={assignment.description || descriptionLabel[assignment.type]}
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
                    autoStart={skipIntro === "1"}
                    finished={isFinished}
                    initialScore={initialScore}
                    feedback={testResult?.feedback}
                    problemUnderstanding={testResult?.problemUnderstanding}
                    technicalAbility={testResult?.technicalAbility}
                    solutionQuality={testResult?.solutionQuality}
                    problemUnderstandingFeedback={testResult?.problemUnderstandingFeedback}
                    technicalAbilityFeedback={testResult?.technicalAbilityFeedback}
                    solutionQualityFeedback={testResult?.solutionQualityFeedback}
                    assignmentType={assignment.type}
                    objectiveScore={objectiveScore}
                    maxObjectiveScore={maxObjectiveScore}
                    essayScore={essayScore}
                    maxEssayScore={maxEssayScore}
                    projectScore={projectScore}
                    maxProjectScore={maxProjectScore}
                />
            )}
        </main>
    );
}
