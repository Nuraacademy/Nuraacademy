import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { TestRunner } from "@/components/test/test_runner"
import { getPlacementTestByClassId, getAssignmentResult } from "@/controllers/assignmentController"
import { getEnrollment } from "@/controllers/enrollmentController"
import { mapAssignmentToTestRunner } from "@/utils/test_mapper"
import { NotFoundState } from "@/components/ui/status/not_found_state"
import { getSession } from "@/app/actions/auth"

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

  if (!assignment || !enrollment) {
    return (
      <main className="min-h-screen w-full bg-[#F9F9F0] flex items-center justify-center">
        <NotFoundState
          title={!assignment ? "Placement Test Not Available" : "Enrollment Not Found"}
          message={!assignment
            ? "It looks like there is no placement test available for this class yet. Please contact your instructor for more information."
            : "You must be enrolled in this class to take the placement test."
          }
        />
      </main>
    )
  }

  // Fetch score if finished
  let initialScore: number | undefined;
  let courseResults: any[] | undefined;

  if (finished === "true") {
    const testResult = await getAssignmentResult(assignment.id, enrollment.id) as any;
    if (testResult) {
      initialScore = testResult.totalScore ?? undefined;

      // Group by course and calculate pass/not pass
      const courseMap = new Map<number, { title: string, scored: number, total: number }>();

      testResult.assignmentItemResults.forEach((ir: any) => {
        const item = ir.assignmentItem;
        const course = item.course;
        if (course) {
          const stats = courseMap.get(course.id) || { title: course.title, scored: 0, total: 0 };
          stats.scored += ir.score || 0;
          stats.total += item.maxScore || 10;
          courseMap.set(course.id, stats);
        }
      });

      courseResults = Array.from(courseMap.entries()).map(([id, stats]) => ({
        courseId: id,
        courseTitle: stats.title,
        status: (stats.scored / stats.total) >= 0.6 ? "Pass" : "Not Pass"
      }));
    }
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
      <div className="px-6 pt-6">
        <Breadcrumb
          items={[
            { label: pageText.breadcrumbHome, href: "/" },
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
        finished={finished === "true"}
        initialScore={initialScore}
      />
    </main>
  )
}
