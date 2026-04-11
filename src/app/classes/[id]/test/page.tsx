import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { TestRunner } from "@/components/test/test_runner"
import { getPlacementTestByClassId, getAssignmentResult } from "@/controllers/assignmentController"
import { getEnrollment } from "@/controllers/enrollmentController"
import { mapAssignmentToTestRunner } from "@/utils/test_mapper"
import { NotFoundState } from "@/components/ui/status/not_found_state"
import { getSession } from "@/app/actions/auth"
import { formatAppDateTime } from "@/lib/appDatetime"

export default async function PlacementTestPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ skipIntro?: string, finished?: string }>
}) {
  const { id: classId } = await params
  const { skipIntro, finished } = await searchParams

  const assignment = await getPlacementTestByClassId(parseInt(classId))

  const currentUserId = await getSession();
  const enrollment = currentUserId ? await getEnrollment(currentUserId, parseInt(classId)) : null;

  // Check if test has started
  const now = new Date();
  const isStarted = assignment?.startDate ? new Date(assignment.startDate) <= now : true;

  if (!assignment || !enrollment || !isStarted) {
    return (
      <main className="min-h-screen w-full bg-[#F9F9F0] flex items-center justify-center">
        <NotFoundState
          title={!assignment ? "Placement Test Not Available" : (!enrollment ? "Enrollment Not Found" : "Placement Test Not Yet Available")}
          message={!assignment
            ? "It looks like there is no placement test available for this class yet. Please contact your instructor for more information."
            : (!enrollment 
                ? "You must be enrolled in this class to take the placement test."
                : `The placement test is scheduled to start on ${formatAppDateTime(assignment.startDate!)}. Please check back then.`)
          }
        />
      </main>
    )
  }


  // Fetch score if finished
  let initialScore: number | undefined;
  let courseResults: any[] | undefined;

  const testResult = await getAssignmentResult(assignment.id, enrollment.id) as any;
  const isFinished = finished === "true" || !!testResult;

  if (testResult) {
    initialScore = testResult.totalScore ?? undefined;

    // Group by course and calculate pass/not pass
    const courseMap = new Map<number, { title: string, scored: number, total: number, requiresGrading: boolean }>();

    testResult.assignmentItemResults.forEach((ir: any) => {
      const item = ir.assignmentItem;
      const course = item.course;
      if (course) {
        const stats = courseMap.get(course.id) || { title: course.title, scored: 0, total: 0, requiresGrading: false };
        stats.scored += ir.score || 0;
        stats.total += item.maxScore || 10;
        
        // If it's an essay or project question and score is null, it requires manual grading
        if ((item.type === "ESSAY" || item.type === "PROJECT") && ir.score === null) {
          stats.requiresGrading = true;
        }

        courseMap.set(course.id, stats);
      }
    });

    courseResults = Array.from(courseMap.entries()).map(([id, stats]) => {
      const ir = testResult.assignmentItemResults.find((r: any) => r.assignmentItem.courseId === id);
      const threshold = ir?.assignmentItem?.course?.threshold ?? 0;
      
      let status: "Pass" | "Not Pass" | "Grading" = stats.scored >= threshold ? "Pass" : "Not Pass";
      if (stats.requiresGrading) {
        status = "Grading";
      }

      return {
        courseId: id,
        courseTitle: stats.title,
        status: status
      };
    });
  }

  const {
    objectiveQuestions,
    essayQuestions,
    projectQuestions,
    testData,
    pageText
  } = mapAssignmentToTestRunner(assignment)

  return (
    <main className="min-h-screen w-full bg-[#F9F9F0]">
      <div className="py-6 max-w-7xl mx-auto">
        <Breadcrumb
          items={[
            { label: pageText.breadcrumbHome, href: "/classes" },
            { label: testData.courseName, href: `/classes/${classId}/overview` },
            { label: pageText.breadcrumbTest, href: `/classes/${classId}/test` },
          ]}
        />
      </div>

      <TestRunner
        classId={classId}
        assignmentId={assignment.id}
        enrollmentId={enrollment.id}
        userName={enrollment.user?.name || undefined}
        objectiveQuestions={objectiveQuestions}
        essayQuestions={essayQuestions}
        projectQuestions={projectQuestions}
        testData={{
          ...testData,
          courseResults
        }}
        pageText={pageText}
        autoStart={skipIntro === "1"}
        finished={isFinished}
        initialScore={initialScore}
        isPlacement={true}
      />
    </main>
  )
}
